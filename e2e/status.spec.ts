import { expect, test } from "@playwright/test";
import { fakeLiveServices, fakeStatus } from "./fakes";

/** juasoh.com/status, with the status API and GitHub faked. */

test("shows live status, uptime, response times, deploys and cost", async ({ page }) => {
  await fakeLiveServices(page);
  await page.goto("/status");

  await expect(page.getByRole("status")).toHaveText("All systems operational");
  for (const name of ["Website", "Contact API"]) {
    const card = page.getByRole("article").filter({ has: page.getByRole("heading", { name }) });
    await expect(card.getByText("Operational")).toBeVisible();
    await expect(card.getByText("Uptime 24h")).toBeVisible();
    await expect(card.getByRole("img", { name: /response time by hour/ })).toBeVisible();
  }
  await expect(page.getByText("99.98%")).toBeVisible();
  await expect(page.getByText("$0.01")).toBeVisible();

  // Deploys: grouped by commit, PR titles shown, unrelated workflows hidden.
  await expect(page.getByText("Admin page: Costs and Analytics tabs (#18)")).toBeVisible();
  await expect(page.getByRole("link", { name: /Website checks: passed/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /AWS backend: failure/ })).toBeVisible();
  await expect(page.getByText(/Jekyll/)).toHaveCount(0);
});

test("a failed check shows as down", async ({ page }) => {
  const down = structuredClone(fakeStatus);
  down.targets[1].up = false;
  await fakeLiveServices(page, down);
  await page.goto("/status");

  await expect(page.getByRole("status")).toHaveText("Something is down");
  const api = page.getByRole("article").filter({ has: page.getByRole("heading", { name: "Contact API" }) });
  await expect(api.getByText("Down")).toBeVisible();
});

test("before the first checks run, it says it's collecting data", async ({ page }) => {
  const empty = structuredClone(fakeStatus);
  for (const t of empty.targets) Object.assign(t, { up: null, last_checked: null, latency_ms_24h: null, latency_series: [] });
  await fakeLiveServices(page, empty);
  await page.goto("/status");

  await expect(page.getByRole("status")).toContainText("Collecting data");
  await expect(page.getByText("No data yet")).toHaveCount(2);
});

test("if the status API is down, the page says so instead of breaking", async ({ page }) => {
  await fakeLiveServices(page, null);
  await page.goto("/status");
  await expect(page.getByText("The status service didn't answer.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Recent deploys" })).toBeVisible();
});
