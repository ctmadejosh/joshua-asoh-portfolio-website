import { defineConfig, devices } from "@playwright/test";

/**
 * Browser tests for the built site (see e2e/). They run against the
 * production build served by `vite preview`, so they test exactly what
 * Cloudflare deploys, pre-rendered HTML included.
 *
 *   npm run build && npm run test:e2e
 */
const PORT = 4173;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "retain-on-failure",
    // Optional: use an already-installed Chromium instead of Playwright's own
    // download (e.g. PW_CHROMIUM_PATH=/opt/pw-browsers/chromium). CI leaves it unset.
    ...(process.env.PW_CHROMIUM_PATH ? { launchOptions: { executablePath: process.env.PW_CHROMIUM_PATH } } : {}),
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `npx vite preview --host 127.0.0.1 --port ${PORT} --strictPort`,
    url: `http://127.0.0.1:${PORT}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
