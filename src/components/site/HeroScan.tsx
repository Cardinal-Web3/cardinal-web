"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  type Variants,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Verdict } from "@/lib/mock-scan";

type DemoTx = {
  verdict: Verdict;
  recipient: string;
  amount: string;
  token: string;
  score: number;
  network: string;
  headline: string;
  reason: string;
  recommendation: string;
  signal: string;
  stepTitle: string;
  stepDescription: string;
  barsActive: number;
};

/** Scroll order: REVIEW → BLOCK → SAFE */
const SHOWCASE_STEPS: DemoTx[] = [
  {
    verdict: "REVIEW",
    recipient: "0xA1b2...aBcD",
    amount: "0.85",
    token: "ETH",
    score: 58,
    network: "Ethereum",
    headline: "Review Required",
    reason: "First-time recipient and elevated gas behavior need one more look.",
    recommendation: "Verify before signing.",
    signal: "First-time recipient",
    stepTitle: "Review Required",
    stepDescription:
      "First-time recipients and elevated gas patterns trigger a human review window before funds move.",
    barsActive: 2,
  },
  {
    verdict: "BLOCK",
    recipient: "0xDe4d...ffee",
    amount: "12,000.00",
    token: "USDC",
    score: 12,
    network: "Ethereum",
    headline: "Critical Risk",
    reason: "Linked to known drainer activity and risky approvals.",
    recommendation: "Do not sign.",
    signal: "Drainer-linked wallet",
    stepTitle: "Critical Risk",
    stepDescription:
      "Known drainer clusters and risky calldata halt the transaction before a wallet signature can execute.",
    barsActive: 1,
  },
  {
    verdict: "ALLOW",
    recipient: "0x7c8b...2a14",
    amount: "2,400.00",
    token: "USDC",
    score: 94,
    network: "Ethereum",
    headline: "Low Risk",
    reason: "Recipient history, network, and simulation all match intent.",
    recommendation: "Proceed with settlement.",
    signal: "Trusted recipient",
    stepTitle: "Low Risk · Proceed",
    stepDescription:
      "When every protection layer clears, Cardinal returns a low-risk verdict with plain-English proof.",
    barsActive: 3,
  },
];

type VerdictStyle = {
  text: string;
  border: string;
  accent: string;
  /** raw color for static glow layers + rail fill */
  color: string;
  label: string;
};

const STYLE: Record<Verdict, VerdictStyle> = {
  ALLOW: {
    text: "text-emerald",
    border: "border-emerald/40",
    accent: "bg-emerald",
    color: "var(--emerald)",
    label: "Low risk",
  },
  REVIEW: {
    text: "text-amber",
    border: "border-amber/40",
    accent: "bg-amber",
    color: "var(--amber)",
    label: "Review",
  },
  BLOCK: {
    text: "text-red",
    border: "border-red/40",
    accent: "bg-red",
    color: "var(--red)",
    label: "Critical",
  },
};

const BAR_LABELS = ["Detected", "Checked", "Protected"];
const EASE = [0.22, 1, 0.36, 1] as const;

/* -------------------------------------------------------------------------- */
/*  Discrete state — IntersectionObserver. One state active at a time.        */
/* -------------------------------------------------------------------------- */

function useActiveStep(count: number, getRoot?: () => Element | null) {
  const [activeIndex, setActiveIndex] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  const setRef = useCallback(
    (index: number) => (el: HTMLElement | null) => {
      refs.current[index] = el;
    },
    [],
  );

  useEffect(() => {
    const elements = refs.current.slice(0, count).filter(Boolean) as HTMLElement[];
    if (!elements.length) return;

    const root = getRoot?.() ?? null;
    // Zero-height (or zero-width) band locked to the viewport/container centre.
    // Exactly one contiguous panel crosses it at a time → clean discrete state.
    const rootMargin = root ? "0px -50% 0px -50%" : "-50% 0px -50% 0px";

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.stepIndex);
            if (!Number.isNaN(idx)) setActiveIndex(idx);
          }
        }
      },
      { root, rootMargin, threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [count, getRoot]);

  return { activeIndex, setActiveIndex, setRef };
}

/* -------------------------------------------------------------------------- */
/*  Score count-up — fires ONCE per state enter (component remounts on key).   */
/* -------------------------------------------------------------------------- */

function AnimatedScore({ score, className }: { score: number; className?: string }) {
  const prefersReducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(prefersReducedMotion ? score : 0);
  const spring = useSpring(0, { stiffness: 70, damping: 18, mass: 0.7 });

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplay(score);
      return;
    }
    spring.jump(0);
    spring.set(score);
  }, [score, spring, prefersReducedMotion]);

  useMotionValueEvent(spring, "change", (v) => {
    if (!prefersReducedMotion) setDisplay(Math.round(v));
  });

  return <span className={className}>{display}</span>;
}

