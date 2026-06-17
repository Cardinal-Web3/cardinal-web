import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { useEffect, useState } from "react";

const NAV = [
  { label: "ENGINE", to: "/", hash: "#engine" },
  { label: "SAFESEND", to: "/safesend" },
  { label: "PARTNERS", to: "/partners" },
  { label: "PILOT", to: "/pilot" },
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
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-[var(--border)] bg-[oklch(0.10_0.008_250/0.7)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.label}
              to={n.to}
              className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/app"
          className="inline-flex items-center gap-2 rounded-md border border-lime/60 bg-lime/5 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-lime transition hover:bg-lime hover:text-background"
        >
          Launch App
        </Link>
      </div>
    </header>
  );
}
