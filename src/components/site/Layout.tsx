import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import { useScrollReveal } from "./useScrollReveal";
import CommandPalette from "./CommandPalette";
import { initAnalytics, trackPageView } from "@/lib/analytics";

const Layout = () => {
  const { pathname, hash } = useLocation();
  useScrollReveal();

  useEffect(() => {
    initAnalytics();
  }, []);

  // One GA page_view per route. Deferred a tick so <Seo> has set the title.
  useEffect(() => {
    const t = window.setTimeout(() => trackPageView(pathname, document.title), 0);
    return () => window.clearTimeout(t);
  }, [pathname]);

  // Start each new page at the top, or at the anchor it links to.
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <CommandPalette />
    </div>
  );
};

export default Layout;
