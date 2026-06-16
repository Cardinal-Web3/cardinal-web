import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ScanResult, Verdict } from "./mock-scan";

export type SafeSendStatus =
  | "draft"
  | "scanning"
  | "pending_release"
  | "released"
  | "cancelled"
  | "blocked";

export type SafeSend = {
  id: string;
  recipient: string;
  token: string;
  amount: number;
  delayHours: number;
  cancelWindowHours: number;
  memo?: string;
  createdAt: number;
  releaseAt: number;
  status: SafeSendStatus;
  verdict?: Verdict;
  scan?: ScanResult;
};

type DraftInput = Omit<
  SafeSend,
  "id" | "createdAt" | "releaseAt" | "status"
>;

type State = {
  drafts: Record<string, Partial<DraftInput>>;
  sends: SafeSend[];
  setDraft: (key: string, value: Partial<DraftInput>) => void;
  clearDraft: (key: string) => void;
  createSend: (s: Omit<SafeSend, "id" | "createdAt" | "releaseAt">) => SafeSend;
  updateSend: (id: string, patch: Partial<SafeSend>) => void;
  cancelSend: (id: string) => void;
};

const newId = () =>
  "ss_" + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);

export const useSafeSends = create<State>()(
  persist(
    (set, get) => ({
      drafts: {},
      sends: [],
      setDraft: (key, value) =>
        set((s) => ({ drafts: { ...s.drafts, [key]: { ...s.drafts[key], ...value } } })),
      clearDraft: (key) =>
        set((s) => {
          const { [key]: _, ...rest } = s.drafts;
          return { drafts: rest };
        }),
      createSend: (input) => {
        const id = newId();
        const now = Date.now();
        const send: SafeSend = {
          id,
          createdAt: now,
          releaseAt: now + input.delayHours * 3600_000,
          ...input,
        };
        set((s) => ({ sends: [send, ...s.sends] }));
        return send;
      },
      updateSend: (id, patch) =>
        set((s) => ({
          sends: s.sends.map((x) => (x.id === id ? { ...x, ...patch } : x)),
        })),
      cancelSend: (id) =>
        set((s) => ({
          sends: s.sends.map((x) =>
            x.id === id ? { ...x, status: "cancelled" } : x,
          ),
        })),
    }),
    { name: "cardinal-safesends" },
  ),
);

export function statusLabel(s: SafeSendStatus) {
  switch (s) {
    case "pending_release":
      return "Pending release";
    case "released":
      return "Released";
    case "cancelled":
      return "Cancelled";
    case "blocked":
      return "Blocked";
    case "scanning":
      return "Scanning";
    default:
      return "Draft";
  }
}
