import { expect, test } from "@playwright/test";
import { fakeLiveServices } from "./fakes";

/** The main menu: every main page is reachable, and the admin sign-in is too. */

const MAIN_PAGES = ["About", "Work", "Projects", "Experience", "Status", "Contact"];

test("every main page is in the menu and opens", async ({ page, isMobile }) => {
  await fakeLiveServices(page);
  await page.goto("/");
  for (const name of MAIN_PAGES) {
    if (isMobile) await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name, exact: true }).click();
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`/${name.toLowerCase()}$`));
  }
});

test("the admin sign-in is reachable from the header", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile) {
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("link", { name: "Admin sign-in" }).click();
  } else {
    await page.getByRole("banner").getByRole("link", { name: "Admin sign-in" }).click();
  }
  await expect(page).toHaveURL(/\/inbox$/);
  await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
});

test("the admin link isn't followed by search engines", async ({ request }) => {
  const html = await (await request.get("/")).text();
  expect(html).toMatch(/<a[^>]*rel="nofollow"[^>]*href="\/inbox"|<a[^>]*href="\/inbox"[^>]*rel="nofollow"/);
});

test("signed in, the button says Admin", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop header button");
  await page.addInitScript(() =>
    sessionStorage.setItem("juasoh:inbox:token", JSON.stringify({ accessToken: "x", expiresAt: Date.now() + 3600_000 }))
  );
  await page.goto("/");
  await expect(page.getByRole("banner").getByRole("link", { name: "Admin", exact: true })).toBeVisible();
});
