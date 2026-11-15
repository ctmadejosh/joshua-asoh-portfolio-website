import { useCallback, useEffect, useState } from "react";
import { BarChart3, DollarSign, Inbox, LogIn, LogOut } from "lucide-react";
import Seo from "@/components/site/Seo";
import { Container, PageIntro } from "@/components/site/Cards";
import MessagesPanel from "@/components/inbox/MessagesPanel";
import CostsPanel from "@/components/inbox/CostsPanel";
import AnalyticsPanel from "@/components/inbox/AnalyticsPanel";
import { finishSignIn, getToken, inboxConfigured, signIn, signOut } from "@/lib/inboxAuth";

/**
 * Private admin page: contact-form messages, AWS costs and site analytics,
 * for the site owner only. Not linked anywhere, kept out of search (noindex,
 * robots.txt, no sitemap entry), and useless without signing in: the API
 * rejects any request without a Cognito token for the owner's account.
 */

const TABS = [
  { id: "messages", label: "Messages", icon: Inbox },
  { id: "costs", label: "Costs", icon: DollarSign },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
] as const;
type TabId = (typeof TABS)[number]["id"];

const tabFromHash = (): TabId => {
  const hash = window.location.hash.slice(1);
  return TABS.some((t) => t.id === hash) ? (hash as TabId) : "messages";
};

type View =
  | { kind: "starting" }
  | { kind: "not-configured" }
  | { kind: "signed-out"; note?: string }
  | { kind: "signed-in" };

const InboxPage = () => {
  // Pre-rendered HTML shows "starting"; everything else happens in the browser.
  const [view, setView] = useState<View>({ kind: "starting" });
  const [tab, setTab] = useState<TabId>("messages");

  const onSignedOut = useCallback((note: string) => setView({ kind: "signed-out", note: note || undefined }), []);

  useEffect(() => {
    setTab(tabFromHash());
    if (!inboxConfigured()) {
      setView({ kind: "not-configured" });
      return;
    }
    finishSignIn()
      .then(() => setView(getToken() ? { kind: "signed-in" } : { kind: "signed-out" }))
      .catch((err: Error) => setView({ kind: "signed-out", note: err.message }));
  }, []);

  const choose = (id: TabId) => {
    setTab(id);
    window.history.replaceState(null, "", id === "messages" ? window.location.pathname : `#${id}`);
  };

  return (
    <Container>
      <Seo title="Inbox" description="Private." noindex />
      <PageIntro eyebrow="Private" title="Admin">
        Messages from the contact form, what the AWS backend costs, and who's visiting.
      </PageIntro>

      {view.kind === "starting" && (
        <p className="text-muted-foreground" role="status">
          Loading…
        </p>
      )}

      {view.kind === "not-configured" && <p className="text-muted-foreground">The inbox isn't set up yet.</p>}

      {view.kind === "signed-out" && (
        <div className="surface-card max-w-md px-6 py-6">
          {view.note && <p className="mb-4 text-sm text-muted-foreground">{view.note}</p>}
          <button type="button" className="btn-primary" onClick={() => void signIn()}>
            <LogIn aria-hidden="true" className="h-4 w-4" />
            Sign in
          </button>
        </div>
      )}

      {view.kind === "signed-in" && (
        <>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border">
            <div role="tablist" aria-label="Admin sections" className="-mb-px flex gap-1">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  id={`tab-${id}`}
                  aria-selected={tab === id}
                  aria-controls={`panel-${id}`}
                  onClick={() => choose(id)}
                  className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                    tab === id
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon aria-hidden="true" className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
            <button type="button" className="btn-secondary mb-2 h-10 px-4 text-sm" onClick={signOut}>
              <LogOut aria-hidden="true" className="h-4 w-4" />
              Sign out
            </button>
          </div>

          <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
            {tab === "messages" && <MessagesPanel onSignedOut={onSignedOut} />}
            {tab === "costs" && <CostsPanel onSignedOut={onSignedOut} />}
            {tab === "analytics" && <AnalyticsPanel />}
          </div>
        </>
      )}
    </Container>
  );
};

export default InboxPage;
