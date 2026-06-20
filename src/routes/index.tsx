import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/pages/HomePage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cardinal — Protect every transaction before value moves" },
      {
        name: "description",
        content:
          "Cardinal is the trust layer for digital asset transactions. Scan risk before signature and route users into safer settlement flows like SafeSend and escrow.",
      },
      { property: "og:title", content: "Cardinal — Protect every transaction before value moves" },
      {
        property: "og:description",
        content:
          "Cardinal scans risk before signature and routes users into safer settlement flows like SafeSend and escrow.",
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
            "Cardinal is the trust layer for digital asset transactions. Protect every transaction before value moves.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }),
      },
    ],
  }),
  component: HomePage,
});
