"use client";

import { motion } from "motion/react";
import Link from "next/link";

export function SafeSendShowcase() {
  return (
    <section id="safesend" className="relative px-6 py-28">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1fr_1.1fr] md:items-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="eyebrow mb-4">SafeSend</div>
          <h2 className="font-display text-balance text-[clamp(34px,5vw,60px)] leading-[1] tracking-[-0.03em]">
            Scan first.
            <br />
            Settle safely.
          </h2>
          <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-muted-foreground">
            SafeSend protects direct transfers by scanning risk before signing and
            giving users a safer settlement path. SafeSend gives users a second
            chance before funds are gone.
          </p>
          <ul className="mt-7 space-y-3 text-[14px]">
            {[
              "Scan → verdict → SafeSend locks funds",
              "Cancel window from 15 min to 72 h",
              "Recipient sees pending, can't pull early",
              "Cancel triggers full refund minus gas",
            ].map((t, i) => (
              <motion.li
                key={t}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-3"
              >
                <span className="mt-1.5 inline-flex h-1.5 w-1.5 flex-none rounded-full bg-emerald shadow-[0_0_10px_oklch(0.76_0.16_155)]" />
                <span className="text-foreground/85">{t}</span>
              </motion.li>
            ))}
          </ul>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/app/new"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[13.5px] font-medium text-background transition hover:bg-cyan"
            >
              Launch App →
            </Link>
            <Link
              href="/safesend"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-surface-elevated px-5 py-2.5 text-[13.5px] transition hover:border-cyan hover:text-cyan"
            >
              Explore SafeSend
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="surface-card relative overflow-hidden p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="eyebrow">SafeSend · draft</div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald/40 bg-emerald/10 px-2.5 py-1 text-[10.5px] text-emerald">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald shadow-[0_0_8px_oklch(0.76_0.16_155)]" />
              Verdict: Low Risk · Proceed
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {[
              <Field key="recip" label="Recipient">
                <div className="font-mono text-[13.5px] text-foreground">0x7c8b3F2a…6c3b5D9E2a14</div>
                <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                  trusted · 84 prior settlements
                </div>
              </Field>,
              <div key="tok-amt" className="grid grid-cols-2 gap-3">
                <Field label="Token">
                  <div className="text-[14px]">USDC</div>
                </Field>
                <Field label="Amount">
                  <div className="text-[14px]">
                    2,400.00 <span className="text-muted-foreground">USDC</span>
                  </div>
                  <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                    ≈ $2,400.00
                  </div>
                </Field>
              </div>,
              <Field key="delay" label="Delay">
                <div className="flex items-center gap-3">
                  <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-[var(--border)]">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "55%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-cyan to-violet"
                    />
                  </div>
                  <div className="font-mono text-[12px]">24h</div>
                </div>
              </Field>,
              <div key="stats" className="grid grid-cols-3 gap-3">
                <Field label="Gas est.">
                  <div className="font-mono text-[12.5px]">0.0021 ETH</div>
                </Field>
                <Field label="Release">
                  <div className="font-mono text-[12.5px]">tomorrow 14:32</div>
                </Field>
                <Field label="Cancel window">
                  <div className="font-mono text-[12.5px] text-amber">23h 58m</div>
                </Field>
              </div>,
            ].map((field, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {field}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="mt-6 flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-surface-elevated/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="text-[12.5px] text-muted-foreground">
              Status · funds will lock on signature
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-4 py-2 text-[12.5px] font-medium text-background transition-colors hover:bg-cyan sm:w-auto sm:py-1.5"
            >
              Sign & lock
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-surface-elevated/70 px-4 py-3">
      <div className="eyebrow mb-1.5">{label}</div>
      {children}
    </div>
  );
}

export function Escrow() {
  const steps = [
    ["Buyer", "Funds deposited & locked"],
    ["Escrow", "Held by Cardinal vault"],
    ["Deliver", "Seller meets agreed terms"],
    ["Release", "Funds released to seller"],
  ];
  return (
    <section id="escrow" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-[1fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="eyebrow mb-4">Escrow · roadmap</div>
            <h2 className="font-display text-balance text-[clamp(34px,5vw,60px)] leading-[1] tracking-[-0.03em]">
              Trust without
              <br />
              blind faith.
            </h2>
            <p className="mt-5 max-w-md text-[16px] leading-relaxed text-muted-foreground">
              Cardinal Escrow holds funds in a smart contract until both sides meet
              the agreed terms. Escrow makes sure nobody has to trust blindly.
              Buyer deposits, funds stay held, seller delivers, release on verify.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="surface-card overflow-hidden p-6"
          >
            <div className="relative grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-3">
              {steps.map(([t, d], i) => (
                <div key={t} className="relative z-10 text-center">
                  {/* connector line to next step — desktop horizontal layout only */}
                  {i < steps.length - 1 && (
                    <div className="absolute left-[calc(50%+24px)] right-[calc(-50%+24px)] top-5 z-0 hidden h-px bg-[var(--border-strong)] sm:block">
                      <div className="h-full w-full bg-gradient-to-r from-cyan/50 to-cyan/20" />
                    </div>
                  )}
                  <div className="relative mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-strong)] bg-surface font-mono text-[12px] text-cyan">
                    0{i + 1}
                  </div>
                  <div className="mt-3 text-[13px] font-medium">{t}</div>
                  <div className="mt-1 text-[11px] text-muted-foreground">{d}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">
              {[
                ["$48M", "Projected in-flight"],
                ["12,408", "Target vault capacity"],
                ["0.012%", "Design dispute rate"],
              ].map(([v, l]) => (
                <div key={l} className="rounded-xl border border-[var(--border)] bg-surface-elevated/70 p-3">
                  <div className="font-display text-lg">{v}</div>
                  <div className="mt-1 text-[10.5px] uppercase tracking-wider text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
            <p className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground/70">
              Roadmap demo figures · not live escrow
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
