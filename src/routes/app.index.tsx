import { createFileRoute, Link } from "@tanstack/react-router";
import { useSafeSends, statusLabel } from "@/lib/safesend-store";
import { shortAddr } from "@/lib/mock-scan";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

export const Route = createFileRoute("/app/")({
  component: Page,
});

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

function Page() {
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
    <div className="mx-auto max-w-[1100px]">
      <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        My SafeSends
      </div>
      <h1 className="wordmark-display mt-4 text-[clamp(48px,8vw,120px)]">
        Protected.
      </h1>
      <p className="mt-3 max-w-md text-[14px] text-muted-foreground">
        Locked, in-flight, and settled protected transfers.
      </p>

      <div className="mt-14 space-y-3" style={{ perspective: 2000 }}>
        {sends.length === 0 ? (
          <div className="glass-panel p-16 text-center">
            <div className="font-display text-[28px] tracking-tight">No SafeSends yet.</div>
            <p className="mt-2 text-[13.5px] text-muted-foreground">
              Create one to see protected settlement in motion.
            </p>
            <Link
              to="/app/new"
              className="mt-7 inline-flex rounded-md bg-lime px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-background transition hover:opacity-90"
            >
              + Create your first SafeSend
            </Link>
          </div>
        ) : (
          sends.map((s, i) => {
            const statusColor =
              s.status === "released"
                ? "text-emerald"
                : s.status === "blocked"
                ? "text-red"
                : s.status === "cancelled"
                ? "text-muted-foreground"
                : "text-lime";
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                whileHover={{ rotateY: 1.5, rotateX: -1, y: -2 }}
                style={{ transformStyle: "preserve-3d" }}
                className="glass-panel grid grid-cols-[1.5fr_1fr_1fr_1fr_auto] items-center gap-6 px-6 py-5 transition"
              >
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    Recipient
                  </div>
                  <div className="mt-1 font-mono text-[15px] text-foreground">
                    {shortAddr(s.recipient, 6)}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    Amount
                  </div>
                  <div className="mt-1 font-display text-[18px]">
                    {s.amount.toLocaleString()}{" "}
                    <span className="text-muted-foreground text-[14px]">{s.token}</span>
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    Status
                  </div>
                  <div className={`mt-1 inline-flex items-center gap-2 text-[13px] ${statusColor}`}>
                    <span
                      className={`inline-flex h-1.5 w-1.5 rounded-full bg-current ${
                        s.status === "pending_release" ? "animate-pulse-soft" : ""
                      }`}
                    />
                    {statusLabel(s.status)}
                  </div>
                </div>
                <div className="font-mono text-[12px] text-muted-foreground">
                  {s.status === "pending_release"
                    ? `releases in ${fmtCountdown(s.releaseAt)}`
                    : s.status === "released"
                    ? "settled"
                    : s.status === "cancelled"
                    ? "refunded"
                    : "—"}
                </div>
                <div>
                  {s.status === "pending_release" ? (
                    <button
                      onClick={() => cancelSend(s.id)}
                      className="rounded-md border border-[var(--border-strong)] bg-surface/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition hover:border-red hover:text-red"
                    >
                      Cancel
                    </button>
                  ) : (
                    <Link
                      to="/app/new/receipt/$id"
                      params={{ id: s.id }}
                      className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition hover:text-foreground"
                    >
                      View →
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
