/**
 * The JA mark, drawn as circuit-board traces: the J drops from a via and jogs
 * 45° to a second via; the A rises from two amber solder pads with
 * chamfered corners, the way PCB traces are routed. On hover of a parent
 * `.group` a signal runs along the traces and the pads light up (skipped
 * under reduced motion).
 *
 * public/favicon.svg uses a bolder, simplified cut of the same geometry for
 * 16–32px tab icons; keep the two in step.
 */
const Logo = ({ className = "h-8 w-8" }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
    <rect width="48" height="48" rx="12" className="fill-primary" />
    <g
      fill="none"
      strokeWidth="3.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="stroke-primary-foreground"
    >
      <path d="M17 12.6 V29 L12 34 H10.6" pathLength={1} className="logo-stroke" />
      <path d="M23.5 36 V21 L29.5 13 L35.5 21 V36" pathLength={1} className="logo-stroke" />
      <path d="M23.5 27.5 H35.5" pathLength={1} className="logo-bar" />
    </g>
    <g strokeWidth="2.8" className="fill-primary stroke-primary-foreground">
      <circle cx="17" cy="10.4" r="2.9" />
      <circle cx="8.4" cy="34" r="2.9" />
    </g>
    <circle cx="23.5" cy="37.6" r="3.2" className="logo-node fill-signal" />
    <circle cx="35.5" cy="37.6" r="3.2" className="logo-node logo-node-2 fill-signal" />
  </svg>
);

export default Logo;
