import { useEffect, useState } from "react";
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
      "A VS Code extension, desktop and CLI tooling, DevOps Intelligence, and the docs that go with them: 144 pull requests merged across 21 repositories.",
  },
];

const STEP_MS = 750;

/**
 * The hero's pipeline run. It plays through once on load, then each stage
 * stays selectable so visitors can read what Joshua works on at that step.
 */
const Pipeline = () => {
  const last = stages.length - 1;
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [reached, setReached] = useState(reducedMotion ? last : -1);
  const [selected, setSelected] = useState(reducedMotion ? last : 0);
  const [userPicked, setUserPicked] = useState(false);

  useEffect(() => {
    if (reached >= last) return;
    const timer = window.setTimeout(
      () => setReached((r) => r + 1),
      reached === -1 ? 500 : STEP_MS
    );
    return () => window.clearTimeout(timer);
  }, [reached, last]);

  // Until the visitor picks a stage, the detail follows the run.
  useEffect(() => {
    if (!userPicked && reached >= 0) setSelected(reached);
  }, [reached, userPicked]);

  const progress = Math.max(reached, 0) / last;

  return (
    <div>
      <h2 className="font-sans text-base font-medium text-sky">
        My work at The Hartford, stage by stage
      </h2>

      <div className="relative mt-6">
        {/* Track runs between the centres of the first and last nodes. */}
        <div aria-hidden="true" className="absolute left-[12.5%] right-[12.5%] top-[15px] h-0.5 bg-white/25">
          <div
            className="h-full origin-left bg-signal transition-transform ease-linear"
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
                      ? "border-signal bg-signal text-ink"
                      : "border-white/40 bg-primary text-transparent"
                  } ${isSelected ? "ring-4 ring-white/30" : "group-hover:ring-4 group-hover:ring-white/15"}`}
                >
                  <Check className="h-4 w-4" strokeWidth={3} />
                </span>
                <span
                  className={`font-display text-lg font-semibold sm:text-xl ${
                    isSelected ? "text-white" : "text-white/70 group-hover:text-white"
                  }`}
                >
                  {stage.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="mx-auto mt-5 min-h-[6.5rem] max-w-2xl text-center text-lg leading-relaxed text-white sm:min-h-[4.5rem]">
        {stages[selected].detail}
      </p>
    </div>
  );
};

export default Pipeline;
