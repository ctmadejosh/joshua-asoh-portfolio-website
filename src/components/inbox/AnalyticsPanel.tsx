import { ArrowUpRight } from "lucide-react";
import { LOOKER_STUDIO_EMBED_URL } from "@/data/site";

const GA_URL = "https://analytics.google.com/analytics/web/";

const ExternalLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="btn-secondary h-10 px-4 text-sm">
    {children}
    <span className="sr-only"> (opens in a new tab)</span>
    <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
  </a>
);

/**
 * Google Analytics, through a Looker Studio report embedded in the page. The
 * data stays in Google: the frame only shows it to Google accounts the report
 * is shared with, so nothing about visitors passes through AWS or this site.
 */
const AnalyticsPanel = () => {
  const reportUrl = LOOKER_STUDIO_EMBED_URL.replace("/embed/reporting/", "/reporting/");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {LOOKER_STUDIO_EMBED_URL && <ExternalLink href={reportUrl}>Open the report</ExternalLink>}
        <ExternalLink href={GA_URL}>Open Google Analytics</ExternalLink>
      </div>

      {LOOKER_STUDIO_EMBED_URL ? (
        <>
          <div className="surface-card overflow-hidden">
            <iframe
              src={LOOKER_STUDIO_EMBED_URL}
              title="Site analytics (Looker Studio)"
              className="h-[80vh] min-h-[36rem] w-full border-0"
              sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
              loading="lazy"
            />
          </div>
          <p className="text-sm text-subtle">
            If the report asks you to sign in or stays blank, your browser is blocking Google's sign-in inside the
            frame. Use "Open the report" instead.
          </p>
        </>
      ) : (
        <div className="surface-card px-6 py-5">
          <h2 className="font-semibold">Connect the analytics report</h2>
          <p className="mt-2 text-muted-foreground">
            This tab shows a Looker Studio report of your Google Analytics data. Once the report exists, its embed
            URL goes in <code>LOOKER_STUDIO_EMBED_URL</code> in <code>src/data/site.ts</code>.
          </p>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPanel;
