import { useEffect, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";

/**
 * The hero's signature: a terminal that "runs" a whoami. The full text is
 * always in the HTML (crawlers and no-JS visitors read it all); the typing is
 * a CSS effect that only applies under the `js` class index.html adds when
 * scripts run and motion is allowed.
 */
const LINES: { key: string; value: string; to?: string }[] = [
  { key: "role", value: "Platform Engineer, The Hartford" },
  { key: "program", value: "Tech & Ops Leadership Development Program" },
  { key: "focus", value: "CLI · desktop agent · VS Code · onboarding" },
  { key: "building", value: "ATLAS, the developer platform for 4,000+ engineers", to: "/work/atlas-developer-platform" },
  { key: "shipped", value: "144 PRs merged across 21 repos" },
  { key: "studying", value: "M.S. Computer Information Technology, CCSU" },
  { key: "based", value: "Connecticut" },
];

const COMMAND = "whoami --verbose";

const TerminalCard = () => {
  const [typed, setTyped] = useState(0);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!document.documentElement.classList.contains("js")) {
      setTyped(COMMAND.length);
      setShown(LINES.length);
    }
  }, []);

  useEffect(() => {
    if (typed < COMMAND.length) {
      const t = window.setTimeout(() => setTyped(typed + 1), 45);
      return () => window.clearTimeout(t);
    }
    if (shown < LINES.length) {
      const t = window.setTimeout(() => setShown(shown + 1), shown === 0 ? 250 : 110);
      return () => window.clearTimeout(t);
    }
  }, [typed, shown]);

  const done = typed >= COMMAND.length && shown >= LINES.length;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_24px_60px_-30px_hsl(var(--foreground)/0.35)]">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-signal" />
        </span>
        <span className="ml-2 font-mono text-xs text-subtle">~/joshua</span>
      </div>
      <div className="px-5 py-5 font-mono text-[0.8rem] leading-relaxed sm:text-sm">
        <p>
          <span className="text-primary-ink" aria-hidden="true">
            ${" "}
          </span>
          <span className="term-cmd" style={{ "--n": typed } as CSSProperties}>
            {COMMAND}
          </span>
          {typed < COMMAND.length && (
            <span aria-hidden="true" className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-foreground" />
          )}
        </p>
        <dl className="mt-3 space-y-1.5">
          {LINES.map((line, i) => (
            <div
              key={line.key}
              data-on={i < shown}
              className="term-line grid grid-cols-[5.5rem_1fr] gap-2 transition-opacity duration-200"
            >
              <dt className="text-subtle">{line.key}</dt>
              <dd>
                {line.to ? (
                  <Link to={line.to} className="underline decoration-border-strong underline-offset-4 hover:decoration-primary">
                    {line.value}
                  </Link>
                ) : (
                  line.value
                )}
              </dd>
            </div>
          ))}
        </dl>
        <p data-on={done} className="term-line mt-4 flex items-center gap-2 transition-opacity">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-surface px-2 py-0.5 text-xs text-primary-ink">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />
            exit 0
          </span>
          <span className="text-xs text-subtle">open to conversations</span>
        </p>
      </div>
    </div>
  );
};

export default TerminalCard;
