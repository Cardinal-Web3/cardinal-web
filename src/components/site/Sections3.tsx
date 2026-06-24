"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useMemo } from "react";
import { CountUp } from "@/components/motion/CountUp";

type Node = { x: number; y: number; tier: "idle" | "active" | "threat" };

// Round to a fixed precision so SVG coordinates serialize identically on the
// server and client. Math.cos/sin/sqrt may differ by ~1 ULP across JS engines
// (the spec allows implementation-defined precision), which otherwise triggers
// a React hydration mismatch.
const r2 = (v: number) => Math.round(v * 100) / 100;

function generateNodes(seed = 42): Node[] {
  const out: Node[] = [];
  // hot zones: NA(150,140), EU(380,120), SEA(560,170)
  const zones = [
    { cx: 150, cy: 140, r: 130, n: 14 },
    { cx: 380, cy: 120, r: 100, n: 12 },
    { cx: 560, cy: 170, r: 130, n: 12 },
  ];
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  zones.forEach((z) => {
    for (let i = 0; i < z.n; i++) {
      const a = rand() * Math.PI * 2;
      const r = Math.sqrt(rand()) * z.r;
      const tierR = rand();
      const tier: Node["tier"] = tierR > 0.9 ? "threat" : tierR > 0.55 ? "active" : "idle";
      out.push({
        x: r2(Math.max(20, Math.min(740, z.cx + Math.cos(a) * r))),
        y: r2(Math.max(20, Math.min(300, z.cy + Math.sin(a) * r))),
        tier,
      });
    }
  });
  return out;
}

const INGEST_FEED = [
  ["DR-1184", "Drainer cluster · +14 wallets"],
  ["UP-0942", "Proxy upgrade · ownership flagged"],
  ["LA-2210", "Laundering pattern · cross-chain"],
  ["PH-3318", "Phishing kit · 23 domains"],
  ["AP-7741", "Unlimited approval · vault drained"],
  ["BR-0455", "Bridge exploit · funds rerouted"],
];

