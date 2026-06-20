"use client";

import Link from "next/link";
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
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      initial={animated ? { opacity: 0, scale: 0.85 } : false}
      animate={animated ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={undefined}
      aria-hidden
    >
      <defs>
        <linearGradient id="logoGrad" x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--cyan)" />
          <stop offset="100%" stopColor="var(--violet)" />
        </linearGradient>
      </defs>

      {/* circular arc segments — compass ring */}
      <path
        d="M 32 6 A 26 26 0 0 1 52 14"
        stroke="url(#logoGrad)"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 52 50 A 26 26 0 0 1 32 58"
        stroke="url(#logoGrad)"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 12 50 A 26 26 0 0 1 6 32"
        stroke="url(#logoGrad)"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 58 32 A 26 26 0 0 1 52 50"
        stroke="url(#logoGrad)"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M 32 58 A 26 26 0 0 1 12 50"
        stroke="url(#logoGrad)"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M 6 32 A 26 26 0 0 1 12 14"
        stroke="url(#logoGrad)"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M 12 14 A 26 26 0 0 1 32 6"
        stroke="url(#logoGrad)"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.35"
      />
      <path
        d="M 52 14 A 26 26 0 0 1 58 32"
        stroke="url(#logoGrad)"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.35"
      />

      {/* cardinal arrows — N */}
      <line x1="32" y1="22" x2="32" y2="10" stroke="url(#logoGrad)" strokeWidth="2" strokeLinecap="round" />
      <polyline points="28,14 32,9 36,14" stroke="url(#logoGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* cardinal arrows — S */}
      <line x1="32" y1="42" x2="32" y2="54" stroke="url(#logoGrad)" strokeWidth="2" strokeLinecap="round" />
      <polyline points="28,50 32,55 36,50" stroke="url(#logoGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* cardinal arrows — E */}
      <line x1="42" y1="32" x2="54" y2="32" stroke="url(#logoGrad)" strokeWidth="2" strokeLinecap="round" />
      <polyline points="50,28 55,32 50,36" stroke="url(#logoGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* cardinal arrows — W */}
      <line x1="22" y1="32" x2="10" y2="32" stroke="url(#logoGrad)" strokeWidth="2" strokeLinecap="round" />
      <polyline points="14,28 9,32 14,36" stroke="url(#logoGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* diagonal arrows — NE */}
      <line x1="39" y1="25" x2="47" y2="17" stroke="url(#logoGrad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <polyline points="43,17 47,17 47,21" stroke="url(#logoGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7" />

      {/* diagonal arrows — NW */}
      <line x1="25" y1="25" x2="17" y2="17" stroke="url(#logoGrad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <polyline points="17,21 17,17 21,17" stroke="url(#logoGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7" />

      {/* diagonal arrows — SE */}
      <line x1="39" y1="39" x2="47" y2="47" stroke="url(#logoGrad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <polyline points="47,43 47,47 43,47" stroke="url(#logoGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7" />

      {/* diagonal arrows — SW */}
      <line x1="25" y1="39" x2="17" y2="47" stroke="url(#logoGrad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <polyline points="21,47 17,47 17,43" stroke="url(#logoGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7" />

      {/* padlock body */}
      <rect
        x="25" y="30" width="14" height="11" rx="2"
        fill="url(#logoGrad)"
        opacity="0.9"
      />

      {/* padlock shackle */}
      <path
        d="M 28 30 L28 26 A 4 4 0 0 1 36 26 L36 30"
        stroke="url(#logoGrad)"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* keyhole */}
      <circle cx="32" cy="35" r="1.5" fill="var(--background, #fff)" />
      <rect x="31.2" y="35.5" width="1.6" height="3" rx="0.5" fill="var(--background, #fff)" />
    </motion.svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={42} />
      <span className="font-display text-[17px] tracking-tight text-foreground">
        Cardinal
      </span>
    </Link>
  );
}
