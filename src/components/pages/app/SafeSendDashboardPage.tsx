"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSafeSends, statusLabel } from "@/lib/safesend-store";
import { shortAddr } from "@/lib/mock-scan";

function useTick(ms = 1000) {
  const [, set] = useState(0);
  useEffect(() => {
    const t = setInterval(() => set((x) => x + 1), ms);
    return () => clearInterval(t);
  }, [ms]);
}

function fmtCountdown(target: number) {
  const diff = Math.max(0, target - Date.now());
  const h = Math.floor(diff / 3600_000);
  const m = Math.floor((diff % 3600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  if (h > 0) return `${h}h ${m.toString().padStart(2, "0")}m`;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

export function SafeSendDashboardPage() {
  useTick(1000);
  const { sends, cancelSend } = useSafeSends();

  useEffect(() => {
    const t = setInterval(() => {
      const now = Date.now();
      for (const s of useSafeSends.getState().sends) {
        if (s.status === "pending_release" && s.releaseAt <= now) {
          useSafeSends.getState().updateSend(s.id, { status: "released" });
        }
      }
    }, 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-end justify-between">
        <div>
          <div className="eyebrow mb-2">SafeSends</div>
          <h1 className="font-display text-[40px] leading-none tracking-[-0.03em]">
            My SafeSends
          </h1>
          <p className="mt-2 text-[14px] text-muted-foreground">
            Locked, in-flight, and settled protected transfers.
          </p>
        </div>
        <Link
          href="/app/new"
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[13.5px] font-medium text-background transition hover:bg-cyan"
        >
          + New SafeSend
        </Link>
      </div>

      <div className="surface-card mt-8 overflow-hidden">
        <div className="grid grid-cols-[1.4fr_1fr_1.1fr_1.2fr_120px] gap-4 border-b border-[var(--border)] px-5 py-3 font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
          <div>Recipient</div>
          <div>Amount</div>
          <div>Status</div>
          <div>Release / Cancel</div>
          <div />
        </div>
        {sends.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="font-display text-xl">No SafeSends yet.</div>
            <p className="mt-2 text-[13.5px] text-muted-foreground">
              Create one to see protected settlement in motion.
            </p>
            <Link
              href="/app/new"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[13.5px] font-medium text-background transition hover:bg-cyan"
            >
              Create your first SafeSend →
            </Link>
          </div>
        ) : (
          sends.map((s) => {
            const statusColor =
              s.status === "released"
                ? "text-emerald"
                : s.status === "blocked"
                  ? "text-red"
                  : s.status === "cancelled"
                    ? "text-muted-foreground"
                    : "text-cyan";
            return (
              <div
                key={s.id}
                className="grid grid-cols-[1.4fr_1fr_1.1fr_1.2fr_120px] items-center gap-4 border-b border-[var(--border)] px-5 py-3 last:border-b-0"
              >
                <div className="font-mono text-[12.5px]">{shortAddr(s.recipient, 5)}</div>
                <div className="text-[13.5px]">
                  {s.amount.toLocaleString()} <span className="text-muted-foreground">{s.token}</span>
                </div>
                <div className={`text-[12.5px] ${statusColor}`}>
                  <span className="inline-flex items-center gap-2">
                    <span className={`inline-flex h-1.5 w-1.5 rounded-full bg-current ${s.status === "pending_release" ? "animate-pulse-soft" : ""}`} />
                    {statusLabel(s.status)}
                  </span>
                </div>
                <div className="font-mono text-[12px] text-muted-foreground">
                  {s.status === "pending_release"
                    ? `releases in ${fmtCountdown(s.releaseAt)}`
                    : s.status === "released"
                      ? `settled ${new Date(s.releaseAt).toLocaleString()}`
                      : s.status === "cancelled"
                        ? "refunded"
                        : "—"}
                </div>
                <div className="flex justify-end">
                  {s.status === "pending_release" ? (
                    <button
                      onClick={() => cancelSend(s.id)}
                      className="rounded-full border border-[var(--border-strong)] bg-surface px-3 py-1 text-[11.5px] text-foreground transition hover:border-red hover:text-red"
                    >
                      Cancel
                    </button>
                  ) : (
                    <span className="font-mono text-[11px] text-muted-foreground">{s.id}</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
