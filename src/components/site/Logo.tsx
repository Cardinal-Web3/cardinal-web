import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";

export function LogoMark({
  size = 28,
  className = "",
  animated = true,
}: {
  size?: number;
  className?: string;
  animated?: boolean;
}) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      initial={animated ? { opacity: 0, scale: 0.85 } : false}
      animate={animated ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={animated ? { rotate: 12 } : undefined}
      aria-hidden
    >
      <defs>
        <linearGradient id="cardinalGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--cyan)" />
          <stop offset="100%" stopColor="var(--violet)" />
        </linearGradient>
        <radialGradient id="cardinalCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--cyan)" stopOpacity="1" />
          <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* hex aperture */}
      <path
        d="M20 3 L34 11 L34 29 L20 37 L6 29 L6 11 Z"
        stroke="url(#cardinalGrad)"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M20 7 L30.5 13 L30.5 27 L20 33 L9.5 27 L9.5 13 Z"
        stroke="url(#cardinalGrad)"
        strokeWidth="0.8"
        strokeLinejoin="round"
        fill="none"
        opacity="0.45"
      />

      {/* outward arrows (NE, NW, SE, SW) */}
      <g stroke="url(#cardinalGrad)" strokeWidth="1.3" strokeLinecap="round" fill="none">
        <path d="M27 13 L31 9 M31 9 L31 12 M31 9 L28 9" />
        <path d="M13 13 L9 9 M9 9 L9 12 M9 9 L12 9" />
        <path d="M27 27 L31 31 M31 31 L31 28 M31 31 L28 31" />
        <path d="M13 27 L9 31 M9 31 L9 28 M9 31 L12 31" />
      </g>

      {/* core */}
      <circle cx="20" cy="20" r="8" fill="url(#cardinalCore)" opacity="0.55" />
      <circle cx="20" cy="20" r="3.2" fill="url(#cardinalGrad)" />
      <circle cx="20" cy="20" r="1.2" fill="var(--background)" />
    </motion.svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={28} />
      <span className="font-display text-[17px] tracking-tight text-foreground">
        Cardinal
      </span>
    </Link>
  );
}
