import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ethers } from "ethers";
import { ARBITRUM_SEPOLIA } from "./safesend-contract";

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
  chainId: number | null;
  wallet: WalletId | null;
  modalOpen: boolean;
  error: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  openModal: () => void;
  closeModal: () => void;
  connect: (w: WalletId) => Promise<void>;
  refresh: () => Promise<void>;
  switchToSafeSendNetwork: () => Promise<void>;
  disconnect: () => void;
};

type EthereumProvider = {
  isMetaMask?: boolean;
  isBraveWallet?: boolean;
  isCoinbaseWallet?: boolean;
  isRabby?: boolean;
  providers?: EthereumProvider[];
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

export const useWallet = create<State>()(
  persist(
    (set, get) => ({
      status: "idle",
      address: null,
      chain: ARBITRUM_SEPOLIA.name,
      chainId: null,
      wallet: null,
      modalOpen: false,
      error: null,
      provider: null,
      signer: null,
      openModal: () => set({ modalOpen: true }),
      closeModal: () => set({ modalOpen: false }),
      connect: async (w) => {
        if (w !== "metamask") {
          set({
            status: "error",
            wallet: w,
            error: `${WALLETS.find((item) => item.id === w)?.name ?? "This wallet"} is coming soon. Use MetaMask for the SafeSend pilot.`,
          });
          return;
        }

        const ethereum = getMetaMaskProvider();
        if (!ethereum) {
          set({
            status: "error",
            wallet: w,
            error: getEthereum()
              ? "MetaMask not found. Another wallet (e.g. Brave or Coinbase) is active — enable/select MetaMask and retry."
              : "MetaMask was not detected. Install the MetaMask extension to continue.",
          });
          return;
        }

        set({ status: "connecting", wallet: w, error: null });
        try {
          await ethereum.request({ method: "eth_requestAccounts" });
          await get().switchToSafeSendNetwork();
          await get().refresh();
          set({ modalOpen: false });
        } catch (error) {
          set({
            status: "error",
            error: getWalletErrorMessage(error),
            provider: null,
            signer: null,
          });
        }
      },
      refresh: async () => {
        const ethereum = getMetaMaskProvider();
        if (!ethereum) return;

        const provider = new ethers.BrowserProvider(ethereum);
        const accounts = (await ethereum.request({ method: "eth_accounts" })) as string[];
        const chainHex = (await ethereum.request({ method: "eth_chainId" })) as string;
        const chainId = Number.parseInt(chainHex, 16);

        if (!accounts?.[0]) {
          set({
            status: "idle",
            address: null,
            chainId,
            provider,
            signer: null,
            wallet: null,
          });
          return;
        }

        const signer = await provider.getSigner();
        set({
          status: "connected",
          address: accounts[0],
          chainId,
          chain: chainId === ARBITRUM_SEPOLIA.id ? ARBITRUM_SEPOLIA.name : `Chain ${chainId}`,
          provider,
          signer,
          wallet: "metamask",
          error: null,
        });
      },
      switchToSafeSendNetwork: async () => {
        const ethereum = getMetaMaskProvider();
        if (!ethereum) throw new Error("MetaMask was not detected in this browser.");

        try {
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: ARBITRUM_SEPOLIA.hexId }],
          });
        } catch (error) {
          if (getErrorCode(error) !== 4902) throw error;
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: ARBITRUM_SEPOLIA.hexId,
                chainName: ARBITRUM_SEPOLIA.name,
                rpcUrls: [ARBITRUM_SEPOLIA.rpcUrl],
                blockExplorerUrls: [ARBITRUM_SEPOLIA.explorerUrl],
                nativeCurrency: ARBITRUM_SEPOLIA.nativeCurrency,
              },
            ],
          });
        }
      },
      disconnect: () =>
        set({
          status: "idle",
          address: null,
          wallet: null,
          provider: null,
          signer: null,
          error: null,
        }),
    }),
    {
      name: "cardinal-wallet",
      partialize: (s) => ({
        status: s.status,
        address: s.address,
        chain: s.chain,
        chainId: s.chainId,
        wallet: s.wallet,
      }),
    },
  ),
);

export function shortAddress(addr: string | null, n = 4) {
  if (!addr) return "";
  return `${addr.slice(0, 2 + n)}…${addr.slice(-n)}`;
}

function getEthereum() {
  if (typeof window === "undefined") return undefined;
  return window.ethereum as EthereumProvider | undefined;
}

/**
 * Resolve the actual MetaMask provider. When several wallet extensions are
 * installed they fight over `window.ethereum`, so we look through the injected
 * `providers` array and pick MetaMask (excluding impostors like Brave/Coinbase
 * that also set `isMetaMask`). Falls back to `window.ethereum` if it is MetaMask.
 */
function getMetaMaskProvider(): EthereumProvider | undefined {
  const eth = getEthereum();
  if (!eth) return undefined;

  const isRealMetaMask = (p?: EthereumProvider) =>
    !!p?.isMetaMask && !p.isBraveWallet && !p.isCoinbaseWallet && !p.isRabby;

  if (Array.isArray(eth.providers) && eth.providers.length > 0) {
    const match = eth.providers.find(isRealMetaMask);
    if (match) return match;
  }

  return isRealMetaMask(eth) ? eth : undefined;
}

function getErrorCode(error: unknown) {
  if (typeof error === "object" && error && "code" in error) {
    return Number((error as { code: number }).code);
  }
  return undefined;
}

function getWalletErrorMessage(error: unknown) {
  const code = getErrorCode(error);
  if (code === 4001) return "Wallet connection was rejected.";
  if (code === -32002) return "A MetaMask request is already pending. Open the MetaMask extension to continue.";
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error && "message" in error) {
    return String((error as { message: string }).message);
  }
  return "Wallet connection failed.";
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}
