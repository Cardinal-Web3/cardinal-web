import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { WalletButton } from "./WalletButton";
import { useEffect, useState } from "react";

const NAV = [
  { label: "SafeSend", to: "/safesend" },
  { label: "Partners", to: "/partners" },
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
            ? "border-[var(--border)] bg-background/70 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-full px-3.5 py-1.5 text-[13.5px] text-muted-foreground transition hover:bg-surface hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <Link
            to="/app"
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
