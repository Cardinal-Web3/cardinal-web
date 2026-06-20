"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { cancelFrame, frame, useReducedMotion } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

const LENIS_OPTIONS: ConstructorParameters<typeof Lenis>[0] = {
  /** Slower, calmer feel — default 1.2 felt too snappy */
  duration: 1.65,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: "vertical",
  gestureOrientation: "vertical",
  smoothWheel: true,
  wheelMultiplier: 0.82,
  touchMultiplier: 1.35,
  infinite: false,
  /** Don't hijack horizontal carousels / nested scroll areas */
  prevent: (node) =>
    Boolean(
      node.closest("[data-lenis-prevent]") ||
        node.classList.contains("lenis-prevent"),
    ),
};

export function SmoothScroll({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const lenis = new Lenis(LENIS_OPTIONS);
    lenisRef.current = lenis;

    const onFrame = (data: { timestamp: number }) => {
      lenis.raf(data.timestamp);
    };

    frame.update(onFrame, true);

    return () => {
      cancelFrame(onFrame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [prefersReducedMotion]);

  return children;
}
