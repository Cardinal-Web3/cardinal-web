import type { Metadata } from "next";
import { PartnersPage } from "@/components/pages/PartnersPage";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "Wallets, exchanges, marketplaces, and payment platforms ship transaction protection with Cardinal.",
  openGraph: {
    title: "Partners — Cardinal",
    description: "Ship transaction protection. Skip the security org.",
  },
};

export default function Page() {
  return <PartnersPage />;
}
