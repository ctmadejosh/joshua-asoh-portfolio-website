/**
 * Where did this visitor come from?
 *
 * Links Joshua shares carry a source tag, either the standard UTM form
 * (?utm_source=linkedin&utm_medium=profile) or a short form (?ref=linkedin).
 * Google Analytics reads utm_* on its own; this module also:
 *   - maps ?ref= onto GA's campaign fields (GA ignores ref by itself),
 *   - remembers the first source of the visit (sessionStorage), so a message
 *     sent from the contact page three clicks later still knows it began on
 *     LinkedIn, and
 *   - falls back to the referring site's hostname, or "direct".
 *
 * Nothing here identifies a person: it's a short label like "linkedin".
 */

const KEY = "juasoh:source";

export type Attribution = {
  source: string; // e.g. "linkedin", "github", "resume", "google", "direct"
  medium?: string; // e.g. "profile", "post", "pdf", "referral", "organic"
  campaign?: string;
};

const clean = (value: string | null | undefined, max = 40) =>
  (value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "")
    .slice(0, max);

/** Turn a referrer URL into a short source label (www.linkedin.com -> linkedin). */
function fromReferrer(referrer: string): Attribution | null {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    if (!host || host === window.location.hostname.replace(/^www\./, "")) return null;
    const known: [RegExp, string, string][] = [
      [/(^|\.)google\./, "google", "organic"],
      [/(^|\.)bing\.com$/, "bing", "organic"],
      [/(^|\.)duckduckgo\.com$/, "duckduckgo", "organic"],
      [/(^|\.)linkedin\.com$|^lnkd\.in$/, "linkedin", "referral"],
      [/(^|\.)github\.com$/, "github", "referral"],
      [/^t\.co$|(^|\.)x\.com$|(^|\.)twitter\.com$/, "x", "referral"],
    ];
    for (const [re, source, medium] of known) if (re.test(host)) return { source, medium };
    return { source: clean(host), medium: "referral" };
  } catch {
    return null;
  }
}

/** Read the source from the current URL (utm_* first, then ?ref=). */
function fromUrl(search: string): Attribution | null {
  const params = new URLSearchParams(search);
  const source = clean(params.get("utm_source")) || clean(params.get("ref"));
  if (!source) return null;
  return {
    source,
    medium: clean(params.get("utm_medium")) || (params.get("utm_source") ? undefined : "referral"),
    campaign: clean(params.get("utm_campaign")) || undefined,
  };
}

/**
 * Call once on app start. The first source seen in a visit sticks; later
 * page loads in the same tab don't overwrite it.
 */
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return { source: "direct" };
  try {
    const saved = sessionStorage.getItem(KEY);
    if (saved) return JSON.parse(saved) as Attribution;
  } catch {
    // Storage blocked (private mode): fall through and compute it.
  }
  const found = fromUrl(window.location.search) ?? fromReferrer(document.referrer) ?? { source: "direct" };
  try {
    sessionStorage.setItem(KEY, JSON.stringify(found));
  } catch {
    // Not fatal: the source is still used for this page.
  }
  return found;
}

/** The ?ref= shorthand, if this load used it without utm_source. GA needs it spelled out. */
export function refOnlyCampaign(): Record<string, string> | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const ref = clean(params.get("ref"));
  if (!ref || params.get("utm_source")) return null;
  return { campaign_source: ref, campaign_medium: "referral" };
}
