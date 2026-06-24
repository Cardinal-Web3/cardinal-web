import type { Metadata } from "next";
import { WhitepaperPage } from "@/components/pages/WhitepaperPage";

export const metadata: Metadata = {
  title: "Whitepaper — Trust Layer",
  description:
    "A concise overview of Cardinal's security-first escrow infrastructure. Download the full investor whitepaper.",
};

export default function Page() {
  return <WhitepaperPage />;
}
