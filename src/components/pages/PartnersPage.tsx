"use client";

import { SiteLayout } from "@/components/layout/site-layout";
import { Partners as PartnersSection } from "@/components/site/Sections3";

export function PartnersPage() {
  return (
    <SiteLayout>
      <main className="pt-28">
        <section className="px-6 pb-4 pt-12">
          <div className="mx-auto max-w-6xl">
            <div className="eyebrow mb-4">For partners</div>
            <h1 className="font-display text-balance text-[clamp(44px,7vw,88px)] leading-[0.95] tracking-[-0.035em]">
              Embed protection
              <br />
              <span className="text-cyan">before users sign.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-muted-foreground">
              Cardinal gives platforms a security and settlement layer they can embed
              before users move funds — scan, verdict, SafeSend, and escrow on the roadmap.
            </p>
          </div>
        </section>
        <PartnersSection />
      </main>
    </SiteLayout>
  );
}
