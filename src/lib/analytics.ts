/**
 * Google Analytics 4. Loads only when VITE_GA_MEASUREMENT_ID is set at build
 * time (e.g. G-XXXXXXXXXX) and only in the browser, so local builds and
 * pre-rendering send nothing. Page views are sent by hand on each route
 * change, because GA's automatic page view only fires on the first load of a
 * single-page app.
 */
import { captureAttribution, refOnlyCampaign } from "./attribution";

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

/**
 * The juasoh.com GA4 property. A measurement ID isn't a secret (it's in every
 * tracked page's HTML); VITE_GA_MEASUREMENT_ID can override it for testing.
 */
const MEASUREMENT_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined) || "G-G1XFK5MDXR";

/** Only the real site is counted: not Cloudflare previews, localhost, or tests. */
const PRODUCTION_HOSTS = new Set(["juasoh.com", "www.juasoh.com"]);
let initialised = false;

export const analyticsEnabled = () =>
  typeof window !== "undefined" &&
  Boolean(MEASUREMENT_ID) &&
  import.meta.env.PROD &&
  (PRODUCTION_HOSTS.has(window.location.hostname) || Boolean(import.meta.env.VITE_GA_MEASUREMENT_ID));

export function initAnalytics() {
  if (initialised || !analyticsEnabled()) return;
  initialised = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag.js expects the `arguments` object itself, not an array.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  // utm_* tags on the landing URL are read by GA automatically. The short
  // ?ref=linkedin form is mapped onto GA's campaign fields here, and the
  // visit's first source is saved as the user property `first_source`.
  const attribution = captureAttribution();
  window.gtag("config", MEASUREMENT_ID, { send_page_view: false, ...(refOnlyCampaign() ?? {}) });
  window.gtag("set", "user_properties", { first_source: attribution.source });
}

export function trackPageView(path: string, title: string) {
  if (!analyticsEnabled() || !window.gtag) return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: title,
  });
}

/** Named events: resume_download, contact_submit, email_copied, command_palette_open, … */
export function trackEvent(name: string, params: Record<string, string | number> = {}) {
  if (!analyticsEnabled() || !window.gtag) return;
  window.gtag("event", name, params);
}
