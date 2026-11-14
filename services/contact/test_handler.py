"""Unit tests for the contact Lambda. No AWS account needed: DynamoDB and SES
are replaced with in-memory fakes.

Run from the repo root:  python -m unittest discover -s services/contact -v
"""

import base64
import json
import os
import unittest

os.environ.update(TABLE_NAME="test-table", FROM_EMAIL="from@example.com", TO_EMAIL="to@example.com")

import handler  # noqa: E402


class FakeTable:
    def __init__(self):
        self.items = []

    def put_item(self, Item):
        self.items.append(Item)


class FakeSes:
    def __init__(self, fail=False):
        self.sent = []
        self.fail = fail

    def send_email(self, **kwargs):
        if self.fail:
            raise RuntimeError("SES is down")
        self.sent.append(kwargs)


VALID = {
    "user_name": "Ada Lovelace",
    "user_email": "ada@example.com",
    "subject": "Hello",
    "message": "I'd like to talk about platform engineering.",
}


def event(body, route="POST /contact", b64=False):
    raw = json.dumps(body) if not isinstance(body, str) else body
    if b64:
        raw = base64.b64encode(raw.encode()).decode()
    return {
        "routeKey": route,
        "body": raw,
        "isBase64Encoded": b64,
        "requestContext": {"http": {"sourceIp": "203.0.113.7", "userAgent": "test-agent"}},
    }


class ContactHandlerTest(unittest.TestCase):
    def setUp(self):
        self.table = FakeTable()
        self.ses = FakeSes()
        handler._clients.clear()
        handler._clients.update(table=self.table, ses=self.ses)

    def call(self, ev):
        res = handler.handler(ev)
        return res["statusCode"], json.loads(res["body"])

    def test_health(self):
        status, body = self.call({"routeKey": "GET /health"})
        self.assertEqual((status, body), (200, {"ok": True}))

    def test_unknown_route_is_404(self):
        status, _ = self.call({"routeKey": "DELETE /contact"})
        self.assertEqual(status, 404)

    def test_valid_message_is_saved_then_emailed(self):
        status, body = self.call(event(VALID))
        self.assertEqual(status, 200)
        self.assertTrue(body["ok"])
        self.assertEqual(len(self.table.items), 1)
        item = self.table.items[0]
        self.assertEqual(item["id"], body["id"])
        self.assertEqual(item["user_email"], "ada@example.com")
        self.assertEqual(item["source_ip"], "203.0.113.7")
        sent = self.ses.sent[0]
        self.assertEqual(sent["ReplyToAddresses"], ["ada@example.com"])
        self.assertEqual(sent["Destination"], {"ToAddresses": ["to@example.com"]})
        self.assertIn("[juasoh.com] Hello", sent["Content"]["Simple"]["Subject"]["Data"])
        self.assertIn("platform engineering", sent["Content"]["Simple"]["Body"]["Text"]["Data"])

    def test_source_is_saved_and_shown_in_email(self):
        self.call(event({**VALID, "source": "LinkedIn"}))
        self.assertEqual(self.table.items[0]["source"], "linkedin")
        self.assertIn("Came from: linkedin", self.ses.sent[0]["Content"]["Simple"]["Body"]["Text"]["Data"])

    def test_source_is_sanitized_and_optional(self):
        self.call(event({**VALID, "source": "<script>alert(1)</script>" + "x" * 100}))
        self.call(event(VALID))
        stored = [i["source"] for i in self.table.items]
        self.assertTrue(all(len(s) <= 40 for s in stored))
        self.assertNotIn("<", stored[0])
        self.assertEqual(stored[1], "unknown")

    def test_base64_body_is_decoded(self):
        status, _ = self.call(event(VALID, b64=True))
        self.assertEqual(status, 200)

    def test_fields_are_trimmed(self):
        self.call(event({**VALID, "user_name": "  Ada  "}))
        self.assertEqual(self.table.items[0]["user_name"], "Ada")

    def test_missing_fields_are_rejected_and_nothing_saved(self):
        status, body = self.call(event({"user_name": "Ada"}))
        self.assertEqual(status, 400)
        self.assertIn("user_email is required", body["errors"])
        self.assertIn("message is required", body["errors"])
        self.assertEqual(self.table.items, [])
        self.assertEqual(self.ses.sent, [])

    def test_bad_email_is_rejected(self):
        status, body = self.call(event({**VALID, "user_email": "not-an-email"}))
        self.assertEqual(status, 400)
        self.assertIn("user_email is not a valid email address", body["errors"])

    def test_too_long_message_is_rejected(self):
        status, body = self.call(event({**VALID, "message": "x" * 5001}))
        self.assertEqual(status, 400)
        self.assertIn("message must be at most 5000 characters", body["errors"])

    def test_header_injection_in_subject_is_rejected(self):
        status, body = self.call(event({**VALID, "subject": "Hi\nBcc: victim@example.com"}))
        self.assertEqual(status, 400)
        self.assertIn("subject must be a single line", body["errors"])

    def test_non_json_body_is_rejected(self):
        status, _ = self.call(event("not json"))
        self.assertEqual(status, 400)

    def test_json_array_body_is_rejected(self):
        status, _ = self.call(event("[1, 2, 3]"))
        self.assertEqual(status, 400)

    def test_oversized_body_is_rejected(self):
        status, _ = self.call(event({**VALID, "padding": "x" * 20_000}))
        self.assertEqual(status, 400)

    def test_honeypot_pretends_success_but_saves_nothing(self):
        status, body = self.call(event({**VALID, "company": "Spam Inc"}))
        self.assertEqual((status, body), (200, {"ok": True}))
        self.assertEqual(self.table.items, [])
        self.assertEqual(self.ses.sent, [])

    def test_email_failure_still_saves_and_succeeds(self):
        handler._clients["ses"] = FakeSes(fail=True)
        with self.assertLogs(level="ERROR") as logs:
            status, body = self.call(event(VALID))
        self.assertEqual(status, 200)
        self.assertTrue(body["ok"])
        self.assertEqual(len(self.table.items), 1)
        self.assertTrue(any("EMAIL_SEND_FAILED" in line for line in logs.output))

    def test_database_failure_returns_500_without_details(self):
        class BrokenTable:
            def put_item(self, Item):
                raise RuntimeError("DynamoDB is down")

        handler._clients["table"] = BrokenTable()
        with self.assertLogs(level="ERROR"):
            status, body = self.call(event(VALID))
        self.assertEqual(status, 500)
        self.assertNotIn("DynamoDB", json.dumps(body))
        self.assertEqual(self.ses.sent, [])


if __name__ == "__main__":
    unittest.main()
