import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

type Verdict = "ALLOW" | "REVIEW" | "BLOCK";

const SLABS = [
  { key: "wallet", label: "Wallet Reputation", code: "0x7c…" },
  { key: "recipient", label: "Recipient History", code: "1,204 tx" },
  { key: "network", label: "Network Validation", code: "chain id 1" },
  { key: "contract", label: "Contract Analysis", code: "decode ok" },
  { key: "simulation", label: "Transaction Simulation", code: "ΔE +0" },
];

const SEQUENCE: { verdict: Verdict; label: string; tag: string }[] = [
  { verdict: "ALLOW", label: "Safe to settle", tag: "0x7c8b…2a14 · 2,400 USDC" },
  { verdict: "REVIEW", label: "Review required", tag: "0xA1b2…aBcD · 0.85 ETH" },
  { verdict: "BLOCK", label: "Threat intercepted", tag: "0xDe4d…ffee · 12,000 USDC" },
];

const VERDICT_COLOR: Record<Verdict, string> = {
  ALLOW: "oklch(0.76 0.16 155)",
  REVIEW: "oklch(0.82 0.16 75)",
  BLOCK: "oklch(0.67 0.22 25)",
};

const PACKETS = [
  { y: 18, delay: 0, threat: false },
  { y: 36, delay: 1.1, threat: false },
  { y: 54, delay: 0.5, threat: true },
  { y: 72, delay: 1.8, threat: false },
  { y: 88, delay: 2.4, threat: false },
];

