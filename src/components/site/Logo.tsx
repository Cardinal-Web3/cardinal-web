import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative inline-flex h-7 w-7 items-center justify-center">
        <span className="absolute inset-0 rounded-md bg-gradient-to-br from-cyan to-violet opacity-90" />
        <span className="absolute inset-[2px] rounded-[5px] bg-background" />
        <svg
          viewBox="0 0 24 24"
          className="relative h-4 w-4 text-cyan"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4Z" />
        </svg>
      </span>
      <span className="font-display text-[17px] tracking-tight text-foreground">
        Cardinal
      </span>
    </Link>
  );
}
