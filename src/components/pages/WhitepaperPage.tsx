"use client";

import { motion, useReducedMotion } from "motion/react";
import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { SiteLayout } from "@/components/layout/site-layout";
import { DownloadWhitepaperButton } from "@/components/ui/download-whitepaper-button";
import { useScrollSpy } from "@/hooks/use-scroll-spy";

const PDF_HREF = "/Cardinal_Escrow_Investor_Deck_2026.pdf";

/** Shared easing — slow, subtle, no bounce */
const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const TOC_SPRING_SOFT = { type: "spring" as const, stiffness: 240, damping: 32, mass: 1.05 };
const TOC_ENTRANCE_MS = 0.62;
const TOC_INDICATOR_EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

const SECTIONS = [
  { id: "the-problem", label: "The Problem" },
  { id: "the-solution", label: "The Solution" },
  { id: "how-it-works", label: "How It Works" },
  { id: "security-engine", label: "Security Engine" },
  { id: "market-opportunity", label: "Market & Opportunity" },
  { id: "revenue-model", label: "Revenue Model" },
  { id: "why-cardinal-wins", label: "Why Cardinal Wins" },
  { id: "the-vision", label: "The Vision" },
] as const;

const SECTION_IDS = SECTIONS.map((s) => s.id);

const stats = [
  ["560M+", "Global crypto users"],
  ["$10T+", "Annual stablecoin volume"],
  ["$24B+", "Lost to crypto scams since 2020"],
  ["0", "Wallets with native escrow + threat intel"],
] as const;

const workflow = [
  ["01", "Create escrow"],
  ["02", "Security scan"],
  ["03", "Fund escrow"],
  ["04", "Deliver assets"],
  ["05", "Approve release"],
  ["06", "Settle"],
] as const;

const layers = [
  ["L1", "Wallet intelligence"],
  ["L2", "Contract intelligence"],
  ["L3", "Transaction simulation"],
  ["L4", "Risk engine"],
  ["L5", "Escrow enforcement"],
] as const;

const revenueStreams = [
  ["Escrow fees", "Per-transaction settlement revenue"],
  ["Enterprise subscriptions", "Recurring API access for institutions"],
  ["API licensing", "Security Engine + threat intel for developers"],
  ["White label", "Embedded escrow for wallet providers"],
] as const;

const moatPoints = [
  "Only solution combining native escrow, threat intel, wallet reputation, and simulation.",
  "Security-first category — not a bolt-on feature inside a wallet.",
  "Full stack coverage that traditional escrow and consumer wallets cannot match.",
  "Technically complex to replicate; compounds with every protected transaction.",
] as const;

