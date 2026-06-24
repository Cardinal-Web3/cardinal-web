"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { SiteLayout } from "@/components/layout/site-layout";
import { useScrollSpy } from "@/hooks/use-scroll-spy";

const TOC_SPRING_SOFT = { type: "spring" as const, stiffness: 240, damping: 32, mass: 1.05 };
const TOC_INDICATOR_EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

const SECTIONS = [
  { id: "intent", label: "Intent" },
  { id: "endpoint", label: "Endpoint" },
  { id: "verdict", label: "Verdict" },
  { id: "payload", label: "Payload" },
  { id: "run-local", label: "Run local" },
] as const;

const SECTION_IDS = SECTIONS.map((s) => s.id);

const requestExample = `curl -X POST http://localhost:3001/api/check-transaction \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: cardinal_demo_key" \\
  -d '{
    "from_address": "0x1230000000000000000000000000000000000456",
    "to_address": "0x0000000000000000000000000000000000000001",
    "chain": "ethereum",
    "token": "USDC",
    "amount": 2500,
    "transaction_type": "safe_send",
    "contract_verified": true,
    "permissions": []
  }'`;

const responseExample = `{
  "request_id": "req_8b2a...",
  "risk_score": 18,
  "risk_level": "LOW",
  "network_valid": true,
  "warnings": [],
  "findings": [],
  "recommended_action": "ALLOW",
  "checked_at": "2026-06-22T06:50:00.000Z"
}`;

const fields = [
  ["from_address", "Who is sending value."],
  ["to_address", "Who or what receives value."],
  ["chain", "Where the transaction will execute."],
  ["token", "The asset being moved."],
  ["amount", "How much value is at risk."],
  ["transaction_type", "The product flow, for example safe_send or escrow."],
  ["contract_verified", "Whether the target contract source is verified."],
  ["permissions", "Approval or contract permissions to inspect."],
];

const verdicts = [
  ["ALLOW", "Continue", "Low risk. Let the user proceed."],
  ["REVIEW", "Warn clearly", "Something needs a human check before signing."],
  ["BLOCK", "Stop signing", "Do not let funds leave the wallet."],
];

