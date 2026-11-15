import { expect, test, type Page } from "@playwright/test";

/**
 * The contact form, with the AWS API replaced by test doubles so no real
 * message is ever sent.
 */

const API = "https://aws.juasoh.com/contact";
const CORS = { "access-control-allow-origin": "*" };

async function fillForm(page: Page) {
  await page.goto("/contact?ref=github");
  await page.getByRole("textbox", { name: "Name" }).fill("Ada Lovelace");
  await page.getByRole("textbox", { name: "Email" }).fill("ada@example.com");
  await page.getByRole("textbox", { name: "Subject" }).fill("Platform role");
  await page.getByRole("textbox", { name: "Message" }).fill("I'd like to talk about platform engineering.");
}

test("a message is sent to the API with its source", async ({ page }) => {
  let sent: Record<string, string> | null = null;
  await page.route(API, async (route) => {
    sent = route.request().postDataJSON();
    await route.fulfill({ status: 200, headers: CORS, contentType: "application/json", body: '{"ok":true,"id":"x"}' });
  });

  await fillForm(page);
  await page.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByText("Thanks for writing.")).toBeVisible();
  expect(sent).toMatchObject({
    user_name: "Ada Lovelace",
    user_email: "ada@example.com",
    subject: "Platform role",
    source: "github", // from ?ref=github
    company: "", // the honeypot stays empty for people
  });
});

test("validation errors from the API are shown", async ({ page }) => {
  await page.route(API, (route) =>
    route.fulfill({
      status: 400,
      headers: CORS,
      contentType: "application/json",
      body: JSON.stringify({ ok: false, errors: ["user_email is not a valid email address"] }),
    })
  );

  await fillForm(page);
  await page.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByRole("alert")).toContainText("Email is not a valid email address");
});

test("if the API is down, the message can still be sent by email", async ({ page }) => {
  await page.route(API, (route) => route.abort("connectionrefused"));

  await fillForm(page);
  await page.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByText("The message didn't send from the site.")).toBeVisible();
  const fallback = page.getByRole("link", { name: "Open in my email app" });
  await expect(fallback).toHaveAttribute("href", /^mailto:.*subject=Platform%20role/);
});
