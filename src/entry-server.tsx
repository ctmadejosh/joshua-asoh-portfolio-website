import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";
import { HeadContext, type HeadData } from "./components/site/Seo";
import { caseStudies } from "./data/work";

/** Every route that gets its own static HTML file and sitemap entry. */
export const routes = [
  "/",
  "/about",
  "/work",
  ...caseStudies.map((study) => `/work/${study.slug}`),
  "/projects",
  "/experience",
  "/contact",
];

export function render(url: string) {
  let head: HeadData | null = null;
  const html = renderToString(
    <StrictMode>
      <HeadContext.Provider value={{ set: (data) => (head = data) }}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HeadContext.Provider>
    </StrictMode>
  );
  return { html, head: head as HeadData | null };
}
