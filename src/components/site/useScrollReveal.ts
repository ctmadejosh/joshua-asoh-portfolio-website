import { useEffect, useLayoutEffect } from "react";

// useLayoutEffect warns during pre-rendering; on the server there is nothing to reveal anyway.
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
import { useLocation } from "react-router-dom";

/**
 * Fades `[data-reveal]` elements in as they scroll into view. The hiding is
 * CSS under the `js` class (see index.css), so this only ever reveals; if the
 * browser has no IntersectionObserver everything is revealed at once.
 * Re-runs on each route change for the new page's elements.
 */
export function useScrollReveal() {
  const { pathname } = useLocation();

  useIsomorphicLayoutEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-revealed)"));
    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("is-revealed"));
      return;
    }
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
      { rootMargin: "0px 0px -6% 0px" }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);
}
