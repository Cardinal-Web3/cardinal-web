"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSafeSends } from "@/lib/safesend-store";
import { shortAddr, VERDICT_DISPLAY } from "@/lib/mock-scan";
import {
  ARBITRUM_SEPOLIA,
  executeSafeSend,
  estimateSafeSend,
  getBlockchainErrorMessage,
  type SafeSendFeeQuote,
} from "@/lib/safesend-contract";
import { useWallet } from "@/lib/wallet-store";

export function ConfirmSafeSendPage() {
  const router = useRouter();
  const { drafts, createSend, clearDraft } = useSafeSends();
  const {
    address,
    chainId,
    provider,
    signer,
    status,
    openModal,
    switchToSafeSendNetwork,
    refresh,
  } = useWallet();
  const d = drafts["new"];
  const scan = d?.scan;
  const [signing, setSigning] = useState(false);
  const [step, setStep] = useState("Ready to estimate");
  const [quote, setQuote] = useState<SafeSendFeeQuote | null>(null);
  const [estimateError, setEstimateError] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);

  useEffect(() => {
    if (!d?.recipient || !d?.amount) {
      router.replace("/app/new");
      return;
    }
    if (!d.scan) router.replace("/app/new/scan");
  }, [d, router]);

  useEffect(() => {
    let cancelled = false;
    setQuote(null);
    setEstimateError(null);
    setTxError(null);

    if (!d?.recipient || !d?.amount || !scan || scan.verdict === "BLOCK") return;
    if (!address || !provider || !signer || chainId !== ARBITRUM_SEPOLIA.id) return;

    setStep("Estimating SafeSend cost");
    estimateSafeSend({
      provider,
      signer,
      owner: address,
      recipient: d.recipient,
      tokenSymbol: d.token,
      amount: d.amount,
      delayHours: d.delayHours ?? 24,
    })
      .then((nextQuote) => {
        if (cancelled) return;
        setQuote(nextQuote);
        setStep("Ready for wallet signature");
      })
      .catch((error) => {
        if (cancelled) return;
        setEstimateError(getBlockchainErrorMessage(error));
        setStep("Estimate failed");
      });

    return () => {
      cancelled = true;
    };
  }, [address, chainId, d, provider, scan, signer]);

  if (!d || !scan) return null;

  async function sign() {
    const currentScan = d?.scan;
    if (!currentScan || currentScan.verdict === "BLOCK" || !quote) return;
    if (!address || !signer) {
      openModal();
      return;
    }

    setSigning(true);
    setTxError(null);
    try {
      const result = await executeSafeSend({
        signer,
        owner: address,
        recipient: d.recipient!,
        quote,
        onStep: setStep,
      });
      const send = createSend({
        transferId: result.transferId,
        txHash: result.txHash,
        approvalTxHash: result.approvalTxHash,
        recipient: d.recipient!,
        token: quote.token.symbol,
        tokenAddress: quote.token.address,
        amount: d.amount!,
        feeAmount: Number(quote.safeSendFeeFormatted),
        recipientAmount: Number(quote.recipientReceivesFormatted),
        gasEstimateEth: quote.estimatedGasEth,
        delayHours: d.delayHours ?? 24,
        cancelWindowHours: d.cancelWindowHours ?? 24,
        memo: d.memo,
        status: "pending_release",
        verdict: currentScan.verdict,
        scan: currentScan,
        mode: "live_contract",
      });
      clearDraft("new");
      router.push(`/app/new/receipt/${send.id}`);
    } catch (error) {
      setTxError(getBlockchainErrorMessage(error));
      setStep("Signature not completed");
    } finally {
      setSigning(false);
    }
  }

  const connected = status === "connected" && !!address;
  const wrongNetwork = connected && chainId !== ARBITRUM_SEPOLIA.id;
  const canSign =
    connected &&
    !wrongNetwork &&
    !!quote &&
    !estimateError &&
    !signing &&
    scan.verdict !== "BLOCK" &&
    quote.balanceRaw >= quote.amountRaw;

  return (
    <div className="surface-card relative overflow-hidden p-5 sm:p-7">
      <div className="aurora pointer-events-none absolute -right-40 -top-40 h-80 w-80 opacity-20" />
      <div className="relative">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="font-display text-[26px] tracking-tight">Confirm SafeSend</div>
            <p className="mt-1 max-w-xl text-[13.5px] text-muted-foreground">
              Review fees, approve the test token if needed, then lock funds with SafeSend.
            </p>
          </div>
          <div className="rounded-full border border-[var(--border)] bg-surface-elevated/75 px-3 py-1 font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
            {step}
          </div>
        </div>

        <div className="mt-7 grid gap-3 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-3">
            <Row
              label="Recipient"
              value={<span className="font-mono">{shortAddr(d.recipient!, 6)}</span>}
            />
            <Row
              label="Amount locked"
              value={
                <>
                  {d.amount!.toLocaleString()}{" "}
                  <span className="text-muted-foreground">
                    {quote?.token.symbol ?? d.token}
                  </span>
                </>
              }
            />
            <Row label="Delay" value={`${d.delayHours}h`} />
            <Row label="Network" value={ARBITRUM_SEPOLIA.name} />
            <Row label="Scan mode" value={scan.mode === "live" ? "Live backend" : "Demo"} />
            {scan.requestId && (
              <Row label="Request ID" value={<span className="font-mono">{scan.requestId}</span>} />
            )}
            <Row
              label="Verdict"
              value={
                <span
                  className={
                    scan.verdict === "ALLOW"
                      ? "text-emerald"
                      : scan.verdict === "REVIEW"
                        ? "text-amber"
                        : "text-red"
                  }
                >
                  {VERDICT_DISPLAY[scan.verdict].label}
                </span>
              }
            />
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-surface-elevated/70 p-4 shadow-[var(--shadow-3d)]">
            <div className="flex items-center justify-between">
              <div>
                <div className="eyebrow mb-1">Settlement preview</div>
                <div className="text-[13px] text-muted-foreground">
                  Contract fee is deducted on release.
                </div>
              </div>
              <span className="inline-flex h-2 w-2 rounded-full bg-cyan shadow-[0_0_16px_oklch(0.82_0.13_210)]" />
            </div>

            <div className="mt-5 space-y-2">
              <PreviewRow
                label="Cardinal fee"
                value={
                  quote
                    ? `${quote.safeSendFeeFormatted} ${quote.token.symbol}`
                    : "Estimating..."
                }
              />
              <PreviewRow
                label="Recipient receives"
                value={
                  quote
                    ? `${quote.recipientReceivesFormatted} ${quote.token.symbol}`
                    : "Estimating..."
                }
                strong
              />
              <PreviewRow
                label="Network gas"
                value={quote ? `~${quote.estimatedGasEth} ETH` : "Estimating..."}
              />
              <PreviewRow
                label="Approval"
                value={
                  quote
                    ? quote.approvalRequired
                      ? "Required"
                      : "Already approved"
                    : "Checking..."
                }
              />
            </div>

            {quote && quote.balanceRaw < quote.amountRaw && (
              <div className="mt-4 rounded-xl border border-red/30 bg-red/10 px-3 py-2 text-[12.5px] text-red">
                Wallet balance is lower than the amount to lock.
              </div>
            )}
            {estimateError && (
              <div className="mt-4 rounded-xl border border-amber/30 bg-amber/10 px-3 py-2 text-[12.5px] text-amber">
                {estimateError}
              </div>
            )}
            {txError && (
              <div className="mt-4 rounded-xl border border-red/30 bg-red/10 px-3 py-2 text-[12.5px] text-red">
                {txError}
              </div>
            )}

            <div className="mt-5 rounded-xl border border-[var(--border)] bg-background/35 px-3 py-3">
              <div className="eyebrow mb-2">Wallet steps</div>
              <div className="grid gap-2 text-[12.5px] text-muted-foreground">
                <Step done={!quote?.approvalRequired} active={quote?.approvalRequired}>
                  {quote?.approvalRequired
                    ? `Approve ${quote.token.symbol}`
                    : "Token allowance ready"}
                </Step>
                <Step active>Sign SafeSend lock transaction</Step>
                <Step>Funds release after delay, or sender cancels before release</Step>
              </div>
            </div>
          </div>
        </div>

        {!connected && (
          <div className="mt-5 rounded-xl border border-cyan/25 bg-cyan/10 px-4 py-3 text-[13px] text-cyan">
            Connect MetaMask to estimate gas and lock funds on Arbitrum Sepolia.
          </div>
        )}
        {wrongNetwork && (
          <div className="mt-5 rounded-xl border border-amber/30 bg-amber/10 px-4 py-3 text-[13px] text-amber">
            Switch MetaMask to Arbitrum Sepolia before signing.
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 border-t border-[var(--border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => router.push("/app/new/verdict")}
            className="rounded-full border border-[var(--border-strong)] bg-surface-elevated px-4 py-2 text-[13px] transition hover:border-foreground"
          >
            ← Back to verdict
          </button>
          {wrongNetwork ? (
            <button
              onClick={async () => {
                await switchToSafeSendNetwork();
                await refresh();
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-amber px-5 py-2.5 text-[13.5px] font-medium text-background transition hover:opacity-90"
            >
              Switch network →
            </button>
          ) : !connected ? (
            <button
              onClick={openModal}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[13.5px] font-medium text-background transition hover:bg-cyan"
            >
              Connect MetaMask →
            </button>
          ) : (
            <button
              onClick={sign}
              disabled={!canSign}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[13.5px] font-medium text-background transition hover:bg-cyan disabled:cursor-not-allowed disabled:opacity-50"
            >
              {scan.verdict === "BLOCK" ? (
                <>Blocked by Cardinal</>
              ) : signing ? (
                <>
                  <span className="inline-flex h-1.5 w-1.5 animate-pulse-soft rounded-full bg-cyan" />
                  {step}
                </>
              ) : (
                <>Sign & lock funds →</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-[var(--border)] bg-surface-elevated/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="eyebrow">{label}</div>
      <div className="break-all text-[14px] sm:text-right">{value}</div>
    </div>
  );
}

function PreviewRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-surface px-3 py-2.5">
      <div className="text-[12.5px] text-muted-foreground">{label}</div>
      <div className={`font-mono text-[12.5px] ${strong ? "text-emerald" : "text-foreground"}`}>
        {value}
      </div>
    </div>
  );
}

function Step({
  children,
  active,
  done,
}: {
  children: React.ReactNode;
  active?: boolean;
  done?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex h-1.5 w-1.5 rounded-full ${
          done ? "bg-emerald" : active ? "animate-pulse-soft bg-cyan" : "bg-[var(--border-strong)]"
        }`}
      />
      <span>{children}</span>
    </div>
  );
}
