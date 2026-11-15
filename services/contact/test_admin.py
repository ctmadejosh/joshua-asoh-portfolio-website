"""Unit tests for the private inbox Lambda. No AWS account needed: DynamoDB is
replaced with an in-memory fake.

Run from the repo root:  python -m unittest discover -s services/contact -v
"""

import json
import os
import unittest

os.environ.update(TABLE_NAME="test-table", OWNER_SUB="owner-sub")

import admin  # noqa: E402

ID_1 = "11111111-1111-4111-8111-111111111111"
ID_2 = "22222222-2222-4222-8222-222222222222"


class ConditionFailed(Exception):
    """Shaped like botocore's ClientError for a failed ConditionExpression."""

    response = {"Error": {"Code": "ConditionalCheckFailedException"}}


class FakeTable:
    def __init__(self, items, page_size=None):
        self.items = {item["id"]: item for item in items}
        self.page_size = page_size
        self.scans = 0

    def scan(self, ExclusiveStartKey=None):
        self.scans += 1
        items = sorted(self.items.values(), key=lambda i: i["id"])
        start = 0
        if ExclusiveStartKey:
            start = next(n for n, i in enumerate(items) if i["id"] == ExclusiveStartKey["id"]) + 1
        size = self.page_size or len(items)
        page = {"Items": items[start : start + size]}
        if start + size < len(items):
            page["LastEvaluatedKey"] = {"id": items[start + size - 1]["id"]}
        return page

    def delete_item(self, Key, ConditionExpression):
        if Key["id"] not in self.items:
            raise ConditionFailed()
        del self.items[Key["id"]]


def message(id_, created_at, **extra):
    return {
        "id": id_,
        "created_at": created_at,
        "user_name": "Ada",
        "user_email": "ada@example.com",
        "subject": "Hi",
        "message": "Hello",
        "source": "linkedin",
        "source_ip": "203.0.113.7",
        "user_agent": "test-agent",
        **extra,
    }


def event(route, sub="owner-sub", path=None):
    claims = {"sub": sub} if sub is not None else {}
    return {
        "routeKey": route,
        "pathParameters": path or {},
        "requestContext": {"authorizer": {"jwt": {"claims": claims}}},
    }


def body(resp):
    return json.loads(resp["body"])


class InboxTest(unittest.TestCase):
    def setUp(self):
        self.table = FakeTable(
            [message(ID_1, "2026-11-14T10:00:00+00:00"), message(ID_2, "2026-11-15T10:00:00+00:00")]
        )
        admin._clients.clear()
        admin._clients["table"] = self.table

    def test_lists_newest_first(self):
        resp = admin.handler(event("GET /messages"))
        self.assertEqual(resp["statusCode"], 200)
        self.assertEqual([m["id"] for m in body(resp)["messages"]], [ID_2, ID_1])

    def test_list_hides_ip_and_user_agent(self):
        msg = body(admin.handler(event("GET /messages")))["messages"][0]
        self.assertNotIn("source_ip", msg)
        self.assertNotIn("user_agent", msg)
        self.assertEqual(msg["source"], "linkedin")

    def test_list_follows_scan_pages(self):
        self.table.page_size = 1
        resp = admin.handler(event("GET /messages"))
        self.assertEqual(len(body(resp)["messages"]), 2)
        self.assertEqual(self.table.scans, 2)

    def test_responses_are_not_cached(self):
        resp = admin.handler(event("GET /messages"))
        self.assertEqual(resp["headers"]["Cache-Control"], "no-store")

    def test_other_user_is_forbidden(self):
        resp = admin.handler(event("GET /messages", sub="someone-else"))
        self.assertEqual(resp["statusCode"], 403)
        self.assertNotIn("messages", body(resp))

    def test_missing_claims_are_forbidden(self):
        self.assertEqual(admin.handler(event("GET /messages", sub=None))["statusCode"], 403)

    def test_unset_owner_forbids_everyone(self):
        os.environ["OWNER_SUB"] = ""
        try:
            self.assertEqual(admin.handler(event("GET /messages", sub=""))["statusCode"], 403)
        finally:
            os.environ["OWNER_SUB"] = "owner-sub"

    def test_delete_removes_message(self):
        resp = admin.handler(event("DELETE /messages/{id}", path={"id": ID_1}))
        self.assertEqual(resp["statusCode"], 200)
        self.assertNotIn(ID_1, self.table.items)
        self.assertIn(ID_2, self.table.items)

    def test_delete_unknown_id_is_404(self):
        resp = admin.handler(event("DELETE /messages/{id}", path={"id": "33333333-3333-4333-8333-333333333333"}))
        self.assertEqual(resp["statusCode"], 404)

    def test_delete_rejects_malformed_id(self):
        resp = admin.handler(event("DELETE /messages/{id}", path={"id": "../../etc"}))
        self.assertEqual(resp["statusCode"], 400)
        self.assertEqual(len(self.table.items), 2)

    def test_other_user_cannot_delete(self):
        resp = admin.handler(event("DELETE /messages/{id}", sub="someone-else", path={"id": ID_1}))
        self.assertEqual(resp["statusCode"], 403)
        self.assertIn(ID_1, self.table.items)

    def test_database_error_returns_500_without_details(self):
        def boom(**_):
            raise RuntimeError("secret internals")

        self.table.scan = boom
        resp = admin.handler(event("GET /messages"))
        self.assertEqual(resp["statusCode"], 500)
        self.assertNotIn("secret", resp["body"])


if __name__ == "__main__":
    unittest.main()
