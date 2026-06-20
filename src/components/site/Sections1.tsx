"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Count-up that supports decimals, fires ONCE on scroll-in (IntersectionObserver),
 * and respects reduced motion. Only text content changes — no transform/opacity
 * animation, so it never triggers layout/paint thrash.
 */
function CountStat({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  delayMs = 0,
  className,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  delayMs?: number;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion) {
      setDisplay(value);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const run = () => {
              const start = performance.now();
              const duration = 1300;
              const tick = (t: number) => {
                const p = Math.min(1, (t - start) / duration);
                const eased = 1 - Math.pow(1 - p, 3);
                setDisplay(value * eased);
                if (p < 1) requestAnimationFrame(tick);
                else setDisplay(value);
              };
              requestAnimationFrame(tick);
            };
            if (delayMs) window.setTimeout(run, delayMs);
            else run();
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, delayMs, prefersReducedMotion]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

function Section({
  eyebrow,
  title,
  lede,
  children,
  id,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  children?: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <div className="eyebrow mb-4">{eyebrow}</div>
          <h2 className="font-display text-balance text-[clamp(30px,4.4vw,54px)] font-medium leading-[1.04] tracking-[-0.025em]">
            {title}
          </h2>
          {lede && (
            <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-muted-foreground">
              {lede}
            </p>
          )}
        </motion.div>
        {children && <div className="mt-14">{children}</div>}
      </div>
    </section>
  );
}

export function Problem() {
  const prefersReducedMotion = useReducedMotion();
  const risks = [
    { code: "approve(0xDe4d…,∞)", text: "Malicious unlimited approval drains tokens" },
    { code: "to: 0xCa11…", text: "Lookalike address swap by clipboard hijack" },
    { code: "network: arbitrum", text: "Bridged to the wrong network — funds lost" },
    { code: "permit(deadline: 2099)", text: "Off-chain signature replayed forever" },
    { code: "revoke ✗", text: "Once signed, on-chain settlement is irreversible" },
  ];

  return (
    <Section
      id="problem"
      eyebrow="The problem"
      title={
        <>
          One signature is the difference
          <br />
          between settlement and total loss.
        </>
      }
      lede="Wallets are the last line of defense — and they were never designed for it. Cardinal sits between intent and execution, protecting every transaction before value moves."
    >
      <div className="grid gap-6 md:grid-cols-[1.1fr_1fr]">
        {/* LEFT — unprotected wallet: ominous, red-tinted. Shares the verdict-card
            language (border + tint + static radial glow + dot grid) but messy and
            unresolved, vs the clean Review/Blocked/Safe cards later on the page. */}
        <div className="relative overflow-hidden rounded-2xl border border-red/30 bg-[color-mix(in_oklab,var(--red)_7%,var(--surface))] shadow-[var(--shadow-elevated)]">
          <div className="dot-bg pointer-events-none absolute inset-0 opacity-[0.16]" />

          <div className="relative z-10 flex items-center justify-between border-b border-red/20 px-5 py-3">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-red/70">
              wallet · unprotected
            </div>
            <div className="font-mono text-[11px] text-red">verdict: ∅</div>
          </div>
          <div className="relative z-10 space-y-2.5 p-4 sm:p-5">
            {risks.map((r, i) => (
              <motion.div
                key={r.code}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-3 rounded-lg border border-red/15 bg-[color-mix(in_oklab,var(--red)_5%,var(--surface))] px-3 py-2.5"
              >
                <span className="relative mt-1.5 inline-flex h-1.5 w-1.5 flex-none">
                  <span className="absolute inset-0 animate-pulse-soft rounded-full bg-red" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red shadow-[0_0_10px_oklch(0.67_0.22_25)]" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-[12px] text-red/90 break-words [overflow-wrap:anywhere]">
                    {r.code}
                  </div>
                  <div className="mt-0.5 text-[13px] leading-snug text-foreground/85">
                    {r.text}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT — cost. Clean / neutral so the pair reads chaos | cost. */}
        <div className="surface-card relative overflow-hidden p-5 sm:p-6">
          <div className="font-display text-[clamp(20px,2.4vw,23px)] leading-snug">
            <CountStat value={3.7} decimals={1} prefix="$" suffix="B+" /> lost to
            preventable transaction errors and contract approvals in the last 24
            months.
          </div>
          <div className="mt-6 space-y-3 text-[13.5px] leading-relaxed text-muted-foreground">
            <p>
              Most users find out only after the block is final. There is no undo
              on-chain, no fraud reversal, no merchant chargeback.
            </p>
            <p>
              Cardinal moves the decision earlier — to the moment intent forms,
              before value moves on-chain.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-3">
            {[
              { value: 1.9, decimals: 1, suffix: "B", label: "Drainer losses", delay: 140 },
              { value: 820, decimals: 0, suffix: "M", label: "Wrong network", delay: 260 },
              { value: 960, decimals: 0, suffix: "M", label: "Address spoof", delay: 380 },
            ].map((s) => (
              <div key={s.label} className="bg-surface px-4 py-4">
                <div className="font-display text-xl text-foreground">
                  <CountStat
                    value={s.value}
                    decimals={s.decimals}
                    prefix="$"
                    suffix={s.suffix}
                    delayMs={s.delay}
                  />
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground/70">
            Source: industry loss reports, 2024 {/* TODO: cite final source */}
          </p>
        </div>
      </div>
    </Section>
  );
}

export function HowItWorks() {
  const steps = [
    ["01", "Detect intent", "Cardinal reads the transaction your wallet is about to ask you to sign."],
    ["02", "Analyze risk", "Wallet intelligence, contract checks, and simulation run in parallel."],
    ["03", "Give verdict", "Low Risk · Proceed, Review Required, or Critical Risk — in plain English."],
    ["04", "Route to safe settlement", "High-risk moves can route into SafeSend or escrow instead of a blind signature."],
  ];

  return (
    <Section
      id="how"
      eyebrow="How Cardinal works"
      title={
        <>
          Cardinal checks before
          <br />
          the wallet asks you to sign.
        </>
      }
      lede="Cardinal scans risk before signature and routes users into safer settlement flows like SafeSend and escrow."
    >
      <div className="grid gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] md:grid-cols-2">
        {steps.map(([n, t, d], i) => (
          <motion.div
            key={n}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -3 }}
            className="group relative cursor-default bg-surface p-7 transition-colors duration-300 hover:bg-surface-elevated/60"
          >
            {/* hover glow */}
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div className="absolute inset-0 bg-gradient-to-b from-cyan/[0.04] to-transparent" />
            </div>

            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan/80 transition-colors duration-300 group-hover:text-cyan">
                  {n}
                </div>
                <div className="h-px w-0 bg-gradient-to-r from-cyan/60 to-transparent transition-all duration-500 group-hover:w-16" />
              </div>
              <div className="font-display mt-5 text-[22px] tracking-tight transition-colors duration-300 group-hover:text-cyan">
                {t}
              </div>
              <div className="mt-2 text-[13.5px] text-muted-foreground">{d}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
