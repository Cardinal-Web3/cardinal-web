# Cardinal — Plan

A cinematic, infrastructure-grade marketing site plus a working SafeSend MVP. Dark, security-focused, motion-led. Built to feel like Stripe × CrowdStrike × Linear, not a crypto project.

## Scope

**Marketing site** (single long scroll, plus standalone sub-routes where SEO matters):
1. Hero — live transaction scan simulation with verdict
2. The Problem — cinematic transaction-failure visualization
3. How Cardinal Works — animated 6-step flow
4. Transaction Protection Engine — live protection dashboard
5. SafeSend — premium product UI
6. Escrow Infrastructure — buyer → escrow → settlement
7. Threat Intelligence — animated security map
8. For Partners — wallets, exchanges, marketplaces, payments
9. Pilot Program — transparency/trust section
10. Footer

**MVP App** at `/app`:
- `/app` — My SafeSends (dashboard)
- `/app/new` — Create SafeSend (form)
- `/app/new/scan` — Scan In Progress (live pipeline)
- `/app/new/verdict` — Verdict (ALLOW / REVIEW / BLOCK)
- `/app/new/confirm` — Confirm SafeSend
- `/app/new/receipt` — Receipt
State persisted in localStorage; no wallet/chain integration — this is a cinematic, deployable-feeling prototype.

## Design system

- **Palette (tokens in `src/styles.css`)**
  - `--background` near-black `oklch(0.14 0.01 250)`
  - `--surface` graphite `oklch(0.19 0.012 250)`
  - `--surface-elevated` `oklch(0.22 0.014 250)`
  - `--foreground` `oklch(0.97 0.005 250)`
  - `--muted-foreground` `oklch(0.62 0.02 250)`
  - `--cyan` `oklch(0.82 0.13 210)` (primary highlight)
  - `--violet` `oklch(0.62 0.17 290)` (gradient accent)
  - `--emerald` `oklch(0.74 0.16 155)` (allow / success)
  - `--amber` `oklch(0.80 0.16 75)` (review)
  - `--red` `oklch(0.65 0.22 25)` (block / threat)
  - `--border` `oklch(1 0 0 / 0.08)`
  - `--gradient-aurora` cyan→violet radial used sparingly behind hero verdict
- **Type**: Geist (display + body) loaded via `<link>` in `__root.tsx`; JetBrains Mono for addresses/tx hashes/code. Huge display sizes (clamp 56→112px), tight tracking, generous leading on body.
- **Surfaces**: 1px borders at 8% white, subtle inner highlight, soft outer glow on key cards (`shadow: 0 0 0 1px var(--border), 0 20px 60px -20px oklch(0.82 0.13 210 / 0.15)`).
- **Grid**: subtle dotted background grid, vignette at edges.

## Motion system

- **Library**: `motion` (Motion for React) for component animation, `gsap` only if a single scrub-scrubbed timeline is needed (likely not). All easings `[0.22, 1, 0.36, 1]`.
- **Hero scan pipeline**: orchestrated timeline — wallet pulse → tx assembled (mono text typing) → 5 signal nodes light up in sequence (wallet reputation, recipient, network, contract, simulation) → lines flow into a central core → verdict card lifts in with colored aura → "Protected settlement" confirmation pill.
- **Section reveals**: subtle y-translate + opacity on enter, staggered children.
- **Dashboard**: live counters, sparkline ticks, "scanning…" shimmer on rows.
- **Threat map**: SVG world-ish abstract grid with animated arcs between nodes, occasional red threat pulse, cyan-protected pulses.
- **Reduced motion**: respect `prefers-reduced-motion` everywhere.

## 3D / depth

Lightweight, no heavy WebGL. Use layered SVG + CSS 3D transforms:
- Hero core: rotating concentric SVG rings with parallax on mouse move
- Network graph: animated SVG nodes/edges with depth blur layers
- No three.js — keeps bundle and SSR clean

## Section-by-section build notes

