import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { Send } from "lucide-react";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30";

const ContactForm: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.current) return;
    setStatus("sending");
    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY).then(
      () => setStatus("sent"),
      () => setStatus("failed")
    );
  };

  if (status === "sent") {
    return (
      <div role="status" className="py-10">
        <p className="font-display text-3xl font-semibold tracking-tight">Message sent.</p>
        <p className="mt-2 text-muted-foreground">
          Thanks for writing. I usually reply within a business day.
        </p>
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

      {status === "failed" && (
        <p role="alert" className="font-medium text-destructive">
          The message didn't send. Try again, or email Joshua.asoh@my.ccsu.edu directly.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
        {status === "sending" ? "Sending message" : "Send message"}
      </button>
    </form>
  );
};

export default ContactForm;
