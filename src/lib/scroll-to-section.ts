let activeFrame: number | null = null;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function clampDuration(delta: number): number {
  return Math.min(2400, Math.max(1000, Math.abs(delta) * 1.1));
}

/** Read scroll-margin-top from the target (falls back to 96px). */
export function getSectionScrollOffset(el: HTMLElement): number {
  const margin = parseFloat(getComputedStyle(el).scrollMarginTop);
  return Number.isFinite(margin) && margin > 0 ? margin : 96;
}

/**
 * Gentle in-page scroll for docs TOC (Lenis is off on /whitepaper).
 * Duration scales with distance but stays readable — never a hard browser snap.
 * Returns animation duration in ms (0 if instant or target missing).
 */
export function smoothScrollToSection(
  id: string,
  options?: { onComplete?: () => void },
): number {
  const el = document.getElementById(id);
  if (!el) return 0;

  const offset = getSectionScrollOffset(el);
  const target = el.getBoundingClientRect().top + window.scrollY - offset;
  const prefersReduced =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (activeFrame !== null) {
    cancelAnimationFrame(activeFrame);
    activeFrame = null;
  }

  if (prefersReduced || Math.abs(target - window.scrollY) < 2) {
    window.scrollTo({ top: target, behavior: "auto" });
    options?.onComplete?.();
    return 0;
  }

  const startY = window.scrollY;
  const delta = target - startY;
  const duration = clampDuration(delta);
  const startTime = performance.now();

  const step = (now: number) => {
    const t = Math.min((now - startTime) / duration, 1);
    window.scrollTo(0, startY + delta * easeInOutCubic(t));
    if (t < 1) {
      activeFrame = requestAnimationFrame(step);
    } else {
      activeFrame = null;
      options?.onComplete?.();
    }
  };

  activeFrame = requestAnimationFrame(step);
  return duration;
}
