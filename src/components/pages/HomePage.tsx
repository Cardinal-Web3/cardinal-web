"use client";

import { SiteLayout } from "@/components/layout/site-layout";
import { Hero } from "@/components/site/Hero";
import { SupportedNetworksMarquee } from "@/components/site/SupportedNetworksMarquee";
import { ProtectionShowcase } from "@/components/site/HeroScan";
import { Problem, HowItWorks } from "@/components/site/Sections1";
import { ProtectionEngine } from "@/components/site/ProtectionEngine";
import { SafeSendShowcase, Escrow } from "@/components/site/Sections2";
import { ThreatMap, Partners, Pilot } from "@/components/site/Sections3";
import { WhitepaperCallout } from "@/components/site/WhitepaperCallout";
import { FAQ } from "@/components/site/FAQ";
import { CTABand } from "@/components/site/CTABand";

export function HomePage() {
  return (
    <SiteLayout>
      <main>
        <Hero />
        <SupportedNetworksMarquee />
        <ProtectionShowcase />
        <Problem />
        <HowItWorks />
        <ProtectionEngine />
        <SafeSendShowcase />
        <Escrow />
        <ThreatMap />
        <Partners />
        <Pilot />
        <WhitepaperCallout />
        <FAQ />
        <CTABand />
      </main>
    </SiteLayout>
  );
}
