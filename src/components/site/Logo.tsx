import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative inline-flex h-6 w-6 items-center justify-center">
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-lime">
          <circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="3.5" fill="currentColor" />
          <path d="M12 2.5 V 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </span>
      <span className="font-display text-[15px] font-medium tracking-[-0.01em] text-foreground">
        Cardinal
      </span>
    </Link>
  );
}
