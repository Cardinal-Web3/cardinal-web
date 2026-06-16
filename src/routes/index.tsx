import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { Problem, HowItWorks } from "@/components/site/Sections1";
import { ProtectionEngine } from "@/components/site/ProtectionEngine";
import { SafeSendShowcase, Escrow } from "@/components/site/Sections2";
import { ThreatMap, Partners, Pilot } from "@/components/site/Sections3";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cardinal — Protect Web3 transactions before you sign" },
      {
        name: "description",
        content:
          "Cardinal is the protection layer between users and blockchain transactions. Scan risk, block scams, and route funds through SafeSend and escrow.",
      },
      { property: "og:title", content: "Cardinal — Web3 Transaction Protection" },
      {
        property: "og:description",
        content:
          "Before you sign, Cardinal scans. Before funds move, Cardinal protects.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Nav />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <ProtectionEngine />
        <SafeSendShowcase />
        <Escrow />
        <ThreatMap />
        <Partners />
        <Pilot />
      </main>
      <Footer />
    </div>
  );
}
