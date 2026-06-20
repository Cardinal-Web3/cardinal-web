"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const BOTTOM_LAYERS = [
  { blur: 0.5, from: 0, to: 32 },
  { blur: 2, from: 22, to: 58 },
  { blur: 5, from: 48, to: 88 },
] as const;

function useFooterRevealActive() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const update = () => {
      const { scrollHeight } = document.documentElement;
      const fromBottom = scrollHeight - window.scrollY - window.innerHeight;
      // Curtain pages reserve ~100svh for footer reveal — hide blur in that zone
      // so footer copy (incl. bottom-right meta) stays crisp.
      setActive(fromBottom <= window.innerHeight * 1.02);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return active;
}

/** Bottom viewport edge only — content softens as it scrolls off-screen. */
export function ProgressiveBlur() {
  const prefersReducedMotion = useReducedMotion();
  const footerReveal = useFooterRevealActive();

  if (prefersReducedMotion || footerReveal) return null;

  return (
    <div
      aria-hidden
      className="progressive-blur-edge pointer-events-none fixed inset-x-0 bottom-0 z-20 h-12 sm:h-14"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--progressive-blur-tint)] to-transparent" />

      {BOTTOM_LAYERS.map(({ blur, from, to }) => (
        <div
          key={blur}
          className="progressive-blur-layer absolute inset-0"
          style={{
            WebkitBackdropFilter: `blur(${blur}px)`,
            backdropFilter: `blur(${blur}px)`,
            maskImage: `linear-gradient(to top, black ${from}%, transparent ${to}%)`,
            WebkitMaskImage: `linear-gradient(to top, black ${from}%, transparent ${to}%)`,
          }}
        />
      ))}
    </div>
  );
}
