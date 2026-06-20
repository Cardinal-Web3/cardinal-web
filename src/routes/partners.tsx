import { createFileRoute } from "@tanstack/react-router";
import { PartnersPage } from "@/components/pages/PartnersPage";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Partners — Cardinal" },
      {
        name: "description",
        content:
          "Cardinal gives platforms a security and settlement layer they can embed before users move funds.",
      },
      { property: "og:title", content: "Partners — Cardinal" },
      {
        property: "og:description",
        content: "Embed protection before users sign.",
      },
    ],
  }),
  component: PartnersPage,
});
