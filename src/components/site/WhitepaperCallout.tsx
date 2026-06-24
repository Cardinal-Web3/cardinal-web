"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { DownloadWhitepaperButton } from "@/components/ui/download-whitepaper-button";

const PDF_HREF = "/Cardinal_Escrow_Investor_Deck_2026.pdf";
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const highlights = [
  ["Market & opportunity", "$24B+ lost to scams, 560M+ users, zero native protection"],
  ["Security engine", "Five-layer risk model: allow, review, or block"],
  ["Revenue model", "Escrow fees, enterprise APIs, and white-label licensing"],
  ["The moat", "Only stack combining escrow, threat intel, and simulation"],
] as const;

const contents = [
  "The Problem",
  "The Solution",
  "How It Works",
  "Security Engine",
  "Market & Opportunity",
  "Revenue Model",
] as const;

export function WhitepaperCallout() {
  return (
    <section id="whitepaper" className="relative overflow-hidden px-6 py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[300px] w-full max-w-[680px] rounded-full bg-violet/[0.05] blur-[120px]" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.05fr_1fr] md:items-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: EASE_OUT }}
        >
          <div className="eyebrow mb-4">Investor whitepaper</div>
          <h2 className="font-display text-balance text-[clamp(32px,4.6vw,54px)] leading-[1.02] tracking-[-0.03em]">
            The full thesis,
            <br />
            <span className="text-brand">in one document.</span>
          </h2>
          <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-muted-foreground">
            Security-first escrow infrastructure — the market, the engine, the business model, and
            why Cardinal wins. Read it online or download the complete investor deck.
          </p>

          <ul className="mt-8 space-y-4">
            {highlights.map(([title, line], i) => (
              <motion.li
                key={title}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.2 + i * 0.08, ease: EASE_OUT }}
                className="flex items-start gap-3"
              >
                <span className="mt-1.5 inline-flex h-1.5 w-1.5 flex-none rounded-full bg-cyan shadow-[0_0_10px_oklch(0.82_0.13_210)]" />
                <span className="text-[14px] leading-snug">
                  <span className="font-medium text-foreground/90">{title}</span>
                  <span className="text-muted-foreground"> — {line}</span>
                </span>
              </motion.li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/whitepaper"
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[13.5px] font-medium text-background transition hover:bg-cyan"
            >
              Read the whitepaper
              <span className="transition-transform duration-200 ease-out group-hover:translate-x-0.5">
                →
              </span>
            </Link>
            <DownloadWhitepaperButton href={PDF_HREF} tone="light" className="!w-auto" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
          className="surface-card relative overflow-hidden p-6 shadow-[var(--shadow-3d)] sm:p-8"
        >
          <div className="dot-bg pointer-events-none absolute inset-0 opacity-[0.18]" />
          <div className="aurora pointer-events-none absolute -right-16 -top-16 h-48 w-48 opacity-25" />
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan/70 to-transparent" />

          <div className="relative">
            <div className="flex items-center justify-between gap-3">
              <div className="eyebrow">Cardinal · Investor deck 2026</div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan/30 bg-cyan/10 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-cyan">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_10px_oklch(0.82_0.13_210)]" />
                PDF
              </span>
            </div>

            <h3 className="mt-5 font-display text-[clamp(24px,4vw,34px)] leading-[0.98] tracking-[-0.03em]">
              Cardinal Escrow
              <br />
              Protocol
            </h3>
            <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">
              Protect every transaction before value moves.
            </p>

            <div className="mt-6 space-y-2">
              {contents.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.25 + i * 0.06, ease: EASE_OUT }}
                  className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-surface-elevated/60 px-3.5 py-2.5"
                >
                  <span className="font-mono text-[10px] tabular-nums text-cyan/80">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[12.5px] text-foreground/85">{item}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-4 text-[11px] text-muted-foreground">
              <span>8 sections · ~615 KB</span>
              <Link href="/whitepaper" className="font-medium text-cyan hover:underline">
                Open online ↗
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
