import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { SIGNAL_LABELS, type SignalKey, type Verdict } from "@/lib/mock-scan";

const SEQUENCE: { verdict: Verdict; recipient: string; amount: string; token: string }[] = [
  { verdict: "ALLOW", recipient: "0x7c8b…2a14", amount: "2,400.00", token: "USDC" },
  { verdict: "REVIEW", recipient: "0xA1b2…aBcD", amount: "0.85", token: "ETH" },
  { verdict: "BLOCK", recipient: "0xDe4d…ffee", amount: "12,000.00", token: "USDC" },
];

const SIGNALS: SignalKey[] = [
  "wallet_reputation",
  "recipient_history",
  "network_validation",
  "contract_analysis",
  "simulation",
];

const VERDICT_STYLE: Record<Verdict, { ring: string; text: string; glow: string; label: string }> = {
  ALLOW: { ring: "border-emerald", text: "text-emerald", glow: "shadow-[var(--shadow-glow-emerald)]", label: "Safe to sign" },
  REVIEW: { ring: "border-amber", text: "text-amber", glow: "shadow-[var(--shadow-glow-amber)]", label: "Review required" },
  BLOCK: { ring: "border-red", text: "text-red", glow: "shadow-[var(--shadow-glow-red)]", label: "Do not sign" },
};

export function HeroScan() {
  const [step, setStep] = useState(0);
  const [seqIdx, setSeqIdx] = useState(0);
  const tx = SEQUENCE[seqIdx];

  useEffect(() => {
    const timings = [600, 700, 700, 700, 700, 700, 1800];
    let i = 0;
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      setStep(i);
      if (i >= timings.length) {
        i = 0;
        setSeqIdx((s) => (s + 1) % SEQUENCE.length);
        t = setTimeout(tick, 400);
        return;
      }
      t = setTimeout(() => {
        i += 1;
        tick();
      }, timings[i]);
    };
    tick();
    return () => clearTimeout(t);
  }, []);

  const v = VERDICT_STYLE[tx.verdict];

  return (
    <div className="relative aspect-[5/6] w-full overflow-hidden rounded-[28px] border border-[var(--border)] bg-[oklch(0.155_0.011_250)] md:aspect-[4/5]">
      {/* aurora bg */}
      <div className="aurora pointer-events-none absolute -inset-20 opacity-70" />
      <div className="dot-bg pointer-events-none absolute inset-0 opacity-60" />
      {/* scan line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full overflow-hidden">
        <div className="animate-scan h-px w-full bg-[linear-gradient(90deg,transparent,oklch(0.82_0.13_210/0.9),transparent)]" />
      </div>

      {/* top tx bar */}
      <div className="relative z-10 flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[oklch(0.16_0.011_250/0.6)] px-5 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inset-0 animate-ping-ring rounded-full bg-cyan/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            cardinal.scan
          </span>
        </div>
        <span className="font-mono text-[11px] text-muted-foreground">
          tx_{Math.abs(tx.recipient.charCodeAt(4) * 991).toString(16).slice(0, 8)}
        </span>
      </div>

      {/* tx summary */}
      <div className="relative z-10 px-6 pt-6">
        <div className="eyebrow mb-2">Incoming transaction</div>
        <div className="flex items-baseline justify-between">
          <div>
            <div className="font-display text-3xl">
              {tx.amount} <span className="text-muted-foreground">{tx.token}</span>
            </div>
            <div className="mt-1 font-mono text-[12px] text-muted-foreground">
              → {tx.recipient}
            </div>
          </div>
        </div>
      </div>

      {/* signal pipeline */}
      <div className="relative z-10 mt-6 space-y-1.5 px-6">
        {SIGNALS.map((s, idx) => {
          const active = step > idx;
          const scanning = step === idx + 1;
          return (
            <div
              key={s}
              className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[oklch(0.18_0.012_250/0.6)] px-3 py-2"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`inline-flex h-1.5 w-1.5 rounded-full transition ${
                    active ? "bg-cyan shadow-[0_0_10px_oklch(0.82_0.13_210)]" : "bg-[var(--border-strong)]"
                  }`}
                />
                <span className="text-[12.5px] text-foreground/85">{SIGNAL_LABELS[s]}</span>
              </div>
              <span className="font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
                {active ? "ok" : scanning ? "scan…" : "idle"}
              </span>
            </div>
          );
        })}
      </div>

      {/* verdict */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-6">
        <AnimatePresence mode="wait">
          {step >= 6 && (
            <motion.div
              key={tx.verdict + seqIdx}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={`relative overflow-hidden rounded-2xl border ${v.ring} bg-[oklch(0.17_0.012_250)] p-4 ${v.glow}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="eyebrow mb-1">Cardinal verdict</div>
                  <div className={`font-display text-2xl ${v.text}`}>{tx.verdict}</div>
                  <div className="mt-0.5 text-[12.5px] text-muted-foreground">
                    {v.label}
                  </div>
                </div>
                <div className={`font-mono text-[11px] uppercase tracking-wider ${v.text}`}>
                  {tx.verdict === "ALLOW"
                    ? "Protected settlement queued"
                    : tx.verdict === "REVIEW"
                    ? "Awaiting confirmation"
                    : "Funds held · do not sign"}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
