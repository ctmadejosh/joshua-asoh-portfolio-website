import { useEffect, useRef, useState } from "react";

/**
 * Counts a figure like "4,000+" or "95,000+" up from zero the first time it
 * scrolls into view. The final text is what's rendered on the server and
 * without JavaScript, and it's left alone under reduced motion or for values
 * that aren't a single number (e.g. "1–2 hrs").
 */
const CountUp = ({ value, duration = 1200 }: { value: string; duration?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(value);
  const match = value.match(/^([^\d]*)([\d,]+)([^\d]*)$/);

  useEffect(() => {
    const el = ref.current;
    if (!el || !match || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;
    const [, prefix, digits, suffix] = match;
    const target = Number(digits.replace(/,/g, ""));
    const grouped = digits.includes(",");
    let frame = 0;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          const n = Math.round(target * eased);
          setText(`${prefix}${grouped ? n.toLocaleString("en-US") : n}${suffix}`);
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
    // `match` is derived from `value`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {text}
    </span>
  );
};

export default CountUp;
