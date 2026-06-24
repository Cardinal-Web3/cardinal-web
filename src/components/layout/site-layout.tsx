"use client";

import { type ReactNode } from "react";
import { Nav } from "@/components/site/Nav";
import { CurtainReveal, Footer, type CurtainPace } from "@/components/site/Footer";

/** Marketing pages: nav + scroll-driven curtain footer reveal (matches homepage). */
export function SiteLayout({
  children,
  docs = false,
  curtainPace = "default",
}: {
  children: ReactNode;
  /** Docs-style pages: static footer, no curtain scroll zone (prevents scroll lock). */
  docs?: boolean;
  /** Slower curtain + CARDINAL letter reveal (for shorter pages like /whitepaper). */
  curtainPace?: CurtainPace;
}) {
  if (docs) {
    return (
      <div className="relative min-h-screen bg-background">
        <Nav />
        {children}
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background [overflow-x:clip]">
      <CurtainReveal pace={curtainPace}>
        <Nav />
        {children}
      </CurtainReveal>
    </div>
  );
}
