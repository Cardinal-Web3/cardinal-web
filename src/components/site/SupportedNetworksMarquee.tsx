"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "motion/react";

const NETWORKS = [
  "Ethereum",
  "Base",
  "Arbitrum",
  "Polygon",
  "Optimism",
  "BNB Chain",
] as const;

function ChainSet({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center gap-8"
      aria-hidden={ariaHidden}
    >
      {NETWORKS.map((name, i) => (
        <Fragment key={name}>
          {i > 0 && (
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet/50 shadow-[0_0_6px_oklch(0.66_0.18_290_/_0.2)]"
              aria-hidden
            />
          )}
          <span className="whitespace-nowrap font-display text-[14px] text-foreground/45 sm:text-[15px]">
            {name}
          </span>
        </Fragment>
      ))}
    </div>
  );
}

export function SupportedNetworksMarquee() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      className="network-marquee-band relative border-y border-[var(--border)] py-7"
      aria-label={`Protected across supported networks: ${NETWORKS.join(", ")}`}
    >
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="eyebrow mb-5 text-center text-muted-foreground"
      >
        Protected across supported networks
      </motion.p>

      {prefersReducedMotion ? (
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6">
          <ChainSet />
        </div>
      ) : (
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="network-marquee-track flex w-max items-center will-change-transform">
            {[0, 1, 2].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center">
                <ChainSet ariaHidden />
                <div className="w-8 shrink-0" aria-hidden />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
