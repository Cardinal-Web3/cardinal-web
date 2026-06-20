"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSafeSends } from "@/lib/safesend-store";
import { scanTransaction, shortAddr, VERDICT_DISPLAY } from "@/lib/mock-scan";

export function ConfirmSafeSendPage() {
  const router = useRouter();
  const { drafts, createSend, clearDraft } = useSafeSends();
  const d = drafts["new"];
  const [signing, setSigning] = useState(false);

  useEffect(() => {
    if (!d?.recipient || !d?.amount) router.replace("/app/new");
  }, [d, router]);

  if (!d) return null;

  const scan = scanTransaction({
    recipient: d.recipient!,
    amount: d.amount!,
    token: d.token ?? "USDC",
  });

  function sign() {
    setSigning(true);
    setTimeout(() => {
      const send = createSend({
        recipient: d.recipient!,
        token: d.token ?? "USDC",
        amount: d.amount!,
        delayHours: d.delayHours ?? 24,
        cancelWindowHours: d.cancelWindowHours ?? 24,
        memo: d.memo,
        status: scan.verdict === "BLOCK" ? "blocked" : "pending_release",
        verdict: scan.verdict,
        scan,
      });
      clearDraft("new");
      router.push(`/app/new/receipt/${send.id}`);
    }, 1800);
  }

  return (
    <div className="surface-card p-7">
      <div className="font-display text-[26px] tracking-tight">Confirm SafeSend</div>
      <p className="mt-1 text-[13.5px] text-muted-foreground">
        Review the protected transfer after Cardinal&apos;s verdict. Funds lock the moment you sign.
      </p>

      <div className="mt-7 grid gap-3">
        <Row label="Recipient" value={<span className="font-mono">{shortAddr(d.recipient!, 6)}</span>} />
        <Row label="Amount" value={<>{d.amount!.toLocaleString()} <span className="text-muted-foreground">{d.token}</span></>} />
        <Row label="Delay" value={`${d.delayHours}h`} />
        <Row label="Cancel window" value={`${d.cancelWindowHours}h`} />
        <Row label="Gas estimate" value={<span className="font-mono">0.0021 ETH</span>} />
        <Row
          label="Verdict"
          value={
            <span className={scan.verdict === "ALLOW" ? "text-emerald" : scan.verdict === "REVIEW" ? "text-amber" : "text-red"}>
              {VERDICT_DISPLAY[scan.verdict].label}
            </span>
          }
        />
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-[var(--border)] pt-6">
        <button
          onClick={() => router.push("/app/new/verdict")}
          className="rounded-full border border-[var(--border-strong)] bg-surface-elevated px-4 py-2 text-[13px] transition hover:border-foreground"
        >
          ← Back to verdict
        </button>
        <button
          onClick={sign}
          disabled={signing}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[13.5px] font-medium text-background transition hover:bg-cyan disabled:opacity-60"
        >
          {signing ? (
            <>
              <span className="inline-flex h-1.5 w-1.5 animate-pulse-soft rounded-full bg-cyan" />
              Signing & locking…
            </>
          ) : (
            <>Sign & lock funds →</>
          )}
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-surface-elevated/70 px-4 py-3">
      <div className="eyebrow">{label}</div>
      <div className="text-[14px]">{value}</div>
    </div>
  );
}
