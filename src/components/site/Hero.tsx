import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { TIE } from "./TIE";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 md:pt-36">
      <div className="grid-bg pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] opacity-50" />

      <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-6 pb-20 md:grid-cols-[1fr_1.05fr] md:gap-16 md:pb-28">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-surface/40 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.22em] backdrop-blur"
          >
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping-ring rounded-full bg-lime/60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-lime" />
            </span>
            <span className="text-muted-foreground">v0.4 · pilot · live</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="wordmark-display mt-7 text-balance"
          >
            Intercept the
            <br />
            transaction.
            <br />
            <span className="text-lime">Before it signs.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-7 max-w-md text-[15px] leading-relaxed text-muted-foreground"
          >
            Cardinal is the security operating system for blockchain
            transactions. We scan, route, and quarantine — before a single
            signature touches the chain.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Link
              to="/app"
              className="group inline-flex items-center gap-2 rounded-md bg-lime px-5 py-3 font-mono text-[11.5px] uppercase tracking-[0.18em] text-background transition hover:opacity-90"
            >
              Launch App →
            </Link>
            <a
              href="#engine"
              className="inline-flex items-center gap-2 rounded-md border border-[var(--border-strong)] bg-surface/40 px-5 py-3 font-mono text-[11.5px] uppercase tracking-[0.18em] text-foreground backdrop-blur transition hover:border-lime hover:text-lime"
            >
              See the Engine
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
        >
          <TIE />
        </motion.div>
      </div>
    </section>
  );
}
