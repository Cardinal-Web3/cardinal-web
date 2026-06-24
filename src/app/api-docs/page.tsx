import type { Metadata } from "next";
import { ApiDocsPage } from "@/components/pages/ApiDocsPage";

export const metadata: Metadata = {
  title: "Protection API",
  description:
    "Developer documentation for Cardinal's transaction protection API, including auth, request payloads, verdicts, and local testing.",
  openGraph: {
    title: "Protection API — Cardinal",
    description:
      "Integrate Cardinal's pre-sign risk checks into wallets, exchanges, marketplaces, and SafeSend flows.",
  },
};

export default function Page() {
  return <ApiDocsPage />;
}
