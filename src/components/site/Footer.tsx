import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-[var(--border)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            The protection layer between users and blockchain transactions.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-surface px-3 py-1.5 text-[11px]">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inset-0 animate-ping-ring rounded-full bg-emerald/50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald" />
            </span>
            <span className="font-mono uppercase tracking-wider text-muted-foreground">
              Pilot live · uptime 99.98%
            </span>
          </div>
        </div>
        {[
          {
            title: "Product",
            items: [
              ["SafeSend", "/safesend"],
              ["Escrow", "/safesend"],
              ["Protection Engine", "/"],
              ["Launch App", "/app"],
            ],
          },
          {
            title: "Company",
            items: [
              ["Partners", "/partners"],
              ["Pilot Program", "/pilot"],
              ["Trust & Security", "/"],
              ["Brand", "/"],
            ],
          },
          {
            title: "Resources",
            items: [
              ["Documentation", "/"],
              ["Threat Reports", "/"],
              ["Status", "/"],
              ["Contact", "/"],
            ],
          },
        ].map((col) => (
          <div key={col.title}>
            <div className="eyebrow mb-4">{col.title}</div>
            <ul className="space-y-2.5">
              {col.items.map(([label, href]) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-[13.5px] text-muted-foreground transition hover:text-foreground"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-6 py-6 text-[12px] text-muted-foreground md:flex-row md:items-center">
          <div className="font-mono">© {new Date().getFullYear()} Cardinal Labs, Inc.</div>
          <div className="font-mono opacity-70">
            cardinal://protect · v0.4.0-pilot
          </div>
        </div>
      </div>
    </footer>
  );
}
