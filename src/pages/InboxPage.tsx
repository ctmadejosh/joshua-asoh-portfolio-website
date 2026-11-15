import { useCallback, useEffect, useState } from "react";
import { Inbox, LogIn, LogOut, RefreshCw, Reply, Trash2 } from "lucide-react";
import Seo from "@/components/site/Seo";
import { Container, PageIntro } from "@/components/site/Cards";
import { INBOX_API_URL } from "@/data/site";
import { finishSignIn, forgetToken, getToken, inboxConfigured, signIn, signOut } from "@/lib/inboxAuth";

/**
 * Private inbox: messages sent through the contact form, for the site owner
 * only. Not linked anywhere, kept out of search (noindex, robots.txt, no
 * sitemap entry), and useless without signing in: the API rejects any request
 * without a Cognito token for the owner's account.
 */

type Message = {
  id: string;
  created_at: string;
  user_name: string;
  user_email: string;
  subject: string;
  message: string;
  source: string;
};

type View =
  | { kind: "starting" }
  | { kind: "not-configured" }
  | { kind: "signed-out"; note?: string }
  | { kind: "loading" }
  | { kind: "ready"; messages: Message[] }
  | { kind: "error"; note: string };

const formatDate = (iso: string) => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
};

const replyLink = (m: Message) =>
  `mailto:${encodeURIComponent(m.user_email)}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`;

const InboxPage = () => {
  // Pre-rendered HTML shows "starting"; everything else happens in the browser.
  const [view, setView] = useState<View>({ kind: "starting" });
  const [deleting, setDeleting] = useState<string | null>(null);

  const api = useCallback(async (path: string, init: RequestInit = {}) => {
    const token = getToken();
    if (!token) {
      setView({ kind: "signed-out" });
      return null;
    }
    const response = await fetch(`${INBOX_API_URL}${path}`, {
      ...init,
      headers: { ...(init.headers || {}), Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (response.status === 401 || response.status === 403) {
      forgetToken();
      setView({ kind: "signed-out", note: "Your session ended. Sign in again." });
      return null;
    }
    return response;
  }, []);

  const load = useCallback(async () => {
    setView({ kind: "loading" });
    try {
      const response = await api("");
      if (!response) return;
      if (!response.ok) throw new Error();
      const data = (await response.json()) as { messages: Message[] };
      setView({ kind: "ready", messages: data.messages });
    } catch {
      setView({ kind: "error", note: "Couldn't load messages. Check your connection and try again." });
    }
  }, [api]);

  useEffect(() => {
    if (!inboxConfigured()) {
      setView({ kind: "not-configured" });
      return;
    }
    finishSignIn()
      .then(() => (getToken() ? load() : setView({ kind: "signed-out" })))
      .catch((err: Error) => setView({ kind: "signed-out", note: err.message }));
  }, [load]);

  const remove = async (m: Message) => {
    if (!window.confirm(`Delete the message from ${m.user_name} ("${m.subject}")? This can't be undone.`)) return;
    setDeleting(m.id);
    try {
      const response = await api(`/${encodeURIComponent(m.id)}`, { method: "DELETE" });
      if (!response) return;
      if (!response.ok && response.status !== 404) throw new Error();
      setView((current) =>
        current.kind === "ready" ? { ...current, messages: current.messages.filter((x) => x.id !== m.id) } : current
      );
    } catch {
      window.alert("Couldn't delete that message. Try again.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <Container>
      <Seo title="Inbox" description="Private." noindex />
      <PageIntro eyebrow="Private" title="Inbox">
        Messages sent through the contact form.
      </PageIntro>

      {view.kind === "starting" || view.kind === "loading" ? (
        <p className="text-muted-foreground" role="status">
          Loading…
        </p>
      ) : null}

      {view.kind === "not-configured" && (
        <p className="text-muted-foreground">The inbox isn't set up yet.</p>
      )}

      {view.kind === "signed-out" && (
        <div className="surface-card max-w-md px-6 py-6">
          {view.note && <p className="mb-4 text-sm text-muted-foreground">{view.note}</p>}
          <button type="button" className="btn-primary" onClick={() => void signIn()}>
            <LogIn aria-hidden="true" className="h-4 w-4" />
            Sign in
          </button>
        </div>
      )}

      {view.kind === "error" && (
        <div className="surface-card max-w-md px-6 py-6">
          <p className="mb-4 text-muted-foreground">{view.note}</p>
          <button type="button" className="btn-secondary" onClick={() => void load()}>
            <RefreshCw aria-hidden="true" className="h-4 w-4" />
            Try again
          </button>
        </div>
      )}

      {view.kind === "ready" && (
        <>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="font-medium">
              {view.messages.length} {view.messages.length === 1 ? "message" : "messages"}
            </p>
            <div className="flex gap-3">
              <button type="button" className="btn-secondary h-10 px-4 text-sm" onClick={() => void load()}>
                <RefreshCw aria-hidden="true" className="h-4 w-4" />
                Refresh
              </button>
              <button type="button" className="btn-secondary h-10 px-4 text-sm" onClick={signOut}>
                <LogOut aria-hidden="true" className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>

          {view.messages.length === 0 ? (
            <div className="surface-card flex items-center gap-3 px-6 py-8 text-muted-foreground">
              <Inbox aria-hidden="true" className="h-5 w-5" />
              No messages yet.
            </div>
          ) : (
            <ul className="space-y-4">
              {view.messages.map((m) => (
                <li key={m.id} className="surface-card px-6 py-5">
                  <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-1">
                    <h2 className="text-lg font-semibold tracking-tight">{m.subject}</h2>
                    <time dateTime={m.created_at} className="text-sm text-subtle">
                      {formatDate(m.created_at)}
                    </time>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {m.user_name} &lt;{m.user_email}&gt;
                    {m.source && <span className="chip ml-2">from {m.source}</span>}
                  </p>
                  <p className="mt-4 whitespace-pre-wrap break-words">{m.message}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <a href={replyLink(m)} className="btn-secondary h-10 px-4 text-sm">
                      <Reply aria-hidden="true" className="h-4 w-4" />
                      Reply
                    </a>
                    <button
                      type="button"
                      className="btn-secondary h-10 px-4 text-sm hover:border-destructive hover:text-destructive"
                      disabled={deleting === m.id}
                      onClick={() => void remove(m)}
                    >
                      <Trash2 aria-hidden="true" className="h-4 w-4" />
                      {deleting === m.id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </Container>
  );
};

export default InboxPage;