/* -------------------------------------------------------------------------- */
/*  Content stagger variants: headline → reason → bars → action.              */
/* -------------------------------------------------------------------------- */

const contentVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
  exit: { opacity: 0, transition: { duration: 0.18, ease: "easeIn" } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: EASE } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.16, ease: "easeIn" } },
};

/* -------------------------------------------------------------------------- */
/*  Card content (the part that crossfades between verdicts).                  */
/* -------------------------------------------------------------------------- */

function CardContent({
  tx,
  animate,
  layout = "desktop",
}: {
  tx: DemoTx;
  animate: boolean;
  /** carousel = mobile/tablet only; desktop sticky card uses default */
  layout?: "desktop" | "carousel";
}) {
  const style = STYLE[tx.verdict];
  const txId = Math.abs(tx.recipient.charCodeAt(4) * 991)
    .toString(16)
    .slice(0, 8);
  const isCarousel = layout === "carousel";

  const Wrap = animate ? motion.div : "div";
  const Item = animate ? motion.div : "div";
  const wrapProps = animate
    ? {
        variants: contentVariants,
        initial: "hidden" as const,
        animate: "show" as const,
        exit: "exit" as const,
      }
    : {};
  const itemProps = animate ? { variants: itemVariants } : {};

  return (
    <Wrap
      {...wrapProps}
      className={`relative z-10 ${isCarousel ? "p-4 sm:p-5" : "p-4 sm:p-5"}`}
    >
      {/* header row */}
      <Item
        {...itemProps}
        className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
      >
        <span className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${style.accent}`} />
          Cardinal protection
        </span>
        <span>tx_{txId}</span>
      </Item>

      {/* amount */}
      <Item {...itemProps} className="mt-4">
        <div
          className={`font-display leading-none tracking-tight ${
            isCarousel ? "text-[22px] sm:text-[24px]" : "text-[28px] sm:text-[32px]"
          }`}
        >
          {tx.amount} <span className="text-muted-foreground">{tx.token}</span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 font-mono text-[10.5px] text-muted-foreground">
          <span>to {tx.recipient}</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
          <span>{tx.network}</span>
        </div>
      </Item>

      <div className="my-4 h-px w-full bg-[var(--border)]" />

      {/* verdict + score */}
      <Item {...itemProps} className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="eyebrow mb-1.5">Verdict</div>
          <h4
            className={`font-display font-medium leading-[1.15] tracking-tight ${style.text} line-clamp-2 ${
              isCarousel ? "text-[17px] sm:text-[18px]" : "text-[20px] sm:text-[22px]"
            }`}
          >
            {tx.headline}
          </h4>
        </div>
        <div
          className={`shrink-0 rounded-lg border bg-surface px-2.5 py-1.5 text-center ${style.border} ${style.text}`}
        >
          <AnimatedScore score={tx.score} className="font-display text-xl leading-none" />
          <div className="mt-0.5 font-mono text-[8px] uppercase tracking-wider text-muted-foreground">
            /100
          </div>
        </div>
      </Item>

      {/* reason */}
      <Item {...itemProps} className="mt-3 text-[13px] leading-relaxed text-foreground/80">
        {tx.reason}
      </Item>

      {/* bars */}
      <Item {...itemProps} className="mt-4 grid grid-cols-3 gap-1.5">
        {BAR_LABELS.map((label, index) => {
          const isActive = tx.barsActive >= index + 1;
          return (
            <div
              key={label}
              className={`rounded-lg border px-2.5 py-2 ${
                isActive ? `${style.border} bg-surface/70` : "border-[var(--border)] bg-background/20"
              }`}
            >
              <div className="h-1 overflow-hidden rounded-full bg-[var(--border-strong)]">
                {animate ? (
                  <motion.div
                    className={`h-full rounded-full ${isActive ? style.accent : "bg-transparent"}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isActive ? 1 : 0.18 }}
                    transition={{ duration: 0.45, ease: EASE, delay: 0.12 + index * 0.06 }}
                    style={{ transformOrigin: "left center" }}
                  />
                ) : (
                  <div
                    className={`h-full rounded-full ${isActive ? style.accent : "bg-transparent"}`}
                    style={{ transform: `scaleX(${isActive ? 1 : 0.18})`, transformOrigin: "left center" }}
                  />
                )}
              </div>
              <div
                className={`mt-1.5 font-mono text-[9px] uppercase tracking-wider ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {label}
              </div>
            </div>
          );
        })}
      </Item>

      {/* action */}
      <Item
        {...itemProps}
        className="mt-4 rounded-lg border border-[var(--border)] bg-background/30 px-3 py-2.5 text-[12px] text-muted-foreground"
      >
        Recommended action:{" "}
        <span className={`font-medium ${style.text}`}>{tx.recommendation}</span>
      </Item>
    </Wrap>
  );
}

/* -------------------------------------------------------------------------- */
/*  Card shell — persistent frame. Glows are static layers; only opacity      */
/*  crossfades (compositor-cheap). No blur / box-shadow tied to scroll.        */
/* -------------------------------------------------------------------------- */

function ProtectionCard({
  verdict,
  children,
  promote = false,
  flat = false,
}: {
  verdict: Verdict;
  children: React.ReactNode;
  promote?: boolean;
  /** Skip top glow/dot layers — avoids dark band on mobile carousel cards */
  flat?: boolean;
}) {
  const style = STYLE[verdict];

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border bg-surface transition-[border-color] duration-300 ${style.border}`}
      style={
        promote
          ? {
              willChange: "transform",
              transform: "translateZ(0)",
              contain: "layout paint",
            }
          : undefined
      }
    >
      {!flat &&
        (Object.keys(STYLE) as Verdict[]).map((v) => (
          <div
            key={v}
            aria-hidden
            className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-out"
            style={{
              opacity: v === verdict ? 1 : 0,
              background: `radial-gradient(120% 75% at 50% 0%, color-mix(in oklab, ${STYLE[v].color} 12%, transparent), transparent 70%)`,
            }}
          />
        ))}
      {!flat && <div className="dot-bg pointer-events-none absolute inset-0 opacity-[0.22]" />}
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Slim vertical progress rail (desktop).                                     */
/* -------------------------------------------------------------------------- */

