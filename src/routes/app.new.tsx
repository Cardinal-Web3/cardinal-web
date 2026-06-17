import { createFileRoute, Outlet, useRouterState, Link } from "@tanstack/react-router";

const STEPS = [
  { to: "/app/new", label: "Compose" },
  { to: "/app/new/scan", label: "Scan" },
  { to: "/app/new/verdict", label: "Verdict" },
  { to: "/app/new/confirm", label: "Confirm" },
  { to: "/app/new/receipt", label: "Receipt" },
];

export const Route = createFileRoute("/app/new")({
  component: Layout,
});

function Layout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const idx = Math.max(
    0,
    STEPS.findIndex((s) => pathname === s.to || (s.to !== "/app/new" && pathname.startsWith(s.to))),
  );
  return (
    <div className="relative mx-auto max-w-[900px]">
      {/* giant step label behind */}
      <div className="pointer-events-none absolute -top-4 left-0 right-0 select-none text-center">
        <div className="wordmark-giant text-[clamp(120px,22vw,260px)] text-foreground/[0.035]">
          {String(idx + 1).padStart(2, "0")}
        </div>
      </div>

      <div className="relative flex items-center justify-between">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          step {String(idx + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")} ·{" "}
          <span className="text-lime">{STEPS[idx]?.label}</span>
        </div>
        <Link
          to="/app"
          className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground"
        >
          ← My SafeSends
        </Link>
      </div>
      <div className="relative mt-4 grid grid-cols-5 gap-1.5">
        {STEPS.map((s, i) => (
          <div
            key={s.to}
            className={`h-[2px] rounded-full transition ${
              i <= idx ? "bg-lime shadow-[0_0_10px_oklch(0.92_0.18_115/0.6)]" : "bg-[var(--border)]"
            }`}
          />
        ))}
      </div>
      <div className="relative mt-16">
        <Outlet />
      </div>
    </div>
  );
}
