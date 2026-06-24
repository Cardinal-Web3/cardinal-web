import { motion } from "motion/react";
import { SIGNAL_LABELS, type SignalKey } from "@/lib/mock-scan";

/** Presentational layer names — maps signal keys to the 5-layer architecture story. */
const LAYER_LABELS: Record<SignalKey, string> = {
  wallet_reputation: "Wallet Intelligence",
  recipient_history: "Risk Engine",
  network_validation: "Settlement Protection",
  contract_analysis: "Contract Intelligence",
  simulation: "Transaction Simulation",
};

function Sparkline({ color = "var(--cyan)" }: { color?: string }) {
  const pts = [4, 8, 6, 10, 7, 12, 9, 14, 11, 18, 13, 22, 16, 24, 19, 28, 22, 30];
  const max = Math.max(...pts);
  const d = pts
    .map((y, i) => `${i === 0 ? "M" : "L"} ${(i / (pts.length - 1)) * 100} ${30 - (y / max) * 28}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 30" className="h-10 w-full" preserveAspectRatio="none">
      <path d={d} fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <path
        d={`${d} L 100 30 L 0 30 Z`}
        fill={color}
        opacity="0.12"
      />
    </svg>
  );
}

const FEED = [
  { t: "00:00:12", sig: "wallet_reputation", txt: "0x7c8b…2a14 ✓ trusted (84 prior settlements)", lvl: "ok" },
  { t: "00:00:14", sig: "contract_analysis", txt: "calldata decode: transfer(USDC, 2400)", lvl: "ok" },
  { t: "00:00:18", sig: "recipient_history", txt: "first interaction · age 2.1y · 1,204 txs", lvl: "info" },
  { t: "00:00:21", sig: "simulation", txt: "balance Δ matches intent · gas 0.0021 ETH", lvl: "ok" },
  { t: "00:00:24", sig: "wallet_reputation", txt: "0xDe4d…ffee ✗ flagged drainer cluster #DR-1184", lvl: "block" },
  { t: "00:00:26", sig: "network_validation", txt: "chain id mismatch · expected 1, got 42161", lvl: "warn" },
];

export function ProtectionEngine() {
  return (
    <section id="engine" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <div className="eyebrow mb-4">Cardinal Protection Engine</div>
          <h2 className="font-display text-balance text-[clamp(34px,5vw,60px)] leading-[1] tracking-[-0.03em]">
            Five protection layers.
            <br />
            One risk verdict.
          </h2>
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-muted-foreground">
            Wallet intelligence, contract analysis, transaction simulation, risk
            engine decisioning, and settlement protection — fused into a single
            verdict, with every finding traceable to its source.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="surface-card mt-14 grid overflow-hidden md:grid-cols-[260px_1fr_360px]"
        >
          {/* left rail */}
          <div className="border-b border-[var(--border)] p-5 md:border-b-0 md:border-r">
            <div className="eyebrow mb-3">Protection layers</div>
            <ul className="space-y-1">
              {(Object.keys(SIGNAL_LABELS) as SignalKey[]).map((s, i) => (
                <li
                  key={s}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-[13px] transition ${
                    i === 0 ? "bg-[oklch(0.22_0.014_250)] text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`inline-flex h-1.5 w-1.5 rounded-full ${
                        i === 0 ? "bg-cyan shadow-[0_0_8px_oklch(0.82_0.13_210)]" : "bg-[var(--border-strong)]"
                      }`}
                    />
                    {LAYER_LABELS[s]}
                  </span>
                  <span className="font-mono text-[10.5px] uppercase tracking-wider">
                    {["12ms", "08ms", "04ms", "21ms", "31ms"][i]}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-xl border border-[var(--border)] bg-surface-elevated/70 p-4">
              <div className="eyebrow mb-2">Latency budget</div>
              <div className="font-display text-2xl">76 ms</div>
              <div className="mt-2 text-[11.5px] text-muted-foreground">
                p50 across signal fusion
              </div>
            </div>
          </div>

          {/* center risk */}
          <div className="border-b border-[var(--border)] p-6 md:border-b-0 md:border-r">
            <div className="flex items-center justify-between">
              <div className="eyebrow">Live risk surface</div>
              <div className="font-mono text-[11px] text-emerald">● streaming</div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
              {[
                ["94", "Low risk rate", "text-emerald"],
                ["5.1", "Review rate", "text-amber"],
                ["0.9", "Critical rate", "text-red"],
              ].map(([v, l, c]) => (
                <div key={l} className="rounded-xl border border-[var(--border)] bg-surface-elevated/70 p-2.5 sm:p-3">
                  <div className={`font-display text-lg sm:text-xl ${c}`}>{v}%</div>
                  <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground sm:text-[10.5px]">{l}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl border border-[var(--border)] bg-surface-elevated/70 p-4">
              <div className="flex items-center justify-between">
                <div className="eyebrow">Throughput · last 60m</div>
                <div className="font-mono text-[11px] text-foreground">12,408 tx/s</div>
              </div>
              <div className="mt-2"><Sparkline /></div>
            </div>
            <div className="mt-3 grid grid-cols-7 gap-1.5">
              {Array.from({ length: 28 }).map((_, i) => {
                const lvl = (i * 37) % 100;
                const bg = lvl > 85 ? "bg-red/70" : lvl > 60 ? "bg-amber/60" : lvl > 30 ? "bg-cyan/50" : "bg-[var(--border-strong)]";
                return <div key={i} className={`h-6 rounded ${bg}`} />;
              })}
            </div>
          </div>

          {/* right feed */}
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div className="eyebrow">Findings feed</div>
              <div className="font-mono text-[11px] text-muted-foreground">tail -f</div>
            </div>
            <div className="mt-3 space-y-1.5">
              {FEED.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 6 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="rounded-md border border-[var(--border)] bg-surface-elevated/70 px-3 py-2"
                >
                  <div className="flex items-center justify-between font-mono text-[10.5px] text-muted-foreground">
                    <span>{f.t}</span>
                    <span
                      className={
                        f.lvl === "block"
                          ? "text-red"
                          : f.lvl === "warn"
                          ? "text-amber"
                          : f.lvl === "info"
                          ? "text-cyan"
                          : "text-emerald"
                      }
                    >
                      {f.lvl}
                    </span>
                  </div>
                  <div className="mt-1 font-mono text-[12px] text-foreground/90 break-words [overflow-wrap:anywhere]">
                    {f.txt}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
