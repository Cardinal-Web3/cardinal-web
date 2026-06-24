"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSafeSends, statusLabel } from "@/lib/safesend-store";
import { shortAddr } from "@/lib/mock-scan";
import {
  cancelSafeSendOnChain,
  explorerTxUrl,
  readSafeSendStatus,
  releaseSafeSendOnChain,
} from "@/lib/safesend-contract";
import { useWallet } from "@/lib/wallet-store";

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
  const { sends, cancelSend, updateSend } = useSafeSends();
  const { provider, signer, openModal } = useWallet();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    const t = setInterval(() => {
      const now = Date.now();
      for (const s of useSafeSends.getState().sends) {
        if (!s.transferId && s.status === "pending_release" && s.releaseAt <= now) {
          useSafeSends.getState().updateSend(s.id, { status: "released" });
        }
      }
    }, 2000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!provider) return;
    let cancelled = false;
    const hydrate = async () => {
      const current = useSafeSends.getState().sends.filter((s) => s.transferId);
      for (const send of current) {
        try {
          const status = await readSafeSendStatus(provider, send.transferId!);
          if (cancelled) return;
          if (status === "Released") {
            useSafeSends.getState().updateSend(send.id, { status: "released" });
          } else if (status === "Cancelled") {
            useSafeSends.getState().updateSend(send.id, { status: "cancelled" });
          }
        } catch {
          // Keep local state if the chain read fails.
        }
      }
    };
    void hydrate();
    const t = setInterval(hydrate, 15_000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [provider]);

  async function cancel(sendId: string, transferId?: string) {
    setActionError(null);
    if (!transferId) {
      cancelSend(sendId);
      return;
    }
    if (!signer) {
      openModal();
      return;
    }
    setBusyId(sendId);
    try {
      await cancelSafeSendOnChain(signer, transferId);
      updateSend(sendId, { status: "cancelled" });
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Cancel transaction failed.");
    } finally {
      setBusyId(null);
    }
  }

  async function release(sendId: string, transferId?: string) {
    setActionError(null);
    if (!transferId) {
      updateSend(sendId, { status: "released" });
      return;
    }
    if (!signer) {
      openModal();
      return;
    }
    setBusyId(sendId);
    try {
      await releaseSafeSendOnChain(signer, transferId);
      updateSend(sendId, { status: "released" });
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Release transaction failed.");
    } finally {
      setBusyId(null);
    }
  }

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

      {actionError && (
        <div className="mt-5 rounded-xl border border-red/30 bg-red/10 px-4 py-3 text-[13px] text-red">
          {actionError}
        </div>
      )}

      <div className="surface-card mt-8 overflow-hidden">
        <div className="hidden grid-cols-[1.4fr_1fr_1.1fr_1.2fr_150px] gap-4 border-b border-[var(--border)] px-5 py-3 font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground md:grid">
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
                className="grid gap-3 border-b border-[var(--border)] px-5 py-4 last:border-b-0 md:grid-cols-[1.4fr_1fr_1.1fr_1.2fr_150px] md:items-center md:gap-4 md:py-3"
              >
                <div>
                  <div className="font-mono text-[12.5px]">{shortAddr(s.recipient, 5)}</div>
                  {s.txHash && (
                    <a
                      href={explorerTxUrl(s.txHash)}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex text-[11px] text-cyan hover:underline"
                    >
                      View tx →
                    </a>
                  )}
                </div>
                <div className="text-[13.5px]">
                  {s.amount.toLocaleString()} <span className="text-muted-foreground">{s.token}</span>
                  {typeof s.recipientAmount === "number" && (
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      recipient gets {s.recipientAmount} {s.token}
                    </div>
                  )}
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
                    <div className="flex flex-wrap justify-end gap-2">
                      {s.releaseAt <= Date.now() && (
                        <button
                          onClick={() => release(s.id, s.transferId)}
                          disabled={busyId === s.id}
                          className="rounded-full border border-emerald/40 bg-emerald/10 px-3 py-1 text-[11.5px] text-emerald transition hover:bg-emerald/15 disabled:opacity-50"
                        >
                          {busyId === s.id ? "Working..." : "Release"}
                        </button>
                      )}
                      <button
                        onClick={() => cancel(s.id, s.transferId)}
                        disabled={busyId === s.id || s.releaseAt <= Date.now()}
                        className="rounded-full border border-[var(--border-strong)] bg-surface px-3 py-1 text-[11.5px] text-foreground transition hover:border-red hover:text-red disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        {busyId === s.id ? "Working..." : "Cancel"}
                      </button>
                    </div>
                  ) : (
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {s.transferId ? `#${s.transferId}` : s.id}
                    </span>
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
