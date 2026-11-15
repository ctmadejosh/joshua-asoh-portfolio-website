"""Unit tests for the private inbox Lambda. No AWS account needed: DynamoDB is
replaced with an in-memory fake.

Run from the repo root:  python -m unittest discover -s services/contact -v
"""

import json
import os
import unittest
from datetime import datetime, timezone

os.environ.update(
    TABLE_NAME="test-table", OWNER_SUB="owner-sub", ACCOUNT_ID="123456789012", BUDGET_NAME="monthly"
)

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
        admin._cost_cache.clear()
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


NOW = datetime(2026, 11, 15, 12, 0, tzinfo=timezone.utc)


def day(month, d):
    return datetime(2026, month, d, tzinfo=timezone.utc)


class FakeCloudWatch:
    """Billing metrics: a running month-to-date total per service."""

    def __init__(self, series):
        self.series = series  # {service or None: [(timestamp, value), ...]}
        self.reads = 0

    def list_metrics(self, **kwargs):
        metrics = []
        for service in self.series:
            dims = [{"Name": "Currency", "Value": "USD"}]
            if service:
                dims.append({"Name": "ServiceName", "Value": service})
            metrics.append({"Dimensions": dims})
        # A linked-account series and a non-USD series must both be ignored.
        metrics.append({"Dimensions": [{"Name": "Currency", "Value": "USD"}, {"Name": "LinkedAccount", "Value": "1"}]})
        metrics.append({"Dimensions": [{"Name": "Currency", "Value": "EUR"}]})
        return {"Metrics": metrics}

    def get_metric_statistics(self, Dimensions, **kwargs):
        self.reads += 1
        dims = {d["Name"]: d["Value"] for d in Dimensions}
        points = self.series[dims.get("ServiceName")]
        return {"Datapoints": [{"Timestamp": t, "Maximum": v} for t, v in points]}


class FakeBudgets:
    def __init__(self, fail=False):
        self.fail = fail

    def describe_budget(self, AccountId, BudgetName):
        if self.fail:
            raise RuntimeError("no access")
        assert (AccountId, BudgetName) == ("123456789012", "monthly")
        return {
            "Budget": {
                "BudgetLimit": {"Amount": "5.0", "Unit": "USD"},
                "CalculatedSpend": {
                    "ActualSpend": {"Amount": "0.0123", "Unit": "USD"},
                    "ForecastedSpend": {"Amount": "0.03", "Unit": "USD"},
                },
            }
        }


class CostsTest(unittest.TestCase):
    def setUp(self):
        self.cloudwatch = FakeCloudWatch(
            {
                None: [(day(10, 20), 0.01), (day(10, 31), 0.02), (day(11, 3), 0.001), (day(11, 14), 0.0123)],
                "AWSLambda": [(day(10, 31), 0.0), (day(11, 14), 0.0)],
                "AmazonApiGateway": [(day(10, 31), 0.02), (day(11, 2), 0.0001), (day(11, 14), 0.0003)],
                "AmazonCognito": [(day(11, 14), 0.012)],
            }
        )
        self.budgets = FakeBudgets()
        admin._clients.clear()
        admin._cost_cache.clear()
        admin._clients.update(cloudwatch=self.cloudwatch, budgets=self.budgets)

    def costs(self):
        return body(admin.get_costs(now=NOW))

    def test_monthly_values_are_the_peak_of_each_month(self):
        data = self.costs()
        self.assertEqual(data["total"], {"this_month": 0.0123, "last_month": 0.02})
        api = next(s for s in data["services"] if s["service"] == "AmazonApiGateway")
        self.assertEqual(api, {"service": "AmazonApiGateway", "this_month": 0.0003, "last_month": 0.02})

    def test_service_new_this_month_has_no_last_month(self):
        cognito = next(s for s in self.costs()["services"] if s["service"] == "AmazonCognito")
        self.assertIsNone(cognito["last_month"])

    def test_services_sorted_by_this_month(self):
        names = [s["service"] for s in self.costs()["services"]]
        self.assertEqual(names, ["AmazonCognito", "AmazonApiGateway", "AWSLambda"])

    def test_ignores_linked_accounts_and_other_currencies(self):
        self.assertEqual(len(self.costs()["services"]), 3)

    def test_budget_totals(self):
        self.assertEqual(self.costs()["budget"], {"limit": 5.0, "actual": 0.0123, "forecast": 0.03})

    def test_billing_metrics_off_is_reported(self):
        self.cloudwatch.series = {}
        data = self.costs()
        self.assertIn("BILLING_METRICS_OFF", data["notes"])
        self.assertEqual(data["services"], [])
        self.assertEqual(data["budget"]["limit"], 5.0)

    def test_budget_failure_still_returns_services(self):
        self.budgets.fail = True
        data = self.costs()
        self.assertIsNone(data["budget"])
        self.assertIn("BUDGET_UNAVAILABLE", data["notes"])
        self.assertEqual(len(data["services"]), 3)

    def test_results_are_cached(self):
        self.costs()
        reads = self.cloudwatch.reads
        self.costs()
        self.assertEqual(self.cloudwatch.reads, reads)

    def test_costs_route_requires_owner(self):
        resp = admin.handler(event("GET /costs", sub="someone-else"))
        self.assertEqual(resp["statusCode"], 403)
        self.assertEqual(self.cloudwatch.reads, 0)

    def test_costs_route(self):
        resp = admin.handler(event("GET /costs"))
        self.assertEqual(resp["statusCode"], 200)
        self.assertTrue(body(resp)["ok"])


if __name__ == "__main__":
    unittest.main()
