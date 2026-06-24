"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { smoothScrollToSection } from "@/lib/scroll-to-section";

function triggerY(): number {
  return window.innerHeight * 0.2;
}

/**
 * Deterministic active section from layout geometry — reliable at any scroll speed.
 * Last section whose top <= trigger line wins; if none, first; always resolves.
 */
export function computeActive(ids: readonly string[]): string {
  if (ids.length === 0) return "";

  const line = triggerY();
  let active = ids[0];
  let anyQualify = false;

  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (el.getBoundingClientRect().top <= line) {
      active = id;
      anyQualify = true;
    }
  }

  if (!anyQualify) return ids[0];

  return active;
}

/**
 * Docs scrollspy: position-based source of truth, rAF-throttled on scroll.
 * IntersectionObserver is an optional extra trigger only.
 */
export function useScrollSpy(ids: readonly string[]): {
  activeId: string;
  scrollToSection: (id: string) => void;
} {
  const [activeId, setActiveIdState] = useState<string>(ids[0] ?? "");

  const activeIdRef = useRef(activeId);
  const lockUntilRef = useRef(0);
  const rafRef = useRef<number>();

  const commitActive = useCallback((next: string) => {
    if (!next || next === activeIdRef.current) return;
    activeIdRef.current = next;
    setActiveIdState(next);
    const hash = `#${next}`;
    if (window.location.hash !== hash) {
      history.replaceState(null, "", hash);
    }
  }, []);

  const runCompute = useCallback(() => {
    if (performance.now() < lockUntilRef.current) return;
    commitActive(computeActive(ids));
  }, [ids, commitActive]);

  const scheduleCompute = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = undefined;
      runCompute();
    });
  }, [runCompute]);

  const scrollToSection = useCallback(
    (id: string) => {
      if (!ids.includes(id)) return;

      const now = performance.now();
      commitActive(id);

      const duration = smoothScrollToSection(id, {
        onComplete: () => {
          lockUntilRef.current = performance.now() + 150;
          runCompute();
        },
      });

      lockUntilRef.current = now + duration + 200;
    },
    [ids, commitActive, runCompute],
  );

  // Honour URL hash on mount (instant, no smooth scroll).
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash || !ids.includes(hash)) {
      runCompute();
      return;
    }

    activeIdRef.current = hash;
    setActiveIdState(hash);
    requestAnimationFrame(() => {
      const el = document.getElementById(hash);
      if (!el) return;
      const margin = parseFloat(getComputedStyle(el).scrollMarginTop);
      const offset = Number.isFinite(margin) && margin > 0 ? margin : 96;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "auto" });
      runCompute();
    });
  }, [ids, runCompute]);

  useEffect(() => {
    if (ids.length === 0) return;

    window.addEventListener("scroll", scheduleCompute, { passive: true });
    window.addEventListener("resize", scheduleCompute);

    // Optional IO — nudge compute on intersection changes, not source of truth.
    let observer: IntersectionObserver | undefined;
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length > 0) {
      observer = new IntersectionObserver(() => scheduleCompute(), {
        rootMargin: "-20% 0px -75% 0px",
        threshold: [0, 0.25, 0.5, 1],
      });
      elements.forEach((el) => observer!.observe(el));
    }

    runCompute();

    return () => {
      window.removeEventListener("scroll", scheduleCompute);
      window.removeEventListener("resize", scheduleCompute);
      observer?.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [ids, scheduleCompute, runCompute]);

  return { activeId, scrollToSection };
}
