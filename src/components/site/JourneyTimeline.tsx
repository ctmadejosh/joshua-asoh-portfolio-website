import { useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Bot, Factory, FlaskConical, Map, Rocket, Trophy, Users, Wrench } from "lucide-react";
import CountUp from "./CountUp";
import type { Milestone } from "@/data/about";

const ICONS = { wrench: Wrench, flask: FlaskConical, users: Users, trophy: Trophy, bot: Bot, factory: Factory, rocket: Rocket, map: Map };

/**
 * The career path as a row of stops on a rail (a tab list). Pick a stop by
 * click, tap, or arrow keys; its story shows in the panel below. Starts on
 * the latest stop, and the rail fills up to the selected one.
 */
const JourneyTimeline = ({ milestones }: { milestones: Milestone[] }) => {
  const last = milestones.length - 1;
  const [active, setActive] = useState(last);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const current = milestones[active];
  const Icon = ICONS[current.icon];

  const select = (i: number, focus = false) => {
    const next = (i + milestones.length) % milestones.length;
    setActive(next);
    if (focus) tabs.current[next]?.focus();
  };

  return (
    <div>
      <div className="-mx-6 overflow-x-auto px-6 pb-2 md:mx-0 md:overflow-visible md:px-0">
        <div className="relative min-w-[50rem]">
          {/* Rail, filled up to the selected stop. */}
          <div aria-hidden="true" className="absolute left-[calc(100%/16)] right-[calc(100%/16)] top-[1.375rem] h-0.5 bg-border">
            <div
              className="h-full origin-left bg-primary transition-transform duration-500 ease-out"
              style={{ transform: `scaleX(${active / last})` }}
            />
          </div>
          <div
            role="tablist"
            aria-label="Career journey"
            className="relative grid"
            style={{ gridTemplateColumns: `repeat(${milestones.length}, minmax(0, 1fr))` }}
            onKeyDown={(e) => {
              const target: Record<string, number> = {
                ArrowRight: active + 1,
                ArrowDown: active + 1,
                ArrowLeft: active - 1,
                ArrowUp: active - 1,
                Home: 0,
                End: last,
              };
              if (e.key in target) {
                e.preventDefault();
                select(target[e.key], true);
              }
            }}
          >
            {milestones.map((m, i) => {
              const StopIcon = ICONS[m.icon];
              const on = i === active;
              const reached = i <= active;
              return (
                <button
                  key={m.title}
                  ref={(el) => (tabs.current[i] = el)}
                  role="tab"
                  id={`${id}-tab-${i}`}
                  aria-selected={on}
                  aria-controls={`${id}-panel`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => select(i)}
                  className="group flex flex-col items-center gap-2 rounded-lg px-1 pb-1 text-center"
                >
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                      on
                        ? "scale-110 border-primary bg-primary text-primary-foreground shadow-[0_0_0_6px_hsl(var(--primary)/0.15)]"
                        : reached
                          ? "border-primary bg-primary-surface text-primary-ink"
                          : "border-border-strong bg-card text-subtle group-hover:border-primary group-hover:text-primary-ink"
                    }`}
                  >
                    <StopIcon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span className={`font-display text-sm font-semibold ${on ? "text-foreground" : "text-subtle"}`}>{m.year}</span>
                  <span className={`text-xs leading-tight ${on ? "text-foreground" : "text-muted-foreground"}`}>{m.org}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${active}`}
        className="surface-card mt-6 grid gap-6 p-6 sm:p-8 md:grid-cols-[minmax(0,1fr)_14rem] md:items-center"
      >
        <div key={active} className="animate-fade-up motion-reduce:animate-none">
          <p className="eyebrow mb-2 flex items-center gap-2">
            <Icon aria-hidden="true" className="h-3.5 w-3.5" />
            {current.year} · {current.org}
          </p>
          <h3 className="text-2xl font-semibold tracking-tight">{current.title}</h3>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{current.summary}</p>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            {current.to && (
              <Link to={current.to} className="group inline-flex items-center gap-1.5 font-medium text-primary-ink">
                Read the case study
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
            <span className="text-sm text-subtle">
              {active + 1} of {milestones.length} · use ← → to move
            </span>
          </div>
        </div>
        {current.highlight && (
          <div key={`h-${active}`} className="rounded-xl bg-primary-surface p-5 text-center">
            <p className="font-display text-4xl font-bold tracking-tight text-primary-ink">
              <CountUp value={current.highlight.value} duration={700} />
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{current.highlight.label}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JourneyTimeline;