export function TIE({ compact = false }: { compact?: boolean }) {
  const [step, setStep] = useState(0);
  const [seq, setSeq] = useState(0);
  const tx = SEQUENCE[seq];

  useEffect(() => {
    let i = 0;
    let t: ReturnType<typeof setTimeout>;
    const loop = () => {
      setStep(i);
      if (i > SLABS.length + 1) {
        i = 0;
        setSeq((s) => (s + 1) % SEQUENCE.length);
        t = setTimeout(loop, 600);
        return;
      }
      i += 1;
      t = setTimeout(loop, 700);
    };
    loop();
    return () => clearTimeout(t);
  }, []);

  const verdictColor = VERDICT_COLOR[tx.verdict];

  return (
    <div
      className={`relative w-full overflow-hidden ${
        compact ? "aspect-[5/4]" : "aspect-[5/4] md:aspect-[6/5]"
      }`}
      style={{ perspective: "2200px" }}
    >
      {/* atmospheric backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_60%,oklch(0.16_0.012_250)_0%,transparent_70%)]" />
      <div className="aurora absolute -inset-20 opacity-50" />

      {/* tilted floor grid receding to horizon */}
      <div
        className="absolute inset-x-0 bottom-0 h-2/3 origin-bottom"
        style={{
          transform: "rotateX(62deg) translateZ(0)",
          backgroundImage:
            "linear-gradient(to right, oklch(0.82 0.13 210 / 0.18) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.82 0.13 210 / 0.14) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "linear-gradient(to top, black 10%, transparent 80%)",
        }}
      />

      {/* horizon glow */}
      <div className="absolute inset-x-0 top-[42%] h-px bg-gradient-to-r from-transparent via-lime/70 to-transparent blur-[1px]" />

      {/* HUD top */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-4 font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="relative inline-flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-ping-ring rounded-full bg-lime/60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-lime" />
          </span>
          <span>cardinal.interceptor</span>
        </div>
        <span className="hidden md:inline">scan_id · {tx.tag.slice(0, 12)}</span>
      </div>

      {/* SVG packet field */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 z-10 h-full w-full"
      >
        <defs>
          <linearGradient id="safeLine" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="oklch(0.82 0.13 210)" stopOpacity="0" />
            <stop offset="0.5" stopColor="oklch(0.82 0.13 210)" stopOpacity="0.5" />
            <stop offset="1" stopColor="oklch(0.92 0.18 115)" stopOpacity="0.9" />
          </linearGradient>
          <radialGradient id="corehalo">
            <stop offset="0" stopColor={verdictColor} stopOpacity="0.55" />
            <stop offset="1" stopColor={verdictColor} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* incoming paths */}
        {PACKETS.map((p, i) => (
          <g key={i}>
            <path
              d={`M -2 ${p.y} Q 30 ${p.y}, 50 50`}
              fill="none"
              stroke={p.threat ? "oklch(0.67 0.22 25 / 0.6)" : "url(#safeLine)"}
              strokeWidth="0.2"
              strokeDasharray="0.6 1.4"
              className="animate-dash-slow"
            />
            {/* packet */}
            <circle r="0.9" fill={p.threat ? "oklch(0.67 0.22 25)" : "oklch(0.92 0.18 115)"}>
              <animateMotion
                dur={`${4 + i * 0.4}s`}
                repeatCount="indefinite"
                begin={`${p.delay}s`}
                path={
                  p.threat
                    ? `M -2 ${p.y} Q 30 ${p.y}, 50 50 Q 55 70, 85 95`
                    : `M -2 ${p.y} Q 30 ${p.y}, 50 50 Q 70 50, 102 ${50 - (i - 2) * 6}`
                }
              />
              <animate
                attributeName="opacity"
                values={p.threat ? "0;1;1;0.2;0" : "0;1;1;1;0"}
                keyTimes="0;0.15;0.45;0.7;1"
                dur={`${4 + i * 0.4}s`}
                begin={`${p.delay}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}

        {/* quarantine well marker */}
        <g opacity="0.7">
          <ellipse cx="85" cy="95" rx="6" ry="1.2" fill="none" stroke="oklch(0.67 0.22 25 / 0.5)" strokeWidth="0.15" />
          <text x="85" y="92" textAnchor="middle" fill="oklch(0.67 0.22 25)" fontSize="2" fontFamily="JetBrains Mono">
            QUARANTINE
          </text>
        </g>

        {/* core halo */}
        <circle cx="50" cy="50" r="14" fill="url(#corehalo)">
          <animate attributeName="r" values="12;16;12" dur="3s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* CORE — stacked tilted glass slabs */}
      <div
        className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="relative"
          style={{
            transform: "rotateX(8deg) rotateY(-14deg)",
            transformStyle: "preserve-3d",
          }}
        >
          {SLABS.map((s, i) => {
            const active = step > i;
            return (
              <motion.div
                key={s.key}
                initial={false}
                animate={{
                  opacity: active ? 1 : 0.35,
                  scale: active ? 1 : 0.97,
                }}
                transition={{ duration: 0.4 }}
                style={{
                  transform: `translateZ(${(i - 2) * 22}px) translateY(${(i - 2) * 6}px)`,
                }}
                className="mb-1.5 flex w-[260px] items-center justify-between rounded-md border border-[var(--glass-stroke)] bg-[oklch(0.18_0.012_250/0.75)] px-3.5 py-2 backdrop-blur-md"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`inline-flex h-1.5 w-1.5 rounded-full transition ${
                      active
                        ? "bg-lime shadow-[0_0_10px_oklch(0.92_0.18_115)]"
                        : "bg-[var(--border-strong)]"
                    }`}
                  />
                  <span className="text-[11.5px] font-medium text-foreground/90">{s.label}</span>
                </div>
                <span className="font-mono text-[9.5px] uppercase tracking-wider text-muted-foreground">
                  {active ? "ok" : "…"}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* VERDICT card */}
      <div className="absolute bottom-5 left-5 right-5 z-30">
        <AnimatePresence mode="wait">
          {step > SLABS.length && (
            <motion.div
              key={tx.verdict + seq}
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="glass-panel flex items-center justify-between px-5 py-3.5"
              style={{
                boxShadow: `0 0 0 1px var(--glass-stroke), 0 0 60px -10px ${verdictColor}`,
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="font-display text-[40px] leading-none"
                  style={{ color: verdictColor }}
                >
                  {tx.verdict[0]}
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    Verdict
                  </div>
                  <div
                    className="font-display text-[16px] leading-tight"
                    style={{ color: verdictColor }}
                  >
                    {tx.verdict}
                  </div>
                  <div className="text-[11.5px] text-muted-foreground">{tx.label}</div>
                </div>
              </div>
              <div className="hidden font-mono text-[10px] uppercase tracking-wider text-muted-foreground md:block">
                {tx.tag}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
