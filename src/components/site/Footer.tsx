import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Wordmark } from "./Wordmark";

export function Footer() {
  return (
    <footer className="relative mt-20">
      <Wordmark />

      <div className="mt-20 border-t border-[var(--border)]">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-[13px] text-muted-foreground">
              The security operating system for blockchain transactions.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-surface/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.22em] backdrop-blur">
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping-ring rounded-full bg-emerald/50" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald" />
              </span>
              <span className="text-muted-foreground">pilot · uptime 99.98%</span>
            </div>
          </div>
          {[
            {
              title: "Technology",
              items: [
                ["Interception Engine", "/"],
                ["SafeSend", "/safesend"],
                ["Escrow", "/safesend"],
                ["Threat Net", "/"],
              ],
            },
            {
              title: "Product",
              items: [
                ["Launch App", "/app"],
                ["Create SafeSend", "/app/new"],
                ["Docs", "/"],
                ["Status", "/"],
              ],
            },
            {
              title: "Company",
              items: [
                ["Partners", "/partners"],
                ["Pilot Program", "/pilot"],
                ["Trust", "/"],
                ["Contact", "/"],
              ],
            },
            {
              title: "Legal",
              items: [
                ["Privacy", "/"],
                ["Terms", "/"],
                ["Disclosures", "/"],
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-foreground">
                {col.title}
              </div>
              <ul className="mt-5 space-y-3">
                {col.items.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      to={href}
                      className="text-[13px] text-muted-foreground transition hover:text-foreground"
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
          <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-2 px-6 py-5 font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground md:flex-row md:items-center">
            <div>© {new Date().getFullYear()} Cardinal Labs, Inc.</div>
            <div className="opacity-70">cardinal://protect · v0.4.0-pilot</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
