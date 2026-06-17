import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { GlassPanel } from "./GlassPanel";
import { useState } from "react";

export function ThreatMap() {
  return (
    <section id="intel" className="relative overflow-hidden px-6 py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          05 / Threat Intelligence
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="wordmark-display mt-6 max-w-4xl text-balance"
        >
          Every contract.
          <br />
          <span className="text-lime">Continuously watched.</span>
        </motion.h2>

        <div className="mt-20 grid gap-10 md:grid-cols-3">
          {[
            ["318K", "Scam wallets indexed"],
            ["8.2M", "Transactions monitored / day"],
            ["1,184", "Active drainer clusters"],
          ].map(([v, l], i) => (
            <motion.div
              key={l}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
            >
              <div className="wordmark-display text-[clamp(56px,7vw,96px)] leading-none text-lime [text-shadow:0_0_40px_oklch(0.92_0.18_115/0.25)]">
                {v}
              </div>
              <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                {l}
              </div>
            </motion.div>
          ))}
        </div>

        {/* tilted threat plane */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative mt-20 h-[320px] overflow-hidden rounded-2xl border border-[var(--glass-stroke)] bg-[oklch(0.13_0.01_250)]"
          style={{ perspective: 1400 }}
        >
          <div
            className="absolute inset-x-0 bottom-0 h-[140%]"
            style={{
              transform: "rotateX(58deg)",
              transformOrigin: "bottom",
              backgroundImage:
                "linear-gradient(to right, oklch(0.82 0.13 210 / 0.18) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.82 0.13 210 / 0.14) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
              maskImage: "linear-gradient(to top, black 10%, transparent 80%)",
            }}
          />
          <svg viewBox="0 0 800 320" className="relative h-full w-full">
            {[
              [60, 80, 760, 240],
              [120, 240, 720, 60],
              [40, 160, 760, 160],
              [200, 40, 600, 280],
              [80, 280, 720, 100],
            ].map(([x1, y1, x2, y2], i) => (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="oklch(0.92 0.18 115 / 0.18)" strokeWidth="0.6" />
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="oklch(0.92 0.18 115)"
                  strokeWidth="0.8"
                  className="animate-dash"
                  opacity="0.7"
                />
              </g>
            ))}
            {[[160, 70], [340, 130], [520, 90], [640, 180], [220, 220], [480, 250]].map(
              ([cx, cy], i) => (
                <g key={i}>
                  <circle cx={cx} cy={cy} r="8" fill="oklch(0.92 0.18 115 / 0.15)">
                    <animate attributeName="r" values="4;12;4" dur="3s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
                  </circle>
                  <circle cx={cx} cy={cy} r="2" fill="oklch(0.92 0.18 115)" />
                </g>
              ),
            )}
            {[[400, 180], [600, 60]].map(([cx, cy], i) => (
              <g key={`t${i}`}>
                <circle cx={cx} cy={cy} r="10" fill="oklch(0.67 0.22 25 / 0.2)">
                  <animate attributeName="r" values="6;16;6" dur="2.4s" repeatCount="indefinite" />
                </circle>
                <circle cx={cx} cy={cy} r="2.5" fill="oklch(0.67 0.22 25)" />
              </g>
            ))}
          </svg>
          <div className="absolute inset-x-0 bottom-3 flex justify-between px-5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <span>cardinal.threatnet</span>
            <span className="text-emerald">● 12 regions · live</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function Partners() {
  const items = [
    { tag: "Wallets", title: "Sign with protection on" },
    { tag: "Exchanges", title: "Withdrawals you can stand behind" },
    { tag: "Marketplaces", title: "Settlement trust, off the shelf" },
    { tag: "Payments", title: "Programmable compliance" },
  ];
  return (
    <section id="partners" className="relative px-6 py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              06 / Partners
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="wordmark-display mt-6 max-w-3xl text-balance"
            >
              Embed protection
              <br />
              in <span className="text-lime">one integration.</span>
            </motion.h2>
          </div>
          <Link
            to="/partners"
            className="hidden rounded-md border border-[var(--border-strong)] bg-surface/40 px-4 py-2 font-mono text-[10.5px] uppercase tracking-[0.18em] backdrop-blur transition hover:border-lime hover:text-lime md:inline-flex"
          >
            Talk to platform team →
          </Link>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-4" style={{ perspective: 2000 }}>
          {items.map((it, i) => (
            <GlassPanel
              key={it.tag}
              tilt="auto"
              intensity={10}
              className={i % 2 === 0 ? "md:translate-y-4" : ""}
            >
              <div className="flex h-full flex-col justify-between p-7">
                <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-lime/80">
                  {it.tag}
                </div>
                <div className="mt-16 font-display text-[22px] leading-tight tracking-tight text-foreground">
                  {it.title}
                </div>
                <div className="mt-6 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground transition group-hover:text-lime">
                  Integration guide →
                </div>
              </div>
            </GlassPanel>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Pilot() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section id="pilot" className="relative px-6 py-32">
      <div className="mx-auto max-w-3xl">
        <div className="text-center font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          07 / Pilot Program
        </div>

        <GlassPanel tilt="none" className="mt-10">
          <div className="relative overflow-hidden p-12 text-center md:p-16">
            <div className="aurora pointer-events-none absolute -inset-40 opacity-40" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-md border border-amber/40 bg-amber/10 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.22em] text-amber">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-amber" />
                Controlled Pilot
              </div>
              <h2 className="wordmark-display mt-6 text-balance text-[clamp(40px,6vw,80px)]">
                Honest, monitored,
                <br />
                <span className="text-lime">hardened.</span>
              </h2>
              <p className="mx-auto mt-6 max-w-md text-[14px] leading-relaxed text-muted-foreground">
                Caps in effect. Daily threat-engine reviews with partners. Public
                post-mortems for any incident.
              </p>

              {sent ? (
                <div className="mx-auto mt-9 max-w-sm rounded-md border border-emerald/40 bg-emerald/10 px-4 py-3 text-[13px] text-emerald">
                  ✓ Request received. We'll reach out at {email}.
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (email) setSent(true);
                  }}
                  className="mx-auto mt-9 flex max-w-md flex-col gap-2 sm:flex-row"
                >
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 rounded-md border border-[var(--border-strong)] bg-surface/60 px-4 py-3 text-[13.5px] text-foreground placeholder:text-muted-foreground focus:border-lime focus:outline-none"
                  />
                  <button className="rounded-md bg-lime px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-background transition hover:opacity-90">
                    Request access
                  </button>
                </form>
              )}
            </div>
          </div>
        </GlassPanel>
      </div>
    </section>
  );
}
