import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { Mail, Send } from "lucide-react";
import { EMAIL } from "@/data/site";
import { trackEvent } from "@/lib/analytics";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

/**
 * EmailJS needs all three IDs, and template IDs start with "template_". A
 * service ID pasted into the template slot (which broke this form before)
 * fails this check, so the form goes straight to the email-app fallback
 * instead of failing on every send.
 */
const emailjsReady = Boolean(SERVICE_ID && PUBLIC_KEY && TEMPLATE_ID?.startsWith("template_"));

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30";

type Fields = { user_name: string; user_email: string; subject: string; message: string };

/** A mailto: link carrying the visitor's message, so nothing they typed is lost. */
const mailtoFor = (f: Fields) =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(f.subject || "Hello from juasoh.com")}&body=${encodeURIComponent(
    `${f.message}\n\n— ${f.user_name}${f.user_email ? ` (${f.user_email})` : ""}`
  )}`;

const ContactForm: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [fallback, setFallback] = useState<string | null>(null);

  const readFields = (): Fields => {
    const data = new FormData(form.current!);
    const get = (k: keyof Fields) => String(data.get(k) ?? "").trim();
    return { user_name: get("user_name"), user_email: get("user_email"), subject: get("subject"), message: get("message") };
  };

  const openEmailApp = (fields: Fields, reason: string) => {
    const href = mailtoFor(fields);
    setFallback(href);
    setStatus("failed");
    trackEvent("contact_submit", { result: reason });
    window.location.href = href;
  };

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.current) return;
    // Honeypot: people never see or fill this field; bots usually do.
    if (new FormData(form.current).get("company")) return setStatus("sent");

    const fields = readFields();
    if (!emailjsReady) return openEmailApp(fields, "not_configured");

    setStatus("sending");
    emailjs.send(SERVICE_ID!, TEMPLATE_ID!, fields, { publicKey: PUBLIC_KEY! }).then(
      () => {
        setStatus("sent");
        trackEvent("contact_submit", { result: "sent" });
      },
      () => {
        setFallback(mailtoFor(fields));
        setStatus("failed");
        trackEvent("contact_submit", { result: "failed" });
      }
    );
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
    <form ref={form} onSubmit={sendEmail} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-[0.95rem] font-semibold">
          Name
          <input name="user_name" required autoComplete="name" className={fieldClass} />
        </label>
        <label className="block text-[0.95rem] font-semibold">
          Email
          <input name="user_email" type="email" required autoComplete="email" className={fieldClass} />
        </label>
      </div>
      <label className="block text-[0.95rem] font-semibold">
        Subject
        <input name="subject" required className={fieldClass} />
      </label>
      <label className="block text-[0.95rem] font-semibold">
        Message
        <textarea name="message" required rows={6} className={`${fieldClass} resize-y`} />
      </label>
      {/* Honeypot, hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status === "failed" && fallback && (
        <div role="alert" className="rounded-lg border border-border bg-muted/60 p-4">
          <p className="font-medium">
            {emailjsReady ? "The message didn't send from the site." : "Finish sending it from your email app."}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your message is filled in and ready. If your email app didn't open, use the button or write to{" "}
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
