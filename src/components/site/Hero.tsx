"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { CountUp } from "@/components/motion/CountUp";

const EASE = [0.22, 1, 0.36, 1] as const;


export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // counter-motion parallax — background drifts slower than scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden pt-28 md:pt-36">
      {/* background with counter-motion parallax */}
      <motion.div
        style={{ y: bgY }}
        className="pointer-events-none absolute inset-x-0 top-0 h-[920px] will-change-transform"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_8%,oklch(0.82_0.13_210_/_0.22),transparent_55%),radial-gradient(ellipse_at_65%_18%,oklch(0.66_0.18_290_/_0.18),transparent_52%)]" />
        <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] opacity-60" />
        <div className="aurora absolute left-1/2 top-0 h-[560px] w-[860px] -translate-x-1/2 opacity-45" />
      </motion.div>

      <div className="mx-auto max-w-6xl px-6 pb-20 md:pb-24">
        <div className="relative max-w-4xl">
          {/* badge */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-surface/60 px-3 py-1 text-[11px] backdrop-blur"
          >
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping-ring rounded-full bg-cyan/60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan" />
            </span>
            <span className="font-mono uppercase tracking-[0.18em] text-muted-foreground">
              Pilot
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span className="font-mono uppercase tracking-[0.18em] text-foreground/80">
              SafeSend live
            </span>
          </motion.div>

          {/* headline — staggered line reveal */}
          <h1 className="font-display mt-6 text-[clamp(42px,6.5vw,92px)] font-medium leading-[0.96] tracking-[-0.035em]">
            <motion.span
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 36, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
              className="block"
            >
              Protect every transaction
            </motion.span>
            <motion.span
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 36, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
              className="text-brand text-brand-drift block"
            >
              before value moves.
            </motion.span>
          </h1>

          {/* subhead */}
          <motion.p
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 14, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: 0.75, ease: EASE }}
            className="mt-6 max-w-xl text-[16.5px] leading-relaxed text-muted-foreground md:text-[18px]"
          >
            Wallet protection, threat intelligence, and safer settlement — before you sign.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.85, ease: EASE }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/app"
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-[14px] font-medium text-background transition-colors hover:bg-cyan"
            >
              Launch App
              <span className="inline-block transition-transform group-hover:translate-x-0.5" aria-hidden>
                →
              </span>
            </Link>
            <Link
              href="/safesend"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-surface-elevated px-5 py-3 text-[14px] text-foreground transition-colors hover:border-cyan hover:text-cyan"
            >
              Explore SafeSend
            </Link>
          </motion.div>

          {/* stats */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.95, ease: EASE }}
            className="mt-12 max-w-lg"
          >
            <div className="grid grid-cols-3 gap-6">
              <Stat value={<CountUp to={1.4} format={(n) => `${n.toFixed(1)}M`} />} label="Txs scanned" />
              <Stat value={<CountUp to={48} format={(n) => `${n}k`} />} label="Threats blocked" />
              <Stat value={<CountUp to={12} suffix=" ms" />} label="Avg verdict" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div>
      <div className="font-display text-2xl">{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
