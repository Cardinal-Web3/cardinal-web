"use client";

import { type ReactNode } from "react";
import { Nav } from "@/components/site/Nav";
import { CurtainReveal } from "@/components/site/Footer";

/** Marketing pages: nav + scroll-driven curtain footer reveal (matches homepage). */
export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-background [overflow-x:clip]">
      <CurtainReveal>
        <Nav />
        {children}
      </CurtainReveal>
    </div>
  );
}
