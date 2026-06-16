import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { SafeSendShowcase, Escrow } from "@/components/site/Sections2";

export const Route = createFileRoute("/safesend")({
  head: () => ({
    meta: [
      { title: "SafeSend — Cancellable transfers · Cardinal" },
      {
        name: "description",
        content:
          "SafeSend locks funds on signature and releases them on a delay you control. Cancel before settlement if anything looks wrong.",
      },
      { property: "og:title", content: "SafeSend — A transfer you can take back" },
      {
        property: "og:description",
        content:
          "Protected, delayed, cancellable transfers from Cardinal.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Nav />
      <main className="pt-28">
        <section className="px-6 pb-10 pt-12">
          <div className="mx-auto max-w-6xl">
            <div className="eyebrow mb-4">SafeSend · documentation</div>
            <h1 className="font-display text-balance text-[clamp(44px,7vw,88px)] leading-[0.95] tracking-[-0.035em]">
              A transfer
              <br />
              you can <span className="text-cyan">take back.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-muted-foreground">
              SafeSend is Cardinal's protected settlement primitive. Funds lock on
              signature, release on a delay you choose, and stay cancellable
              until release.
            </p>
            <div className="mt-8 flex gap-3">
              <Link to="/app/new" className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[13.5px] font-medium text-background transition hover:bg-cyan">
                Create your first SafeSend →
              </Link>
            </div>
          </div>
        </section>
        <SafeSendShowcase />
        <Escrow />
      </main>
      <Footer />
    </div>
  );
}
