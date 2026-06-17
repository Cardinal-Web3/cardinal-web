import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Pilot as PilotSection } from "@/components/site/Sections3";
import { useState } from "react";

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
        content: "Controlled pilot for SafeSend. Honest, monitored, hardened.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Nav />
      <main className="pt-28">
        <PilotSection />
        <section className="px-6 pb-20">
          <div className="mx-auto max-w-2xl">
            <div className="glass-panel p-8">
              <div className="eyebrow mb-3">Request access</div>
              <div className="font-display text-2xl tracking-tight">
                Join the SafeSend pilot.
              </div>
              <p className="mt-2 text-[13.5px] text-muted-foreground">
                We onboard a small set of partners each cycle. We'll get back
                within 48h.
              </p>
              {sent ? (
                <div className="mt-6 rounded-xl border border-emerald/40 bg-emerald/10 px-4 py-3 text-[13.5px] text-emerald">
                  ✓ Request received. We'll reach out at {email}.
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
      <Footer />
    </div>
  );
}
