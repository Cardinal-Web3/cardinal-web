import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { HeroScan } from "./HeroScan";
import { HeroSceneClient } from "@/components/three/HeroSceneClient";
import { CountUp } from "@/components/motion/CountUp";

const WORDS = ["Protect", "Web3", "transactions"];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 md:pt-40">
      {/* Three.js backdrop (lazy, desktop only) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[900px] opacity-70">
        <HeroSceneClient />
      </div>
      <div className="grid-bg pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] opacity-60" />
      <div className="aurora pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 opacity-50" />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-24 md:grid-cols-[1.15fr_1fr]">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-surface/60 px-3 py-1 text-[11px] backdrop-blur"
          >
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping-ring rounded-full bg-cyan/60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan" />
            </span>
            <span className="font-mono uppercase tracking-[0.18em] text-muted-foreground">
              Pilot · v0.4
            </span>
            <span className="text-muted-foreground/50">/</span>
            <span className="font-mono uppercase tracking-[0.18em] text-foreground/80">
              SafeSend live
            </span>
          </motion.div>

          <h1 className="font-display mt-6 text-balance text-[clamp(44px,7vw,92px)] leading-[0.95] tracking-[-0.035em]">
            {WORDS.map((w, i) => (
              <span key={w} className="inline-block overflow-hidden align-bottom">
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block pr-3"
                >
                  {w}
                </motion.span>
              </span>
            ))}
            <br />
            <span className="inline-block overflow-hidden align-bottom">
              <motion.span
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block text-brand"
              >
                before you sign.
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-6 max-w-xl text-[16px] leading-relaxed text-muted-foreground"
          >
            Cardinal scans transaction risk, explains what it finds, and helps users
            move funds through safer settlement flows like SafeSend and escrow.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.72 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Link
              to="/app"
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-[14px] font-medium text-background transition hover:bg-cyan"
            >
              Launch App
              <span className="transition group-hover:translate-x-0.5" aria-hidden>
                →
              </span>
            </Link>
            <Link
              to="/safesend"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-surface-elevated px-5 py-3 text-[14px] text-foreground transition hover:border-cyan hover:text-cyan"
            >
              Explore SafeSend
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-12 grid max-w-md grid-cols-3 gap-6"
          >
            <div>
              <div className="font-display text-2xl">
                <CountUp to={1.4} format={(n) => `${(n).toFixed(1)}M`} />
              </div>
              <div className="mt-1 text-[11.5px] uppercase tracking-wider text-muted-foreground">
                Transactions scanned
              </div>
            </div>
            <div>
              <div className="font-display text-2xl">
                <CountUp to={48} format={(n) => `${n}k`} />
              </div>
              <div className="mt-1 text-[11.5px] uppercase tracking-wider text-muted-foreground">
                Threats blocked
              </div>
            </div>
            <div>
              <div className="font-display text-2xl">
                <CountUp to={12} suffix=" ms" />
              </div>
              <div className="mt-1 text-[11.5px] uppercase tracking-wider text-muted-foreground">
                Avg verdict
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <HeroScan />
        </motion.div>
      </div>

      {/* Trust strip */}
      <div className="mx-auto max-w-6xl border-t border-[var(--border)] px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="eyebrow">Indexes threat data from</div>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 font-display text-[15px] text-muted-foreground">
            {["Ethereum", "Base", "Arbitrum", "Solana", "Optimism", "Polygon"].map((c) => (
              <span key={c} className="opacity-70 transition hover:opacity-100">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
