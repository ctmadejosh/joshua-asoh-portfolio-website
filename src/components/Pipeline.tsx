import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

const stages = [
  {
    name: "Provision",
    detail:
      "Harness project provisioning and onboarding workflows, written to be idempotent so a re-run leaves a team's setup intact.",
  },
  {
    name: "Build",
    detail:
      "Build-farm smoke testing in Harness, so changes to the platform are checked before engineers depend on them.",
  },
  {
    name: "Test",
    detail:
      "Cross-platform integration tests and an 80%+ code-coverage threshold on the developer tooling teams share.",
  },
  {
    name: "Ship",
    detail:
      "A VS Code extension, desktop and CLI tooling, DevOps analytics, and the docs that go with them: 144 pull requests merged (of 214 authored) across 21 repositories.",
  },
];

const STEP_MS = 750;

/**
 * The pipeline run. It plays through once when scrolled into view, then each stage
 * stays selectable so visitors can read what Joshua works on at that step.
 */
const Pipeline = () => {
  const last = stages.length - 1;
  const [reached, setReached] = useState(-1);
  const [selected, setSelected] = useState(0);
  const [userPicked, setUserPicked] = useState(false);
  const [instant, setInstant] = useState(false);
  const [started, setStarted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || !("IntersectionObserver" in window)) return setStarted(true);
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStarted(true);
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Reduced motion: skip the run and show the finished pipeline.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInstant(true);
      setReached(last);
      setSelected(last);
    }
  }, [last]);

  useEffect(() => {
    if (!started || instant || reached >= last) return;
    const timer = window.setTimeout(
      () => setReached((r) => r + 1),
      reached === -1 ? 500 : STEP_MS
    );
    return () => window.clearTimeout(timer);
  }, [reached, last, instant, started]);

  // Until the visitor picks a stage, the detail follows the run.
  useEffect(() => {
    if (!userPicked && reached >= 0) setSelected(reached);
  }, [reached, userPicked]);

  const progress = Math.max(reached, 0) / last;

  return (
    <div ref={rootRef}>
      <p className="eyebrow">My work at The Hartford, stage by stage</p>

      <div className="relative mt-6">
        {/* Track runs between the centres of the first and last nodes. */}
        <div aria-hidden="true" className="absolute left-[12.5%] right-[12.5%] top-[15px] h-0.5 bg-border">
          <div
            className="h-full origin-left bg-primary transition-transform ease-linear"
            style={{ transform: `scaleX(${progress})`, transitionDuration: `${STEP_MS}ms` }}
          />
        </div>

        <div className="relative grid grid-cols-4">
          {stages.map((stage, i) => {
            const done = i <= reached;
            const isSelected = i === selected;
            return (
              <button
                key={stage.name}
                type="button"
                aria-pressed={isSelected}
                onClick={() => {
                  setUserPicked(true);
                  setSelected(i);
                }}
                className="group flex flex-col items-center gap-3 rounded-md pb-1"
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                    done
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border-strong bg-card text-transparent"
                  } ${isSelected ? "ring-4 ring-primary/25" : "group-hover:ring-4 group-hover:ring-primary/10"}`}
                >
                  <Check className="h-4 w-4" strokeWidth={3} />
                </span>
                <span
                  className={`font-display text-base font-semibold sm:text-lg ${
                    isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  {stage.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="mx-auto mt-5 min-h-[6.5rem] max-w-2xl text-center leading-relaxed text-muted-foreground sm:min-h-[4.5rem]">
        {stages[selected].detail}
      </p>
    </div>
  );
};

export default Pipeline;
