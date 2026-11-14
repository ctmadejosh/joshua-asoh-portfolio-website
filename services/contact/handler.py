"""Contact form backend for juasoh.com.

API Gateway (HTTP API) calls this Lambda function for two routes:

  GET  /health   ->  {"ok": true}, for uptime checks
  POST /contact  ->  validates the message, saves it to DynamoDB, and emails
                     it to Joshua through SES with Reply-To set to the visitor

The message is saved *before* the email is sent, so a temporary SES problem
never loses a message. An email failure is logged as EMAIL_SEND_FAILED, which
a CloudWatch metric filter turns into an alarm (see infra/contact/monitoring.tf).

Only the standard library and boto3 are used; boto3 is built into the Lambda
Python runtime, so there is nothing to package beyond this file.
"""

from __future__ import annotations

import base64
import json
import logging
import os
import re
import uuid
from datetime import datetime, timezone
from typing import Any

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Field name -> (max length). Names match the website form's inputs.
LIMITS = {"user_name": 100, "user_email": 254, "subject": 150, "message": 5000}
# Deliberately simple: one @, no spaces, a dot in the domain. SES rejects
# anything truly undeliverable; this only catches obvious typos.
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
# Optional "where did they come from" label set by the website (utm_source,
# ?ref=, or the referring site). Untrusted, so it's reduced to a short slug.
SOURCE_RE = re.compile(r"[^a-z0-9._-]")
MAX_BODY_BYTES = 16_000

# boto3 clients are created on first use, not at import time, so tests can
# swap in fakes and cold starts don't pay for clients a route doesn't need.
_clients: dict[str, Any] = {}


def _table():
    if "table" not in _clients:
        import boto3

        _clients["table"] = boto3.resource("dynamodb").Table(os.environ["TABLE_NAME"])
    return _clients["table"]


def _ses():
    if "ses" not in _clients:
        import boto3

        _clients["ses"] = boto3.client("sesv2")
    return _clients["ses"]


def _response(status: int, body: dict[str, Any]) -> dict[str, Any]:
    return {
        "statusCode": status,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(body),
    }


def _parse_body(event: dict[str, Any]) -> dict[str, Any] | None:
    raw = event.get("body") or ""
    if event.get("isBase64Encoded"):
        raw = base64.b64decode(raw).decode("utf-8", errors="replace")
    if len(raw.encode("utf-8")) > MAX_BODY_BYTES:
        return None
    try:
        data = json.loads(raw)
    except (json.JSONDecodeError, TypeError):
        return None
    return data if isinstance(data, dict) else None


def validate(data: dict[str, Any]) -> tuple[dict[str, str], list[str]]:
    """Return (clean fields, errors). Every field is required and trimmed."""
    clean: dict[str, str] = {}
    errors: list[str] = []
    for field, limit in LIMITS.items():
        value = data.get(field)
        value = value.strip() if isinstance(value, str) else ""
        if not value:
            errors.append(f"{field} is required")
        elif len(value) > limit:
            errors.append(f"{field} must be at most {limit} characters")
        clean[field] = value
    if clean["user_email"] and not EMAIL_RE.match(clean["user_email"]):
        errors.append("user_email is not a valid email address")
    # Header injection guard: subject and name go into email headers.
    for field in ("user_name", "subject"):
        if "\n" in clean[field] or "\r" in clean[field]:
            errors.append(f"{field} must be a single line")
    return clean, errors


def clean_source(value: Any) -> str:
    """Return a safe source label like "linkedin", or "unknown"."""
    if not isinstance(value, str):
        return "unknown"
    slug = SOURCE_RE.sub("", value.strip().lower())[:40]
    return slug or "unknown"


def _send_email(record: dict[str, str]) -> None:
    body = (
        f"New message from juasoh.com\n\n"
        f"From:    {record['user_name']} <{record['user_email']}>\n"
        f"Subject: {record['subject']}\n"
        f"Came from: {record['source']}\n"
        f"Sent:    {record['created_at']}\n"
        f"ID:      {record['id']}\n\n"
        f"{record['message']}\n"
    )
    _ses().send_email(
        FromEmailAddress=os.environ["FROM_EMAIL"],
        Destination={"ToAddresses": [os.environ["TO_EMAIL"]]},
        # Replying in your mail app goes straight to the visitor.
        ReplyToAddresses=[record["user_email"]],
        Content={
            "Simple": {
                "Subject": {"Data": f"[juasoh.com] {record['subject']}", "Charset": "UTF-8"},
                "Body": {"Text": {"Data": body, "Charset": "UTF-8"}},
            }
        },
    )


def handle_contact(event: dict[str, Any]) -> dict[str, Any]:
    data = _parse_body(event)
    if data is None:
        return _response(400, {"ok": False, "errors": ["Body must be a JSON object under 16 KB"]})

    # Honeypot: the form has a hidden "company" field people never fill in.
    # Bots do. Answer as if it worked, so they don't learn to avoid it.
    if isinstance(data.get("company"), str) and data["company"].strip():
        logger.info(json.dumps({"event": "HONEYPOT_TRIPPED"}))
        return _response(200, {"ok": True})

    clean, errors = validate(data)
    if errors:
        return _response(400, {"ok": False, "errors": errors})

    http = (event.get("requestContext") or {}).get("http") or {}
    record = {
        "id": str(uuid.uuid4()),
        "created_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        **clean,
        "source": clean_source(data.get("source")),
        "source_ip": http.get("sourceIp", ""),
        "user_agent": (http.get("userAgent") or "")[:300],
    }

    # 1) Save first: the message is safe even if email fails.
    _table().put_item(Item=record)

    # 2) Then email. A failure here is logged for the alarm, not shown to the
    #    visitor: their message is stored and will be seen.
    try:
        _send_email(record)
        emailed = True
    except Exception:  # noqa: BLE001 - any SES error should alarm, not 500
        logger.exception(json.dumps({"event": "EMAIL_SEND_FAILED", "id": record["id"]}))
        emailed = False

    logger.info(json.dumps({"event": "MESSAGE_RECEIVED", "id": record["id"], "emailed": emailed}))
    return _response(200, {"ok": True, "id": record["id"]})


def handler(event: dict[str, Any], context: Any = None) -> dict[str, Any]:
    route = event.get("routeKey", "")
    try:
        if route == "GET /health":
            return _response(200, {"ok": True})
        if route == "POST /contact":
            return handle_contact(event)
        return _response(404, {"ok": False, "errors": ["Not found"]})
    except Exception:  # noqa: BLE001 - never leak a stack trace to the caller
        logger.exception(json.dumps({"event": "UNHANDLED_ERROR", "route": route}))
        return _response(500, {"ok": False, "errors": ["Something went wrong. Please email instead."]})
