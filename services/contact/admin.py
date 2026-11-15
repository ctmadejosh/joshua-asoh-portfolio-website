"""Private inbox backend for juasoh.com/inbox.

API Gateway calls this Lambda for two routes, both behind a Cognito JWT
authorizer (see infra/contact/admin.tf):

  GET    /messages        ->  every message, newest first
  DELETE /messages/{id}   ->  deletes one message
  GET    /costs           ->  this AWS account's costs, by service

Costs come from two free sources (Cost Explorer's API would charge $0.01 a
call): CloudWatch billing metrics, which give each service's estimated
month-to-date charges, and AWS Budgets, which gives the total, the month-end
forecast and the limit. Billing metrics only exist once "CloudWatch billing
alerts" is turned on in Billing preferences.

API Gateway has already checked the token's signature, expiry, issuer and
audience before this code runs. This function adds one more check: the token
must belong to the owner's Cognito user (OWNER_SUB), so even another valid
account in the pool would get 403.

Kept separate from handler.py so the public contact form's function stays
write-only. Every read and delete is logged for an audit trail.
"""

from __future__ import annotations

import json
import logging
import os
import re
import time
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta, timezone
from typing import Any

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Fields returned to the inbox. The visitor's IP and user agent stay in
# DynamoDB for abuse investigations but aren't sent to the browser.
FIELDS = ("id", "created_at", "user_name", "user_email", "subject", "message", "source")
# Message IDs are UUIDs created by handler.py.
ID_RE = re.compile(r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$")
# A contact form gets a handful of messages; this cap just bounds the response.
MAX_MESSAGES = 1000

# Costs change a few times a day; don't re-read them on every page view.
COST_CACHE_SECONDS = 15 * 60

_clients: dict[str, Any] = {}
_cost_cache: dict[str, Any] = {}


def _table():
    if "table" not in _clients:
        import boto3

        _clients["table"] = boto3.resource("dynamodb").Table(os.environ["TABLE_NAME"])
    return _clients["table"]


def _client(name: str):
    if name not in _clients:
        import boto3

        # Billing metrics and Budgets both live in us-east-1.
        _clients[name] = boto3.client(name, region_name="us-east-1")
    return _clients[name]


def _response(status: int, body: dict[str, Any]) -> dict[str, Any]:
    return {
        "statusCode": status,
        # Message contents must never sit in a browser or proxy cache.
        "headers": {"Content-Type": "application/json", "Cache-Control": "no-store"},
        "body": json.dumps(body),
    }


def _caller_sub(event: dict[str, Any]) -> str:
    claims = (((event.get("requestContext") or {}).get("authorizer") or {}).get("jwt") or {}).get("claims") or {}
    sub = claims.get("sub")
    return sub if isinstance(sub, str) else ""


def list_messages() -> dict[str, Any]:
    table = _table()
    items: list[dict[str, Any]] = []
    kwargs: dict[str, Any] = {}
    # A Scan returns up to 1 MB per page; follow the pages to the end.
    while len(items) < MAX_MESSAGES:
        page = table.scan(**kwargs)
        items.extend(page.get("Items", []))
        if "LastEvaluatedKey" not in page:
            break
        kwargs["ExclusiveStartKey"] = page["LastEvaluatedKey"]

    messages = [{field: str(item.get(field, "")) for field in FIELDS} for item in items[:MAX_MESSAGES]]
    messages.sort(key=lambda m: m["created_at"], reverse=True)
    return _response(200, {"ok": True, "messages": messages})


def delete_message(message_id: str) -> dict[str, Any]:
    if not ID_RE.match(message_id):
        return _response(400, {"ok": False, "errors": ["Invalid message id"]})
    try:
        # The condition turns "delete something that isn't there" into a 404
        # instead of a silent success.
        _table().delete_item(Key={"id": message_id}, ConditionExpression="attribute_exists(id)")
    except Exception as err:  # botocore's ClientError; matched by code so tests need no botocore
        code = (getattr(err, "response", None) or {}).get("Error", {}).get("Code")
        if code == "ConditionalCheckFailedException":
            return _response(404, {"ok": False, "errors": ["Message not found"]})
        raise
    return _response(200, {"ok": True})


def _month_starts(now: datetime) -> tuple[datetime, datetime]:
    this_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    last_month = (this_month - timedelta(days=1)).replace(day=1)
    return this_month, last_month


def _billing_series(cloudwatch) -> list[str | None]:
    """Each USD EstimatedCharges series for this account: a service name, or
    None for the account total."""
    series: list[str | None] = []
    kwargs: dict[str, Any] = {"Namespace": "AWS/Billing", "MetricName": "EstimatedCharges"}
    while True:
        page = cloudwatch.list_metrics(**kwargs)
        for metric in page.get("Metrics", []):
            dims = {d["Name"]: d["Value"] for d in metric.get("Dimensions", [])}
            if dims.get("Currency") != "USD" or "LinkedAccount" in dims:
                continue
            series.append(dims.get("ServiceName"))
        if not page.get("NextToken"):
            return series
        kwargs["NextToken"] = page["NextToken"]


def _charges(cloudwatch, service: str | None, now: datetime) -> dict[str, float | None]:
    """This month's and last month's estimated charges for one series.

    EstimatedCharges is a running month-to-date total that resets on the 1st,
    so the highest value in a month is that month's charge."""
    this_month, last_month = _month_starts(now)
    dimensions = [{"Name": "Currency", "Value": "USD"}]
    if service:
        dimensions.append({"Name": "ServiceName", "Value": service})
    points = cloudwatch.get_metric_statistics(
        Namespace="AWS/Billing",
        MetricName="EstimatedCharges",
        Dimensions=dimensions,
        StartTime=last_month,
        EndTime=now,
        Period=86400,
        Statistics=["Maximum"],
    ).get("Datapoints", [])

    def peak(start: datetime, end: datetime) -> float | None:
        values = [p["Maximum"] for p in points if start <= p["Timestamp"] < end]
        return round(max(values), 4) if values else None

    return {"this_month": peak(this_month, now + timedelta(days=1)), "last_month": peak(last_month, this_month)}


def _budget() -> dict[str, float | None]:
    budget = _client("budgets").describe_budget(
        AccountId=os.environ["ACCOUNT_ID"], BudgetName=os.environ["BUDGET_NAME"]
    )["Budget"]
    spend = budget.get("CalculatedSpend") or {}

    def amount(block: dict[str, Any] | None) -> float | None:
        return round(float(block["Amount"]), 4) if block and "Amount" in block else None

    return {
        "limit": amount(budget.get("BudgetLimit")),
        "actual": amount(spend.get("ActualSpend")),
        "forecast": amount(spend.get("ForecastedSpend")),
    }


def get_costs(now: datetime | None = None) -> dict[str, Any]:
    now = now or datetime.now(timezone.utc)
    cached = _cost_cache.get("body")
    if cached and time.time() - _cost_cache["at"] < COST_CACHE_SECONDS:
        return _response(200, cached)

    notes: list[str] = []
    services: list[dict[str, Any]] = []
    total: dict[str, float | None] = {"this_month": None, "last_month": None}
    cloudwatch = _client("cloudwatch")
    series = _billing_series(cloudwatch)
    if series:
        # One small read per service; run them side by side.
        with ThreadPoolExecutor(max_workers=8) as pool:
            results = list(pool.map(lambda s: (s, _charges(cloudwatch, s, now)), series))
        for service, charges in results:
            if service is None:
                total = charges
            else:
                services.append({"service": service, **charges})
        services.sort(key=lambda s: (s["this_month"] or 0, s["last_month"] or 0), reverse=True)
    else:
        notes.append("BILLING_METRICS_OFF")

    try:
        budget = _budget()
    except Exception:  # noqa: BLE001 - show the rest of the page without it
        logger.exception(json.dumps({"event": "BUDGET_READ_FAILED"}))
        budget = None
        notes.append("BUDGET_UNAVAILABLE")

    body = {
        "ok": True,
        "generated_at": now.isoformat(timespec="seconds"),
        "currency": "USD",
        "total": total,
        "services": services,
        "budget": budget,
        "notes": notes,
    }
    _cost_cache.update(body=body, at=time.time())
    return _response(200, body)


def handler(event: dict[str, Any], context: Any = None) -> dict[str, Any]:
    route = event.get("routeKey", "")
    caller = _caller_sub(event)
    owner = os.environ.get("OWNER_SUB", "")
    try:
        if not owner or caller != owner:
            logger.warning(json.dumps({"event": "INBOX_FORBIDDEN", "route": route, "sub": caller}))
            return _response(403, {"ok": False, "errors": ["Forbidden"]})

        if route == "GET /messages":
            logger.info(json.dumps({"event": "INBOX_LIST"}))
            return list_messages()
        if route == "GET /costs":
            logger.info(json.dumps({"event": "INBOX_COSTS"}))
            return get_costs()
        if route == "DELETE /messages/{id}":
            message_id = (event.get("pathParameters") or {}).get("id", "")
            logger.info(json.dumps({"event": "INBOX_DELETE", "id": message_id}))
            return delete_message(message_id)
        return _response(404, {"ok": False, "errors": ["Not found"]})
    except Exception:  # noqa: BLE001 - never leak a stack trace to the caller
        logger.exception(json.dumps({"event": "UNHANDLED_ERROR", "route": route}))
        return _response(500, {"ok": False, "errors": ["Something went wrong"]})
