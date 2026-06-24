"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSafeSends } from "@/lib/safesend-store";
import { shortAddr } from "@/lib/mock-scan";
import { explorerTxUrl } from "@/lib/safesend-contract";

export function ReceiptSafeSendPage() {
  const params = useParams<{ id: string }>();
  const { sends } = useSafeSends();
  const send = sends.find((s) => s.id === params.id);
  const [, set] = useState(0);

  useEffect(() => {
    const t = setInterval(() => set((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, []);

  if (!send) {
    return (
      <div className="surface-card p-7">
        <div className="font-display text-xl">Receipt not found.</div>
        <Link href="/app" className="mt-4 inline-block text-cyan hover:underline">
          ← Back to SafeSends
        </Link>
      </div>
    );
  }

  const blocked = send.status === "blocked";
  const remain = Math.max(0, send.releaseAt - Date.now());
  const h = Math.floor(remain / 3600_000);
  const m = Math.floor((remain % 3600_000) / 60_000);
  const s = Math.floor((remain % 60_000) / 1000);

  return (
    <div
      className={`surface-card relative overflow-hidden p-7 ${blocked ? "shadow-[var(--shadow-glow-red)]" : "shadow-[var(--shadow-glow-emerald)]"}`}
    >
      <div className="aurora pointer-events-none absolute -inset-32 opacity-25" />
      <div className="relative">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="eyebrow mb-2">
              {blocked ? "Critical Risk · Do Not Sign" : "Protected settlement"}
            </div>
            <div
              className={`font-display text-[clamp(30px,9vw,44px)] leading-none ${blocked ? "text-red" : "text-emerald"}`}
            >
              {blocked ? "Do Not Sign" : "Locked"}
            </div>
            <p className="mt-2 max-w-md text-[13.5px] text-muted-foreground">
              {blocked
                ? "Cardinal refused to broadcast. No funds left your wallet."
                : "Funds are protected by SafeSend and will release after the delay window."}
            </p>
          </div>
          <div className="shrink-0 self-start rounded-xl border border-[var(--border)] bg-surface-elevated/70 px-4 py-3 text-center font-mono">
            <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">
              transfer
            </div>
            <div className="mt-1 text-[12px]">
              {send.transferId ? `#${send.transferId}` : send.id}
            </div>
          </div>
        </div>

        <div className="mt-7 grid gap-3 md:grid-cols-2">
          <Detail
            label="Recipient"
            value={<span className="font-mono">{shortAddr(send.recipient, 6)}</span>}
          />
          <Detail
            label="Amount"
            value={
              <>
                {send.amount.toLocaleString()}{" "}
                <span className="text-muted-foreground">{send.token}</span>
              </>
            }
          />
          {typeof send.feeAmount === "number" && (
            <Detail
              label="Cardinal fee"
              value={
                <>
                  {send.feeAmount} <span className="text-muted-foreground">{send.token}</span>
                </>
              }
            />
          )}
          {typeof send.recipientAmount === "number" && (
            <Detail
              label="Recipient receives"
              value={
                <span className="text-emerald">
                  {send.recipientAmount}{" "}
                  <span className="text-muted-foreground">{send.token}</span>
                </span>
              }
            />
          )}
          {send.gasEstimateEth && (
            <Detail
              label="Estimated gas"
              value={<span className="font-mono">~{send.gasEstimateEth} ETH</span>}
            />
          )}
          <Detail
            label="Protection mode"
            value={send.mode === "live_contract" ? "Live contract" : send.scan?.mode === "live" ? "Live backend" : "Demo"}
          />
          {send.scan?.requestId && (
            <Detail
              label="Scan request"
              value={<span className="font-mono">{send.scan.requestId}</span>}
            />
          )}
          {!blocked && (
            <>
              <Detail
                label="Releases in"
                value={
                  <span className="font-mono text-cyan">
                    {h}h {String(m).padStart(2, "0")}m {String(s).padStart(2, "0")}s
                  </span>
                }
              />
              <Detail
                label="Cancel window"
                value={<span className="font-mono text-amber">open</span>}
              />
            </>
          )}
          {send.txHash && (
            <Detail
              label="SafeSend tx"
              value={
                <a
                  href={explorerTxUrl(send.txHash)}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-cyan hover:underline"
                >
                  {shortAddr(send.txHash, 8)} →
                </a>
              }
            />
          )}
          {send.approvalTxHash && (
            <Detail
              label="Approval tx"
              value={
                <a
                  href={explorerTxUrl(send.approvalTxHash)}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-cyan hover:underline"
                >
                  {shortAddr(send.approvalTxHash, 8)} →
                </a>
              }
            />
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-[var(--border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => navigator.clipboard?.writeText(send.txHash ?? send.id)}
            className="rounded-full border border-[var(--border-strong)] bg-surface-elevated px-4 py-2 text-[13px] transition hover:border-cyan hover:text-cyan"
          >
            Copy tx
          </button>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/app/new"
              className="rounded-full border border-[var(--border-strong)] bg-surface-elevated px-4 py-2 text-[13px] transition hover:border-foreground"
            >
              New SafeSend
            </Link>
            <Link
              href="/app"
              className="rounded-full bg-foreground px-5 py-2 text-[13px] font-medium text-background transition hover:bg-cyan"
            >
              Go to dashboard →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-surface-elevated/70 px-4 py-3">
      <div className="eyebrow mb-1">{label}</div>
      <div className="text-[14px] break-words [overflow-wrap:anywhere]">{value}</div>
    </div>
  );
}
