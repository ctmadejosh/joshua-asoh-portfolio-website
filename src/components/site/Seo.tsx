import { createContext, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SITE_NAME, SITE_URL } from "@/data/site";

export type HeadData = {
  title: string;
  description: string;
  canonical: string;
  noindex: boolean;
  ogType: "website" | "article" | "profile";
  jsonLd: Record<string, unknown>[];
};

/**
 * During pre-rendering (scripts/prerender.mjs) a collector is provided and
 * each page's <Seo> reports its head tags into it, so they are baked into
 * that route's static HTML. In the browser there is no collector and <Seo>
 * updates document.head as the visitor navigates.
 */
export const HeadContext = createContext<{ set: (data: HeadData) => void } | null>(null);

type SeoProps = {
  title?: string;
  description: string;
  noindex?: boolean;
  ogType?: HeadData["ogType"];
  /** Page-specific structured data; a BreadcrumbList is added automatically. */
  jsonLd?: Record<string, unknown>[];
  /** Breadcrumb trail after Home, e.g. [["Work", "/work"], ["Atlas Studio", "/work/atlas-studio"]]. */
  breadcrumbs?: [string, string][];
};

export const absoluteUrl = (path: string) => `${SITE_URL}${path === "/" ? "/" : path.replace(/\/$/, "")}`;

export function buildHead(pathname: string, props: SeoProps): HeadData {
  const { title, description, noindex = false, ogType = "website", jsonLd = [], breadcrumbs } = props;
  const data: HeadData = {
    title: title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Platform Engineer`,
    description,
    canonical: absoluteUrl(pathname),
    noindex,
    ogType,
    jsonLd: [...jsonLd],
  };
  if (breadcrumbs?.length) {
    data.jsonLd.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [["Home", "/"], ...breadcrumbs].map(([name, path], i) => ({
        "@type": "ListItem",
        position: i + 1,
        name,
        item: absoluteUrl(path),
      })),
    });
  }
  return data;
}

const setMeta = (attr: "name" | "property", key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const Seo = (props: SeoProps) => {
  const { pathname } = useLocation();
  const collector = useContext(HeadContext);
  const head = buildHead(pathname, props);
  if (collector) collector.set(head);

  const key = JSON.stringify(head);
  useEffect(() => {
    document.title = head.title;
    setMeta("name", "description", head.description);
    setMeta("name", "robots", head.noindex ? "noindex" : "index, follow, max-image-preview:large");
    setMeta("property", "og:type", head.ogType);
    setMeta("property", "og:title", head.title);
    setMeta("property", "og:description", head.description);
    setMeta("property", "og:url", head.canonical);
    setMeta("name", "twitter:title", head.title);
    setMeta("name", "twitter:description", head.description);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = head.canonical;

    document.head.querySelectorAll("script[data-page-jsonld]").forEach((el) => el.remove());
    head.jsonLd.forEach((data) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.pageJsonld = "";
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    });
    // `key` captures every field of `head`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return null;
};

export default Seo;
