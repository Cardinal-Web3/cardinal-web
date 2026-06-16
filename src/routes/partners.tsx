import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Partners as PartnersSection } from "@/components/site/Sections3";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Partners — Cardinal" },
      {
        name: "description",
        content:
          "Wallets, exchanges, marketplaces, and payment platforms ship transaction protection with Cardinal.",
      },
      { property: "og:title", content: "Partners — Cardinal" },
      {
        property: "og:description",
        content: "Ship transaction protection. Skip the security org.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Nav />
      <main className="pt-28">
        <section className="px-6 pb-4 pt-12">
          <div className="mx-auto max-w-6xl">
            <div className="eyebrow mb-4">For partners</div>
            <h1 className="font-display text-balance text-[clamp(44px,7vw,88px)] leading-[0.95] tracking-[-0.035em]">
              Embed protection in
              <br />
              <span className="text-cyan">one integration.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-muted-foreground">
              Cardinal exposes verdicts, SafeSend, and escrow as composable APIs.
              Drop them in front of withdrawals, signing flows, or marketplace
              settlement — no security org required.
            </p>
          </div>
        </section>
        <PartnersSection />
      </main>
      <Footer />
    </div>
  );
}
