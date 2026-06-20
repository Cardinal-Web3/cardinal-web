"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Logo } from "@/components/site/Logo";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { WalletButton } from "@/components/site/WalletButton";
import { useWallet, shortAddress } from "@/lib/wallet-store";

const NAV = [
  { to: "/app", label: "SafeSends", icon: "◐" },
  { to: "/app/new", label: "Create", icon: "✛" },
];

export function AppShell({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  const { status, address } = useWallet();
  const connected = status === "connected" && address;

  return (
    <div className="relative grid min-h-screen md:grid-cols-[240px_1fr]">
      {/* desktop side nav */}
      <aside className="hidden border-r border-[var(--border)] bg-surface md:flex md:flex-col">
        <div className="px-5 py-5">
          <Logo />
        </div>
        <nav className="flex-1 px-3">
          {NAV.map((n) => {
            const active = pathname === n.to || (n.to !== "/app" && pathname.startsWith(n.to));
            return (
              <Link
                key={n.to}
                href={n.to}
                className={`relative mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] transition ${
                  active ? "text-foreground" : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill-desktop"
                    className="absolute inset-0 rounded-lg bg-surface-elevated"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className={`font-mono relative text-[14px] ${active ? "text-cyan" : ""}`}>{n.icon}</span>
                <span className="relative">{n.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="m-3 rounded-xl border border-[var(--border)] bg-surface-elevated p-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber/40 bg-amber/10 px-2 py-0.5 text-[10px] text-amber">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-amber" />
            Pilot
          </div>
          <div className="mt-3 text-[12.5px] font-medium">Protection Engine · pilot</div>
          <div className="mt-1 text-[11.5px] text-muted-foreground">
            Max $25k per SafeSend during pilot.
          </div>
        </div>
        <div className="border-t border-[var(--border)] px-5 py-4 text-[11px] text-muted-foreground">
          <Link href="/" className="hover:text-foreground">← Back to site</Link>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        {/* top bar */}
        <header className="sticky top-0 z-30 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-[var(--border)] bg-background/70 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="md:hidden">
              <Logo />
            </div>
            <div className="font-mono hidden text-[11px] uppercase tracking-[0.18em] text-muted-foreground md:block">
              cardinal.app · pilot
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full border border-[var(--border)] bg-surface px-3 py-1 text-[11px] sm:flex">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald shadow-[var(--shadow-glow-emerald)]" />
              <span className="font-mono uppercase tracking-wider text-muted-foreground">Protection Engine</span>
            </div>
            <ThemeToggle />
            {connected ? (
              <div className="font-mono inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-surface-elevated px-3 py-1 text-[12px]">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-cyan to-violet text-[10px] text-background">
                  C
                </span>
                {shortAddress(address)}
              </div>
            ) : (
              <WalletButton />
            )}
          </div>
        </header>

        <main className="flex-1 px-4 py-6 pb-24 sm:px-6 sm:py-8 md:pb-8">
          {children}
        </main>

        {/* mobile bottom tab bar */}
        <nav className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-around rounded-full border border-[var(--border-strong)] bg-background/80 px-2 py-1.5 backdrop-blur-xl md:hidden">
          {NAV.map((n) => {
            const active = pathname === n.to || (n.to !== "/app" && pathname.startsWith(n.to));
            return (
              <Link
                key={n.to}
                href={n.to}
                className={`relative inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full px-3 py-2 text-[12.5px] transition ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill-mobile"
                    className="absolute inset-0 rounded-full bg-surface-elevated"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className={`font-mono relative ${active ? "text-cyan" : ""}`}>{n.icon}</span>
                <span className="relative">{n.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