- **Hero**: full viewport, left column copy ("Protect Web3 transactions before you sign." + sub + two CTAs `Launch App` / `Explore SafeSend`), right column the live scan visualization. Auto-loops every ~8s; ALLOW/REVIEW/BLOCK rotate to show range. Pause on hover.
- **Problem**: split — left: failure modes list (malicious approval, scam wallet, wrong recipient, wrong network, irreversible loss) with mono code-style examples; right: a transaction "shattering" animation when an unprotected sig is submitted.
- **How it works**: horizontal 6-step rail, sticky on scroll, each step animates in with its own micro-illustration.
- **Protection Engine**: full-bleed dashboard mockup — left rail with 5 signal categories, center risk graph (sparkline + heat bars), right panel "findings" feed streaming in.
- **SafeSend**: realistic product card — recipient (truncated 0x address), token selector (ETH/USDC), amount, delay slider (1h–72h), gas estimate, release time, cancel window countdown, status pill. Interactive — user can change inputs.
- **Escrow**: 4-stage horizontal flow with state machine animation.
- **Threat Intelligence**: animated map of nodes; counters: scam wallets indexed, txs monitored, signals processed.
- **Partners**: 4 cards (Wallets / Exchanges / Marketplaces / Payments) with subtle hover lift and abstract icon per category.
- **Pilot**: transparent honest block — "SafeSend is in controlled pilot." Bullet list of what that means. Form: request pilot access (email only, stored in localStorage — no backend in v1).
- **Footer**: minimal — logo, columns (Product / Company / Resources / Legal), small print, status indicator dot.

## App MVP (`/app/*`)

Real feeling, no backend. Zustand store + localStorage.
- **Create SafeSend**: same field set as marketing section, plus recipient validation (regex 0x + 40 hex), token dropdown, amount with USD estimate, delay & cancel window, optional memo.
- **Scan**: 5-stage pipeline with realistic timings (600–1200ms each), live log feed in mono. Findings appear with severity chips.
- **Verdict**: large verdict letter (A/R/B) with aura color, summary, list of findings, "Proceed" / "Edit transaction" / "Cancel".
- **Confirm**: review screen, "Sign with wallet" simulated (2s pending → success).
- **Receipt**: tx-id, cancel countdown, share/copy actions, link to dashboard.
- **My SafeSends**: table — recipient, amount, status (Pending release / Released / Cancelled / Blocked), countdown, row actions (Cancel before release).

## Routes (TanStack Start)

```
src/routes/
  __root.tsx                 (head, font links, dark class on html)
  index.tsx                  (full marketing page)
  safesend.tsx               (deeper SafeSend page for SEO; reuses sections)
  partners.tsx               (partners detail page)
  pilot.tsx                  (pilot program detail + signup)
  app.tsx                    (app shell: left rail, top bar, <Outlet/>)
  app.index.tsx              (My SafeSends)
  app.new.tsx                (Create — wizard layout with <Outlet/>)
  app.new.index.tsx          (form)
  app.new.scan.tsx
  app.new.verdict.tsx
  app.new.confirm.tsx
  app.new.receipt.$id.tsx
```
Each route sets its own `head()` with unique title, description, og tags.

## Files to create (key components)

- `src/components/site/Nav.tsx`, `Footer.tsx`
- `src/components/site/Hero.tsx`, `HeroScan.tsx` (the cinematic visualization)
- `src/components/site/Problem.tsx`, `HowItWorks.tsx`, `ProtectionEngine.tsx`, `SafeSendShowcase.tsx`, `Escrow.tsx`, `ThreatMap.tsx`, `Partners.tsx`, `Pilot.tsx`
- `src/components/app/AppShell.tsx`, `SafeSendForm.tsx`, `ScanPipeline.tsx`, `VerdictCard.tsx`, `ReceiptCard.tsx`, `SafeSendTable.tsx`
- `src/components/ui/*` shadcn (already present)
- `src/lib/safesend-store.ts` (Zustand + localStorage)
- `src/lib/mock-scan.ts` (deterministic-ish scoring from address + amount)
- `src/styles.css` updated with full token system

## Dependencies to add

`motion`, `zustand`, `clsx` (likely present), `lucide-react` (present).

## Non-goals (v1)

- No wallet connect / chain RPC
- No backend / Lovable Cloud (no auth, no DB)
- No payments
- No three.js / WebGL

If you want any of those wired up (Cloud for storing pilot signups, real wallet connect, etc.), say the word and I'll add a follow-up.

---

Approve and I'll build it end-to-end.
