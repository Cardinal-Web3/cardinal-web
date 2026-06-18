import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { Problem, HowItWorks } from "@/components/site/Sections1";
import { ProtectionEngine } from "@/components/site/ProtectionEngine";
import { SafeSendShowcase, Escrow } from "@/components/site/Sections2";
import { ThreatMap, Partners, Pilot } from "@/components/site/Sections3";
import { FAQ } from "@/components/site/FAQ";
import { CTABand } from "@/components/site/CTABand";

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
      { property: "og:image", content: "/favicon.svg" },
      { name: "twitter:image", content: "/favicon.svg" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Cardinal",
          applicationCategory: "SecurityApplication",
          operatingSystem: "Web",
          description:
            "Cardinal is the protection layer between users and blockchain transactions.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }),
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
        <FAQ />
        <CTABand />
      </main>
      <Footer />
    </div>
  );
}
