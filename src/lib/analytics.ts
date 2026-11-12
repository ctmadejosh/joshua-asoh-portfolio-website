/**
 * Google Analytics 4. Loads only when VITE_GA_MEASUREMENT_ID is set at build
 * time (e.g. G-XXXXXXXXXX) and only in the browser, so local builds and
 * pre-rendering send nothing. Page views are sent by hand on each route
 * change, because GA's automatic page view only fires on the first load of a
 * single-page app.
 */
type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
let initialised = false;

export const analyticsEnabled = () =>
  typeof window !== "undefined" && Boolean(MEASUREMENT_ID) && import.meta.env.PROD;

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
  window.gtag("config", MEASUREMENT_ID, { send_page_view: false });
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
