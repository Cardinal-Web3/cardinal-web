import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { GlassPanel } from "./GlassPanel";

export function SafeSendShowcase() {
  return (
    <section id="safesend" className="relative overflow-hidden px-6 py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          03 / SafeSend
        </div>

        <div className="relative mt-10">
          {/* giant background wordmark */}
          <div className="pointer-events-none absolute inset-x-0 -top-6 z-0 select-none text-center">
            <div className="wordmark-giant text-foreground/[0.045]">SafeSend.</div>
          </div>

          <div className="relative z-10 grid items-center gap-12 md:grid-cols-[1fr_1.05fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-md"
            >
              <h2 className="wordmark-display text-balance">
                A transfer
                <br />
                you can <span className="text-lime">take back.</span>
              </h2>
              <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">
                Funds lock on signature, release on a delay you control. If
                anything looks wrong before settlement — cancel.
              </p>
              <div className="mt-9 flex gap-3">
                <Link
                  to="/app/new"
                  className="rounded-md bg-lime px-5 py-3 font-mono text-[11.5px] uppercase tracking-[0.18em] text-background transition hover:opacity-90"
                >
                  Create SafeSend →
                </Link>
                <Link
                  to="/safesend"
                  className="rounded-md border border-[var(--border-strong)] bg-surface/40 px-5 py-3 font-mono text-[11.5px] uppercase tracking-[0.18em] backdrop-blur transition hover:border-lime hover:text-lime"
                >
                  Read docs
                </Link>
              </div>
            </motion.div>

            <GlassPanel tilt="left">
              <div className="p-7">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
                    safesend // draft
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-md border border-emerald/40 bg-emerald/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-emerald">
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald" />
                    ALLOW
                  </div>
                </div>

                <div className="mt-6 space-y-5">
                  <Row label="Recipient" mono>
                    0x7c8b3F2a…6c3b5D9E2a14
                  </Row>
                  <div className="grid grid-cols-2 gap-5">
                    <Row label="Token">USDC</Row>
                    <Row label="Amount" mono>2,400.00</Row>
                  </div>
                  <div>
                    <div className="eyebrow mb-3">Release delay</div>
                    <div className="flex items-center gap-3">
                      <div className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-[var(--border)]">
                        <div className="h-full w-[55%] rounded-full bg-lime shadow-[0_0_12px_oklch(0.92_0.18_115)]" />
                      </div>
                      <div className="font-mono text-[12px] text-lime">24h</div>
                    </div>
                  </div>
                </div>

                <div className="mt-7 flex items-center justify-between border-t border-[var(--glass-stroke)] pt-5">
                  <div className="font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
                    releases · tomorrow 14:32
                  </div>
                  <button className="rounded-md bg-foreground px-4 py-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-background">
                    Sign & lock
                  </button>
                </div>
              </div>
            </GlassPanel>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({
  label,
  children,
  mono,
}: {
  label: string;
  children: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div>
      <div className="eyebrow mb-1.5">{label}</div>
      <div className={`text-[15px] text-foreground ${mono ? "font-mono text-[13.5px]" : ""}`}>
        {children}
      </div>
    </div>
  );
}

export function Escrow() {
  const steps = [
    { n: "01", t: "Deposit", d: "Buyer locks funds in the Cardinal vault." },
    { n: "02", t: "Hold", d: "Conditions monitored on-chain in real time." },
    { n: "03", t: "Release", d: "Settled to seller when verified." },
  ];

  return (
    <section id="escrow" className="relative px-6 py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          04 / Escrow Infrastructure
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="wordmark-display mt-6 max-w-3xl text-balance"
        >
          Marketplace-grade
          <br />
          settlement <span className="text-lime">trust.</span>
        </motion.h2>

        <div
          className="mt-20 grid gap-6 md:grid-cols-3"
          style={{ perspective: 1800 }}
        >
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 30, rotateY: i === 0 ? 8 : i === 2 ? -8 : 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              style={{
                transform: `rotateY(${i === 0 ? 6 : i === 2 ? -6 : 0}deg) rotateX(4deg)`,
                transformStyle: "preserve-3d",
              }}
              className="glass-panel relative p-8"
            >
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-lime">
                {s.n}
              </div>
              <div className="wordmark-display mt-8 text-[clamp(32px,5vw,56px)] leading-none">
                {s.t}
              </div>
              <div className="mt-4 text-[13.5px] text-muted-foreground">{s.d}</div>
              {i < 2 && (
                <div className="absolute -right-3 top-1/2 hidden h-px w-6 bg-gradient-to-r from-lime to-transparent md:block" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
