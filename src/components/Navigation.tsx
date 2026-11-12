import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Work", href: "#projects" },
  { name: "Certifications", href: "#certifications" },
  { name: "Contact", href: "#contact" },
];

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mark the section currently in view.
  useEffect(() => {
    const sections = navItems
      .map((item) => document.querySelector(item.href))
      .filter((el): el is Element => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const solid = isScrolled || isOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${
        solid
          ? "border-b border-border bg-background/95 text-foreground backdrop-blur"
          : "border-b border-transparent text-white"
      }`}
    >
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#home" className="font-display text-lg font-bold tracking-tight">
          Joshua Asoh
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const current = solid && active === item.href;
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={current ? "true" : undefined}
                  className={`border-b-2 py-1 text-[0.95rem] font-medium transition-colors ${
                    current
                      ? "border-primary text-primary"
                      : "border-transparent hover:border-current"
                  }`}
                >
                  {item.name}
                </a>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          className="-mr-2 p-2 md:hidden"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {isOpen && (
        <ul id="mobile-menu" className="border-t border-border px-6 py-3 md:hidden">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block py-3 font-display text-2xl font-semibold"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
};

export default Navigation;
