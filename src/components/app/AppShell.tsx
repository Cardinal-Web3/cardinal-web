import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Logo } from "@/components/site/Logo";

const NAV = [
  { to: "/app", label: "SafeSends", icon: "◐" },
  { to: "/app/new", label: "Create", icon: "✛" },
];

export function AppShell({ children }: { children?: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="relative grid min-h-screen md:grid-cols-[240px_1fr]">
      <aside className="hidden border-r border-[var(--border)] bg-[oklch(0.16_0.011_250)] md:flex md:flex-col">
        <div className="px-5 py-5">
          <Logo />
        </div>
        <nav className="flex-1 px-3">
          {NAV.map((n) => {
            const active = pathname === n.to || (n.to !== "/app" && pathname.startsWith(n.to));
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] transition ${
                  active ? "bg-surface-elevated text-foreground" : "text-muted-foreground hover:bg-surface hover:text-foreground"
                }`}
              >
                <span className={`font-mono text-[14px] ${active ? "text-cyan" : ""}`}>{n.icon}</span>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="m-3 rounded-xl border border-[var(--border)] bg-[oklch(0.17_0.011_250)] p-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber/40 bg-amber/10 px-2 py-0.5 text-[10px] text-amber">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-amber" />
            Pilot
          </div>
          <div className="mt-3 text-[12.5px] font-medium">Caps in effect</div>
          <div className="mt-1 text-[11.5px] text-muted-foreground">
            Max $25k per SafeSend during pilot.
          </div>
        </div>
        <div className="border-t border-[var(--border)] px-5 py-4 text-[11px] text-muted-foreground">
          <Link to="/" className="hover:text-foreground">← Back to site</Link>
        </div>
      </aside>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--border)] bg-[oklch(0.14_0.01_250/0.7)] px-6 py-3 backdrop-blur">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            cardinal.app · pilot
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-[var(--border)] bg-surface px-3 py-1 text-[11px] sm:flex">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald shadow-[0_0_8px_oklch(0.76_0.16_155)]" />
              <span className="font-mono uppercase tracking-wider text-muted-foreground">protected</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-surface-elevated px-3 py-1 text-[12px]">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-cyan to-violet font-mono text-[10px] text-background">
                C
              </span>
              <span className="font-mono">0x7c8b…2a14</span>
            </div>
          </div>
        </header>
        <main className="flex-1 px-6 py-8">{children ?? <Outlet />}</main>
      </div>
    </div>
  );
}
