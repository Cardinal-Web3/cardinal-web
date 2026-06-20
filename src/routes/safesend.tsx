import { createFileRoute } from "@tanstack/react-router";
import { SafeSendPage } from "@/components/pages/SafeSendPage";

export const Route = createFileRoute("/safesend")({
  head: () => ({
    meta: [
      { title: "SafeSend — Protected transfers · Cardinal" },
      {
        name: "description",
        content:
          "SafeSend protects direct transfers by scanning risk before signing and giving users a safer settlement path.",
      },
      { property: "og:title", content: "SafeSend — Protect direct transfers before value moves" },
      {
        property: "og:description",
        content:
          "Cardinal scans first — then SafeSend locks funds on a delay you control.",
      },
    ],
  }),
  component: SafeSendPage,
});
