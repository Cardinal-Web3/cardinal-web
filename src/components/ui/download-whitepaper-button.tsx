"use client";

import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/** Slow, felt easing — matches site motion vocabulary */
const EASE_SMOOTH = "cubic-bezier(0.22, 1, 0.36, 1)";

type DownloadWhitepaperButtonProps = {
  href: string;
  /** Dark pill on light page (hero). Light pill on dark band (footer CTA). */
  tone?: "dark" | "light";
  className?: string;
};

/** Thin diagonal up-right arrow — matches external-link / launch affordance. */
function LaunchArrow({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M3.75 10.25 10.25 3.75M10.25 3.75H6.25M10.25 3.75V7.75"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LaunchArrowSlot({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <span className="inline-flex size-3.5 shrink-0 items-center justify-center" aria-hidden>
      <LaunchArrow
        className={cn(
          "[will-change:transform]",
          !reduceMotion &&
            "transition-transform duration-[250ms] ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px]",
        )}
      />
    </span>
  );
}

export function DownloadWhitepaperButton({
  href,
  tone = "dark",
  className,
}: DownloadWhitepaperButtonProps) {
  const reduceMotion = useReducedMotion();

  const buttonMotion = reduceMotion
    ? undefined
    : ({
        transitionDuration: "480ms",
        transitionTimingFunction: EASE_SMOOTH,
      } as const);

  return (
    <a
      href={href}
      target="_blank"
      download
      style={buttonMotion}
      className={cn(
        "group relative inline-flex w-full items-center justify-center overflow-hidden rounded-full sm:w-auto",
        "border transition-[transform,box-shadow,background-color,border-color,filter]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        tone === "dark" && [
          "border-foreground/[0.08] bg-foreground text-background",
          "shadow-[inset_0_1px_0_oklch(1_0_0/0.07),0_1px_3px_oklch(0_0_0/0.07)]",
          "hover:border-foreground/[0.12] hover:bg-[color-mix(in_oklch,var(--foreground)_93%,white)]",
          "hover:shadow-[inset_0_1px_0_oklch(1_0_0/0.1),0_8px_24px_-6px_oklch(0_0_0/0.12)]",
          reduceMotion
            ? "hover:brightness-[1.04]"
            : "hover:-translate-y-1 active:translate-y-0 active:scale-[0.985]",
        ],
        tone === "light" && [
          "border-background/15 bg-background text-foreground",
          "shadow-[inset_0_1px_0_oklch(1_0_0/0.45),0_1px_3px_oklch(0_0_0/0.12)]",
          "hover:border-background/25 hover:bg-[color-mix(in_oklch,var(--background)_94%,white)]",
          "hover:shadow-[inset_0_1px_0_oklch(1_0_0/0.55),0_8px_24px_-6px_oklch(0_0_0/0.2)]",
          reduceMotion
            ? "hover:brightness-[1.03]"
            : "hover:-translate-y-1 active:translate-y-0 active:scale-[0.985]",
        ],
        className,
      )}
    >
      {!reduceMotion && (
        <span
          aria-hidden
          className="download-btn-shine pointer-events-none absolute inset-0 rounded-full"
        />
      )}
      <span className="relative z-[1] inline-flex items-center justify-center gap-2.5 px-6 py-3 text-[13.5px] font-medium">
        Download Whitepaper
        <LaunchArrowSlot reduceMotion={!!reduceMotion} />
      </span>
    </a>
  );
}
