/**
 * The JA mark: one continuous stroke. The J's stem rises, arcs over the top,
 * and runs down as the A's leg, ending in an amber node, like a pipeline
 * reaching deploy. On hover of a parent `.group` the stroke redraws itself and
 * the node pulses (skipped under reduced motion).
 *
 * The same geometry is in public/favicon.svg; keep the two in step.
 */
export const MARK_STROKE = "M9 31.5 C9 37.5 17.5 38.5 17.5 31.5 V16 C17.5 9.5 24.5 9.5 26.5 14.5 L35.5 38";
export const MARK_BAR = "M17.5 28 H30.5";

const Logo = ({ className = "h-8 w-8" }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
    <rect width="48" height="48" rx="12" className="fill-primary" />
    <g
      transform="translate(1.25 -0.5)"
      fill="none"
      strokeWidth="4.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="stroke-primary-foreground"
    >
      <path d={MARK_STROKE} pathLength={1} className="logo-stroke" />
      <path d={MARK_BAR} pathLength={1} className="logo-bar" />
    </g>
    <circle cx="36.75" cy="37.5" r="3.6" className="logo-node fill-signal" />
  </svg>
);

export default Logo;
