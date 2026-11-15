import { useCallback, useEffect, useState } from "react";
import { Inbox, RefreshCw, Reply, Trash2 } from "lucide-react";
import { adminFetch, SignedOutError } from "@/lib/adminApi";

type Message = {
  id: string;
  created_at: string;
  user_name: string;
  user_email: string;
  subject: string;
  message: string;
  source: string;
};

const formatDate = (iso: string) => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
};

const replyLink = (m: Message) =>
  `mailto:${encodeURIComponent(m.user_email)}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`;

const MessagesPanel = ({ onSignedOut }: { onSignedOut: (note: string) => void }) => {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setMessages(null);
    try {
      const response = await adminFetch("/messages");
      if (!response.ok) throw new Error();
      setMessages(((await response.json()) as { messages: Message[] }).messages);
    } catch (err) {
      if (err instanceof SignedOutError) onSignedOut(err.message);
      else setError("Couldn't load messages. Check your connection and try again.");
    }
  }, [onSignedOut]);

  useEffect(() => {
    void load();
  }, [load]);

  const remove = async (m: Message) => {
    if (!window.confirm(`Delete the message from ${m.user_name} ("${m.subject}")? This can't be undone.`)) return;
    setDeleting(m.id);
    try {
      const response = await adminFetch(`/messages/${encodeURIComponent(m.id)}`, { method: "DELETE" });
      if (!response.ok && response.status !== 404) throw new Error();
      setMessages((current) => current?.filter((x) => x.id !== m.id) ?? current);
    } catch (err) {
      if (err instanceof SignedOutError) onSignedOut(err.message);
      else window.alert("Couldn't delete that message. Try again.");
    } finally {
      setDeleting(null);
    }
  };

  if (error) {
    return (
      <div className="surface-card max-w-md px-6 py-6">
        <p className="mb-4 text-muted-foreground">{error}</p>
        <button type="button" className="btn-secondary" onClick={() => void load()}>
          <RefreshCw aria-hidden="true" className="h-4 w-4" />
          Try again
        </button>
      </div>
    );
  }
  if (!messages) {
    return (
      <p className="text-muted-foreground" role="status">
        Loading messages…
      </p>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="font-medium">
          {messages.length} {messages.length === 1 ? "message" : "messages"}
        </p>
        <button type="button" className="btn-secondary h-10 px-4 text-sm" onClick={() => void load()}>
          <RefreshCw aria-hidden="true" className="h-4 w-4" />
          Refresh
        </button>
      </div>
      {messages.length === 0 ? (
        <div className="surface-card flex items-center gap-3 px-6 py-8 text-muted-foreground">
          <Inbox aria-hidden="true" className="h-5 w-5" />
          No messages yet.
        </div>
      ) : (
        <ul className="space-y-4">
          {messages.map((m) => (
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
  );
};

export default MessagesPanel;
