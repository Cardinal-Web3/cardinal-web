"use client";

import { useState } from "react";
import { SiteLayout } from "@/components/layout/site-layout";
import { Pilot as PilotSection } from "@/components/site/Sections3";

export function PilotPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <SiteLayout>
      <main className="pt-28">
        <section className="px-6 pb-4 pt-12">
          <div className="mx-auto max-w-6xl">
            <div className="eyebrow mb-4">Controlled pilot</div>
            <h1 className="font-display text-balance text-[clamp(44px,7vw,88px)] leading-[0.95] tracking-[-0.035em]">
              Protect every transaction
              <br />
              <span className="text-cyan">before value moves.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-muted-foreground">
              SafeSend is in controlled pilot. We focus on testing, monitoring, and
              hardening with a small set of partner wallets and exchanges before
              opening broadly.
            </p>
          </div>
        </section>
        <PilotSection />
        <section className="px-6 pb-20">
          <div className="mx-auto max-w-2xl">
            <div className="surface-card p-8">
              <div className="eyebrow mb-3">Request access</div>
              <div className="font-display text-2xl tracking-tight">
                Join the SafeSend pilot.
              </div>
              <p className="mt-2 text-[13.5px] text-muted-foreground">
                We onboard a small set of partners each cycle. We&apos;ll get back
                within 48h.
              </p>
              {sent ? (
                <div className="mt-6 rounded-xl border border-emerald/40 bg-emerald/10 px-4 py-3 text-[13.5px] text-emerald">
                  Request received. We&apos;ll reach out at {email}.
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!email) return;
                    setSent(true);
                  }}
                  className="mt-6 flex flex-col gap-3 sm:flex-row"
                >
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 rounded-full border border-[var(--border-strong)] bg-surface px-5 py-3 text-[14px] text-foreground placeholder:text-muted-foreground focus:border-cyan focus:outline-none"
                  />
                  <button className="rounded-full bg-foreground px-5 py-3 text-[13.5px] font-medium text-background transition hover:bg-cyan">
                    Request access →
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
