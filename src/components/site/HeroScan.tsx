import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { SIGNAL_LABELS, type SignalKey, type Verdict } from "@/lib/mock-scan";
import { useTilt } from "@/hooks/use-tilt";

const SEQUENCE: { verdict: Verdict; recipient: string; amount: string; token: string; score: number }[] = [
  { verdict: "ALLOW", recipient: "0x7c8b…2a14", amount: "2,400.00", token: "USDC", score: 94 },
  { verdict: "REVIEW", recipient: "0xA1b2…aBcD", amount: "0.85", token: "ETH", score: 58 },
  { verdict: "BLOCK", recipient: "0xDe4d…ffee", amount: "12,000.00", token: "USDC", score: 12 },
];

const SIGNALS: SignalKey[] = [
  "wallet_reputation",
  "recipient_history",
  "network_validation",
  "contract_analysis",
  "simulation",
];

const VERDICT_STYLE: Record<Verdict, { ring: string; text: string; glow: string; label: string; from: string }> = {
  ALLOW: { ring: "border-emerald/60", text: "text-emerald", glow: "shadow-[var(--shadow-glow-emerald)]", label: "Safe to sign", from: "var(--emerald)" },
  REVIEW: { ring: "border-amber/60", text: "text-amber", glow: "shadow-[var(--shadow-glow-amber)]", label: "Review required", from: "var(--amber)" },
  BLOCK: { ring: "border-red/60", text: "text-red", glow: "shadow-[var(--shadow-glow-red)]", label: "Do not sign", from: "var(--red)" },
};

export function HeroScan() {
  const [step, setStep] = useState(0);
  const [seqIdx, setSeqIdx] = useState(0);
  const [scoreDisplay, setScoreDisplay] = useState(0);
  const tx = SEQUENCE[seqIdx];
  const tilt = useTilt(8);

  useEffect(() => {
    const timings = [600, 700, 700, 700, 700, 700, 2200];
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

  // animate the score number when verdict shows
  useEffect(() => {
    if (step < 6) {
      setScoreDisplay(0);
      return;
    }
    const start = performance.now();
    const dur = 900;
    const target = tx.score;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setScoreDisplay(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [step, tx.score]);

  const v = VERDICT_STYLE[tx.verdict];

  return (
    <div
      className="relative"
      style={{ perspective: "1400px" }}
      onMouseMove={tilt.onMove}
      onMouseLeave={tilt.onLeave}
    >
      {/* depth planes */}
      <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[32px] bg-[var(--surface-elevated)] opacity-30 blur-2xl" />
      <div className="pointer-events-none absolute -inset-8 -z-20 rounded-[36px] bg-[var(--violet)] opacity-15 blur-3xl" />

      {/* floating side glyphs */}
      <motion.div
        className="font-mono pointer-events-none absolute -left-3 top-12 z-20 hidden rounded-md border border-[var(--border-strong)] bg-surface-elevated px-2.5 py-1 text-[10px] text-muted-foreground shadow-lg md:block"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        ETH · MAINNET
      </motion.div>
      <motion.div
        className="font-mono pointer-events-none absolute -right-2 bottom-32 z-20 hidden rounded-md border border-cyan/40 bg-surface-elevated px-2.5 py-1 text-[10px] text-cyan shadow-[var(--shadow-glow-cyan)] md:block"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        12ms · verdict
      </motion.div>

      <motion.div
        style={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative aspect-[5/6] w-full overflow-hidden rounded-[28px] border border-[var(--border-strong)] bg-surface md:aspect-[4/5]"
      >
        {/* animated border beam */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]">
          <div className="animate-beam absolute -inset-[100%] bg-[conic-gradient(from_0deg,transparent_0deg,var(--cyan)_25deg,transparent_60deg,transparent_180deg,var(--violet)_205deg,transparent_240deg)] opacity-40" />
          <div className="absolute inset-[1px] rounded-[27px] bg-surface" />
        </div>

        {/* aurora bg */}
        <div className="aurora pointer-events-none absolute -inset-20 opacity-70" />
        <div className="dot-bg pointer-events-none absolute inset-0 opacity-60" />

        {/* scan line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-full overflow-hidden">
          <div className="animate-scan h-px w-full bg-[linear-gradient(90deg,transparent,var(--cyan),transparent)] opacity-70" />
        </div>

        {/* top tx bar */}
        <div className="relative z-10 flex items-center justify-between gap-3 border-b border-[var(--border)] bg-background/40 px-5 py-3 backdrop-blur">
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
              <div className="font-mono mt-1 text-[12px] text-muted-foreground">
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
              <motion.div
                key={s}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="relative flex items-center justify-between overflow-hidden rounded-lg border border-[var(--border)] bg-background/40 px-3 py-2"
              >
                {active && (
                  <motion.span
                    layoutId={`bar-${s}`}
                    className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-cyan to-violet"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    style={{ transformOrigin: "top" }}
                  />
                )}
                {scanning && (
                  <motion.span
                    className="absolute inset-y-0 left-0 w-full bg-[linear-gradient(90deg,transparent,var(--cyan),transparent)] opacity-30"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                  />
                )}
                <div className="relative flex items-center gap-2.5">
                  <span
                    className={`inline-flex h-1.5 w-1.5 rounded-full transition ${
                      active ? "bg-cyan shadow-[var(--shadow-glow-cyan)]" : "bg-[var(--border-strong)]"
                    }`}
                  />
                  <span className="text-[12.5px] text-foreground/90">{SIGNAL_LABELS[s]}</span>
                </div>
                <span className="font-mono relative text-[10.5px] uppercase tracking-wider text-muted-foreground">
                  {active ? "ok" : scanning ? "scan…" : "idle"}
                </span>
              </motion.div>
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
                className={`relative overflow-hidden rounded-2xl border ${v.ring} bg-background/70 p-4 backdrop-blur ${v.glow}`}
              >
                {/* aura ring */}
                <svg className="pointer-events-none absolute -right-6 -top-6 h-32 w-32" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke={v.from} strokeWidth="1" opacity="0.3" />
                  <motion.circle
                    cx="50" cy="50" r="40" fill="none" stroke={v.from} strokeWidth="2"
                    strokeDasharray="251" strokeDashoffset="251"
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 1.4, ease: "easeOut" }}
                  />
                </svg>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="eyebrow mb-1">Cardinal verdict</div>
                    <div className={`font-display flex items-baseline gap-2 text-2xl ${v.text}`}>
                      {tx.verdict}
                      <span className="font-mono text-xs text-muted-foreground">
                        {scoreDisplay}/100
                      </span>
                    </div>
                    <div className="mt-0.5 text-[12.5px] text-muted-foreground">
                      {v.label}
                    </div>
                  </div>
                  <div className={`font-mono text-[11px] uppercase tracking-wider ${v.text}`}>
                    {tx.verdict === "ALLOW"
                      ? "Settle"
                      : tx.verdict === "REVIEW"
                      ? "Hold"
                      : "Block"}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
