"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { WalletButton } from "./WalletButton";
import { useEffect, useState } from "react";

const NAV = [
  { label: "SafeSend", to: "/safesend" },
  { label: "Whitepaper", to: "/whitepaper" },
  { label: "Partners", to: "/partners" },
  { label: "API", to: "/api-docs" },
  { label: "Pilot", to: "/pilot" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4">
      <div
        className={`flex w-full max-w-6xl items-center justify-between gap-2 rounded-full border px-3 py-2 transition-all duration-500 sm:px-4 ${
          scrolled
            ? "border-[var(--border)]/60 bg-background/80 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.25)] backdrop-blur-2xl backdrop-saturate-150"
            : "border-[var(--border)]/40 bg-background/75 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.18)] backdrop-blur-2xl backdrop-saturate-150"
        }`}
      >
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              href={n.to}
              className="rounded-full px-3.5 py-1.5 text-[13.5px] text-muted-foreground transition hover:bg-surface hover:text-foreground"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <Link
            href="/app"
            className="hidden rounded-full border border-[var(--border-strong)] bg-surface-elevated px-4 py-1.5 text-[13px] text-foreground transition hover:border-cyan hover:text-cyan md:inline-flex"
          >
            Launch app
          </Link>
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
