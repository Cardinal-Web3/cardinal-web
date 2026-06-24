"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { LogoMark } from "./Logo";

export type CurtainPace = "default" | "slow";

const footerColumns = [
  {
    title: "Product",
    items: [
      ["SafeSend", "/safesend"],
      ["Escrow", "/safesend"],
      ["Launch App", "/app"],
    ],
  },
  {
    title: "Platform",
    items: [
      ["Protection API", "/api-docs"],
      ["Swagger", "http://localhost:3001/docs"],
      ["Wallet", "/app"],
    ],
  },
  {
    title: "Company",
    items: [
      ["Partners", "/partners"],
      ["Pilot", "/pilot"],
      ["GitHub", "https://github.com/Cardinal-Web3"],
    ],
  },
];

/* ----------------------------------------------------------------------------
 * FooterPanel — presentational, theme-aware (drives all color from tokens).
 * Fills its container; positioning/animation is owned by the parent.
 * ------------------------------------------------------------------------- */
function FooterPanel({
  scrollProgress,
  pace = "default",
}: {
  scrollProgress?: MotionValue<number>;
  pace?: CurtainPace;
}) {
  const fallback = useMotionValue(1);
  const progress = scrollProgress ?? fallback;
  const isSlow = pace === "slow";

  // Scroll-driven letter-by-letter reveal for "CARDINAL"
  const makeLetterStyle = (i: number) => {
    const start = isSlow ? 0.18 + i * 0.055 : 0.62 + i * 0.018;
    const end = start + (isSlow ? 0.22 : 0.14);
    return {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      y: useTransform(progress, [start, end], [60, 0]),
      // eslint-disable-next-line react-hooks/rules-of-hooks
      opacity: useTransform(progress, [start, start + 0.06], [0, 1]),
      // eslint-disable-next-line react-hooks/rules-of-hooks
      rotateX: useTransform(progress, [start, end], [-70, 0]),
      // eslint-disable-next-line react-hooks/rules-of-hooks
      scale: useTransform(progress, [start, end], [0.7, 1]),
      // eslint-disable-next-line react-hooks/rules-of-hooks
      filter: useTransform(progress, [start, start + 0.08], ["blur(6px)", "blur(0px)"]),
    };
  };

  const l0 = makeLetterStyle(0);
  const l1 = makeLetterStyle(1);
  const l2 = makeLetterStyle(2);
  const l3 = makeLetterStyle(3);
  const l4 = makeLetterStyle(4);
  const l5 = makeLetterStyle(5);
  const l6 = makeLetterStyle(6);
  const l7 = makeLetterStyle(7);
  const letterStyles = [l0, l1, l2, l3, l4, l5, l6, l7];

  // Glow that fades in once all letters have landed
  const glowOp = useTransform(progress, [isSlow ? 0.78 : 0.9, 1], [0, 1]);

  const sitemapOp = useTransform(progress, [isSlow ? 0.72 : 0.88, isSlow ? 0.96 : 0.98], [0, 1]);
  const sitemapY = useTransform(progress, [isSlow ? 0.72 : 0.88, isSlow ? 0.96 : 0.98], [16, 0]);

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.16]" />
      <div className="dot-bg pointer-events-none absolute inset-0 opacity-40 dark:opacity-[0.18]" />
      <div className="footer-glow pointer-events-none absolute inset-x-0 bottom-0 h-1/2" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[72%] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,var(--footer-ring),transparent)]" />

      {/* Closing statement */}
      <div className="flex flex-1 flex-col items-center justify-center px-5 pb-8 pt-20 text-center sm:px-10 sm:pb-14 sm:pt-36">
        <div className="relative">
          {/* text glow that fades in after all letters land */}
          <motion.div
            style={{ opacity: glowOp }}
            className="pointer-events-none absolute inset-0 -inset-x-8 blur-[60px]"
          >
            <div className="mx-auto h-full w-3/4 rounded-full bg-cyan/[0.06] dark:bg-cyan/[0.08]" />
          </motion.div>

          <h2
            className="font-display relative max-w-[12ch] text-[clamp(38px,12vw,150px)] leading-[0.82] tracking-[-0.06em]"
            style={{ perspective: "800px" }}
          >
            {"CARDINAL".split("").map((char, i) => (
              <motion.span
                key={i}
                style={letterStyles[i]}
                className="inline-block text-[var(--footer-fg)] will-change-[transform,filter,opacity]"
              >
                {char}
              </motion.span>
            ))}
          </h2>
        </div>

        <p className="mx-auto mt-4 max-w-lg text-balance text-[13.5px] leading-relaxed text-[var(--footer-muted)] sm:mt-6 sm:text-[16px]">
          Scan. Settle. Protect — before value moves.
        </p>

        <div className="mt-5 flex w-full max-w-sm flex-col gap-2 sm:mt-8 sm:max-w-none sm:flex-row sm:justify-center sm:gap-2.5">
          <Link
            href="/app"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-[var(--footer-primary-bg)] px-6 py-3 text-[13.5px] font-medium text-[var(--footer-primary-fg)] transition hover:bg-cyan hover:text-[var(--footer-primary-fg)]"
          >
            Launch protected app
            <span className="transition group-hover:translate-x-0.5" aria-hidden>
              →
            </span>
          </Link>
          <Link
            href="/pilot"
            className="inline-flex items-center justify-center rounded-full border border-[var(--footer-secondary-border)] bg-[var(--footer-secondary-bg)] px-6 py-3 text-[13.5px] text-[var(--footer-muted)] transition hover:border-cyan/40 hover:text-cyan"
          >
            Join the pilot
          </Link>
        </div>
      </div>

      {/* Site map + meta */}
      <motion.div
        style={{ opacity: sitemapOp, y: sitemapY }}
        className="border-t border-[var(--footer-ring)] px-5 py-4 sm:px-10 sm:py-7"
      >
        <div className="mx-auto grid max-w-6xl gap-4 sm:gap-7 md:grid-cols-[1.25fr_2fr] md:items-start">
          <div className="flex items-start justify-between gap-3 md:block">
            <div>
              <Link href="/" className="group inline-flex items-center gap-2.5">
                <motion.div
                  whileHover={{ rotate: 15 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <LogoMark size={26} animated={false} />
                </motion.div>
                <span className="font-display text-[16px] tracking-tight text-[var(--footer-fg)] transition-colors group-hover:text-cyan">
                  Cardinal
                </span>
              </Link>
              <p className="mt-2 max-w-[210px] text-[12.5px] leading-relaxed text-[var(--footer-faint)] sm:mt-3 sm:max-w-xs sm:text-[13px]">
                Transaction protection before signature.
              </p>
            </div>
            <div className="mt-0 inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--footer-ring)] bg-[var(--footer-chip)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--footer-muted)] md:mt-4">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_12px_oklch(0.82_0.13_210)]" />
              Pilot live
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-5">
            {footerColumns.map((col) => (
              <div key={col.title} className="border-l border-[var(--footer-ring)] pl-3 sm:pl-4">
                <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--footer-faint)] sm:text-[10px] sm:tracking-[0.18em]">
                  {col.title}
                </div>
                <ul className="mt-2 space-y-1.5 sm:mt-3 sm:space-y-2">
                  {col.items.map(([label, href]) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="group/link inline-flex items-center gap-1.5 text-[11.5px] text-[var(--footer-muted)] transition-colors duration-200 hover:text-cyan sm:gap-2 sm:text-[13px]"
                      >
                        <span className="hidden h-px w-2 bg-[var(--footer-ring)] transition-all duration-300 group-hover/link:w-4 group-hover/link:bg-cyan sm:inline-block" />
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* bottom bar */}
        <div className="mx-auto mt-4 flex max-w-6xl flex-col gap-1.5 border-t border-[var(--footer-ring)] pt-3 sm:mt-7 sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:pt-4">
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--footer-faint)] sm:text-[10px] sm:tracking-[0.14em]">
            © {new Date().getFullYear()} Cardinal Labs, Inc.
          </span>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link
              href="/api-docs"
              className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--footer-faint)] transition-colors hover:text-cyan sm:text-[10px] sm:tracking-[0.14em]"
            >
              API docs
            </Link>
            <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--footer-faint)] sm:text-[10px] sm:tracking-[0.14em]">
              cardinal://protect · v0.4.0-pilot
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * CurtainReveal — wraps the page content and pins the footer behind it.
 *
 * Layout / z-index / margin:
 *   - content panel: position relative, z-index 1, solid bg, rounded bottom,
 *     margin-bottom = footer height (100svh) → opens the reveal gap at the end.
 *   - footer: position fixed, bottom 0, full width, z-index 0 (behind content).
 *
 * Scroll/timeline:
 *   useScroll on the content ref with offset ["end end", "end start"].
 *   The content's bottom edge travels from viewport-bottom → viewport-top across
 *   exactly one viewport (= footer height), so progress 0→1 maps 1:1 to the
 *   reveal. useTransform scrubs scale/translateY/opacity to that progress, so
 *   every scroll pixel is a frame and it reverses on scroll up.
 * ------------------------------------------------------------------------- */
