// Renders resume/resume.html to public/Joshua_Asoh_Resume.pdf.
//
//   npm run resume        (needs Playwright with Chromium installed)
//
// Edit the HTML, run this, and commit both files. Times New Roman is used
// where installed; Liberation Serif (identical metrics) otherwise, so line
// breaks match either way.
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "resume", "resume.html");
const output = path.join(root, "public", "Joshua_Asoh_Resume.pdf");

// Playwright isn't a project dependency; use a local or global install.
const { chromium } = await import("playwright").catch(() => createRequire(import.meta.url)("playwright"));

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(source).href, { waitUntil: "load" });
await page.pdf({ path: output, format: "Letter", preferCSSPageSize: true, printBackground: true });
await browser.close();
console.log(`wrote ${path.relative(root, output)}`);
