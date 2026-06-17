import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Logo } from "@/components/site/Logo";

export function AppShell({ children }: { children?: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const inNew = pathname.startsWith("/app/new");
  return (
    <div className="relative flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[oklch(0.10_0.008_250/0.7)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Logo />
            <div className="hidden font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground md:flex md:items-center md:gap-2">
              <span>/</span>
              <Link to="/app" className="hover:text-foreground">app</Link>
              {inNew && (
                <>
                  <span>/</span>
                  <span className="text-foreground">new</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-md border border-emerald/30 bg-emerald/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-emerald sm:flex">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald shadow-[0_0_8px_oklch(0.76_0.16_155)]" />
              Protected
            </div>
            {!inNew && (
              <Link
                to="/app/new"
                className="rounded-md bg-lime px-4 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-background transition hover:opacity-90"
              >
                + New SafeSend
              </Link>
            )}
            <div className="inline-flex items-center gap-2 rounded-md border border-[var(--border-strong)] bg-surface-elevated px-2.5 py-1 font-mono text-[11px]">
              0x7c8b…2a14
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 px-6 py-12">{children ?? <Outlet />}</main>
      <div className="border-t border-[var(--border)] px-6 py-4 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between">
          <Link to="/" className="hover:text-foreground">← cardinal.site</Link>
          <span className="text-amber">pilot · max $25k / safesend</span>
        </div>
      </div>
    </div>
  );
}
