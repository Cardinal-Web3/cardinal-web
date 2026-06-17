import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useSafeSends } from "@/lib/safesend-store";
import { SAMPLE_ADDRESSES } from "@/lib/mock-scan";

export const Route = createFileRoute("/app/new/")({
  component: Page,
});

function Page() {
  const nav = useNavigate();
  const { drafts, setDraft } = useSafeSends();
  const d = drafts["new"] ?? {};
  const [recipient, setRecipient] = useState<string>(d.recipient ?? "");
  const [token, setToken] = useState<string>(d.token ?? "USDC");
  const [amount, setAmount] = useState<string>(d.amount ? String(d.amount) : "");
  const [delay, setDelay] = useState<number>(d.delayHours ?? 24);
  const [cancelWindow, setCancelWindow] = useState<number>(d.cancelWindowHours ?? 24);
  const [memo, setMemo] = useState<string>(d.memo ?? "");

  const validRecipient = /^0x[a-fA-F0-9]{40}$/.test(recipient);
  const validAmount = Number(amount) > 0;
  const canContinue = validRecipient && validAmount;

  function onContinue() {
    setDraft("new", {
      recipient,
      token,
      amount: Number(amount),
      delayHours: delay,
      cancelWindowHours: cancelWindow,
      memo,
    });
    nav({ to: "/app/new/scan" });
  }

  return (
    <div className="glass-panel p-7">
      <div className="font-display text-[26px] tracking-tight">Compose transfer</div>
      <p className="mt-1 text-[13.5px] text-muted-foreground">
        We'll scan before you sign. Funds lock on signature and release after the delay.
      </p>

      <div className="mt-7 space-y-4">
        <div>
          <Label>Recipient</Label>
          <div className="relative">
            <input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value.trim())}
              placeholder="0x…"
              className="w-full rounded-xl border border-[var(--border-strong)] bg-[oklch(0.17_0.011_250)] px-4 py-3 font-mono text-[13.5px] focus:border-cyan focus:outline-none"
            />
            {recipient && (
              <div
                className={`mt-1.5 font-mono text-[11px] ${
                  validRecipient ? "text-emerald" : "text-red"
                }`}
              >
                {validRecipient ? "✓ valid address format" : "✗ expected 0x + 40 hex chars"}
              </div>
            )}
            {!recipient && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {SAMPLE_ADDRESSES.map((a) => (
                  <button
                    key={a}
                    onClick={() => setRecipient(a)}
                    className="rounded-full border border-[var(--border)] bg-surface px-2.5 py-1 font-mono text-[10.5px] text-muted-foreground transition hover:border-cyan hover:text-cyan"
                  >
                    {a.slice(0, 8)}…{a.slice(-4)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-[140px_1fr] gap-3">
          <div>
            <Label>Token</Label>
            <select
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full rounded-xl border border-[var(--border-strong)] bg-[oklch(0.17_0.011_250)] px-4 py-3 text-[13.5px] focus:border-cyan focus:outline-none"
            >
              {["USDC", "USDT", "ETH", "DAI"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Amount</Label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="0.00"
              className="w-full rounded-xl border border-[var(--border-strong)] bg-[oklch(0.17_0.011_250)] px-4 py-3 font-mono text-[14px] focus:border-cyan focus:outline-none"
            />
          </div>
        </div>

        <div>
          <Label>Delay before release · {delay}h</Label>
          <input
            type="range"
            min={1}
            max={72}
            value={delay}
            onChange={(e) => setDelay(Number(e.target.value))}
            className="w-full accent-cyan"
          />
          <div className="mt-1 flex justify-between font-mono text-[10.5px] text-muted-foreground">
            <span>1h</span>
            <span>24h</span>
            <span>72h</span>
          </div>
        </div>

        <div>
          <Label>Cancel window · {cancelWindow}h</Label>
          <input
            type="range"
            min={1}
            max={72}
            value={cancelWindow}
            onChange={(e) => setCancelWindow(Number(e.target.value))}
            className="w-full accent-cyan"
          />
        </div>

        <div>
          <Label>Memo (optional)</Label>
          <input
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="Invoice #1842"
            className="w-full rounded-xl border border-[var(--border-strong)] bg-[oklch(0.17_0.011_250)] px-4 py-3 text-[13.5px] focus:border-cyan focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-[var(--border)] pt-6">
        <div className="text-[12px] text-muted-foreground">
          Gas est. <span className="font-mono text-foreground">0.0021 ETH</span>
        </div>
        <button
          onClick={onContinue}
          disabled={!canContinue}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[13.5px] font-medium text-background transition hover:bg-cyan disabled:cursor-not-allowed disabled:opacity-30"
        >
          Scan with Cardinal →
        </button>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="eyebrow mb-2">{children}</div>;
}
