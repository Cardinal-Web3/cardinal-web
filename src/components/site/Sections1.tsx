import { motion } from "motion/react";
import { GlassPanel } from "./GlassPanel";

export function Problem() {
  const risks = [
    "Malicious unlimited approvals",
    "Lookalike address spoofing",
    "Wrong network bridging",
    "Replayable off-chain permits",
  ];
  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="flex items-end justify-between gap-6"
        >
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            01 / The Threat Surface
          </div>
          <div className="hidden h-px flex-1 bg-[var(--border)] md:block" />
        </motion.div>

        <div className="mt-12 grid items-center gap-12 md:grid-cols-[1.3fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="wordmark-giant text-foreground/95 [text-shadow:0_0_60px_oklch(0.67_0.22_25/0.18)]">
              $3.8B
            </div>
            <div className="mt-4 max-w-md font-mono text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
              lost in the last 24 months to <span className="text-red">preventable</span> on-chain settlement errors.
            </div>
          </motion.div>

          <GlassPanel tilt="right" className="md:translate-y-6">
            <div className="p-7">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
                wallet // unprotected
              </div>
              <div className="mt-5 space-y-3">
                {risks.map((r, i) => (
                  <motion.div
                    key={r}
                    initial={{ opacity: 0, x: 8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    className="flex items-center gap-3 border-b border-[var(--glass-stroke)] pb-3 last:border-b-0 last:pb-0"
                  >
                    <span className="inline-flex h-1 w-1 flex-none rounded-full bg-red shadow-[0_0_10px_oklch(0.67_0.22_25)]" />
                    <span className="text-[14px] text-foreground/90">{r}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 border-t border-[var(--glass-stroke)] pt-4 font-mono text-[10.5px] uppercase tracking-[0.22em] text-red/80">
                outcome // irreversible
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </section>
  );
}

import { TIE } from "./TIE";

const SIGNALS = [
  { n: "01", label: "Wallet Reputation", desc: "Drainer clusters, sanction lists, behavioral fingerprints." },
  { n: "02", label: "Recipient History", desc: "First-seen, settlement history, counterparty trust." },
  { n: "03", label: "Network Validation", desc: "Chain id, bridge integrity, replay surface." },
  { n: "04", label: "Contract Analysis", desc: "Calldata decode, approval scope, proxy ownership." },
  { n: "05", label: "Transaction Simulation", desc: "Net balance delta, gas anomalies, side effects." },
];

export function InterceptionEngine() {
  return (
    <section id="engine" className="relative px-6 py-32">
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
        >
          02 / Transaction Interception Engine
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="wordmark-display mt-6 max-w-5xl text-balance"
        >
          Five signal classes.
          <br />
          <span className="text-lime">One verdict.</span>
        </motion.h2>

        <div className="mt-16 grid items-center gap-10 md:grid-cols-[1fr_1.1fr]">
          <div className="space-y-3">
            {SIGNALS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group flex items-start gap-5 border-b border-[var(--border)] pb-4"
              >
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-lime/80">
                  {s.n}
                </div>
                <div className="flex-1">
                  <div className="font-display text-[20px] tracking-tight text-foreground">
                    {s.label}
                  </div>
                  <div className="mt-1 text-[13px] text-muted-foreground">{s.desc}</div>
                </div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  ok
                </div>
              </motion.div>
            ))}
            <div className="pt-2 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              p50 fusion latency · <span className="text-lime">76ms</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel overflow-hidden"
          >
            <TIE compact />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
