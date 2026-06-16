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
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="eyebrow mb-1">Create SafeSend</div>
          <div className="font-mono text-[12px] text-muted-foreground">
            step {String(idx + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")} · {STEPS[idx]?.label}
          </div>
        </div>
        <Link to="/app" className="text-[12.5px] text-muted-foreground hover:text-foreground">
          ← My SafeSends
        </Link>
      </div>
      <div className="mt-4 grid grid-cols-5 gap-1.5">
        {STEPS.map((s, i) => (
          <div
            key={s.to}
            className={`h-1 rounded-full transition ${
              i <= idx ? "bg-gradient-to-r from-cyan to-violet" : "bg-[var(--border)]"
            }`}
          />
        ))}
      </div>
      <div className="mt-10">
        <Outlet />
      </div>
    </div>
  );
}
