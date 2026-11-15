"""Unit tests for the uptime checker and the public status API. No AWS or
network needed: CloudWatch and HTTP are replaced with fakes.

Run from the repo root:  python -m unittest discover -s services/contact -v
"""

import json
import unittest
import urllib.error
from datetime import datetime, timedelta, timezone

import status
import status_check

NOW = datetime(2026, 11, 15, 12, 0, tzinfo=timezone.utc)


class FakeCloudWatch:
    def __init__(self):
        self.put = []
        self.reads = 0
        self.points = {}  # (metric, target) -> list of (timestamp, value)
        self.billing = []

    def put_metric_data(self, Namespace, MetricData):
        self.put.append((Namespace, MetricData))

    def get_metric_statistics(self, Namespace, MetricName, Dimensions, StartTime, EndTime, Period, Statistics):
        self.reads += 1
        if Namespace == "AWS/Billing":
            return {"Datapoints": [{"Timestamp": t, "Maximum": v} for t, v in self.billing if StartTime <= t <= EndTime]}
        target = Dimensions[0]["Value"]
        raw = [(t, v) for t, v in self.points.get((MetricName, target), []) if StartTime <= t <= EndTime]
        buckets = {}
        for t, v in raw:
            start = StartTime + timedelta(seconds=((t - StartTime).total_seconds() // Period) * Period)
            buckets.setdefault(start, []).append(v)
        out = []
        for t, values in buckets.items():
            p = {"Timestamp": t}
            if "Sum" in Statistics:
                p["Sum"] = sum(values)
            if "SampleCount" in Statistics:
                p["SampleCount"] = float(len(values))
            if "Minimum" in Statistics:
                p["Minimum"] = min(values)
            if "Average" in Statistics:
                p["Average"] = sum(values) / len(values)
            out.append(p)
        return {"Datapoints": out}


def every_5_minutes(hours, value, end=NOW):
    count = int(hours * 12)
    return [(end - timedelta(minutes=5 * i + 1), value) for i in range(count)]


class CheckerTest(unittest.TestCase):
    def setUp(self):
        self.cw = FakeCloudWatch()
        status_check._clients.clear()
        status_check._clients["cloudwatch"] = self.cw

    def run_with(self, responses):
        def fetch(url):
            result = responses[url]
            if isinstance(result, Exception):
                raise result
            return result

        return status_check.handler(fetch=fetch)["results"]

    def test_healthy_targets_record_up_and_latency(self):
        results = self.run_with({
            "https://juasoh.com/": (200, b"<title>Joshua Asoh</title>"),
            "https://aws.juasoh.com/health": (200, b'{"ok": true}'),
        })
        self.assertTrue(all(r["up"] for r in results))
        namespace, data = self.cw.put[0]
        self.assertEqual(namespace, "juasoh/Status")
        names = sorted((d["MetricName"], d["Dimensions"][0]["Value"]) for d in data)
        self.assertEqual(names, [("LatencyMs", "api"), ("LatencyMs", "website"), ("Up", "api"), ("Up", "website")])

    def test_wrong_body_counts_as_down(self):
        results = self.run_with({
            "https://juasoh.com/": (200, b"Cloudflare error page"),
            "https://aws.juasoh.com/health": (200, b'{"ok": false}'),
        })
        self.assertFalse(any(r["up"] for r in results))
        self.assertEqual(results[0]["reason"], "unexpected body")

    def test_errors_and_timeouts_count_as_down_without_latency(self):
        results = self.run_with({
            "https://juasoh.com/": urllib.error.HTTPError("u", 503, "down", {}, None),
            "https://aws.juasoh.com/health": TimeoutError(),
        })
        self.assertFalse(any(r["up"] for r in results))
        _, data = self.cw.put[0]
        self.assertEqual([d["MetricName"] for d in data], ["Up", "Up"])
        self.assertEqual({d["Value"] for d in data}, {0.0})

    def test_malformed_json_counts_as_down(self):
        results = self.run_with({
            "https://juasoh.com/": (200, b"Joshua Asoh"),
            "https://aws.juasoh.com/health": (200, b"<html>"),
        })
        self.assertEqual([r["up"] for r in results], [True, False])


class StatusApiTest(unittest.TestCase):
    def setUp(self):
        self.cw = FakeCloudWatch()
        status._clients.clear()
        status._cache.clear()
        status._clients["cloudwatch"] = self.cw

    def body(self):
        return json.loads(status.get_status(now=NOW)["body"])

    def test_no_data_yet(self):
        data = self.body()
        api = next(t for t in data["targets"] if t["target"] == "api")
        self.assertIsNone(api["up"])
        self.assertIsNone(api["uptime"]["24h"])
        self.assertIsNone(data["cost_this_month"])

    def test_uptime_and_latest_check(self):
        # 30 days of checks for the API; the 6 checks in the last 30 minutes failed.
        ups = every_5_minutes(24 * 30, 1.0)
        ups = [(t, 0.0) if NOW - t < timedelta(minutes=30) else (t, v) for t, v in ups]
        self.cw.points[("Up", "api")] = ups
        self.cw.points[("LatencyMs", "api")] = every_5_minutes(24, 120.0)
        api = next(t for t in self.body()["targets"] if t["target"] == "api")
        self.assertFalse(api["up"])
        self.assertAlmostEqual(api["uptime"]["24h"], 100 * (288 - 6) / 288, places=2)
        self.assertGreater(api["uptime"]["30d"], api["uptime"]["24h"])
        self.assertEqual(api["latency_ms_24h"], 120)
        self.assertGreaterEqual(len(api["latency_series"]), 24)

    def test_cost_is_this_months_peak_only(self):
        self.cw.billing = [(datetime(2026, 10, 31, tzinfo=timezone.utc), 3.21), (datetime(2026, 11, 14, tzinfo=timezone.utc), 0.0123)]
        self.assertEqual(self.body()["cost_this_month"], 0.01)

    def test_cached_for_a_minute(self):
        self.body()
        reads = self.cw.reads
        self.body()
        self.assertEqual(self.cw.reads, reads)

    def test_public_cache_header(self):
        resp = status.handler({"routeKey": "GET /status"})
        self.assertEqual(resp["statusCode"], 200)
        self.assertIn("max-age=60", resp["headers"]["Cache-Control"])

    def test_unknown_route(self):
        self.assertEqual(status.handler({"routeKey": "GET /other"})["statusCode"], 404)

    def test_errors_do_not_leak(self):
        def boom(**_):
            raise RuntimeError("secret internals")

        self.cw.get_metric_statistics = boom
        resp = status.handler({"routeKey": "GET /status"})
        self.assertEqual(resp["statusCode"], 500)
        self.assertNotIn("secret", resp["body"])


if __name__ == "__main__":
    unittest.main()
