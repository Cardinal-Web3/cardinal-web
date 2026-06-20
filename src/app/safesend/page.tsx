import type { Metadata } from "next";
import { SafeSendPage } from "@/components/pages/SafeSendPage";

export const metadata: Metadata = {
  title: "SafeSend — Cancellable transfers",
  description:
    "SafeSend locks funds on signature and releases them on a delay you control. Cancel before settlement if anything looks wrong.",
  openGraph: {
    title: "SafeSend — A transfer you can take back",
    description: "Protected, delayed, cancellable transfers from Cardinal.",
  },
};

export default function Page() {
  return <SafeSendPage />;
}
