import { useSyncExternalStore } from "react";

const STORAGE_KEY = "theme";
const THEME_COLORS = { light: "#F6F7FA", dark: "#0B0E15" };

/** Sets the theme class, the browser chrome colour, and remembers the choice. */
export function setTheme(dark: boolean) {
  const root = document.documentElement;
  root.classList.toggle("dark", dark);
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", dark ? THEME_COLORS.dark : THEME_COLORS.light);
  try {
    localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
  } catch {
    // Storage can be unavailable (private mode); the toggle still works for this visit.
  }
}

// The `dark` class on <html> is the source of truth: the inline script in
// index.html sets it before paint, and this store follows it.
const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
};

export const useIsDark = () =>
  useSyncExternalStore(
    subscribe,
    () => document.documentElement.classList.contains("dark"),
    () => false
  );