export function WhitepaperPage() {
  const { activeId, scrollToSection } = useScrollSpy(SECTION_IDS);

  return (
    <SiteLayout curtainPace="slow">
      <main className="pt-[4.5rem] sm:pt-28">
        <section className="relative overflow-hidden px-4 pb-8 pt-6 sm:px-6 sm:pb-16 sm:pt-12">
          <div className="aurora pointer-events-none absolute left-1/2 top-10 h-[220px] w-full max-w-[640px] -translate-x-1/2 opacity-20 sm:h-[360px] sm:opacity-25" />
          <div className="mx-auto grid max-w-6xl gap-6 sm:gap-10 lg:grid-cols-[1fr_380px] lg:items-end">
            <div className="min-w-0">
              <div className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-[var(--border)] bg-surface-elevated/70 px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground sm:text-[10.5px] sm:tracking-[0.18em]">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_14px_oklch(0.82_0.13_210)]" />
                Investor whitepaper · Confidential
              </div>
              <h1 className="mt-3 font-display text-balance text-[clamp(32px,10vw,88px)] leading-[0.92] tracking-[-0.05em] sm:mt-5 sm:leading-[0.9]">
                Whitepaper
              </h1>
              <p className="mt-2.5 max-w-xl text-[14px] leading-relaxed text-muted-foreground sm:mt-4 sm:text-[17px]">
                Security-first escrow infrastructure — scan risk, hold funds safely, settle with
                confidence.
              </p>
              <div className="mt-6 sm:mt-7">
                <DownloadWhitepaperButton href={PDF_HREF} tone="dark" />
              </div>
            </div>

            <div className="surface-card relative overflow-hidden p-3.5 shadow-[var(--shadow-3d)] sm:p-5">
              <div className="dot-bg absolute inset-0 opacity-40" />
              <div className="relative">
                <div className="eyebrow mb-2.5 sm:mb-3">Protection stack</div>
                <div className="space-y-1.5 sm:space-y-2">
                  {[
                    "Threat intelligence",
                    "Transaction simulation",
                    "Wallet reputation",
                    "Smart contract settlement",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-surface-elevated/70 px-3 py-2 sm:px-4 sm:py-2.5"
                    >
                      <span className="min-w-0 text-[12.5px] leading-snug sm:text-[13px]">
                        {item}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-cyan">
                        active
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 sm:pb-16">
          <MobileToc activeId={activeId} onNavigate={scrollToSection} />

          <div className="md:grid md:grid-cols-[240px_minmax(0,1fr)] md:gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-14">
            <aside className="hidden md:block">
              <div className="sticky top-24">
                <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
                  On this page
                </p>
                <TableOfContents activeId={activeId} onNavigate={scrollToSection} />
              </div>
            </aside>

            <div className="min-w-0 space-y-10 sm:space-y-14 md:space-y-20">
              <DocSection id="the-problem" title="The Problem" index={0}>
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  Digital assets move billions every day — OTC trades, NFT sales, token allocations,
                  service payments — yet most still run on blind trust. When something goes wrong,
                  funds are gone and there is no recovery path.
                </p>
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  Trust remains the biggest unsolved barrier to mainstream digital asset adoption.
                </p>
              </DocSection>

              <DocSection id="the-solution" title="The Solution" index={1}>
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  Cardinal Escrow Protocol is security-driven settlement infrastructure: smart
                  contract escrow combined with threat intelligence, transaction simulation, and
                  wallet reputation — before value moves.
                </p>
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  One protection layer for peer-to-peer digital asset transactions at global scale.
                </p>
              </DocSection>

              <DocSection id="how-it-works" title="How It Works" index={2}>
                <p className="text-[14px] text-muted-foreground">
                  Every transaction passes through security checks before settlement.
                </p>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {workflow.map(([step, label]) => (
                    <div
                      key={step}
                      className="rounded-xl border border-[var(--border)] bg-surface-elevated/60 px-4 py-3"
                    >
                      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-cyan">
                        {step}
                      </div>
                      <div className="mt-1 text-[13px] font-medium">{label}</div>
                    </div>
                  ))}
                </div>
              </DocSection>

              <DocSection id="security-engine" title="Security Engine" index={3}>
                <p className="text-[14px] text-muted-foreground">
                  Five layers. One decision: allow, review, or block.
                </p>
                <div className="flex flex-wrap gap-2">
                  {layers.map(([tag, label]) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-surface-elevated/60 px-3 py-1.5 text-[12.5px]"
                    >
                      <span className="font-mono text-[10px] text-cyan">{tag}</span>
                      {label}
                    </span>
                  ))}
                </div>
              </DocSection>

              <DocSection id="market-opportunity" title="Market & Opportunity" index={4}>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
                  {stats.map(([value, label]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-[var(--border)] bg-surface-elevated/60 p-3 sm:rounded-2xl sm:p-4"
                    >
                      <div className="font-display text-[clamp(22px,6vw,28px)] leading-none">
                        {value}
                      </div>
                      <div className="mt-1 text-[11px] leading-snug text-muted-foreground sm:mt-1.5 sm:text-[12px]">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </DocSection>

              <DocSection id="revenue-model" title="Revenue Model" index={5}>
                <div className="grid gap-3 sm:grid-cols-2">
                  {revenueStreams.map(([title, line]) => (
                    <div
                      key={title}
                      className="rounded-2xl border border-[var(--border)] bg-surface-elevated/60 p-4"
                    >
                      <div className="font-medium">{title}</div>
                      <p className="mt-1 text-[12.5px] text-muted-foreground">{line}</p>
                    </div>
                  ))}
                </div>
              </DocSection>

              <DocSection id="why-cardinal-wins" title="Why Cardinal Wins" index={6}>
                <ComparisonTable />
                <ul className="mt-4 space-y-2">
                  {moatPoints.map((point) => (
                    <li
                      key={point}
                      className="flex gap-2 text-[13px] leading-relaxed text-muted-foreground"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan" />
                      {point}
                    </li>
                  ))}
                </ul>
              </DocSection>

              <DocSection id="the-vision" title="The Vision" index={7}>
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  Cardinal is not building another wallet. It is building the trust infrastructure
                  layer for digital assets — the default protection rail before any high-value
                  transaction settles.
                </p>
                <p className="text-[15px] leading-relaxed text-foreground">
                  Protect every transaction before value moves.
                </p>
              </DocSection>
            </div>
          </div>
        </div>

        <section className="px-4 pb-16 sm:px-6 sm:pb-24">
          <div className="mx-auto max-w-6xl rounded-2xl border border-[var(--border)] bg-foreground p-4 text-background sm:rounded-3xl sm:p-8">
            <div className="grid gap-5 sm:gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-60">
                  Full document
                </div>
                <h2 className="mt-2 font-display text-[clamp(26px,4vw,42px)] leading-[0.95]">
                  Read the full whitepaper
                </h2>
                <p className="mt-2 max-w-md text-[13.5px] leading-relaxed opacity-70">
                  Financial models, roadmap, enterprise use cases, and investment thesis — in the
                  complete PDF.
                </p>
              </div>
              <DownloadWhitepaperButton href={PDF_HREF} tone="light" />
            </div>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}

function MobileToc({
  activeId,
  onNavigate,
}: {
  activeId: string;
  onNavigate: (id: string) => void;
}) {
  const reduceMotion = useReducedMotion();
  const navRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [indicator, setIndicator] = useState({ x: 0, width: 0, ready: false });

  const syncIndicator = useCallback(() => {
    const strip = stripRef.current;
    const btn = btnRefs.current.get(activeId);
    if (!strip || !btn) return;
    setIndicator({ x: btn.offsetLeft, width: btn.offsetWidth, ready: true });
  }, [activeId]);

  useLayoutEffect(() => {
    const strip = stripRef.current;
    const btn = btnRefs.current.get(activeId);
    if (!strip || !btn) return;

    const targetLeft = btn.offsetLeft - strip.clientWidth / 2 + btn.offsetWidth / 2;
    strip.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: reduceMotion ? "auto" : "smooth",
    });
    syncIndicator();
  }, [activeId, reduceMotion, syncIndicator]);

  useLayoutEffect(() => {
    syncIndicator();
    const raf = requestAnimationFrame(syncIndicator);
    document.fonts?.ready.then(syncIndicator);
    window.addEventListener("resize", syncIndicator);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", syncIndicator);
    };
  }, [syncIndicator]);

  const indicatorTransition = reduceMotion
    ? "none"
    : `transform 0.25s ${TOC_INDICATOR_EASE}, width 0.25s ${TOC_INDICATOR_EASE}`;

  return (
    <nav
      ref={navRef}
      aria-label="Whitepaper sections"
      className="sticky top-[4.5rem] z-40 -mx-4 mb-5 border-b border-[var(--border)] bg-background/90 backdrop-blur-xl sm:-mx-6 md:hidden"
    >
      <p className="px-4 pt-2.5 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60 sm:px-6">
        On this page
      </p>
      <div className="relative px-4 pb-2 pt-1 sm:px-6">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-5 bg-gradient-to-r from-background/95 to-transparent sm:w-6"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-5 bg-gradient-to-l from-background/95 to-transparent sm:w-6"
        />
        <div
          ref={stripRef}
          className="relative flex gap-0.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 h-0.5 rounded-full bg-cyan shadow-[0_0_10px_oklch(0.82_0.13_210/0.35)] will-change-transform"
            style={{
              transform: `translateX(${indicator.x}px)`,
              width: indicator.ready ? indicator.width : 0,
              opacity: indicator.ready ? 1 : 0,
              transition: indicatorTransition,
            }}
          />
          {SECTIONS.map((section) => {
            const isActive = section.id === activeId;
            return (
              <motion.button
                key={section.id}
                ref={(el) => {
                  if (el) btnRefs.current.set(section.id, el);
                  else btnRefs.current.delete(section.id);
                }}
                type="button"
                data-section={section.id}
                aria-current={isActive ? "true" : undefined}
                onClick={() => onNavigate(section.id)}
                animate={{
                  opacity: reduceMotion ? 1 : isActive ? 1 : 0.5,
                }}
                transition={reduceMotion ? { duration: 0 } : TOC_SPRING_SOFT}
                className={`shrink-0 px-3 py-2.5 text-[12px] leading-none sm:text-[12.5px] ${
                  isActive ? "font-semibold text-cyan" : "font-normal text-muted-foreground"
                }`}
              >
                {section.label}
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

function TableOfContents({
  activeId,
  onNavigate,
  className = "",
}: {
  activeId: string;
  onNavigate: (id: string) => void;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const [indicator, setIndicator] = useState({ y: 0, height: 0, ready: false });

  const syncIndicator = useCallback(() => {
    const container = navRef.current;
    const link = linkRefs.current.get(activeId);
    if (!container || !link) return;

    const containerRect = container.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();

    setIndicator({
      y: linkRect.top - containerRect.top,
      height: linkRect.height,
      ready: true,
    });
  }, [activeId]);

  useLayoutEffect(() => {
    syncIndicator();

    const raf = requestAnimationFrame(() => {
      syncIndicator();
      requestAnimationFrame(syncIndicator);
    });

    document.fonts?.ready.then(syncIndicator);

    return () => cancelAnimationFrame(raf);
  }, [syncIndicator]);

  useLayoutEffect(() => {
    window.addEventListener("resize", syncIndicator);
    return () => window.removeEventListener("resize", syncIndicator);
  }, [syncIndicator]);

  const listVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.09,
        delayChildren: reduceMotion ? 0 : 0.16,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: reduceMotion ? 1 : 0, x: reduceMotion ? 0 : -6 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: TOC_ENTRANCE_MS, ease: EASE_OUT },
    },
  };

  const indicatorTransition = reduceMotion
    ? "none"
    : `transform 0.25s ${TOC_INDICATOR_EASE}, height 0.25s ${TOC_INDICATOR_EASE}`;

  return (
    <nav ref={navRef} aria-label="Whitepaper sections" className={`relative ${className}`}>
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 w-0.5 rounded-full bg-cyan shadow-[0_0_10px_oklch(0.82_0.13_210/0.35)] will-change-transform"
        style={{
          transform: `translateY(${indicator.y}px)`,
          height: indicator.ready ? indicator.height : 0,
          opacity: indicator.ready ? 1 : 0,
          transition: indicatorTransition,
        }}
      />
      <motion.ol
        className="space-y-px"
        initial="hidden"
        animate="show"
        variants={listVariants}
        onAnimationComplete={syncIndicator}
      >
        {SECTIONS.map((section) => {
          const isActive = section.id === activeId;
          return (
            <motion.li key={section.id} variants={itemVariants}>
              <motion.a
                ref={(el) => {
                  if (el) linkRefs.current.set(section.id, el);
                  else linkRefs.current.delete(section.id);
                }}
                href={`#${section.id}`}
                aria-current={isActive ? "true" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(section.id);
                }}
                animate={{
                  x: isActive && !reduceMotion ? 2 : 0,
                  opacity: isActive ? 1 : 0.5,
                }}
                transition={reduceMotion ? { duration: 0 } : TOC_SPRING_SOFT}
                className={`relative block border-l border-transparent py-2 pl-3.5 pr-1 text-[13px] leading-snug tracking-[-0.01em] ${
                  isActive
                    ? "font-medium text-cyan"
                    : "font-normal text-muted-foreground hover:text-foreground/80"
                }`}
              >
                {section.label}
              </motion.a>
            </motion.li>
          );
        })}
      </motion.ol>
    </nav>
  );
}

function DocSection({
  id,
  title,
  index,
  children,
}: {
  id: string;
  title: string;
  index: number;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <section id={id} className="scroll-mt-[7.25rem] md:scroll-mt-24">
      <motion.div
        initial={reduceMotion ? false : { opacity: 1, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-64px" }}
        transition={{
          duration: 0.55,
          delay: reduceMotion ? 0 : (index % 4) * 0.06,
          ease: EASE_OUT,
        }}
      >
        <h2 className="font-display text-[clamp(20px,5.5vw,36px)] leading-[1] tracking-[-0.04em] sm:leading-[0.98]">
          {title}
        </h2>
        <div className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3 [&_p]:text-[14px] sm:[&_p]:text-[15px] [&_p]:leading-relaxed">
          {children}
        </div>
      </motion.div>
    </section>
  );
}

function Mark({ value }: { value: string }) {
  if (value === "yes")
    return (
      <span className="font-medium text-emerald" aria-label="Yes">
        ✓
      </span>
    );
  if (value === "no")
    return (
      <span className="text-muted-foreground" aria-label="No">
        ✗
      </span>
    );
  if (value === "partial") return <span className="font-mono text-[11px] text-amber">Partial</span>;
  return <span className="text-muted-foreground">{value}</span>;
}

function ComparisonTable() {
  const columns = ["Cardinal", "MetaMask", "Trust Wallet", "Fireblocks"];
  const rows = [
    ["Native escrow", "yes", "no", "no", "no"],
    ["Threat intelligence", "yes", "no", "no", "partial"],
    ["Wallet reputation", "yes", "no", "no", "no"],
    ["Transaction simulation", "yes", "partial", "no", "partial"],
    ["Multi-sig escrow", "yes", "no", "no", "partial"],
  ] as const;

  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <div className="min-w-[32rem] rounded-2xl border border-[var(--border)] sm:min-w-0">
        <table className="w-full border-collapse text-left text-[11.5px] sm:text-[12.5px]">
          <thead>
            <tr className="bg-surface-elevated/60">
              <th className="sticky left-0 z-10 border-b border-[var(--border)] bg-surface-elevated/95 px-2.5 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground backdrop-blur-sm sm:px-3 sm:py-2.5 sm:text-[10px] sm:tracking-[0.14em]">
                Capability
              </th>
              {columns.map((col, i) => (
                <th
                  key={col}
                  className={`border-b border-[var(--border)] px-2 py-2 text-center font-mono text-[9px] uppercase tracking-[0.12em] sm:px-3 sm:py-2.5 sm:text-[10px] sm:tracking-[0.14em] ${
                    i === 0 ? "text-cyan" : "text-muted-foreground"
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]} className="border-b border-[var(--border)] last:border-0">
                <th
                  scope="row"
                  className="sticky left-0 z-10 bg-background/95 px-2.5 py-2 text-left text-[11px] font-normal leading-snug text-foreground backdrop-blur-sm sm:px-3 sm:py-2.5 sm:text-[12.5px]"
                >
                  {row[0]}
                </th>
                {row.slice(1).map((cell, i) => (
                  <td
                    key={i}
                    className={`px-2 py-2 text-center sm:px-3 sm:py-2.5 ${i === 0 ? "bg-cyan/5" : ""}`}
                  >
                    <Mark value={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
