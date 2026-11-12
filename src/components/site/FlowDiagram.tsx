import { ChevronDown, ChevronRight } from "lucide-react";
import type { CaseStudy } from "@/data/work";

/**
 * A case study's system as a row of steps (a column on phones). Steps Joshua
 * built are filled; the rest are context. Plain HTML, so it scales, reflows,
 * themes, and reads in order to a screen reader as a numbered list.
 */
const FlowDiagram = ({
  flow,
  note,
  compact = false,
  vertical = false,
}: {
  flow: CaseStudy["flow"];
  note?: string;
  compact?: boolean;
  /** Always stack top to bottom, for narrow containers on wide screens. */
  vertical?: boolean;
}) => {
  const md = vertical ? "" : "md:";
  return (
  <figure>
    <ol
      className={`flex gap-2 ${compact ? "flex-row items-stretch" : `flex-col items-stretch ${md}flex-row`}`}
      aria-label="How it works, step by step"
    >
      {flow.map((step, i) => (
        <li key={step.label} className={`flex flex-1 gap-2 ${compact ? "flex-row items-center" : `flex-col items-stretch ${md}flex-row ${md}items-center`}`}>
          <div
            className={`flex-1 rounded-lg border text-left ${
              compact ? "px-2 py-1.5" : "px-3.5 py-3"
            } ${
              step.mine
                ? "border-primary/40 bg-primary-surface"
                : "border-dashed border-border-strong bg-card"
            }`}
          >
            <p className={`font-semibold leading-tight ${compact ? "text-[0.7rem]" : "text-sm"} ${step.mine ? "text-primary-ink" : ""}`}>
              {step.label}
            </p>
            {!compact && step.detail && <p className="mt-0.5 text-xs text-muted-foreground">{step.detail}</p>}
          </div>
          {i < flow.length - 1 &&
            (compact ? (
              <ChevronRight aria-hidden="true" className="h-3 w-3 shrink-0 text-subtle" />
            ) : (
              <>
                <ChevronDown aria-hidden="true" className={`mx-auto h-4 w-4 shrink-0 text-subtle ${vertical ? "" : "md:hidden"}`} />
                {!vertical && <ChevronRight aria-hidden="true" className="hidden h-4 w-4 shrink-0 text-subtle md:block" />}
              </>
            ))}
        </li>
      ))}
    </ol>
    {!compact && (
      <figcaption className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-subtle">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm border border-primary/40 bg-primary-surface" />
          My part
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm border border-dashed border-border-strong" />
          Context
        </span>
        {note && <span>{note}</span>}
      </figcaption>
    )}
  </figure>
  );
};

export default FlowDiagram;
