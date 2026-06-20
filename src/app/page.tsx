import type { Metadata } from "next";
import { HomePage } from "@/components/pages/HomePage";

export const metadata: Metadata = {
  title: "Cardinal — Protect every transaction before value moves",
  description:
    "Cardinal is the trust layer for digital asset transactions. Scan risk before signature and route users into safer settlement flows like SafeSend and escrow.",
  openGraph: {
    title: "Cardinal — Protect every transaction before value moves",
    description:
      "Cardinal scans risk before signature and routes users into safer settlement flows like SafeSend and escrow.",
    images: ["/favicon.svg"],
  },
  twitter: {
    images: ["/favicon.svg"],
  },
};

export default function Page() {
  return <HomePage />;
}
