import { motion, AnimatePresence } from "motion/react";
import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CountUp } from "@/components/motion/CountUp";

type Node = { x: number; y: number; tier: "idle" | "active" | "threat" };

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
        x: Math.max(20, Math.min(740, z.cx + Math.cos(a) * r)),
        y: Math.max(20, Math.min(300, z.cy + Math.sin(a) * r)),
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

  const [feed, setFeed] = useState(INGEST_FEED.slice(0, 3));
  useEffect(() => {
    let i = 3;
    const t = setInterval(() => {
      const next = INGEST_FEED[i % INGEST_FEED.length];
      setFeed((cur) => [next, ...cur].slice(0, 3));
      i++;
    }, 3200);
    return () => clearInterval(t);
  }, []);

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
            <div className="aurora pointer-events-none absolute inset-0 opacity-60" />
            <div className="dot-bg absolute inset-0 opacity-40" />
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
                  stroke="var(--cyan)"
                  strokeWidth="0.3"
                  opacity="0.18"
                />
              ))}

              {/* arcs */}
              {arcs.map((arc, i) => {
                const mx = (arc.a.x + arc.b.x) / 2;
                const my = Math.min(arc.a.y, arc.b.y) - 30;
                const d = `M ${arc.a.x} ${arc.a.y} Q ${mx} ${my} ${arc.b.x} ${arc.b.y}`;
                return (
                  <g key={i}>
                    <path d={d} fill="none" stroke="var(--cyan)" strokeWidth="0.4" opacity="0.3" />
                    <path
                      d={d}
                      fill="none"
                      stroke="var(--cyan)"
                      strokeWidth="1"
                      strokeDasharray="3 200"
                      opacity="0.9"
                      style={{
                        animation: `dash 4s linear ${arc.delay}s infinite`,
                      }}
                    />
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

            <div className="font-mono absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10.5px] uppercase tracking-wider text-muted-foreground">
              <span>cardinal.threatnet · live</span>
              <div className="flex items-center gap-3">
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
                <AnimatePresence initial={false}>
                  {feed.map(([id, t]) => (
                    <motion.div
                      key={id + t}
                      layout
                      initial={{ opacity: 0, y: -10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.35 }}
                      className="flex items-center justify-between gap-3 rounded-md border border-[var(--border)] bg-surface px-3 py-2"
                    >
                      <div className="font-mono shrink-0 text-[11.5px] text-muted-foreground">{id}</div>
                      <div className="min-w-0 truncate text-right text-[12.5px] text-foreground/85">{t}</div>
                    </motion.div>
                  ))}
                </AnimatePresence>
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
              <div className="inline-flex items-center gap-2 rounded-full border border-amber/40 bg-amber/10 px-3 py-1 text-[11px]">
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
                <li key={t} className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-surface px-4 py-3">
                  <span className="mt-1.5 inline-flex h-1.5 w-1.5 flex-none rounded-full bg-cyan shadow-[var(--shadow-glow-cyan)]" />
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
