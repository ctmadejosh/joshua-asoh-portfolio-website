import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, Download, FileText, Github, Home, Linkedin, Mail, Moon, Search, Sun } from "lucide-react";
import { toast } from "sonner";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { caseStudies } from "@/data/work";
import { EMAIL, GITHUB_URL, LINKEDIN_URL, NAV_PAGES, RESUME_PATH } from "@/data/site";
import { setTheme, useIsDark } from "@/lib/theme";
import { trackEvent } from "@/lib/analytics";

export const OPEN_PALETTE_EVENT = "open-command-palette";

export async function copyEmail() {
  try {
    await navigator.clipboard.writeText(EMAIL);
    toast.success("Email address copied", { description: EMAIL });
    trackEvent("email_copied");
  } catch {
    window.location.href = `mailto:${EMAIL}`;
  }
}

/**
 * ⌘K / Ctrl+K (or "/") opens a searchable list of every page, case study, and
 * action on the site: discoverable from the header button, not a hidden key.
 */
const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const isDark = useIsDark();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target?.closest("input, textarea, select, [contenteditable=true]");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) trackEvent("command_palette_open");
  }, [open]);

  const run = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages, case studies, actions…" />
      <CommandList>
        <CommandEmpty>Nothing matches that. Try "work" or "resume".</CommandEmpty>
        <CommandGroup heading="Pages">
          <CommandItem onSelect={() => run(() => navigate("/"))}>
            <Home /> Home
          </CommandItem>
          {NAV_PAGES.map((page) => (
            <CommandItem key={page.to} onSelect={() => run(() => navigate(page.to))}>
              <Search /> {page.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Case studies">
          {caseStudies.map((study) => (
            <CommandItem
              key={study.slug}
              value={`${study.title} ${study.stack.join(" ")}`}
              onSelect={() => run(() => navigate(`/work/${study.slug}`))}
            >
              <FileText /> {study.title}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => run(copyEmail)}>
            <Copy /> Copy email address
          </CommandItem>
          <CommandItem onSelect={() => run(() => navigate("/contact"))}>
            <Mail /> Send a message
          </CommandItem>
          <CommandItem
            onSelect={() =>
              run(() => {
                trackEvent("resume_download", { location: "command_palette" });
                window.open(RESUME_PATH, "_blank", "noopener");
              })
            }
          >
            <Download /> Open resume (PDF)
          </CommandItem>
          <CommandItem onSelect={() => run(() => setTheme(!isDark))}>
            {isDark ? <Sun /> : <Moon />} Switch to {isDark ? "light" : "dark"} theme
          </CommandItem>
          <CommandItem onSelect={() => run(() => window.open(LINKEDIN_URL, "_blank", "noopener"))}>
            <Linkedin /> LinkedIn profile
          </CommandItem>
          <CommandItem onSelect={() => run(() => window.open(GITHUB_URL, "_blank", "noopener"))}>
            <Github /> GitHub profile
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