export function CurtainReveal({
  children,
  pace = "default",
}: {
  children: ReactNode;
  pace?: CurtainPace;
}) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const isSlow = pace === "slow";

  // Slow pace needs a longer scroll runway *and* matching margin-bottom.
  // Offset end must stay within what margin-bottom allows, or progress caps mid-animation.
  const scrollOffset: NonNullable<Parameters<typeof useScroll>[0]>["offset"] = isSlow
    ? ["end end", "end -80%"]
    : ["end end", "end start"];

  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: scrollOffset,
  });

  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [1, 1] : isSlow ? [0.94, 1] : [0.92, 1],
  );
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : isSlow ? [32, 0] : [40, 0],
  );
  const mobileY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : isSlow ? [18, 0] : [20, 0],
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    prefersReducedMotion ? [1, 1, 1] : isSlow ? [0.35, 0.7, 1] : [0.5, 0.85, 1],
  );

  return (
    <>
      <div
        ref={contentRef}
        className={
          isSlow
            ? "curtain-content mb-[180dvh] sm:mb-[180svh]"
            : "curtain-content mb-[100dvh] sm:mb-[100svh]"
        }
      >
        {children}
      </div>

      <footer
        className="footer-surface fixed inset-x-0 bottom-0 z-0 h-dvh overflow-hidden sm:h-svh"
        aria-hidden={false}
      >
        <motion.div
          style={{ scale, y, opacity, transformOrigin: "center" }}
          className="hidden h-full will-change-transform sm:block"
        >
          <FooterPanel scrollProgress={scrollYProgress} pace={pace} />
        </motion.div>
        <motion.div
          style={{ y: mobileY, transformOrigin: "center" }}
          className="h-full will-change-transform sm:hidden"
        >
          <FooterPanel scrollProgress={scrollYProgress} pace={pace} />
        </motion.div>
      </footer>
    </>
  );
}

/* ----------------------------------------------------------------------------
 * Footer — static, in-flow variant for inner pages (no curtain).
 * ------------------------------------------------------------------------- */
export function Footer() {
  return (
    <footer className="footer-surface relative mt-24 min-h-[80svh] overflow-hidden border-t border-[var(--footer-ring)]">
      <FooterPanel />
    </footer>
  );
}
