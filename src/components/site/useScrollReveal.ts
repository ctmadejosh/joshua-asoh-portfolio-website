import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Fades `[data-reveal]` elements in as they scroll into view. Content stays
 * visible unless this runs: it only hides things after adding `js-reveal`, and
 * skips everything under reduced motion. Re-runs on each route change.
 */
export function useScrollReveal() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      root.classList.remove("js-reveal");
      return;
    }

    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-revealed)")
    );
    elements.forEach((el) => {
      const delay = el.dataset.revealDelay;
      if (delay) el.style.setProperty("--reveal-delay", `${delay}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    elements.forEach((el) => observer.observe(el));
    root.classList.add("js-reveal");

    return () => observer.disconnect();
  }, [pathname]);
}
