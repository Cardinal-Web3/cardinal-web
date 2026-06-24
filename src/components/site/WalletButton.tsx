"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { useWallet, WALLETS, shortAddress, type WalletId } from "@/lib/wallet-store";

export function WalletButton() {
  const { status, address, openModal, disconnect, refresh } = useWallet();

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (status === "connected" && address) {
    return (
      <motion.div
        layoutId="wallet-pill"
        className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-emerald/40 bg-surface-elevated px-3 py-1.5 text-[12.5px]"
      >
        <span className="relative inline-flex h-2 w-2">
          <span className="absolute inset-0 animate-ping-ring rounded-full bg-emerald/60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald" />
        </span>
        <span className="font-mono">{shortAddress(address)}</span>
        <button
          onClick={disconnect}
          className="ml-1 rounded-full px-1.5 py-0.5 text-[10px] text-muted-foreground transition hover:text-red"
          aria-label="Disconnect wallet"
        >
          ✕
        </button>
      </motion.div>
    );
  }

  return (
    <motion.button
      layoutId="wallet-pill"
      onClick={openModal}
      className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-1.5 text-[13px] font-medium text-background transition hover:bg-cyan"
    >
      <span className="relative inline-flex h-1.5 w-1.5">
        <span className="absolute inset-0 animate-ping-ring rounded-full bg-cyan/60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan" />
      </span>
      Connect Wallet
    </motion.button>
  );
}

