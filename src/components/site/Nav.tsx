"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
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

// API docs are desktop-only; omit from the mobile menu (still reachable via footer).
const MOBILE_NAV = NAV.filter((n) => n.to !== "/api-docs");

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4">
      <div
        className={`flex w-full max-w-6xl items-center justify-between gap-2 rounded-full border px-3 py-2 transition-all duration-500 sm:px-4 ${
          scrolled || menuOpen
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
          <div className="hidden md:block">
            <WalletButton />
          </div>
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border-strong)] bg-surface-elevated text-foreground transition hover:border-cyan md:hidden"
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 -z-[1] bg-background/40 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              key="mobile-menu"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-3 top-[4.5rem] origin-top rounded-3xl border border-[var(--border)] bg-background/95 p-3 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:inset-x-4 md:hidden"
            >
              <div className="flex flex-col gap-0.5">
                {MOBILE_NAV.map((n, i) => (
                  <motion.div
                    key={n.to}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 + i * 0.04 }}
                  >
                    <Link
                      href={n.to}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between rounded-2xl px-4 py-3 text-[15px] font-medium text-foreground transition hover:bg-surface"
                    >
                      {n.label}
                      <span className="text-muted-foreground">→</span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-3 flex flex-col gap-2 border-t border-[var(--border)] pt-3">
                <Link
                  href="/app"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center rounded-full border border-[var(--border-strong)] bg-surface-elevated px-4 py-2.5 text-[14px] font-medium text-foreground transition hover:border-cyan hover:text-cyan"
                >
                  Launch app
                </Link>
                <div className="flex justify-center" onClick={() => setMenuOpen(false)}>
                  <WalletButton />
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-3.5 w-4" aria-hidden>
      <span
        className="absolute left-0 block h-[1.5px] w-full rounded-full bg-current transition-all duration-300"
        style={{ top: open ? "6px" : "1px", transform: open ? "rotate(45deg)" : "none" }}
      />
      <span
        className="absolute left-0 top-[6px] block h-[1.5px] w-full rounded-full bg-current transition-all duration-200"
        style={{ opacity: open ? 0 : 1 }}
      />
      <span
        className="absolute left-0 block h-[1.5px] w-full rounded-full bg-current transition-all duration-300"
        style={{ top: open ? "6px" : "11px", transform: open ? "rotate(-45deg)" : "none" }}
      />
    </span>
  );
}
