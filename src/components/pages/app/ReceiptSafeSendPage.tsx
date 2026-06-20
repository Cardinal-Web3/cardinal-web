"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSafeSends } from "@/lib/safesend-store";
import { shortAddr } from "@/lib/mock-scan";

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
    <div className={`surface-card relative overflow-hidden p-7 ${blocked ? "shadow-[var(--shadow-glow-red)]" : "shadow-[var(--shadow-glow-emerald)]"}`}>
      <div className="aurora pointer-events-none absolute -inset-32 opacity-25" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <div className="eyebrow mb-2">{blocked ? "Critical Risk · Do Not Sign" : "Protected settlement"}</div>
            <div className={`font-display text-[44px] leading-none ${blocked ? "text-red" : "text-emerald"}`}>
              {blocked ? "Do Not Sign" : "Locked"}
            </div>
            <p className="mt-2 max-w-md text-[13.5px] text-muted-foreground">
              {blocked
                ? "Cardinal refused to broadcast. No funds left your wallet."
                : "Funds are protected by SafeSend and will release after the delay window."}
            </p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-surface-elevated/70 px-4 py-3 text-center font-mono">
            <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">tx id</div>
            <div className="mt-1 text-[12px]">{send.id}</div>
          </div>
        </div>

        <div className="mt-7 grid gap-3 md:grid-cols-2">
          <Detail label="Recipient" value={<span className="font-mono">{shortAddr(send.recipient, 6)}</span>} />
          <Detail label="Amount" value={<>{send.amount.toLocaleString()} <span className="text-muted-foreground">{send.token}</span></>} />
          {!blocked && (
            <>
              <Detail label="Releases in" value={<span className="font-mono text-cyan">{h}h {String(m).padStart(2, "0")}m {String(s).padStart(2, "0")}s</span>} />
              <Detail label="Cancel window" value={<span className="font-mono text-amber">open</span>} />
            </>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-[var(--border)] pt-6">
          <button
            onClick={() => navigator.clipboard?.writeText(send.id)}
            className="rounded-full border border-[var(--border-strong)] bg-surface-elevated px-4 py-2 text-[13px] transition hover:border-cyan hover:text-cyan"
          >
            Copy tx id
          </button>
          <div className="flex gap-2">
            <Link href="/app/new" className="rounded-full border border-[var(--border-strong)] bg-surface-elevated px-4 py-2 text-[13px] transition hover:border-foreground">
              New SafeSend
            </Link>
            <Link href="/app" className="rounded-full bg-foreground px-5 py-2 text-[13px] font-medium text-background transition hover:bg-cyan">
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
      <div className="text-[14px]">{value}</div>
    </div>
  );
}
