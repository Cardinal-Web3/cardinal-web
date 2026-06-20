"use client";

import Link from "next/link";
import { SiteLayout } from "@/components/layout/site-layout";
import { SafeSendShowcase, Escrow } from "@/components/site/Sections2";

export function SafeSendPage() {
  return (
    <SiteLayout>
      <main className="pt-28">
        <section className="px-6 pb-10 pt-12">
          <div className="mx-auto max-w-6xl">
            <div className="eyebrow mb-4">SafeSend · documentation</div>
            <h1 className="font-display text-balance text-[clamp(44px,7vw,88px)] leading-[0.95] tracking-[-0.035em]">
              Protect direct transfers
              <br />
              <span className="text-cyan">before value moves.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-muted-foreground">
              SafeSend protects direct transfers by scanning risk before signing and
              giving users a safer settlement path. Cardinal scans first — then
              SafeSend locks funds on a delay you control.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/app/new" className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[13.5px] font-medium text-background transition hover:bg-cyan">
                Launch App →
              </Link>
              <Link href="/pilot" className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-surface-elevated px-5 py-2.5 text-[13.5px] transition hover:border-cyan hover:text-cyan">
                Join Pilot
              </Link>
            </div>
          </div>
        </section>
        <SafeSendShowcase />
        <Escrow />
      </main>
    </SiteLayout>
  );
}
