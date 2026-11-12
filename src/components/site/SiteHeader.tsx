import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, Moon, Sun, X } from "lucide-react";
import { NAV_PAGES, SITE_NAME } from "@/data/site";
import { setTheme, useIsDark } from "@/lib/theme";

const HIDE_AFTER_PX = 80;
const MIN_DELTA_PX = 6;

const iconButton =
  "inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground";

const SiteHeader = () => {
  const isDark = useIsDark();
  const { pathname } = useLocation();
  const [hidden, setHidden] = useState(false);
  // The path the menu was opened on; navigating elsewhere closes it.
  const [menuOpenOn, setMenuOpenOn] = useState<string | null>(null);
  const menuOpen = menuOpenOn === pathname;
  const lastY = useRef(0);

  // Tuck the header away while reading down the page; bring it back on scroll up.
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY.current;
        if (Math.abs(delta) > MIN_DELTA_PX) {
          setHidden(delta > 0 && y > HIDE_AFTER_PX);
          lastY.current = y;
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpenOn(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const links = (variant: "inline" | "menu") =>
    NAV_PAGES.map((page) => (
      <li key={page.to}>
        <NavLink
          to={page.to}
          onClick={() => setMenuOpenOn(null)}
          className={({ isActive }) =>
            [
              variant === "menu"
                ? "block border-l-2 py-3 pl-3 text-base"
                : "border-b-2 pb-1 text-[0.95rem]",
              "transition-colors",
              isActive
                ? "border-primary font-medium text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            ].join(" ")
          }
        >
          {page.label}
        </NavLink>
      </li>
    ));

  return (
    <header
      className={`sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md transition-transform duration-300 ease-out motion-reduce:transition-none ${
        hidden && !menuOpen ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-md focus:bg-card focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <div className="relative mx-auto flex h-[4.5rem] max-w-site items-center justify-between gap-4 px-6 md:px-10">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label={`${SITE_NAME}, home`}>
          <span
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground font-display text-sm font-bold tracking-tight text-background"
          >
            JA
          </span>
          <span className="hidden font-display font-semibold tracking-tight sm:inline">{SITE_NAME}</span>
        </Link>

        <nav aria-label="Main" className="hidden md:block lg:absolute lg:left-1/2 lg:-translate-x-1/2">
          <ul className="flex items-center gap-x-8">{links("inline")}</ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            onClick={() => setTheme(!isDark)}
            className={iconButton}
          >
            {isDark ? <Moon className="h-[1.1rem] w-[1.1rem]" /> : <Sun className="h-[1.1rem] w-[1.1rem]" />}
          </button>
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpenOn(menuOpen ? null : pathname)}
            className={`${iconButton} md:hidden`}
          >
            {menuOpen ? <X className="h-[1.1rem] w-[1.1rem]" /> : <Menu className="h-[1.1rem] w-[1.1rem]" />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav id="mobile-nav" aria-label="Main" className="mx-auto max-w-site px-6 pb-4 md:hidden">
          <ul className="flex flex-col">{links("menu")}</ul>
        </nav>
      )}
    </header>
  );
};

export default SiteHeader;