function ProgressRail({ activeIndex, count }: { activeIndex: number; count: number }) {
  const verdict = SHOWCASE_STEPS[activeIndex].verdict;
  const color = STYLE[verdict].color;
  const fill = count > 1 ? activeIndex / (count - 1) : 0;

  return (
    <div className="sticky top-0 flex h-[100svh] items-center justify-center">
      <div className="relative h-[180px] w-px bg-[var(--border)]">
        {/* colored progress fill */}
        <div
          className="absolute left-0 top-0 w-px origin-top rounded-full transition-[transform,background-color] duration-500 ease-out"
          style={{ height: "100%", transform: `scaleY(${fill})`, backgroundColor: color }}
        />
        {SHOWCASE_STEPS.map((step, i) => {
          const reached = i <= activeIndex;
          return (
            <span
              key={step.verdict}
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 transition-colors duration-500"
              style={{ top: `${(i / (count - 1)) * 100}%` }}
            >
              <span
                className="block rounded-full transition-all duration-500"
                style={{
                  width: i === activeIndex ? 9 : 6,
                  height: i === activeIndex ? 9 : 6,
                  backgroundColor: reached ? color : "var(--border-strong)",
                }}
              />
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Step copy (desktop left column).                                           */
/* -------------------------------------------------------------------------- */

function StepPanel({
  step,
  index,
  active,
  setRef,
}: {
  step: DemoTx;
  index: number;
  active: boolean;
  setRef: (index: number) => (el: HTMLElement | null) => void;
}) {
  const style = STYLE[step.verdict];

  return (
    <div
      ref={setRef(index)}
      data-step-index={index}
      className={`flex min-h-[88svh] flex-col justify-center transition-opacity duration-500 ease-out ${
        active ? "opacity-100" : "opacity-35"
      }`}
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        Step {String(index + 1).padStart(2, "0")} · {style.label}
      </div>
      <h3
        className={`font-display mt-3 text-[clamp(26px,3.4vw,38px)] font-medium leading-[1.1] tracking-[-0.02em] transition-colors duration-500 ${
          active ? style.text : "text-foreground"
        }`}
      >
        {step.stepTitle}
      </h3>
      <p className="mt-3 max-w-sm text-[14.5px] leading-relaxed text-muted-foreground">
        {step.stepDescription}
      </p>
      <div className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        <span className={`h-1.5 w-1.5 rounded-full ${style.accent}`} />
        Risk score · {step.score}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sticky card host — content crossfade keyed by verdict.                     */
/* -------------------------------------------------------------------------- */

function StickyCard({ tx }: { tx: DemoTx }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="sticky top-0 flex h-[100svh] items-center">
      <div className="mx-auto w-full max-w-[540px]">
        <ProtectionCard verdict={tx.verdict} promote>
          {prefersReducedMotion ? (
            <CardContent tx={tx} animate={false} />
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              <CardContent key={tx.verdict} tx={tx} animate />
            </AnimatePresence>
          )}
        </ProtectionCard>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Mobile + tablet carousel (< lg). Desktop (lg+) is unchanged.              */
/* -------------------------------------------------------------------------- */

/** Slide width token — symmetric peek via matching track padding */
const MOBILE_SLIDE_W = "min(400px,calc(100vw-2.5rem))";
const MOBILE_TRACK_PAD = "max(1.25rem,calc((100vw - min(400px,calc(100vw-2.5rem)))/2))";

function MobileShowcase() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const getRoot = useCallback(() => scrollRef.current, []);
  const { activeIndex, setRef } = useActiveStep(SHOWCASE_STEPS.length, getRoot);
  const active = SHOWCASE_STEPS[activeIndex];

  const scrollTo = useCallback(
    (index: number) => {
      const slide = scrollRef.current?.querySelector<HTMLElement>(`[data-step-index="${index}"]`);
      slide?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        inline: "center",
        block: "nearest",
      });
    },
    [prefersReducedMotion],
  );

  const trackStyle = {
    scrollPaddingInline: MOBILE_TRACK_PAD,
    paddingInline: MOBILE_TRACK_PAD,
  } as const;

  return (
    <div className="lg:hidden">
      {/* one synced caption — fixed height so cards never jump */}
      <p
        key={active.verdict}
        className="mb-5 line-clamp-3 min-h-[3.75rem] text-[13.5px] leading-relaxed text-muted-foreground"
      >
        {active.stepDescription}
      </p>

      <div
        ref={scrollRef}
        data-lenis-prevent
        style={trackStyle}
        className="-mx-6 flex snap-x snap-mandatory snap-always gap-3 overflow-x-auto overscroll-x-contain scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [touch-action:pan-x] [&::-webkit-scrollbar]:hidden"
      >
        {SHOWCASE_STEPS.map((step, index) => (
          <div
            key={step.verdict}
            data-step-index={index}
            ref={setRef(index)}
            className="shrink-0 snap-center snap-always"
            style={{ width: MOBILE_SLIDE_W }}
          >
            <ProtectionCard verdict={step.verdict} flat>
              <CardContent tx={step} animate={false} layout="carousel" />
            </ProtectionCard>
          </div>
        ))}
      </div>

      <div
        className="mt-5 flex items-center justify-center gap-1"
        role="tablist"
        aria-label="Verdict states"
      >
        {SHOWCASE_STEPS.map((step, index) => (
          <button
            key={step.verdict}
            type="button"
            role="tab"
            aria-selected={activeIndex === index}
            aria-label={`${STYLE[step.verdict].label}: ${step.stepTitle}`}
            onClick={() => scrollTo(index)}
            className="flex h-11 min-w-11 items-center justify-center rounded-full px-1"
          >
            <span
              className={`block h-2 rounded-full transition-[width,background-color] duration-300 ease-out ${
                activeIndex === index ? `w-8 ${STYLE[step.verdict].accent}` : "w-2 bg-[var(--border-strong)]"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section.                                                                   */
/* -------------------------------------------------------------------------- */

export function ProtectionShowcase() {
  const { activeIndex, setRef } = useActiveStep(SHOWCASE_STEPS.length);
  const tx = SHOWCASE_STEPS[activeIndex];

  return (
    <section id="protection-showcase" className="relative px-6 pb-24 pt-20 lg:pb-28 lg:pt-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 max-w-2xl lg:mb-10">
          <div className="eyebrow mb-3">Cardinal protection</div>
          <h2 className="font-display text-balance text-[clamp(30px,4.2vw,52px)] font-medium leading-[1.05] tracking-[-0.02em]">
            Three verdicts. One scroll away.
          </h2>
          <p className="mt-4 text-[15.5px] leading-relaxed text-muted-foreground lg:hidden">
            Swipe the cards — the protection verdict updates with each state.
          </p>
          <p className="mt-4 hidden text-[15.5px] leading-relaxed text-muted-foreground lg:block">
            Scroll the steps — the protection card updates to match each verdict in real time.
          </p>
        </div>

        <MobileShowcase />

        {/* desktop (lg+): rail · steps · sticky card — unchanged */}
        <div className="relative hidden lg:grid lg:grid-cols-[20px_1fr_minmax(0,540px)] lg:gap-8 xl:gap-14">
          <ProgressRail activeIndex={activeIndex} count={SHOWCASE_STEPS.length} />

          <div>
            {SHOWCASE_STEPS.map((step, index) => (
              <StepPanel
                key={step.verdict}
                step={step}
                index={index}
                active={activeIndex === index}
                setRef={setRef}
              />
            ))}
          </div>

          <StickyCard tx={tx} />
        </div>
      </div>
    </section>
  );
}

/** @deprecated Use ProtectionShowcase — kept for import compatibility */
export const HeroScan = ProtectionShowcase;
