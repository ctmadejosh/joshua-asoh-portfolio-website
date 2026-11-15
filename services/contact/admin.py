"""Private inbox backend for juasoh.com/inbox.

API Gateway calls this Lambda for two routes, both behind a Cognito JWT
authorizer (see infra/contact/admin.tf):

  GET    /messages        ->  every message, newest first
  DELETE /messages/{id}   ->  deletes one message

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

_clients: dict[str, Any] = {}


def _table():
    if "table" not in _clients:
        import boto3

        _clients["table"] = boto3.resource("dynamodb").Table(os.environ["TABLE_NAME"])
    return _clients["table"]


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
        if route == "DELETE /messages/{id}":
            message_id = (event.get("pathParameters") or {}).get("id", "")
            logger.info(json.dumps({"event": "INBOX_DELETE", "id": message_id}))
            return delete_message(message_id)
        return _response(404, {"ok": False, "errors": ["Not found"]})
    except Exception:  # noqa: BLE001 - never leak a stack trace to the caller
        logger.exception(json.dumps({"event": "UNHANDLED_ERROR", "route": route}))
        return _response(500, {"ok": False, "errors": ["Something went wrong"]})
