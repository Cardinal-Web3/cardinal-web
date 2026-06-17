import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { Problem, InterceptionEngine } from "@/components/site/Sections1";
import { SafeSendShowcase, Escrow } from "@/components/site/Sections2";
import { ThreatMap, Partners, Pilot } from "@/components/site/Sections3";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cardinal — The security OS for blockchain transactions" },
      {
        name: "description",
        content:
          "Cardinal intercepts blockchain transactions before they sign. Scan risk, route SafeSend, and quarantine threats at the protection layer.",
      },
      { property: "og:title", content: "Cardinal — Transaction Interception Engine" },
      {
        property: "og:description",
        content: "Intercept the transaction. Before it signs.",
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
        <InterceptionEngine />
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