export function ThreatMap() {
  const nodes = useMemo(() => generateNodes(), []);
  const arcs = useMemo(() => {
    const list: { a: Node; b: Node; delay: number }[] = [];
    for (let i = 0; i < 8; i++) {
      const a = nodes[Math.floor((i * 7) % nodes.length)];
      const b = nodes[Math.floor((i * 13 + 5) % nodes.length)];
      if (a && b) list.push({ a, b, delay: i * 0.6 });
    }
    return list;
  }, [nodes]);

  const feed = INGEST_FEED.slice(0, 3);

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
          <div className="eyebrow mb-4">Security Engine</div>
          <h2 className="font-display text-balance text-[clamp(34px,5vw,60px)] leading-[1] tracking-[-0.03em]">
            Threat intelligence
            <br />
            for every transaction.
          </h2>
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-muted-foreground">
            Cardinal&apos;s Security Engine indexes drainer campaigns, contract
            upgrades, and cross-chain laundering patterns. Findings feed every
            scan before users sign.
          </p>
        </motion.div>

        <div className="surface-card mt-14 grid overflow-hidden md:grid-cols-[1.4fr_1fr]">
          <div className="relative aspect-[8/5] w-full overflow-hidden border-b border-[var(--border)] bg-surface-elevated/45 md:border-b-0 md:border-r">
            <div className="aurora pointer-events-none absolute inset-0 opacity-45" />
            <div className="dot-bg absolute inset-0 opacity-55" />
            <svg viewBox="0 0 760 320" className="relative h-full w-full">
              <defs>
                <radialGradient id="threatGlow">
                  <stop offset="0%" stopColor="var(--red)" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="var(--red)" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="activeGlow">
                  <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0" />
                </radialGradient>
                {/* arc gradient */}
                <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="var(--cyan)" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0.6" />
                </linearGradient>
                {/* glow filter for arcs */}
                <filter id="arcGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* longitude grid */}
              {[0.2, 0.4, 0.6, 0.8].map((t) => (
                <ellipse
                  key={t}
                  cx="380"
                  cy="160"
                  rx={380 * t}
                  ry={150 * t}
                  fill="none"
                  stroke="var(--map-grid)"
                  strokeWidth="0.8"
                  opacity="1"
                />
              ))}

              {/* arcs — cubic bezier with gradient stroke + traveling dot */}
              {arcs.map((arc, i) => {
                const dx = arc.b.x - arc.a.x;
                const dy = arc.b.y - arc.a.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const lift = Math.min(dist * 0.35, 80);
                const cp1x = r2(arc.a.x + dx * 0.3);
                const cp1y = r2(Math.min(arc.a.y, arc.b.y) - lift);
                const cp2x = r2(arc.a.x + dx * 0.7);
                const cp2y = r2(Math.min(arc.a.y, arc.b.y) - lift * 0.8);
                const d = `M ${arc.a.x} ${arc.a.y} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${arc.b.x} ${arc.b.y}`;
                const dur = 3 + (i % 3) * 0.8;
                return (
                  <g key={i}>
                    {/* base arc line */}
                    <path
                      d={d}
                      fill="none"
                      stroke="url(#arcGrad)"
                      strokeWidth="0.8"
                      opacity="0.7"
                    />
                    {/* glow arc */}
                    <path
                      d={d}
                      fill="none"
                      stroke="var(--cyan)"
                      strokeWidth="1.5"
                      opacity="0.08"
                      filter="url(#arcGlow)"
                    />
                    {/* traveling dot */}
                    <circle r="2.5" fill="var(--cyan)" opacity="0.9" filter="url(#arcGlow)">
                      <animateMotion
                        dur={`${dur}s`}
                        repeatCount="indefinite"
                        begin={`${arc.delay}s`}
                        path={d}
                      />
                      <animate attributeName="opacity" values="0;0.9;0.9;0" dur={`${dur}s`} repeatCount="indefinite" begin={`${arc.delay}s`} />
                    </circle>
                  </g>
                );
              })}

              {/* nodes */}
              {nodes.map((n, i) => {
                if (n.tier === "threat") {
                  return (
                    <g key={i}>
                      <circle cx={n.x} cy={n.y} r={14} fill="url(#threatGlow)" />
                      <circle cx={n.x} cy={n.y} r={5} fill="none" stroke="var(--red)" strokeWidth="0.8" opacity="0.6">
                        <animate attributeName="r" values="4;9;4" dur="2s" repeatCount="indefinite" begin={`${i * 0.2}s`} />
                        <animate attributeName="opacity" values="0.7;0;0.7" dur="2s" repeatCount="indefinite" begin={`${i * 0.2}s`} />
                      </circle>
                      <circle cx={n.x} cy={n.y} r={2.6} fill="var(--red)" />
                    </g>
                  );
                }
                if (n.tier === "active") {
                  return (
                    <g key={i}>
                      <circle cx={n.x} cy={n.y} r={8} fill="url(#activeGlow)" />
                      <circle cx={n.x} cy={n.y} r={2} fill="var(--cyan)">
                        <animate attributeName="opacity" values="1;0.5;1" dur="2.4s" repeatCount="indefinite" begin={`${i * 0.15}s`} />
                      </circle>
                    </g>
                  );
                }
                return <circle key={i} cx={n.x} cy={n.y} r={1.4} fill="var(--cyan)" opacity="0.55" />;
              })}
            </svg>

            <div className="font-mono absolute bottom-3 left-4 right-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 text-[10px] uppercase tracking-wider text-muted-foreground sm:text-[10.5px]">
              <span>cardinal.threatnet · live</span>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <span className="flex items-center gap-1.5"><span className="inline-flex h-1.5 w-1.5 rounded-full bg-cyan/70" /> active</span>
                <span className="flex items-center gap-1.5"><span className="inline-flex h-1.5 w-1.5 rounded-full bg-red" /> threat</span>
                <span className="text-emerald">● 12 regions</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 gap-3">
              {[
                { v: 318000, l: "Scam wallets indexed", c: "text-red", f: (n: number) => `${Math.round(n / 1000)}k` },
                { v: 8200000, l: "Txs monitored / day", c: "text-cyan", f: (n: number) => `${(n / 1_000_000).toFixed(1)}M` },
                { v: 1184, l: "Drainer clusters", c: "text-amber" },
                { v: 94, l: "Partner sources", c: "text-emerald" },
              ].map((m) => (
                <div key={m.l} className="rounded-xl border border-[var(--border)] bg-surface p-4">
                  <div className={`font-display text-2xl ${m.c}`}>
                    <CountUp to={m.v} format={m.f} />
                  </div>
                  <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                    {m.l}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <div className="eyebrow mb-2">Recent threat ingest</div>
              <div className="relative space-y-1.5">
                {feed.map(([id, t]) => (
                  <div
                    key={id + t}
                    className="flex items-center justify-between gap-3 rounded-md border border-[var(--border)] bg-surface px-3 py-2"
                  >
                    <div className="font-mono shrink-0 text-[11.5px] text-muted-foreground">{id}</div>
                    <div className="min-w-0 truncate text-right text-[12.5px] text-foreground/85">{t}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Partners() {
  const items = [
    { tag: "Wallets", title: "Scan before sign", icon: "🛡", body: "Verdicts before users move funds." },
    { tag: "Exchanges", title: "Safer withdrawals", icon: "↗", body: "Scan-first outbound protection." },
    { tag: "Marketplaces", title: "Settlement trust", icon: "⚖", body: "Escrow APIs for digital assets." },
    { tag: "OTC desks", title: "Counterparty check", icon: "🔍", body: "Verify before high-value moves." },
    { tag: "DAOs", title: "Treasury guard", icon: "🏛", body: "Screen before multisig executes." },
    { tag: "Custodians", title: "Institutional rails", icon: "🔒", body: "Risk controls on every flow." },
    { tag: "Web3 teams", title: "Ship fast", icon: "⚡", body: "Composable APIs, no security org." },
    { tag: "Payments", title: "Compliance-ready", icon: "✓", body: "Scan fiat-to-crypto payouts." },
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
              A security layer
              <br />
              you can embed.
            </h2>
            <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-muted-foreground">
              Embed Cardinal before users move funds — wallets, exchanges,
              marketplaces, DAOs, and more.
            </p>
          </div>
          <Link
            href="/partners"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-surface-elevated px-4 py-2 text-[13px] transition hover:border-cyan hover:text-cyan"
          >
            Join Pilot →
          </Link>
        </motion.div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <motion.div
              key={it.tag}
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="group relative cursor-pointer bg-surface p-6 transition-colors duration-300 hover:bg-surface-elevated/80"
            >
              {/* hover glow */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="absolute -inset-px rounded-sm bg-gradient-to-b from-cyan/[0.07] to-transparent" />
              </div>

              <div className="relative">
                <div className="mb-4 flex items-center justify-between">
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-cyan/80">
                    {it.tag}
                  </div>
                  <motion.span
                    className="text-lg opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    {it.icon}
                  </motion.span>
                </div>

                <div className="font-display text-[18px] leading-snug tracking-tight transition-colors duration-300 group-hover:text-cyan">
                  {it.title}
                </div>

                <div className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  {it.body}
                </div>

                <div className="mt-5 flex items-center gap-1.5 text-[12px] text-foreground/50 transition-all duration-300 group-hover:gap-2.5 group-hover:text-cyan">
                  <span>Learn more</span>
                  <motion.span
                    className="inline-block"
                    initial={false}
                  >
                    →
                  </motion.span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Pilot() {
  const commitments = [
    "Daily threat-engine reviews",
    "Transfer and vault caps",
    "End-to-end audited findings",
    "Public post-mortems",
  ];

  return (
    <section id="pilot" className="relative px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-amber/30 bg-amber/8 px-3 py-1 text-[11px]">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-amber shadow-[var(--shadow-glow-amber)]" />
            <span className="font-mono uppercase tracking-[0.18em] text-amber">
              Controlled pilot
            </span>
          </div>

          <h2 className="font-display mx-auto mt-6 max-w-xl text-balance text-[clamp(32px,4.5vw,52px)] leading-[1.05] tracking-[-0.03em]">
            Honest over oversold.
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
            SafeSend is in controlled pilot — testing and hardening with
            select partners before opening broadly.
          </p>
        </motion.div>

        {/* commitments row */}
        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
          {commitments.map((t, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="group rounded-xl border border-[var(--border)] bg-surface px-4 py-4 text-center transition-colors duration-300 hover:border-cyan/30"
            >
              <span className="mx-auto mb-2.5 inline-flex h-1.5 w-1.5 rounded-full bg-cyan shadow-[var(--shadow-glow-cyan)] transition-transform duration-300 group-hover:scale-150" />
              <div className="text-[13px] leading-snug text-foreground/85">{t}</div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          <Link
            href="/pilot"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[13.5px] font-medium text-background transition hover:bg-cyan"
          >
            Join Pilot →
          </Link>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-surface-elevated px-5 py-2.5 text-[13.5px] transition hover:border-cyan hover:text-cyan"
          >
            Launch App
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
