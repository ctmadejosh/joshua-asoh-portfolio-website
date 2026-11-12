import { Linkedin, Mail, MapPin, Phone } from "lucide-react";
import Seo from "@/components/site/Seo";
import ContactForm from "@/components/ContactForm";
import { Container, PageIntro } from "@/components/site/Cards";
import { EMAIL, LINKEDIN_URL } from "@/data/site";

const contactInfo = [
  { icon: Mail, label: "Email", value: EMAIL, href: `mailto:${EMAIL}`, external: false },
  { icon: Phone, label: "Phone", value: "203-613-0475", href: "tel:2036130475", external: false },
  { icon: Linkedin, label: "LinkedIn", value: "linkedin.com/in/joshua-asoh", href: LINKEDIN_URL, external: true },
  { icon: MapPin, label: "Location", value: "New Haven, CT", href: null, external: false },
];

const ContactPage = () => (
  <Container>
    <Seo
      title="Contact"
      description="Get in touch with Joshua Asoh about platform engineering, CI/CD, developer experience, or opportunities."
    />
    <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
      <div>
        <PageIntro eyebrow="Contact" title="Say hello.">
          I'm open to new opportunities and glad to talk shop about platform engineering. I
          usually reply within a business day.
        </PageIntro>
        <ul className="divide-y divide-border border-y border-border" data-reveal>
          {contactInfo.map((info) => (
            <li key={info.label} className="flex items-center gap-4 py-4">
              <info.icon aria-hidden="true" className="h-5 w-5 shrink-0 text-primary-ink" />
              <span className="sr-only">{info.label}:</span>
              {info.href ? (
                <a
                  href={info.href}
                  {...(info.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="break-all font-medium underline decoration-border-strong underline-offset-4 hover:decoration-primary"
                >
                  {info.value}
                  {info.external && <span className="sr-only"> (opens in a new tab)</span>}
                </a>
              ) : (
                <span className="font-medium">{info.value}</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="surface-card self-start p-6 sm:p-8 lg:mt-24" data-reveal data-reveal-delay={120}>
        <ContactForm />
      </div>
    </div>
  </Container>
);

export default ContactPage;
