// Generates the social preview images (Open Graph / iMessage / LinkedIn / X)
// in public/og/, in the site's own look: warm paper, engineering grid, the
// circuit-trace JA mark, the site fonts.
//
//   npm run og        (needs Playwright with Chromium installed)
//
// Re-run after changing a case study's title or eyebrow, and commit the
// images. When the look changes, bump OG_VERSION so link previews that
// cached the old images (iMessage holds them for a long time) fetch new ones.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { caseStudies } from "../src/data/work.ts";
import { OG_VERSION } from "../src/data/og.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "public", "og");
fs.mkdirSync(out, { recursive: true });

const font = (pkg, file) =>
  `data:font/woff2;base64,${fs.readFileSync(path.join(root, "node_modules", pkg, "files", file)).toString("base64")}`;
const portrait = `data:image/jpeg;base64,${fs.readFileSync(path.join(root, "src/assets/hero-portrait.jpg")).toString("base64")}`;

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

const LOGO = `<svg viewBox="0 0 48 48" width="56" height="56"><rect width="48" height="48" rx="12" fill="#1B3BDB"/>
<g fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round">
<path d="M17 12.6 V29 L12 34 H10.6"/><path d="M23.5 36 V21 L29.5 13 L35.5 21 V36"/><path d="M23.5 27.5 H35.5"/></g>
<g fill="#1B3BDB" stroke="#fff" stroke-width="2.8"><circle cx="17" cy="10.4" r="2.9"/><circle cx="8.4" cy="34" r="2.9"/></g>
<circle cx="23.5" cy="37.6" r="3.2" fill="#FFB000"/><circle cx="35.5" cy="37.6" r="3.2" fill="#FFB000"/></svg>`;

const page = (body) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Display; src: url(${font("@fontsource-variable/bricolage-grotesque", "bricolage-grotesque-latin-wght-normal.woff2")}); font-weight: 200 800; }
@font-face { font-family: Sans; src: url(${font("@fontsource-variable/instrument-sans", "instrument-sans-latin-wght-normal.woff2")}); font-weight: 400 700; }
* { box-sizing: border-box; margin: 0; }
body { width: 1200px; height: 630px; overflow: hidden; background: #F9F8F5; color: #11151F; font-family: Sans, sans-serif; position: relative; }
.grid { position: absolute; inset: 0; background-image: linear-gradient(#E4DFD5 1px, transparent 1px), linear-gradient(90deg, #E4DFD5 1px, transparent 1px);
  background-size: 40px 40px; -webkit-mask-image: radial-gradient(ellipse at 25% 40%, black 15%, transparent 75%); }
.wrap { position: relative; height: 100%; padding: 64px 72px; display: flex; flex-direction: column; }
.brand { display: flex; align-items: center; gap: 16px; font-family: Display; font-weight: 650; font-size: 30px; letter-spacing: -0.01em; }
.brand small { display: block; font-family: Sans; font-weight: 500; font-size: 19px; color: #5F6675; letter-spacing: 0; }
h1 { font-family: Display; font-weight: 750; letter-spacing: -0.035em; line-height: 1.02; }
.hl { color: #1B3BDB; text-decoration: underline; text-decoration-color: #FFB000; text-decoration-thickness: 0.09em; text-underline-offset: 0.12em; text-decoration-skip-ink: none; }
.eyebrow { font-family: Display; font-weight: 650; font-size: 18px; letter-spacing: 0.2em; text-transform: uppercase; color: #6B7280; }
.foot { margin-top: auto; display: flex; align-items: center; gap: 12px; font-size: 22px; color: #3F4654; font-weight: 500; }
.dot { width: 12px; height: 12px; border-radius: 50%; background: #FFB000; }
.term { position: absolute; right: 72px; top: 200px; width: 430px; background: #fff; border: 1px solid #DDD8CE; border-radius: 18px;
  box-shadow: 0 30px 60px -30px rgba(17,21,31,.35); font-family: ui-monospace, Menlo, monospace; font-size: 17px; overflow: hidden; }
.term .bar { display: flex; gap: 8px; padding: 14px 18px; border-bottom: 1px solid #E8E4DC; }
.term .bar i { width: 11px; height: 11px; border-radius: 50%; background: #CFC9BD; } .term .bar i:last-child { background: #FFB000; }
.term .body { padding: 18px 22px 22px; line-height: 1.75; }
.term .k { color: #6B7280; display: inline-block; width: 92px; }
.flow { display: flex; gap: 10px; align-items: center; margin-top: 34px; }
.step { border: 2px dashed #C9C3B7; background: #fff; border-radius: 12px; padding: 12px 16px; font-weight: 600; font-size: 19px; }
.step.mine { border: 2px solid rgba(27,59,219,.35); background: #E8ECFF; color: #1B3BDB; }
.arrow { color: #9AA0AC; font-size: 22px; }
</style></head><body><div class="grid"></div>${body}</body></html>`;

const brand = `<div class="brand">${LOGO}<div>Joshua Asoh<small>Platform Engineer · The Hartford</small></div></div>`;

const home = page(`<div class="wrap">
  ${brand}
  <h1 style="font-size:76px; margin-top:54px; max-width:640px">I build the pipelines and tools <span class="hl">engineers ship with</span>.</h1>
  <div class="foot"><span class="dot"></span>juasoh.com</div>
</div>
<div class="term"><div class="bar"><i></i><i></i><i></i></div><div class="body">
  <div><span style="color:#1B3BDB">$</span> whoami</div>
  <div><span class="k">building</span>ATLAS developer platform</div>
  <div><span class="k">for</span>4,000+ engineers</div>
  <div><span class="k">focus</span>CLI · agent · VS Code</div>
  <div><span class="k">shipped</span>144 PRs merged</div>
</div></div>
<img src="${portrait}" style="position:absolute; right:44px; top:140px; width:112px; height:112px; border-radius:50%; object-fit:cover; object-position:56% 40%; border:4px solid #F9F8F5; box-shadow:0 8px 24px -8px rgba(17,21,31,.4)">`);

const study = (s) =>
  page(`<div class="wrap">
  ${brand}
  <p class="eyebrow" style="margin-top:48px">Case study · ${esc(s.eyebrow)}</p>
  <h1 style="font-size:${s.title.length > 52 ? 58 : 66}px; margin-top:16px; max-width:1000px">${esc(s.title)}</h1>
  <div class="flow">${s.flow
    .slice(0, 5)
    .map((f) => `<span class="step ${f.mine ? "mine" : ""}">${esc(f.label)}</span>`)
    .join('<span class="arrow">›</span>')}</div>
  <div class="foot"><span class="dot"></span>juasoh.com/work</div>
</div>`);

const jobs = [
  [`home-${OG_VERSION}.jpg`, home],
  ...caseStudies.map((s) => [`${s.slug}-${OG_VERSION}.jpg`, study(s)]),
];

// Playwright is not a project dependency; use a local install if there is one,
// else a global one (CommonJS require honours NODE_PATH, ES imports do not).
const { chromium } = await import("playwright").catch(() => createRequire(import.meta.url)("playwright"));
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
const p = await ctx.newPage();
for (const [name, html] of jobs) {
  await p.setContent(html, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: path.join(out, name), type: "jpeg", quality: 88 });
  console.log(`wrote public/og/${name}`);
}
await browser.close();
