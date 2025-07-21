
import React, { useRef, useState } from "react";
import emailjs from "emailjs-com";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const ContactForm: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!form.current) return;

    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
      .then(
        () => {
          setSent(true);
          setLoading(false);
        },
        () => {
          setError("Failed to send message. Please try again.");
          setLoading(false);
        }
      );
  };

  if (sent) {
    return <div className="text-green-600 font-semibold">Message sent! Thank you.</div>;
  }

  return (
    <form ref={form} onSubmit={sendEmail} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <Input name="user_name" required placeholder="Your name" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input name="user_email" type="email" required placeholder="your.email@example.com" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Subject</label>
        <Input name="subject" required placeholder="What's this about?" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Message</label>
        <Textarea name="message" required rows={6} placeholder="Your message..." />
      </div>
      {error && <div className="text-red-600">{error}</div>}
      <Button type="submit" disabled={loading} className="w-full group" size="lg">
        {loading ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
};

export default ContactForm;
