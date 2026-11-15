"""Public status API for juasoh.com/status.

API Gateway calls this for GET /status (no login: it's a public page). It
reads back what status_check.py records and returns, for each target:

  - whether the latest check passed, and when it ran
  - uptime over the last 24 hours, 7 days and 30 days
  - average response time over 24 hours, plus an hourly series for a chart

and the account's estimated AWS cost so far this month (one total, from the
free CloudWatch billing metric; no per-service detail is made public).

Everything is read-only and cached for a minute, so a busy page costs at
most a few CloudWatch reads per minute, inside the free allowance.
"""

from __future__ import annotations

import json
import logging
import time
from datetime import datetime, timedelta, timezone
from typing import Any

logger = logging.getLogger()
logger.setLevel(logging.INFO)

NAMESPACE = "juasoh/Status"
TARGETS = ("website", "api")
CACHE_SECONDS = 60

_clients: dict[str, Any] = {}
_cache: dict[str, Any] = {}


def _cloudwatch():
    if "cloudwatch" not in _clients:
        import boto3

        # Billing metrics only exist in us-east-1, where this stack runs.
        _clients["cloudwatch"] = boto3.client("cloudwatch", region_name="us-east-1")
    return _clients["cloudwatch"]


def _response(status: int, body: dict[str, Any]) -> dict[str, Any]:
    return {
        "statusCode": status,
        "headers": {"Content-Type": "application/json", "Cache-Control": "public, max-age=60"},
        "body": json.dumps(body),
    }


def _stats(metric: str, target: str, start: datetime, end: datetime, period: int, stats: list[str]) -> list[dict]:
    points = _cloudwatch().get_metric_statistics(
        Namespace=NAMESPACE,
        MetricName=metric,
        Dimensions=[{"Name": "Target", "Value": target}],
        StartTime=start,
        EndTime=end,
        Period=period,
        Statistics=stats,
    ).get("Datapoints", [])
    return sorted(points, key=lambda p: p["Timestamp"])


def _uptime(hourly: list[dict], since: datetime) -> float | None:
    """Share of checks that passed since a time, as a percentage."""
    window = [p for p in hourly if p["Timestamp"] >= since]
    checks = sum(p["SampleCount"] for p in window)
    if not checks:
        return None
    passed = sum(p["Sum"] for p in window)
    return round(100 * passed / checks, 3)


def target_status(target: str, now: datetime) -> dict[str, Any]:
    # 1) Uptime: hourly pass counts over 30 days (720 points, one request).
    hourly_up = _stats("Up", target, now - timedelta(days=30), now, 3600, ["Sum", "SampleCount"])
    # 2) The latest individual check (5-minute resolution, last 30 minutes).
    recent = _stats("Up", target, now - timedelta(minutes=30), now, 300, ["Minimum"])
    # 3) Response time: hourly averages over 24 hours.
    latency = _stats("LatencyMs", target, now - timedelta(hours=24), now, 3600, ["Average"])

    last = recent[-1] if recent else None
    latency_values = [p["Average"] for p in latency]
    return {
        "target": target,
        "up": None if last is None else last["Minimum"] >= 1,
        "last_checked": last["Timestamp"].isoformat() if last else None,
        "uptime": {
            "24h": _uptime(hourly_up, now - timedelta(hours=24)),
            "7d": _uptime(hourly_up, now - timedelta(days=7)),
            "30d": _uptime(hourly_up, now - timedelta(days=30)),
        },
        "latency_ms_24h": round(sum(latency_values) / len(latency_values)) if latency_values else None,
        "latency_series": [{"t": p["Timestamp"].isoformat(), "ms": round(p["Average"])} for p in latency],
    }


def month_cost(now: datetime) -> float | None:
    """Estimated AWS charges so far this month (account total, USD)."""
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    points = _cloudwatch().get_metric_statistics(
        Namespace="AWS/Billing",
        MetricName="EstimatedCharges",
        Dimensions=[{"Name": "Currency", "Value": "USD"}],
        StartTime=month_start,
        EndTime=now,
        Period=86400,
        Statistics=["Maximum"],
    ).get("Datapoints", [])
    return round(max(p["Maximum"] for p in points), 2) if points else None


def get_status(now: datetime | None = None) -> dict[str, Any]:
    now = now or datetime.now(timezone.utc)
    if _cache.get("body") and time.time() - _cache["at"] < CACHE_SECONDS:
        return _response(200, _cache["body"])

    targets = [target_status(t, now) for t in TARGETS]
    try:
        cost = month_cost(now)
    except Exception:  # noqa: BLE001 - the page works without the cost line
        logger.exception(json.dumps({"event": "COST_READ_FAILED"}))
        cost = None

    body = {"ok": True, "generated_at": now.isoformat(timespec="seconds"), "targets": targets, "cost_this_month": cost}
    _cache.update(body=body, at=time.time())
    return _response(200, body)


def handler(event: dict[str, Any], context: Any = None) -> dict[str, Any]:
    try:
        if event.get("routeKey") == "GET /status":
            return get_status()
        return _response(404, {"ok": False, "errors": ["Not found"]})
    except Exception:  # noqa: BLE001 - never leak a stack trace to the caller
        logger.exception(json.dumps({"event": "UNHANDLED_ERROR"}))
        return _response(500, {"ok": False, "errors": ["Status is unavailable right now"]})
