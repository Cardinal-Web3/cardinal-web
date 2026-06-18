import { AnimatePresence, motion } from "motion/react";
import { useWallet, WALLETS, shortAddress, type WalletId } from "@/lib/wallet-store";

export function WalletButton() {
  const { status, address, openModal, disconnect } = useWallet();

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
  const { modalOpen, closeModal, connect, status, wallet } = useWallet();

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
            className="surface-card relative w-full max-w-sm overflow-hidden p-6"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/70 to-transparent" />
            <div className="eyebrow mb-1">Cardinal Vault</div>
            <h3 className="font-display text-xl">Connect a wallet</h3>
            <p className="mt-1 text-[12.5px] text-muted-foreground">
              Cardinal will scan every transaction before you sign.
            </p>

            <ul className="mt-5 space-y-1.5">
              {WALLETS.map((w, i) => {
                const isConnecting = status === "connecting" && wallet === w.id;
                const dimmed = status === "connecting" && wallet !== w.id;
                return (
                  <motion.li
                    key={w.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: dimmed ? 0.4 : 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <button
                      disabled={status === "connecting"}
                      onClick={() => connect(w.id as WalletId)}
                      className="group flex w-full items-center justify-between rounded-xl border border-[var(--border)] bg-surface px-3.5 py-3 text-left text-[13.5px] transition hover:border-cyan disabled:cursor-wait"
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className="h-7 w-7 rounded-lg"
                          style={{
                            background: `linear-gradient(135deg, ${w.color}, ${w.color}80)`,
                          }}
                        />
                        <span className="font-medium">{w.name}</span>
                      </span>
                      {isConnecting ? (
                        <motion.span
                          className="inline-block h-3.5 w-3.5 rounded-full border-2 border-cyan border-t-transparent"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                        />
                      ) : (
                        <span className="text-[11px] text-muted-foreground transition group-hover:text-cyan">
                          →
                        </span>
                      )}
                    </button>
                  </motion.li>
                );
              })}
            </ul>

            <div className="mt-5 flex items-center justify-between border-t border-[var(--border)] pt-4 text-[11px] text-muted-foreground">
              <span>Pilot · simulated connection</span>
              <button onClick={closeModal} className="hover:text-foreground">
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
