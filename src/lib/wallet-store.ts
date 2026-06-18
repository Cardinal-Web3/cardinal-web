import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WalletStatus = "idle" | "connecting" | "connected" | "error";
export type WalletId = "metamask" | "walletconnect" | "coinbase" | "rabby";

export const WALLETS: { id: WalletId; name: string; color: string }[] = [
  { id: "metamask", name: "MetaMask", color: "#f6851b" },
  { id: "walletconnect", name: "WalletConnect", color: "#3b99fc" },
  { id: "coinbase", name: "Coinbase Wallet", color: "#0052ff" },
  { id: "rabby", name: "Rabby", color: "#7084ff" },
];

type State = {
  status: WalletStatus;
  address: string | null;
  chain: string;
  wallet: WalletId | null;
  modalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  connect: (w: WalletId) => Promise<void>;
  disconnect: () => void;
};

function fakeAddress() {
  const hex = "0123456789abcdef";
  let s = "0x";
  for (let i = 0; i < 40; i++) s += hex[Math.floor(Math.random() * 16)];
  return s;
}

export const useWallet = create<State>()(
  persist(
    (set) => ({
      status: "idle",
      address: null,
      chain: "Ethereum",
      wallet: null,
      modalOpen: false,
      openModal: () => set({ modalOpen: true }),
      closeModal: () => set({ modalOpen: false }),
      connect: async (w) => {
        set({ status: "connecting", wallet: w });
        await new Promise((r) => setTimeout(r, 1100));
        set({
          status: "connected",
          address: fakeAddress(),
          wallet: w,
          modalOpen: false,
        });
      },
      disconnect: () =>
        set({ status: "idle", address: null, wallet: null }),
    }),
    {
      name: "cardinal-wallet",
      partialize: (s) => ({
        status: s.status,
        address: s.address,
        chain: s.chain,
        wallet: s.wallet,
      }),
    },
  ),
);

export function shortAddress(addr: string | null, n = 4) {
  if (!addr) return "";
  return `${addr.slice(0, 2 + n)}…${addr.slice(-n)}`;
}
