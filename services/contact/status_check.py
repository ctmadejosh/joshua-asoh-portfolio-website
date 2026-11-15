"""Uptime checker for juasoh.com and its API.

EventBridge runs this every 5 minutes. It requests each target, then records
two CloudWatch metrics per target in the "juasoh/Status" namespace:

  Up         1 if the target answered correctly in time, else 0
  LatencyMs  how long the request took (only when it answered)

The public status page (status.py) reads these back, and CloudWatch alarms on
"Up" email an alert if a target is down for 10 minutes. Standard library plus
boto3 only, like the other functions.
"""

from __future__ import annotations

import json
import logging
import time
import urllib.error
import urllib.request
from typing import Any, Callable

logger = logging.getLogger()
logger.setLevel(logging.INFO)

NAMESPACE = "juasoh/Status"
TIMEOUT_SECONDS = 8
USER_AGENT = "juasoh-status-check/1.0 (+https://juasoh.com/status)"

# name -> (url, check). A check returns True if the response body is healthy.
TARGETS: dict[str, tuple[str, Callable[[bytes], bool]]] = {
    "website": ("https://juasoh.com/", lambda body: b"Joshua Asoh" in body),
    "api": ("https://aws.juasoh.com/health", lambda body: json.loads(body or b"{}").get("ok") is True),
}

_clients: dict[str, Any] = {}


def _cloudwatch():
    if "cloudwatch" not in _clients:
        import boto3

        _clients["cloudwatch"] = boto3.client("cloudwatch")
    return _clients["cloudwatch"]


def _fetch(url: str) -> tuple[int, bytes]:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Cache-Control": "no-cache"})
    with urllib.request.urlopen(request, timeout=TIMEOUT_SECONDS) as response:  # noqa: S310 - fixed https URLs
        return response.status, response.read(200_000)


def check(name: str, fetch: Callable[[str], tuple[int, bytes]] = _fetch) -> dict[str, Any]:
    url, healthy = TARGETS[name]
    started = time.monotonic()
    try:
        status, body = fetch(url)
        latency_ms = round((time.monotonic() - started) * 1000, 1)
        up = status == 200 and healthy(body)
        reason = "" if up else f"HTTP {status}" if status != 200 else "unexpected body"
    except (urllib.error.URLError, TimeoutError, OSError, ValueError) as err:
        latency_ms, up, reason = None, False, type(err).__name__
    return {"target": name, "up": up, "latency_ms": latency_ms if up else None, "reason": reason}


def record(results: list[dict[str, Any]]) -> None:
    data = []
    for r in results:
        dims = [{"Name": "Target", "Value": r["target"]}]
        data.append({"MetricName": "Up", "Dimensions": dims, "Value": 1.0 if r["up"] else 0.0, "Unit": "Count"})
        if r["latency_ms"] is not None:
            data.append(
                {"MetricName": "LatencyMs", "Dimensions": dims, "Value": r["latency_ms"], "Unit": "Milliseconds"}
            )
    _cloudwatch().put_metric_data(Namespace=NAMESPACE, MetricData=data)


def handler(event: Any = None, context: Any = None, fetch: Callable[[str], tuple[int, bytes]] = _fetch) -> dict:
    results = [check(name, fetch) for name in TARGETS]
    record(results)
    for r in results:
        log = logger.info if r["up"] else logger.warning
        log(json.dumps({"event": "STATUS_CHECK", **r}))
    return {"ok": True, "results": results}