export function WalletModal() {
  const { modalOpen, closeModal, connect, status, wallet, error } = useWallet();

  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-background/60 backdrop-blur-xl"
            onClick={closeModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="relative max-h-[calc(100dvh-2rem)] w-full max-w-[420px] overflow-y-auto overscroll-contain rounded-[24px] border border-[var(--border-strong)] bg-background/92 p-5 shadow-[0_28px_90px_oklch(0_0_0_/_0.55)] backdrop-blur-2xl sm:p-6"
          >
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan/80 to-transparent" />
            <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-cyan/10 blur-3xl" />

            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="eyebrow mb-2">Cardinal Vault</div>
                <h3 className="font-display text-[22px] leading-tight">Connect wallet</h3>
                <p className="mt-2 max-w-[310px] text-[13px] leading-relaxed text-muted-foreground">
                  Use MetaMask for the SafeSend pilot on Arbitrum Sepolia.
                </p>
              </div>
              <div className="rounded-full border border-cyan/30 bg-cyan/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan">
                Pilot
              </div>
            </div>

            <ul className="mt-6 space-y-2">
              {WALLETS.map((w, i) => {
                const isConnecting = status === "connecting" && wallet === w.id;
                const dimmed = status === "connecting" && wallet !== w.id;
                const isActive = w.id === "metamask";
                return (
                  <motion.li
                    key={w.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: dimmed ? 0.4 : 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <button
                      disabled={status === "connecting" || !isActive}
                      onClick={() => connect(w.id as WalletId)}
                      className={[
                        "group flex w-full items-center justify-between rounded-2xl border px-3.5 py-3 text-left transition",
                        isActive
                          ? "border-cyan/25 bg-surface-elevated hover:border-cyan hover:bg-cyan/5 disabled:cursor-wait"
                          : "cursor-not-allowed border-[var(--border)] bg-surface/50 opacity-70",
                      ].join(" ")}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <WalletIcon id={w.id as WalletId} />
                        <span>
                          <span className="block text-[14px] font-medium text-foreground">
                            {w.name}
                          </span>
                          <span className="mt-0.5 block text-[11px] text-muted-foreground">
                            {isActive ? "Available now" : "Coming soon"}
                          </span>
                        </span>
                      </span>
                      {isConnecting ? (
                        <motion.span
                          className="inline-block h-3.5 w-3.5 rounded-full border-2 border-cyan border-t-transparent"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                        />
                      ) : (
                        <span
                          className={[
                            "rounded-full px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] transition",
                            isActive
                              ? "bg-cyan/10 text-cyan group-hover:bg-cyan group-hover:text-background"
                              : "bg-surface-elevated text-muted-foreground",
                          ].join(" ")}
                        >
                          {isActive ? "Connect" : "Soon"}
                        </span>
                      )}
                    </button>
                  </motion.li>
                );
              })}
            </ul>

            {error && (
              <div className="mt-4 rounded-xl border border-amber/30 bg-amber/10 px-3 py-2 text-[12px] text-amber">
                {error}
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] pt-4 text-[11px] text-muted-foreground">
              <span>MetaMask required for pilot testing</span>
              <button onClick={closeModal} className="rounded-full px-2 py-1 transition hover:bg-surface hover:text-foreground">
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function WalletIcon({ id }: { id: WalletId }) {
  const tile = "grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-2xl";

  if (id === "metamask") {
    return (
      <span className={`${tile} bg-gradient-to-b from-[#3a2410] to-[#1f1408] ring-1 ring-[#f6851b]/30`}>
        <svg viewBox="0 0 212 189" className="h-7 w-7" aria-hidden="true">
          <path fill="#E17726" stroke="#E17726" strokeWidth="1" strokeLinejoin="round" d="m198.4 1-78.6 58.3 14.6-34.4z" />
          <path fill="#E27625" stroke="#E27625" strokeWidth="1" strokeLinejoin="round" d="m13.6 1 77.9 58.8L77.6 24.9zM169.5 137.2l-20.9 32 44.8 12.3 12.8-43.6zm-163.2.7L19 181.5l44.8-12.3-20.9-32z" />
          <path fill="#E27625" stroke="#E27625" strokeWidth="1" strokeLinejoin="round" d="m61.3 82.2-12.5 18.8 44.5 2-1.5-47.9zm89.4 0L116.9 54.3l-1 48.7 44.4-2zM63.8 169.2l26.9-13-23.2-18.1zm57.5-13 26.8 13-3.6-31.1z" />
          <path fill="#D5BFB2" stroke="#D5BFB2" strokeWidth="1" strokeLinejoin="round" d="m148.1 169.2-26.8-13 2.2 17.4-.3 7.4zm-84.3 0 25 11.8-.2-7.4 2-17.4z" />
          <path fill="#233447" stroke="#233447" strokeWidth="1" strokeLinejoin="round" d="m89.2 124.9-22.4-6.6 15.8-7.2zm33.5 0 6.7-13.8 15.9 7.2z" />
          <path fill="#CC6228" stroke="#CC6228" strokeWidth="1" strokeLinejoin="round" d="m63.8 169.2 3.8-32-24.7.7zm80.6-32 3.7 32 20.9-31.3zm22.2-36.2-44.4 2 4.1 22.9 6.7-13.8 15.9 7.2zM66.8 118.3l15.9-7.2 6.6 13.8 4.2-22.9-44.5-2z" />
          <path fill="#E27525" stroke="#E27525" strokeWidth="1" strokeLinejoin="round" d="m48.8 101 18.7 36.4-.7-18.1zm96.4 18.3-.8 18.1L163.2 101zm-51.9-16.3-4.2 22.9 5.2 26.9 1.2-35.4zm25 0-2.1 14.3 1.1 35.5 5.3-26.9z" />
          <path fill="#F5841F" stroke="#F5841F" strokeWidth="1" strokeLinejoin="round" d="m122.8 124.9-5.3 26.9 3.8 2.6 23.2-18.1.8-18.1zm-56-6.6.7 18.1 23.2 18.1 3.8-2.6-5.2-26.9z" />
          <path fill="#C0AC9D" stroke="#C0AC9D" strokeWidth="1" strokeLinejoin="round" d="m123.2 181 .3-7.4-2-1.7H90.6l-1.9 1.7.2 7.4-25-11.8 8.7 7.2 17.7 12.3h30.4l17.8-12.3 8.7-7.2z" />
          <path fill="#161616" stroke="#161616" strokeWidth="1" strokeLinejoin="round" d="m121.3 156.2-3.8-2.6h-23l-3.8 2.6-2 17.4 1.9-1.7h30.9l2 1.7z" />
          <path fill="#763E1A" stroke="#763E1A" strokeWidth="1" strokeLinejoin="round" d="M201.7 63.1 208.3 31 198.4 1l-77.1 57.2 29.7 25.1 41.9 12.3 9.3-10.8-4-2.9 6.4-5.8-5-3.8 6.4-4.9zM3.7 31l6.7 32.1-4.3 3.2 6.5 4.9-4.9 3.8 6.4 5.8-4 2.9 9.2 10.8 42-12.3 29.6-25.1L13.6 1z" />
          <path fill="#F5841F" stroke="#F5841F" strokeWidth="1" strokeLinejoin="round" d="m192.6 95.6-41.9-12.3 12.7 19.1-19 36.9 25-.3h37.3zM61.3 83.3 19.4 95.6 5.5 139h37.2l25 .3-19-36.9zM116.9 103l2.7-46.2 12.1-32.7H80.4l12 32.7 2.8 46.2 1 14.5.1 35.8h23l.2-35.8z" />
        </svg>
      </span>
    );
  }

  if (id === "walletconnect") {
    return (
      <span className={`${tile} bg-[#3396ff]`}>
        <svg viewBox="0 0 300 185" className="h-6 w-6" aria-hidden="true">
          <path
            fill="#fff"
            d="M61.4 36.3c48.9-47.9 128.2-47.9 177.1 0l5.9 5.8c2.5 2.4 2.5 6.3 0 8.7l-20.1 19.7c-1.2 1.2-3.2 1.2-4.4 0l-8.1-7.9c-34.1-33.4-89.4-33.4-123.5 0l-8.7 8.5c-1.2 1.2-3.2 1.2-4.4 0L54.9 51.4c-2.5-2.4-2.5-6.3 0-8.7zm218.7 40.8 17.9 17.5c2.5 2.4 2.5 6.3 0 8.7l-80.7 79.1c-2.5 2.4-6.4 2.4-8.9 0l-57.3-56.1c-.6-.6-1.6-.6-2.2 0l-57.3 56.1c-2.5 2.4-6.4 2.4-8.9 0L2 103.3c-2.5-2.4-2.5-6.3 0-8.7l17.9-17.5c2.5-2.4 6.4-2.4 8.9 0l57.3 56.1c.6.6 1.6.6 2.2 0l57.3-56.1c2.5-2.4 6.4-2.4 8.9 0l57.3 56.1c.6.6 1.6.6 2.2 0l57.3-56.1c2.4-2.4 6.4-2.4 8.8 0z"
          />
        </svg>
      </span>
    );
  }

  if (id === "coinbase") {
    return (
      <span className={`${tile} bg-[#0052ff]`}>
        <svg viewBox="0 0 1024 1024" className="h-9 w-9" aria-hidden="true">
          <path
            fill="#fff"
            d="M512 692c-99.4 0-180-80.6-180-180s80.6-180 180-180c89.1 0 163.1 64.8 177.4 149.8h181.3C854.3 304.4 700.9 168 512 168 322.8 168 168 322.8 168 512s154.8 344 344 344c188.9 0 342.3-136.4 358.7-313.8H689.4C675.1 627.2 601.1 692 512 692z"
          />
        </svg>
      </span>
    );
  }

  return (
    <span className={`${tile} bg-gradient-to-br from-[#8697ff] to-[#6075f0]`}>
      <svg viewBox="0 0 40 40" className="h-6 w-6" aria-hidden="true">
        <path
          fill="#fff"
          d="M31.8 17.6c1.5-3.6-3.1-9.6-8.7-11.5-5.4-1.9-8.4-.7-9.3 1.6-1.3 3.5 3.3 5.1 7.5 6.8 5.9 2.4-1.5 4.8-7.8 8.2-5.6 3-7.9 6.9-5.2 10.6 2.4 3.3 9.3 4.4 15.2 1.3 7.4-3.8 6-9.1 4.3-11.8-1.1-1.7-1.5-2.4-1-3.7.3-.9 1.5-.6 3.2-.4 1.1.1 2.2.2 3.1-.1-.4-.3-1.1-.6-1.7-.8-.9-.3-1.6-.5-1.3-1.3z"
        />
        <circle cx="22.5" cy="14.5" r="1.6" fill="#6075f0" />
      </svg>
    </span>
  );
}
