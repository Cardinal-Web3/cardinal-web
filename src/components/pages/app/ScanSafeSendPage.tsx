"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSafeSends } from "@/lib/safesend-store";
import { SIGNAL_LABELS, type SignalKey } from "@/lib/mock-scan";
import { requestProtectionScan, type ProtectionScanResult } from "@/lib/protection-api";
import { useWallet } from "@/lib/wallet-store";

const ORDER: SignalKey[] = [
  "wallet_reputation",
  "recipient_history",
  "network_validation",
  "contract_analysis",
  "simulation",
];

export function ScanSafeSendPage() {
  const router = useRouter();
  const { drafts, setDraft } = useSafeSends();
  const { address, chain } = useWallet();
  const d = drafts["new"];
  const recipient = d?.recipient;
  const amount = d?.amount;
  const token = d?.token ?? "USDC";
  const [step, setStep] = useState(0);
  const [logs, setLogs] = useState<{ t: string; lvl: string; txt: string }[]>([]);
  const [scanError, setScanError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!recipient || !amount) {
      router.replace("/app/new");
      return;
    }

    let i = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    setStep(0);
    setLogs([]);
    setScanError(null);

    const tick = (result: ProtectionScanResult) => {
      if (cancelled) return;
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
          txt: found ? found.text : `${SIGNAL_LABELS[sig]} no anomalies`,
        },
      ]);
      if (i < ORDER.length) {
        timers.push(setTimeout(() => tick(result), 700 + Math.random() * 600));
      } else {
        timers.push(setTimeout(() => router.push("/app/new/verdict"), 700));
      }
    };

    requestProtectionScan({
      fromAddress: address,
      recipient,
      amount,
      token,
      chain,
      transactionType: "safe_send",
      contractVerified: true,
      permissions: [],
    })
      .then((result) => {
        if (cancelled) return;
        setDraft("new", {
          scan: result,
          verdict: result.verdict,
        });
        setLogs([
          {
            t: new Date().toISOString().slice(11, 19),
            lvl: result.mode === "live" ? "ok" : "info",
            txt:
              result.mode === "live"
                ? `Backend request ${result.requestId ?? "completed"} returned ${result.verdict}`
                : "Demo scan mode returned local mock verdict",
          },
        ]);
        timers.push(setTimeout(() => tick(result), 500));
      })
      .catch((error) => {
        if (cancelled) return;
        setScanError(
          error instanceof Error ? error.message : "Cardinal Protection API unavailable",
        );
      });

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [address, amount, chain, recipient, router, setDraft, token]);

  return (
    <div className="surface-card p-7">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-display text-[26px] tracking-tight">
            Cardinal Protection Engine · scanning
          </div>
          <p className="mt-1 text-[13.5px] text-muted-foreground">
            Five protection layers evaluated through the backend pre-sign gate.
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
              className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-surface-elevated/70 px-4 py-2.5"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex h-1.5 w-1.5 rounded-full transition ${done ? "bg-cyan shadow-[0_0_10px_oklch(0.82_0.13_210)]" : scanning ? "animate-pulse-soft bg-amber" : "bg-[var(--border-strong)]"}`}
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

      <div className="mt-6 rounded-xl border border-[var(--border)] bg-surface-elevated/80 p-4">
        <div className="font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
          cardinal.scan · backend
        </div>
        {scanError && (
          <div className="mt-3 rounded-lg border border-red/30 bg-red/10 px-3 py-2 text-[12.5px] text-red">
            {scanError}
          </div>
        )}
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
