import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useSafeSends } from "@/lib/safesend-store";
import { SIGNAL_LABELS, scanTransaction, VERDICT_DISPLAY, type ScanResult, type Verdict } from "@/lib/mock-scan";

export const Route = createFileRoute("/app/new/verdict")({
  component: Page,
});

const STYLE: Record<Verdict, { ring: string; bg: string; text: string; glow: string; label: string; desc: string; cta: string }> = {
  ALLOW: {
    ring: "border-emerald/60",
    bg: "bg-emerald/10",
    text: "text-emerald",
    glow: "shadow-[var(--shadow-glow-emerald)]",
    label: VERDICT_DISPLAY.ALLOW.label,
    desc: "No anomalies above threshold. SafeSend will lock funds on signature.",
    cta: "Proceed to confirm",
  },
  REVIEW: {
    ring: "border-amber/60",
    bg: "bg-amber/10",
    text: "text-amber",
    glow: "shadow-[var(--shadow-glow-amber)]",
    label: VERDICT_DISPLAY.REVIEW.label,
    desc: "Cardinal found details worth a second look. Verify before signing.",
    cta: "Proceed with caution",
  },
  BLOCK: {
    ring: "border-red/60",
    bg: "bg-red/10",
    text: "text-red",
    glow: "shadow-[var(--shadow-glow-red)]",
    label: VERDICT_DISPLAY.BLOCK.label,
    desc: "High-confidence threat signals. We strongly recommend cancelling.",
    cta: "Override (not advised)",
  },
};

function Page() {
  const nav = useNavigate();
  const { drafts } = useSafeSends();
  const d = drafts["new"];
  const [scan, setScan] = useState<ScanResult | null>(null);

  useEffect(() => {
    if (!d?.recipient || !d?.amount) {
      nav({ to: "/app/new" });
      return;
    }
    setScan(
      scanTransaction({
        recipient: d.recipient!,
        amount: d.amount!,
        token: d.token ?? "USDC",
      }),
    );
  }, [d, nav]);

  if (!scan || !d) return null;
  const v = STYLE[scan.verdict];

  return (
    <div className={`surface-card relative overflow-hidden p-7 ${v.glow}`}>
      <div className="aurora pointer-events-none absolute -inset-32 opacity-30" />
      <div className="relative">
        <div className="flex items-start justify-between">
          <div>
            <div className="eyebrow mb-2">Cardinal verdict</div>
            <div className={`font-display text-[clamp(28px,5vw,44px)] leading-tight ${v.text}`}>
              {v.label}
            </div>
            <p className="mt-2 max-w-md text-[13.5px] text-muted-foreground">{v.desc}</p>
          </div>
          <div className={`rounded-2xl border ${v.ring} ${v.bg} px-5 py-4 text-center`}>
            <div className="eyebrow mb-1">Risk score</div>
            <div className={`font-display text-3xl ${v.text}`}>{scan.score}</div>
            <div className="mt-0.5 font-mono text-[10px] text-muted-foreground">/ 100</div>
          </div>
        </div>

        <div className="mt-7">
          <div className="eyebrow mb-3">Findings</div>
          <div className="space-y-2">
            {scan.findings.map((f, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[oklch(0.17_0.011_250)] px-4 py-3"
              >
                <span
                  className={`mt-1 inline-flex h-1.5 w-1.5 flex-none rounded-full ${
                    f.severity === "high"
                      ? "bg-red"
                      : f.severity === "med"
                      ? "bg-amber"
                      : f.severity === "low"
                      ? "bg-cyan"
                      : "bg-emerald"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      {SIGNAL_LABELS[f.signal]}
                    </div>
                    <div
                      className={`font-mono text-[10.5px] uppercase tracking-wider ${
                        f.severity === "high"
                          ? "text-red"
                          : f.severity === "med"
                          ? "text-amber"
                          : f.severity === "low"
                          ? "text-cyan"
                          : "text-emerald"
                      }`}
                    >
                      {f.severity}
                    </div>
                  </div>
                  <div className="mt-1 text-[13px] text-foreground/90">{f.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-[var(--border)] pt-6">
          <button
            onClick={() => nav({ to: "/app/new" })}
            className="rounded-full border border-[var(--border-strong)] bg-surface-elevated px-4 py-2 text-[13px] transition hover:border-foreground"
          >
            ← Edit transaction
          </button>
          <div className="flex gap-2">
            {scan.verdict !== "ALLOW" && (
              <button
                onClick={() => nav({ to: "/app" })}
                className="rounded-full border border-[var(--border-strong)] bg-surface px-4 py-2 text-[13px] transition hover:border-cyan"
              >
                Cancel
              </button>
            )}
            <button
              onClick={() => nav({ to: "/app/new/confirm" })}
              className={`rounded-full px-5 py-2 text-[13.5px] font-medium transition ${
                scan.verdict === "BLOCK"
                  ? "border border-red/60 bg-red/10 text-red hover:bg-red/20"
                  : scan.verdict === "REVIEW"
                  ? "border border-amber/60 bg-amber/10 text-amber hover:bg-amber/20"
                  : "bg-foreground text-background hover:bg-cyan"
              }`}
            >
              {v.cta} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
