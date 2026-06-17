import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useSafeSends } from "@/lib/safesend-store";
import { SIGNAL_LABELS, scanTransaction, type SignalKey } from "@/lib/mock-scan";

const ORDER: SignalKey[] = [
  "wallet_reputation",
  "recipient_history",
  "network_validation",
  "contract_analysis",
  "simulation",
];

export const Route = createFileRoute("/app/new/scan")({
  component: Page,
});

function Page() {
  const nav = useNavigate();
  const { drafts, setDraft } = useSafeSends();
  const d = drafts["new"];
  const [step, setStep] = useState(0);
  const [logs, setLogs] = useState<{ t: string; lvl: string; txt: string }[]>([]);

  useEffect(() => {
    if (!d?.recipient || !d?.amount) {
      nav({ to: "/app/new" });
      return;
    }
    const result = scanTransaction({
      recipient: d.recipient!,
      amount: d.amount!,
      token: d.token ?? "USDC",
    });
    setDraft("new", { /* keep */ });
    // store scan in draft via a temporary key
    (window as any).__cardinal_scan = result;

    let i = 0;
    const tick = () => {
      i++;
      setStep(i);
      const sig = ORDER[i - 1];
      const time = new Date().toISOString().slice(11, 19);
      const found = result.findings.find((f) => f.signal === sig);
      const lvl =
        found?.severity === "high"
          ? "block"
          : found?.severity === "med"
          ? "warn"
          : found?.severity === "low"
          ? "info"
          : "ok";
      setLogs((l) => [
        ...l,
        {
          t: time,
          lvl,
          txt: found ? found.text : `${SIGNAL_LABELS[sig]} ✓ no anomalies`,
        },
      ]);
      if (i < ORDER.length) {
        setTimeout(tick, 700 + Math.random() * 600);
      } else {
        setTimeout(() => nav({ to: "/app/new/verdict" }), 700);
      }
    };
    const t0 = setTimeout(tick, 500);
    return () => clearTimeout(t0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="glass-panel p-7">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-display text-[26px] tracking-tight">Scanning…</div>
          <p className="mt-1 text-[13.5px] text-muted-foreground">
            Five signal classes evaluated in parallel.
          </p>
        </div>
        <div className="relative inline-flex h-12 w-12 items-center justify-center">
          <span className="absolute inset-0 animate-ping-ring rounded-full bg-cyan/30" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan shadow-[0_0_18px_oklch(0.82_0.13_210)]" />
        </div>
      </div>

      <div className="mt-7 space-y-1.5">
        {ORDER.map((s, i) => {
          const done = step > i;
          const scanning = step === i;
          return (
            <div
              key={s}
              className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[oklch(0.17_0.011_250)] px-4 py-2.5"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex h-1.5 w-1.5 rounded-full transition ${
                    done ? "bg-cyan shadow-[0_0_10px_oklch(0.82_0.13_210)]" : scanning ? "animate-pulse-soft bg-amber" : "bg-[var(--border-strong)]"
                  }`}
                />
                <span className="text-[13.5px]">{SIGNAL_LABELS[s]}</span>
              </div>
              <span className="font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
                {done ? "complete" : scanning ? "scanning" : "pending"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl border border-[var(--border)] bg-black/40 p-4">
        <div className="font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
          cardinal.scan · live
        </div>
        <div className="mt-2 max-h-40 space-y-1 overflow-hidden font-mono text-[11.5px]">
          {logs.map((l, i) => (
            <div key={i} className="flex gap-3">
              <span className="text-muted-foreground">{l.t}</span>
              <span
                className={
                  l.lvl === "block"
                    ? "text-red"
                    : l.lvl === "warn"
                    ? "text-amber"
                    : l.lvl === "info"
                    ? "text-cyan"
                    : "text-emerald"
                }
              >
                [{l.lvl}]
              </span>
              <span className="text-foreground/90">{l.txt}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
