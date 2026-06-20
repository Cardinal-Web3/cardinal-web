"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const STEPS = [
  { href: "/app/new", label: "Compose" },
  { href: "/app/new/scan", label: "Scan" },
  { href: "/app/new/verdict", label: "Verdict" },
  { href: "/app/new/confirm", label: "Confirm" },
  { href: "/app/new/receipt", label: "Receipt" },
];

export function SafeSendWizardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const idx = Math.max(
    0,
    STEPS.findIndex((s) => pathname === s.href || (s.href !== "/app/new" && pathname.startsWith(s.href))),
  );

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="eyebrow mb-1">Create SafeSend</div>
          <div className="font-mono text-[12px] text-muted-foreground">
            step {String(idx + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")} · {STEPS[idx]?.label}
          </div>
        </div>
        <Link href="/app" className="text-[12.5px] text-muted-foreground hover:text-foreground">
          ← My SafeSends
        </Link>
      </div>
      <div className="mt-4 grid grid-cols-5 gap-1.5">
        {STEPS.map((s, i) => (
          <div
            key={s.href}
            className={`h-1 rounded-full transition ${
              i <= idx ? "bg-gradient-to-r from-cyan to-violet" : "bg-[var(--border)]"
            }`}
          />
        ))}
      </div>
      <div className="mt-10">{children}</div>
    </div>
  );
}
