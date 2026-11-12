import { Github, Linkedin, Mail } from "lucide-react";
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from "@/data/site";

const socialLinks = [
  { name: "LinkedIn", href: LINKEDIN_URL, icon: Linkedin, external: true },
  { name: "GitHub", href: GITHUB_URL, icon: Github, external: true },
  { name: "Email", href: `mailto:${EMAIL}`, icon: Mail, external: false },
];

/** Icon-and-label row of profile links; `labels` hides the words on small footers. */
const SocialLinks = ({ labels = true, className = "" }: { labels?: boolean; className?: string }) => (
  <ul className={`flex flex-wrap items-center gap-x-5 gap-y-3 ${className}`}>
    {socialLinks.map(({ name, href, icon: Icon, external }) => (
      <li key={name}>
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          aria-label={labels ? undefined : external ? `${name} (opens in a new tab)` : name}
          className="group inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Icon aria-hidden="true" className="h-[1.1rem] w-[1.1rem]" />
          {labels && (
            <span className="border-b border-border group-hover:border-foreground">
              {name}
              {external && <span className="sr-only"> (opens in a new tab)</span>}
            </span>
          )}
        </a>
      </li>
    ))}
  </ul>
);

export default SocialLinks;
