import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";

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
            A transfer
            <br />
            you can take back.
          </h2>
          <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-muted-foreground">
            SafeSend locks funds the moment you sign and releases them on a delay
            you control. If something looks wrong — a spoofed address, a drained
            wallet, a wrong network — cancel before settlement.
          </p>
          <ul className="mt-7 space-y-3 text-[14px]">
            {[
              "Locked → delayed release → on-chain settlement",
              "Configurable cancel window from 15 min to 72 h",
              "Recipient sees pending balance, cannot pull early",
              "Cancel triggers full refund minus base gas",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span className="mt-1.5 inline-flex h-1.5 w-1.5 flex-none rounded-full bg-emerald shadow-[0_0_10px_oklch(0.76_0.16_155)]" />
                <span className="text-foreground/85">{t}</span>
              </li>
            ))}
          </ul>
          <div className="mt-9 flex gap-3">
            <Link
              to="/app/new"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[13.5px] font-medium text-background transition hover:bg-cyan"
            >
              Create SafeSend →
            </Link>
            <Link
              to="/safesend"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-surface-elevated px-5 py-2.5 text-[13.5px] transition hover:border-cyan hover:text-cyan"
            >
              Read the docs
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
          <div className="flex items-center justify-between">
            <div className="eyebrow">SafeSend · draft</div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald/40 bg-emerald/10 px-2.5 py-1 text-[10.5px] text-emerald">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald shadow-[0_0_8px_oklch(0.76_0.16_155)]" />
              Verdict: Allow
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <Field label="Recipient">
              <div className="font-mono text-[13.5px] text-foreground">0x7c8b3F2a…6c3b5D9E2a14</div>
              <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                trusted · 84 prior settlements
              </div>
            </Field>
            <div className="grid grid-cols-2 gap-3">
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
            </div>

            <Field label="Delay">
              <div className="flex items-center gap-3">
                <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-[var(--border)]">
                  <div className="h-full w-[55%] rounded-full bg-gradient-to-r from-cyan to-violet" />
                </div>
                <div className="font-mono text-[12px]">24h</div>
              </div>
            </Field>

            <div className="grid grid-cols-3 gap-3">
              <Field label="Gas est.">
                <div className="font-mono text-[12.5px]">0.0021 ETH</div>
              </Field>
              <Field label="Release">
                <div className="font-mono text-[12.5px]">tomorrow 14:32</div>
              </Field>
              <Field label="Cancel window">
                <div className="font-mono text-[12.5px] text-amber">23h 58m</div>
              </Field>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between rounded-xl border border-[var(--border)] bg-[oklch(0.17_0.011_250)] px-4 py-3">
            <div className="text-[12.5px] text-muted-foreground">
              Status · funds will lock on signature
            </div>
            <button className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-1.5 text-[12.5px] font-medium text-background">
              Sign & lock
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[oklch(0.17_0.011_250)] px-4 py-3">
      <div className="eyebrow mb-1.5">{label}</div>
      {children}
    </div>
  );
}

export function Escrow() {
  const steps = [
    ["Buyer", "Funds deposited & locked"],
    ["Escrow", "Held by Cardinal vault"],
    ["Verify", "Conditions confirmed on-chain"],
    ["Settle", "Released to seller"],
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
            <div className="eyebrow mb-4">Escrow infrastructure</div>
            <h2 className="font-display text-balance text-[clamp(34px,5vw,60px)] leading-[1] tracking-[-0.03em]">
              Marketplace-grade
              <br />
              settlement trust.
            </h2>
            <p className="mt-5 max-w-md text-[16px] leading-relaxed text-muted-foreground">
              Buyer funds are vaulted on Cardinal. Sellers see committed
              balances. Funds release only when conditions verify on-chain.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="surface-card overflow-hidden p-6"
          >
            <div className="relative grid grid-cols-4 gap-3">
              <svg className="pointer-events-none absolute inset-0" preserveAspectRatio="none" viewBox="0 0 100 10">
                <line x1="0" y1="5" x2="100" y2="5" stroke="var(--border-strong)" strokeWidth="0.4" />
                <line x1="0" y1="5" x2="100" y2="5" stroke="var(--cyan)" strokeWidth="0.5" className="animate-dash" />
              </svg>
              {steps.map(([t, d], i) => (
                <div key={t} className="relative z-10 text-center">
                  <div className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-strong)] bg-surface font-mono text-[12px] text-cyan">
                    0{i + 1}
                  </div>
                  <div className="mt-3 text-[13px] font-medium">{t}</div>
                  <div className="mt-1 text-[11px] text-muted-foreground">{d}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                ["$48M", "In-flight escrow"],
                ["12,408", "Active vaults"],
                ["0.012%", "Dispute rate"],
              ].map(([v, l]) => (
                <div key={l} className="rounded-xl border border-[var(--border)] bg-[oklch(0.17_0.011_250)] p-3">
                  <div className="font-display text-lg">{v}</div>
                  <div className="mt-1 text-[10.5px] uppercase tracking-wider text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
