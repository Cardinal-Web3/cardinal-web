import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";

function Node({ cx, cy, r = 3, color = "var(--cyan)", delay = 0 }: { cx: number; cy: number; r?: number; color?: string; delay?: number }) {
  return (
    <g style={{ transformOrigin: `${cx}px ${cy}px` }}>
      <circle cx={cx} cy={cy} r={r * 4} fill={color} opacity="0.12">
        <animate attributeName="r" values={`${r * 2};${r * 5};${r * 2}`} dur="3s" repeatCount="indefinite" begin={`${delay}s`} />
        <animate attributeName="opacity" values="0.2;0;0.2" dur="3s" repeatCount="indefinite" begin={`${delay}s`} />
      </circle>
      <circle cx={cx} cy={cy} r={r} fill={color} />
    </g>
  );
}

export function ThreatMap() {
  const safe = [
    [80, 90], [180, 70], [240, 140], [340, 110], [410, 180], [520, 90],
    [580, 200], [690, 130], [120, 200], [300, 240], [460, 70], [640, 250],
  ];
  const threats = [[220, 220], [500, 240], [620, 80]];
  const lines = [
    [80, 90, 180, 70],
    [180, 70, 340, 110],
    [340, 110, 520, 90],
    [520, 90, 690, 130],
    [120, 200, 300, 240],
    [300, 240, 460, 70],
    [240, 140, 410, 180],
    [410, 180, 580, 200],
    [580, 200, 640, 250],
  ];
  return (
    <section id="intel" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <div className="eyebrow mb-4">Threat intelligence</div>
          <h2 className="font-display text-balance text-[clamp(34px,5vw,60px)] leading-[1] tracking-[-0.03em]">
            Every wallet, every contract,
            <br />
            continuously monitored.
          </h2>
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-muted-foreground">
            Cardinal indexes drainer campaigns, contract upgrades, and
            cross-chain laundering patterns in real time. Findings update every
            scan, everywhere.
          </p>
        </motion.div>

        <div className="surface-card mt-14 grid overflow-hidden md:grid-cols-[1.4fr_1fr]">
          <div className="relative aspect-[8/5] w-full overflow-hidden border-b border-[var(--border)] md:border-b-0 md:border-r">
            <div className="aurora pointer-events-none absolute inset-0 opacity-50" />
            <div className="dot-bg absolute inset-0 opacity-50" />
            <svg viewBox="0 0 760 320" className="relative h-full w-full">
              {lines.map(([x1, y1, x2, y2], i) => (
                <g key={i}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--cyan)" strokeWidth="0.4" opacity="0.35" />
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--cyan)" strokeWidth="0.8" className="animate-dash" opacity="0.6" />
                </g>
              ))}
              {safe.map((p, i) => (
                <Node key={i} cx={p[0]} cy={p[1]} delay={i * 0.3} />
              ))}
              {threats.map((p, i) => (
                <Node key={`t${i}`} cx={p[0]} cy={p[1]} color="var(--red)" r={4} delay={i * 0.7} />
              ))}
            </svg>
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
              <span>cardinal.threatnet · live</span>
              <span className="text-emerald">● 12 regions</span>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 gap-3">
              {[
                ["318k", "Scam wallets indexed", "red"],
                ["8.2M", "Txs monitored / day", "cyan"],
                ["1,184", "Drainer clusters", "amber"],
                ["94", "Partner sources", "emerald"],
              ].map(([v, l, c]) => (
                <div key={l} className="rounded-xl border border-[var(--border)] bg-[oklch(0.17_0.011_250)] p-4">
                  <div className={`font-display text-2xl text-${c}`}>{v}</div>
                  <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                    {l}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-1.5">
              <div className="eyebrow mb-2">Recent threat ingest</div>
              {[
                ["DR-1184", "Drainer cluster · +14 wallets"],
                ["UP-0942", "Proxy upgrade · ownership flagged"],
                ["LA-2210", "Laundering pattern · cross-chain"],
              ].map(([id, t]) => (
                <div key={id} className="flex items-center justify-between rounded-md border border-[var(--border)] bg-[oklch(0.17_0.011_250)] px-3 py-2">
                  <div className="font-mono text-[11.5px] text-muted-foreground">{id}</div>
                  <div className="text-[12.5px] text-foreground/85">{t}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Partners() {
  const items = [
    { tag: "Wallets", title: "Sign with protection on", body: "Embed Cardinal scan in your sign flow. ALLOW/REVIEW/BLOCK in 50ms." },
    { tag: "Exchanges", title: "Withdrawals you can stand behind", body: "SafeSend on outbound flows reduces fraud reversals and support load." },
    { tag: "Marketplaces", title: "Settlement trust, off the shelf", body: "Escrow APIs for digital asset and physical-good marketplaces." },
    { tag: "Payments", title: "Programmable compliance", body: "Routing, screening, and finality controls for fiat-to-crypto rails." },
  ];
  return (
    <section id="partners" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
        >
          <div className="max-w-3xl">
            <div className="eyebrow mb-4">For partners</div>
            <h2 className="font-display text-balance text-[clamp(34px,5vw,60px)] leading-[1] tracking-[-0.03em]">
              Ship transaction protection.
              <br />
              Skip the security org.
            </h2>
          </div>
          <Link
            to="/partners"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-surface-elevated px-4 py-2 text-[13px] transition hover:border-cyan hover:text-cyan"
          >
            Talk to platform team →
          </Link>
        </motion.div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] md:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <motion.div
              key={it.tag}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group relative bg-surface p-7"
            >
              <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-cyan/80">
                {it.tag}
              </div>
              <div className="font-display mt-12 text-[19px] leading-snug tracking-tight">
                {it.title}
              </div>
              <div className="mt-3 text-[13px] text-muted-foreground">{it.body}</div>
              <div className="mt-6 inline-flex items-center gap-1.5 text-[12px] text-foreground/70 transition group-hover:text-cyan">
                Integration guide →
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Pilot() {
  return (
    <section id="pilot" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="surface-card relative overflow-hidden p-10 md:p-14"
        >
          <div className="aurora pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] opacity-40" />
          <div className="relative grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-surface-elevated px-3 py-1 text-[11px]">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-amber shadow-[var(--shadow-glow-amber)]" />
                <span className="font-mono uppercase tracking-[0.18em] text-amber">
                  Controlled pilot
                </span>
              </div>
              <h2 className="font-display mt-6 text-balance text-[clamp(34px,5vw,56px)] leading-[1] tracking-[-0.03em]">
                We'd rather be honest
                <br />
                than oversold.
              </h2>
              <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-muted-foreground">
                SafeSend is in controlled pilot. Today we focus on testing,
                monitoring, and hardening with a small set of partner wallets
                and exchanges before opening broadly.
              </p>
            </div>
            <ul className="space-y-3 text-[14px]">
              {[
                "Daily threat-engine reviews with partners",
                "Caps on transfer size and concurrent vaults",
                "All findings audited end-to-end",
                "Public post-mortems for any incident",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[oklch(0.17_0.011_250)] px-4 py-3">
                  <span className="mt-1.5 inline-flex h-1.5 w-1.5 flex-none rounded-full bg-cyan shadow-[0_0_10px_oklch(0.82_0.13_210)]" />
                  <span className="text-foreground/90">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative mt-10 flex flex-wrap gap-3 border-t border-[var(--border)] pt-8">
            <Link
              to="/pilot"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[13.5px] font-medium text-background transition hover:bg-cyan"
            >
              Request pilot access →
            </Link>
            <Link
              to="/app"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-surface-elevated px-5 py-2.5 text-[13.5px] transition hover:border-cyan hover:text-cyan"
            >
              Try the app
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
