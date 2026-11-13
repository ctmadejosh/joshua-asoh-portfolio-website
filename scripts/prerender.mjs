// Pre-renders every route to static HTML after `vite build`, so search
// engines and link previews get real content and per-page metadata instead
// of an empty <div id="root">. The browser then hydrates that HTML.
//
// Output: dist/index.html, dist/work.html, dist/work/<slug>.html, …, plus
// dist/404.html (served with a real 404 status) and dist/sitemap.xml.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const SITE_URL = "https://juasoh.com";

const { render, routes } = await import(pathToFileURL(path.join(root, "dist-ssr", "entry-server.js")).href);
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");

const escapeAttr = (value) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// JSON inside <script> must not be able to close the tag.
const safeJson = (data) => JSON.stringify(data).replace(/</g, "\\u003c");

function replaceOnce(html, pattern, replacement, label) {
  const found = typeof pattern === "string" ? html.includes(pattern) : pattern.test(html);
  if (!found) throw new Error(`prerender: template is missing ${label}`);
  return html.replace(pattern, replacement);
}

function page(url) {
  const { html: appHtml, head } = render(url);
  if (!head) throw new Error(`prerender: ${url} rendered no <Seo>`);

  let html = template;
  const meta = (attr, key, value) => {
    html = replaceOnce(
      html,
      new RegExp(`<meta ${attr}="${key}" content="[^"]*"\\s*/?>`),
      `<meta ${attr}="${key}" content="${escapeAttr(value)}" />`,
      `${attr}=${key}`
    );
  };

  html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${escapeAttr(head.title)}</title>`, "<title>");
  meta("name", "description", head.description);
  meta("name", "robots", head.noindex ? "noindex" : "index, follow, max-image-preview:large");
  meta("property", "og:type", head.ogType);
  meta("property", "og:url", head.canonical);
  meta("property", "og:title", head.title);
  meta("property", "og:description", head.description);
  meta("name", "twitter:title", head.title);
  meta("name", "twitter:description", head.description);
  meta("property", "og:image", head.image);
  meta("property", "og:image:alt", head.imageAlt);
  meta("name", "twitter:image", head.image);
  html = replaceOnce(
    html,
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    head.noindex ? "" : `<link rel="canonical" href="${head.canonical}" />`,
    "canonical"
  );
  const jsonLd = head.jsonLd
    .map((data) => `<script type="application/ld+json" data-page-jsonld>${safeJson(data)}</script>`)
    .join("\n    ");
  html = html.replace("</head>", `  ${jsonLd}\n  </head>`);
  html = replaceOnce(html, '<div id="root"></div>', `<div id="root">${appHtml}</div>`, "#root");
  return html;
}

const outFile = (url) => (url === "/" ? "index.html" : `${url.slice(1)}.html`);

for (const url of routes) {
  const file = path.join(dist, outFile(url));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, page(url));
  console.log(`prerendered ${url} -> dist/${outFile(url)}`);
}

fs.writeFileSync(path.join(dist, "404.html"), page("/404-not-found"));
console.log("prerendered 404 -> dist/404.html");

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((url) => `  <url><loc>${SITE_URL}${url === "/" ? "/" : url}</loc><lastmod>${today}</lastmod></url>`)
  .join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap);
console.log(`wrote dist/sitemap.xml (${routes.length} URLs)`);
