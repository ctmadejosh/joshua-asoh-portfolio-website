import { Linkedin, Mail, MapPin, Phone } from "lucide-react";
import ContactForm from "@/components/ContactForm";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "Joshua.asoh@my.ccsu.edu",
    href: "mailto:Joshua.asoh@my.ccsu.edu",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "203-613-0475",
    href: "tel:2036130475",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/joshua-asoh",
    href: "https://www.linkedin.com/in/joshua-asoh",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "New Haven, CT",
    href: null,
  },
];

const Contact = () => {
  return (
    <section id="contact" className="bg-primary py-20 text-white lg:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <h2 className="text-5xl font-bold leading-none tracking-tight sm:text-7xl">
            Get in touch
          </h2>
          <p className="mt-6 max-w-md text-xl leading-relaxed text-sky">
            I'm open to new opportunities and glad to talk shop about platform engineering.
            I usually reply within a business day.
          </p>

          <ul className="mt-10 divide-y divide-white/20 border-y border-white/20">
            {contactInfo.map((info) => (
              <li key={info.label} className="flex items-center gap-4 py-4">
                <info.icon aria-hidden="true" className="h-5 w-5 shrink-0 text-signal" />
                <span className="sr-only">{info.label}:</span>
                {info.href ? (
                  <a
                    href={info.href}
                    className="break-all text-lg font-medium underline decoration-white/40 underline-offset-4 hover:decoration-signal"
                  >
                    {info.value}
                  </a>
                ) : (
                  <span className="text-lg font-medium">{info.value}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="self-start rounded-lg bg-card p-6 text-foreground sm:p-8">
          <ContactForm />
        </div>
      </div>
    </section>
  );
};

export default Contact;
