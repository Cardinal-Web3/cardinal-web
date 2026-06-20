import type { Metadata } from "next";
import { PilotPage } from "@/components/pages/PilotPage";

export const metadata: Metadata = {
  title: "Pilot Program",
  description: "SafeSend is in controlled pilot. Apply for early partner access.",
  openGraph: {
    title: "Pilot Program — Cardinal",
    description: "Controlled pilot for SafeSend. Honest, monitored, hardened.",
  },
};

export default function Page() {
  return <PilotPage />;
}
