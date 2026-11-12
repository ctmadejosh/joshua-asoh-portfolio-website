import { Link } from "react-router-dom";
import { NAV_PAGES, SITE_NAME } from "@/data/site";
import SocialLinks from "./SocialLinks";

const SiteFooter = () => (
  <footer className="mt-24 border-t border-border">
    <div className="mx-auto flex max-w-site flex-col gap-8 px-6 py-12 md:flex-row md:items-start md:justify-between md:px-10">
      <div>
        <p className="font-display font-semibold tracking-tight">{SITE_NAME}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform engineering, CI/CD, and developer experience. Connecticut.
        </p>
        <p className="mt-6 text-sm text-subtle">© {new Date().getFullYear()} {SITE_NAME}</p>
      </div>
      <div className="flex flex-col gap-5 md:items-end">
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {NAV_PAGES.map((page) => (
              <li key={page.to}>
                <Link to={page.to} className="text-muted-foreground transition-colors hover:text-foreground">
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <SocialLinks labels={false} />
      </div>
    </div>
  </footer>
);

export default SiteFooter;
