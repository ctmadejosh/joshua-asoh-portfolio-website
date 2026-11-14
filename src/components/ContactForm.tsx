import React, { useRef, useState } from "react";
import { Mail, Send } from "lucide-react";
import { CONTACT_API_URL, EMAIL } from "@/data/site";
import { trackEvent } from "@/lib/analytics";
import { captureAttribution } from "@/lib/attribution";

/**
 * Sends the form to Joshua's own AWS backend: API Gateway at aws.juasoh.com,
 * then a Lambda that saves the message to DynamoDB and emails it through SES
 * (see services/contact and infra/contact).
 *
 * If the API can't be reached (not deployed yet, network trouble, an outage),
 * the form opens the visitor's email app with their message filled in, so a
 * message is never lost. Validation errors from the API are shown inline.
 */

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30";

type Fields = { user_name: string; user_email: string; subject: string; message: string };

const TIMEOUT_MS = 10_000;

/** A mailto: link carrying the visitor's message, so nothing they typed is lost. */
const mailtoFor = (f: Fields) =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(f.subject || "Hello from juasoh.com")}&body=${encodeURIComponent(
    `${f.message}\n\n— ${f.user_name}${f.user_email ? ` (${f.user_email})` : ""}`
  )}`;

const ContactForm: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "invalid" | "failed">("idle");
  const [fallback, setFallback] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const readFields = (): Fields => {
    const data = new FormData(form.current!);
    const get = (k: keyof Fields) => String(data.get(k) ?? "").trim();
    return { user_name: get("user_name"), user_email: get("user_email"), subject: get("subject"), message: get("message") };
  };

  const fail = (fields: Fields, reason: string) => {
    const href = mailtoFor(fields);
    setFallback(href);
    setStatus("failed");
    trackEvent("contact_submit", { result: reason });
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.current) return;
    const company = String(new FormData(form.current).get("company") ?? "");
    const fields = readFields();

    setStatus("sending");
    setErrors([]);
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(CONTACT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // `company` is the honeypot; the API quietly drops messages that fill it.
        // `source` is where the visit began (e.g. "linkedin"), so the email says so.
        body: JSON.stringify({ ...fields, company, source: captureAttribution().source }),
        signal: controller.signal,
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: string[] };

      if (res.ok && body.ok) {
        setStatus("sent");
        trackEvent("contact_submit", { result: "sent", source: captureAttribution().source });
      } else if (res.status === 400 && body.errors?.length) {
        setErrors(body.errors);
        setStatus("invalid");
        trackEvent("contact_submit", { result: "invalid" });
      } else {
        fail(fields, `http_${res.status}`);
      }
    } catch {
      fail(fields, "unreachable");
    } finally {
      window.clearTimeout(timer);
    }
  };

  if (status === "sent") {
    return (
      <div role="status" className="py-10">
        <p className="font-display text-3xl font-semibold tracking-tight">Message sent.</p>
        <p className="mt-2 text-muted-foreground">Thanks for writing. I usually reply within a business day.</p>
      </div>
    );
  }

  return (
    <form ref={form} onSubmit={send} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-[0.95rem] font-semibold">
          Name
          <input name="user_name" required maxLength={100} autoComplete="name" className={fieldClass} />
        </label>
        <label className="block text-[0.95rem] font-semibold">
          Email
          <input name="user_email" type="email" required maxLength={254} autoComplete="email" className={fieldClass} />
        </label>
      </div>
      <label className="block text-[0.95rem] font-semibold">
        Subject
        <input name="subject" required maxLength={150} className={fieldClass} />
      </label>
      <label className="block text-[0.95rem] font-semibold">
        Message
        <textarea name="message" required maxLength={5000} rows={6} className={`${fieldClass} resize-y`} />
      </label>
      {/* Honeypot, hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status === "invalid" && errors.length > 0 && (
        <div role="alert" className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm">
          <p className="font-medium">Please check the form:</p>
          <ul className="mt-1 list-disc pl-5 text-muted-foreground">
            {errors.map((err) => (
              <li key={err}>{err.replace("user_name", "Name").replace("user_email", "Email").replace(/^subject/, "Subject").replace(/^message/, "Message")}</li>
            ))}
          </ul>
        </div>
      )}

      {status === "failed" && fallback && (
        <div role="alert" className="rounded-lg border border-border bg-muted/60 p-4">
          <p className="font-medium">The message didn't send from the site.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your message is filled in and ready to send from your email app, or write to{" "}
            <a href={`mailto:${EMAIL}`} className="text-link">
              {EMAIL}
            </a>
            .
          </p>
          <a href={fallback} className="btn-secondary mt-3 h-10 text-sm">
            <Mail aria-hidden="true" className="h-4 w-4" />
            Open in my email app
          </a>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60"
      >
        <Send aria-hidden="true" className="h-4 w-4" />
        {status === "sending" ? "Sending message" : "Send message"}
      </button>
    </form>
  );
};

export default ContactForm;
