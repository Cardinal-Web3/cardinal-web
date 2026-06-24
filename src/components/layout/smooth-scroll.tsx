"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { usePathname } from "next/navigation";
import { cancelFrame, frame, useReducedMotion } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

/** Routes that use native browser scroll (no Lenis hijacking). */
const LENIS_DISABLED_PATHS = ["/whitepaper"];

const LENIS_OPTIONS: ConstructorParameters<typeof Lenis>[0] = {
  duration: 1.65,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: "vertical",
  gestureOrientation: "vertical",
  smoothWheel: true,
  wheelMultiplier: 0.82,
  touchMultiplier: 1.35,
  infinite: false,
  prevent: (node) =>
    Boolean(
      node.closest("[data-lenis-prevent]") ||
        node.classList.contains("lenis-prevent"),
    ),
};

export function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);
  const lenisDisabled = LENIS_DISABLED_PATHS.some((path) => pathname.startsWith(path));

  useEffect(() => {
    const destroyLenis = () => {
      if (!lenisRef.current) return;
      lenisRef.current.destroy();
      lenisRef.current = null;
    };

    if (prefersReducedMotion || lenisDisabled) {
      destroyLenis();
      return;
    }

    const lenis = new Lenis(LENIS_OPTIONS);
    lenisRef.current = lenis;

    const onFrame = (data: { timestamp: number }) => {
      lenis.raf(data.timestamp);
    };

    frame.update(onFrame, true);

    return () => {
      cancelFrame(onFrame);
      destroyLenis();
    };
  }, [prefersReducedMotion, lenisDisabled]);

  return children;
}
