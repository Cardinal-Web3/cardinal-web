import { createFileRoute } from "@tanstack/react-router";
import { PilotPage } from "@/components/pages/PilotPage";

export const Route = createFileRoute("/pilot")({
  head: () => ({
    meta: [
      { title: "Pilot Program — Cardinal" },
      {
        name: "description",
        content:
          "SafeSend is in controlled pilot. Apply for early partner access.",
      },
      { property: "og:title", content: "Pilot Program — Cardinal" },
      {
        property: "og:description",
        content: "Protect every transaction before value moves.",
      },
    ],
  }),
  component: PilotPage,
});