export function ApiDocsPage() {
  const { activeId, scrollToSection } = useScrollSpy(SECTION_IDS);

  return (
    <SiteLayout docs>
      <main className="relative min-h-screen overflow-hidden px-5 pb-24 pt-28 sm:px-8 lg:px-10">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-45 dark:opacity-25" />
        <div className="pointer-events-none absolute left-1/2 top-28 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan/10 blur-[120px]" />

        <MobileToc activeId={activeId} onNavigate={scrollToSection} />

        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Docs map
              </div>
              <nav className="mt-6 space-y-1 border-l border-[var(--border)] pl-3">
                {SECTIONS.map((item) => {
                  const isActive = item.id === activeId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-current={isActive ? "true" : undefined}
                      onClick={() => scrollToSection(item.id)}
                      className={`relative -ml-3 block w-full border-l-2 py-1.5 pl-3 text-left font-mono text-[11px] uppercase tracking-[0.16em] transition ${
                        isActive
                          ? "border-cyan text-cyan"
                          : "border-transparent text-muted-foreground hover:translate-x-1 hover:text-foreground"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>
              <div className="mt-10 border-l border-cyan/40 pl-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">
                  Live reference
                </div>
                <a
                  href="http://localhost:3001/docs"
                  className="group/swagger relative mt-3 inline-flex items-center gap-3 overflow-hidden rounded-full border border-cyan/25 bg-cyan/[0.045] px-3 py-2 text-[13px] text-foreground transition duration-300 hover:border-cyan/70 hover:bg-cyan/[0.09] hover:text-cyan hover:shadow-[0_0_32px_-16px_oklch(0.82_0.13_210)]"
                >
                  <span className="pointer-events-none absolute inset-y-0 -left-12 w-10 rotate-12 bg-cyan/20 blur-md transition duration-700 group-hover/swagger:left-full" />
                  <span className="relative">Open Swagger</span>
                  <span
                    className="relative grid h-7 w-7 place-items-center rounded-full border border-cyan/25 bg-background/45 transition duration-300 group-hover/swagger:translate-x-0.5 group-hover/swagger:border-cyan/70"
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-3.5 w-3.5 transition duration-300 group-hover/swagger:-translate-y-0.5 group-hover/swagger:translate-x-0.5"
                      fill="none"
                    >
                      <path
                        d="M7 17 17 7M9 7h8v8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </a>
              </div>
            </div>
          </aside>

          <div className="min-w-0">
            <section id="intent" className="scroll-mt-36 border-b border-[var(--border)] pb-14 lg:scroll-mt-28">
              <div className="flex flex-wrap items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-cyan shadow-[0_0_14px_oklch(0.82_0.13_210)]" />
                  Cardinal Protection API
                </span>
                <span>/</span>
                <span>pre-sign decisioning</span>
              </div>

              <h1 className="mt-8 max-w-3xl font-display text-[clamp(38px,5.8vw,76px)] leading-[0.94] tracking-[-0.045em]">
                Check risk before signature.
              </h1>

              <div className="mt-8 grid gap-8 xl:grid-cols-[0.8fr_1.2fr]">
                <div>
                  <p className="max-w-lg text-[15.5px] leading-relaxed text-muted-foreground sm:text-[17px]">
                    Call one endpoint with transaction details. Use the returned action:
                    <span className="text-foreground"> ALLOW, REVIEW, or BLOCK.</span>
                  </p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/app/new"
                      className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-3 text-[13.5px] font-medium text-background transition hover:bg-cyan"
                    >
                      Try SafeSend flow →
                    </Link>
                    <a
                      href="#endpoint"
                      className="inline-flex items-center justify-center rounded-full border border-[var(--border-strong)] bg-background/30 px-5 py-3 text-[13.5px] text-foreground transition hover:border-cyan hover:text-cyan"
                    >
                      Read endpoint
                    </a>
                  </div>
                </div>

                <FlowStrip />
              </div>
            </section>

            <section id="endpoint" className="scroll-mt-36 border-b border-[var(--border)] py-16 lg:scroll-mt-28">
              <SectionHeader
                index="01"
                title="Endpoint"
                body="Use the backend endpoint from trusted server environments. The MVP uses a Next.js proxy route so partner keys never touch the browser."
              />
              <div className="mt-10 grid gap-8 xl:grid-cols-[360px_1fr]">
                <div className="space-y-7">
                  <EndpointLine label="Backend" method="POST" path="/api/check-transaction" />
                  <EndpointLine label="MVP proxy" method="POST" path="/api/protection/check" />
                  <div className="border-l border-cyan/45 pl-5">
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">
                      Auth header
                    </div>
                    <div className="mt-2 font-mono text-[15px]">x-api-key</div>
                    <p className="mt-3 max-w-sm text-[13.5px] leading-relaxed text-muted-foreground">
                      Store this key server-side. For web products, call your own backend or the
                      built-in Next proxy.
                    </p>
                  </div>
                </div>
                <CodeSurface title="Request" code={requestExample} />
              </div>
            </section>

            <section id="verdict" className="scroll-mt-36 border-b border-[var(--border)] py-16 lg:scroll-mt-28">
              <SectionHeader
                index="02"
                title="Verdict"
                body="Do not build product behavior from the score alone. Use recommended_action as the gate and use findings to explain the decision."
              />
              <div className="mt-10">
                {verdicts.map(([name, action, body], index) => (
                  <VerdictLane
                    key={name}
                    name={name}
                    action={action}
                    body={body}
                    index={index + 1}
                  />
                ))}
              </div>
              <div className="mt-10 grid gap-8 xl:grid-cols-[360px_1fr]">
                <div className="border-l border-[var(--border)] pl-5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Integration rule
                  </div>
                  <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-muted-foreground">
                    `risk_score` helps explain confidence. `recommended_action` decides whether the
                    app continues, warns, or blocks before signature.
                  </p>
                </div>
                <CodeSurface title="Response" code={responseExample} />
              </div>
            </section>

            <section id="payload" className="scroll-mt-36 border-b border-[var(--border)] py-16 lg:scroll-mt-28">
              <SectionHeader
                index="03"
                title="Payload"
                body="The request should be boring and explicit. Cardinal turns these transaction facts into explainable risk findings."
              />
              <div className="mt-10 divide-y divide-[var(--border)] border-y border-[var(--border)]">
                {fields.map(([name, detail]) => (
                  <div
                    key={name}
                    className="grid gap-2 py-4 transition duration-300 hover:bg-cyan/[0.035] sm:grid-cols-[220px_1fr]"
                  >
                    <div className="font-mono text-[12px] text-cyan">{name}</div>
                    <div className="text-[14px] leading-relaxed text-muted-foreground">
                      {detail}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="run-local" className="scroll-mt-36 py-16 lg:scroll-mt-28">
              <SectionHeader
                index="04"
                title="Run local"
                body="Run the backend first, then run the web MVP. Live mode shows a real API error if the backend is offline."
              />
              <div className="mt-10 grid gap-8 xl:grid-cols-[360px_1fr]">
                <div className="space-y-5 border-l border-cyan/45 pl-5">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      Backend
                    </div>
                    <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                      Starts Postgres, applies migrations, seeds demo key, then serves Swagger at
                      `localhost:3001/docs`.
                    </p>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      Web
                    </div>
                    <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                      Starts the MVP at `localhost:3004` and calls `/api/protection/check`.
                    </p>
                  </div>
                </div>
                <CodeSurface
                  title="Commands"
                  code={`# Terminal 1: backend
cd cardinal-protection-api-be
docker compose up -d
npm run prisma:deploy
npm run prisma:seed
npm run start:dev

# Terminal 2: web MVP
cd cardinal-security-wallet/apps/web-modified-app/cardinal-protocol
npm run dev`}
                />
              </div>
            </section>
          </div>
        </div>
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
      aria-label="API docs sections"
      className="sticky top-[4.5rem] z-40 -mx-5 mb-8 border-b border-[var(--border)] bg-background/90 backdrop-blur-xl sm:-mx-8 lg:hidden"
    >
      <p className="px-5 pt-2.5 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60 sm:px-8">
        On this page
      </p>
      <div className="relative px-5 pb-2 pt-1 sm:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-5 bg-gradient-to-r from-background/95 to-transparent sm:w-8"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-5 bg-gradient-to-l from-background/95 to-transparent sm:w-8"
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
                aria-current={isActive ? "true" : undefined}
                onClick={() => onNavigate(section.id)}
                animate={{ opacity: reduceMotion ? 1 : isActive ? 1 : 0.5 }}
                transition={reduceMotion ? { duration: 0 } : TOC_SPRING_SOFT}
                className={`shrink-0 whitespace-nowrap px-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] leading-none ${
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

function FlowStrip() {
  const steps = ["transaction intent", "risk engine", "recommended action", "wallet gate"];
  return (
    <div className="relative overflow-hidden border-y border-[var(--border)] py-4 sm:py-8">
      <div className="animate-scan pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--gradient-line)]" />
      <div className="grid gap-0 sm:grid-cols-4">
        {steps.map((step, index) => (
          <div
            key={step}
            className="group relative border-l border-[var(--border)] px-5 py-2.5 first:border-l-0 sm:py-6"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">
              0{index + 1}
            </div>
            <div className="mt-1.5 text-[15px] leading-tight text-foreground sm:mt-4 sm:min-h-12 sm:text-[17px]">{step}</div>
            <div className="mt-2.5 h-px origin-left scale-x-50 bg-cyan/40 transition duration-500 group-hover:scale-x-100 sm:mt-6" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionHeader({ index, title, body }: { index: string; title: string; body: string }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[160px_1fr]">
      <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan">{index}</div>
      <div>
        <h2 className="font-display text-[clamp(34px,5vw,64px)] leading-[0.95] tracking-[-0.045em]">
          {title}
        </h2>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}

function EndpointLine({ label, method, path }: { label: string; method: string; path: string }) {
  return (
    <div className="group border-l border-[var(--border)] pl-5 transition duration-300 hover:border-cyan">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <span className="font-mono text-[11px] text-cyan">{method}</span>
        <span className="font-mono text-[14px] text-foreground/90 transition group-hover:text-cyan">
          {path}
        </span>
      </div>
    </div>
  );
}

function VerdictLane({
  index,
  name,
  action,
  body,
}: {
  index: number;
  name: string;
  action: string;
  body: string;
}) {
  return (
    <div className="group grid gap-3 border-t border-[var(--border)] py-5 transition duration-300 last:border-b hover:bg-cyan/[0.035] sm:grid-cols-[90px_180px_1fr_170px] sm:items-center">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        0{index}
      </div>
      <div className="font-display text-[28px] tracking-[-0.03em] transition group-hover:text-cyan">
        {name}
      </div>
      <div className="text-[14px] leading-relaxed text-muted-foreground">{body}</div>
      <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-foreground/80">
        {action}
      </div>
    </div>
  );
}

function CodeSurface({ title, code }: { title: string; code: string }) {
  return (
    <div className="group/code relative min-w-0 border-l border-[var(--border)] pl-5 [perspective:1200px]">
      <div className="mb-3 flex items-center justify-between gap-4 transition duration-300 group-hover/code:translate-x-1">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition group-hover/code:text-cyan">
          {title}
        </div>
        <div className="h-px flex-1 bg-[linear-gradient(90deg,var(--border),transparent)]" />
      </div>
      <div className="relative transition duration-500 [transform-style:preserve-3d] group-hover/code:-translate-y-1 group-hover/code:[transform:rotateX(1.5deg)_rotateY(-1.5deg)]">
        <div className="pointer-events-none absolute -inset-3 translate-y-5 rounded-[28px] bg-cyan/10 blur-2xl opacity-0 transition duration-500 group-hover/code:opacity-100" />
        <div className="relative overflow-hidden rounded-[24px] border border-[var(--border)] bg-[linear-gradient(145deg,color-mix(in_oklab,var(--surface-elevated)_84%,transparent),color-mix(in_oklab,var(--background)_92%,transparent))] shadow-[0_26px_80px_-44px_oklch(0_0_0/0.75),0_0_0_1px_var(--border)]">
          <div className="flex items-center justify-between border-b border-[var(--border)] bg-background/35 px-4 py-3">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-red/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber/75" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald/75" />
            </div>
            <div className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">
              Cardinal API
            </div>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,oklch(from_var(--cyan)_l_c_h/0.12),transparent_38%)]" />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-[linear-gradient(90deg,color-mix(in_oklab,var(--background)_86%,transparent),transparent)]" />
            <pre className="relative max-h-[440px] overflow-auto px-5 py-5 font-mono text-[11.5px] leading-relaxed text-foreground/90">
              <code>{code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
