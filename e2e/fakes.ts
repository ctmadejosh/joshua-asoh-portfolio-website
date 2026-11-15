import type { Page } from "@playwright/test";

/**
 * Test doubles for the live services some pages call from the browser, so
 * tests never depend on AWS or GitHub being reachable (or on a backend
 * change that hasn't been deployed yet).
 */
const CORS = { "access-control-allow-origin": "*" };
const hoursAgo = (h: number) => new Date(Date.now() - h * 3600_000).toISOString();

export const fakeStatus = {
  ok: true,
  generated_at: hoursAgo(0),
  cost_this_month: 0.01,
  targets: [
    {
      target: "website",
      up: true,
      last_checked: hoursAgo(0.05),
      uptime: { "24h": 100, "7d": 100, "30d": 99.98 },
      latency_ms_24h: 180,
      latency_series: Array.from({ length: 24 }, (_, i) => ({ t: hoursAgo(24 - i), ms: 150 + ((i * 37) % 80) })),
    },
    {
      target: "api",
      up: true,
      last_checked: hoursAgo(0.05),
      uptime: { "24h": 100, "7d": 99.9, "30d": 99.95 },
      latency_ms_24h: 95,
      latency_series: Array.from({ length: 24 }, (_, i) => ({ t: hoursAgo(24 - i), ms: 80 + ((i * 23) % 40) })),
    },
  ],
};

export const fakeRuns = {
  workflow_runs: [
    { name: "contact-backend", conclusion: "success", sha: "aaaaaaa1", title: "Admin page: Costs and Analytics tabs (#18)" },
    { name: "site", conclusion: "success", sha: "aaaaaaa1", title: "" },
    { name: "Deploy Jekyll with GitHub Pages dependencies preinstalled", conclusion: "failure", sha: "aaaaaaa1", title: "" },
    { name: "contact-backend", conclusion: "failure", sha: "bbbbbbb2", title: "Private inbox at juasoh.com/inbox (#16)" },
  ].map((r, i) => ({
    id: i + 1,
    name: r.name,
    head_sha: r.sha.padEnd(40, "0"),
    status: "completed",
    conclusion: r.conclusion,
    created_at: hoursAgo(i + 1),
    html_url: `https://github.com/ctmadejosh/joshua-asoh-portfolio-website/actions/runs/${i + 1}`,
    head_commit: {
      message: `Merge pull request #${r.title.match(/#(\d+)/)?.[1] ?? 1} from x/y\n\n${r.title.replace(/ \(#\d+\)$/, "")}`,
    },
  })),
};

export async function fakeLiveServices(page: Page, status: object | null = fakeStatus) {
  await page.route("https://aws.juasoh.com/status", (route) =>
    status
      ? route.fulfill({ status: 200, headers: CORS, contentType: "application/json", body: JSON.stringify(status) })
      : route.fulfill({ status: 503, headers: CORS, body: "" })
  );
  await page.route("https://api.github.com/**", (route) =>
    route.fulfill({ status: 200, headers: CORS, contentType: "application/json", body: JSON.stringify(fakeRuns) })
  );
}
