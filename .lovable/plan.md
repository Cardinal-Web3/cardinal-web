
# Cardinal v2 — Security Operating System

A cinematic restructure that strips dashboard chrome, adds 3D depth, and stages Cardinal as a security OS. Not crypto. Not SaaS. Reference register: Apple keynote, Arc Browser, Stripe Radar, CrowdStrike Falcon, Palantir Foundry — with the typographic confidence of Litheum.

## Direction shifts

- **−50% dashboard UI** — kill flat stat cards, dense rails, repeated badge clutter. Replace with sparse, oversized typographic statements + one signature visual per section.
- **+300% cinematic storytelling** — each section is a scene with a single idea, a single visual, and air around it. Sticky scroll, parallax depth, scrubbed reveals.
- **Tilted glass panels** — replace every flat card with floating panels using `transform: perspective(1600px) rotateX/rotateY`, backdrop-blur, inner highlight stroke, soft drop shadow, subtle hover tilt tracking the cursor.
- **Giant typography moments** — Litheum-style closing wordmark, oversized section labels (clamp 80→220px), tight tracking, mixed case. Body stays small and quiet.

## Signature visual: Transaction Interception Engine (TIE)

A single hero-grade 3D scene replacing the current `HeroScan`. Lives in the hero AND returns as the centerpiece of the Protection Engine section.

```text
        wallet ──packet──▶  ╔═══════════════╗  ──packet──▶ chain
        wallet ──packet──▶  ║   CARDINAL    ║       │
        wallet ──packet──▶  ║  INTERCEPTOR  ║   ↘ quarantined
                            ╚═══════════════╝
                              ▲    ▲    ▲
                          5 signal beams (tilted glass slabs)
```

- 3D stage: CSS `perspective: 2000px`, tilted floor grid receding to horizon, volumetric fog.
- **Packets** = small luminous quads traveling along curved SVG paths from left (origin wallets) toward the central Interceptor core.
- **Interceptor core** = stacked tilted glass slabs (5 signal layers) rotating slowly on Y; each slab lights when its check runs.
- **Threats** = red packets that get yanked off-path into a quarantine well below the core (animated arc + dissolve).
- **Safe** = cyan packets that pass through and continue to the right, leaving a faint trail.
- **Verdict halo** pulses around the core when a transaction resolves (cyan/amber/red aura).
- Subtle mouse parallax on the whole stage; respects `prefers-reduced-motion`.

Implemented as layered SVG + CSS 3D transforms + Motion. No three.js.

## Section rebuild (marketing)

1. **Hero** — left: tight 2-line statement ("Intercept the transaction. / Before it signs."), small mono caption, two pills (Launch App / See the Engine). Right: TIE scene full-bleed, 80vh.
2. **The Threat Surface** (was Problem) — single giant numeric ("$3.8B" type moment), one tilted glass panel listing 4 failure modes, packet-shatter micro-animation on scroll.
3. **The Interception Engine** — sticky scroll: TIE re-mounts large, 5 captions reveal one-by-one as each signal slab lights (Wallet · Recipient · Network · Contract · Simulation). No dashboard, no rails.
4. **SafeSend** — one tilted glass panel floating in space, oversized "SafeSend." wordmark behind it, minimal labels.
5. **Escrow** — three tilted slabs in perspective row (Deposit → Hold → Release), connecting light beam.
6. **Threat Intelligence** — globe-less: tilted dark plane with animated arcs + 3 huge counters as type moments, not cards.
7. **Partners** — 4 thin tilted glass slats, hover lifts and rotates toward cursor.
8. **Pilot** — single centered glass panel, email input, quiet.
9. **Closing wordmark** — Litheum-style: **"CARDINAL"** rendered massive (clamp 140→320px), tight, edge-to-edge, hairline divider above. Sits directly above footer.
10. **Footer** — Litheum-style columns: Technology / Product / Company / Legal / Follow. Compact, mono labels, hairline dividers.

## Nav

Rebuild to match Litheum register:
- Left: small logo mark + wordmark.
- Center-right: uppercase mono links with wide tracking (Engine · SafeSend · Escrow · Partners · Pilot).
- Right: pill outlined CTA "LAUNCH APP" with cyan border, hover fills.
- Transparent over hero, gains hairline border + blur on scroll.

## App (`/app/*`) — dashboard slimdown

Remove ~50% of UI density while keeping it functional:
- Drop the left rail; replace with a single thin top bar (logo · breadcrumb · "+ New SafeSend").
- "My SafeSends" becomes a sparse list of floating tilted glass rows (not a table), one per transfer, oversized recipient address, tiny status, hover lifts.
- New SafeSend wizard: each step is one centered glass panel on a dark stage, giant step label behind it ("01 / COMPOSE"), one input group visible at a time.
- Scan step: reuse the TIE scene at smaller scale; signal slabs light in sequence; log feed reduced to 3 lines max.
- Verdict: single giant letter (A / R / B) at 240px, one-line summary, two actions.
- Receipt: one panel, mono tx id, cancel countdown as a type moment.

## Design tokens (additions to `src/styles.css`)

- `--glass-bg: oklch(0.22 0.014 250 / 0.55)`
- `--glass-stroke: oklch(1 0 0 / 0.10)`
- `--glass-highlight: linear-gradient(180deg, oklch(1 0 0 / 0.08), transparent 40%)`
- `--shadow-float: 0 40px 80px -30px oklch(0 0 0 / 0.7), 0 0 0 1px var(--glass-stroke), inset 0 1px 0 oklch(1 0 0 / 0.06)`
- `--perspective-stage: 2000px`
- Utilities: `.glass-panel`, `.tilt-left`, `.tilt-right`, `.stage-3d`, `.wordmark-giant` (clamp(80px, 18vw, 320px), letter-spacing -0.05em, font-weight 500).
- Keep current palette; bias accent usage to a single signature hue per scene.

## Motion

- Mouse-tracked tilt on glass panels (max ±6°, spring damped).
- Section reveals: y+opacity, staggered, ease `[0.22,1,0.36,1]`.
- TIE: orchestrated Motion timeline (packets, slab lights, verdict halo) on loop; pauses on hover; freezes under reduced motion to a static composed frame.
- Scroll-driven: Interception Engine section uses sticky + scroll progress to advance through the 5 slabs.

## Files

**New**
- `src/components/site/TIE.tsx` — the Transaction Interception Engine (shared hero + section).
- `src/components/site/GlassPanel.tsx` — tilted glass primitive (mouse parallax, variants).
- `src/components/site/Wordmark.tsx` — giant closing wordmark.
- `src/components/site/SectionLabel.tsx` — oversized typographic section headers.
- `src/components/site/InterceptionSection.tsx` — sticky scroll scene.

**Rewritten**
- `src/components/site/Nav.tsx` — Litheum-style nav.
- `src/components/site/Footer.tsx` — Litheum-style columns + giant wordmark.
- `src/components/site/Hero.tsx` — tighter copy, embeds TIE.
- `src/components/site/HeroScan.tsx` — replaced by TIE (file removed).
- `src/components/site/Sections1.tsx` / `Sections2.tsx` / `Sections3.tsx` — rebuilt around glass + type moments.
- `src/components/site/ProtectionEngine.tsx` — replaced by `InterceptionSection.tsx`.
- `src/components/app/AppShell.tsx` — top-bar only, no left rail.
- All `src/routes/app.*` — slimmed UI, glass rows, giant step labels.
- `src/styles.css` — new glass/perspective tokens + utilities.

**Unchanged**
- `src/lib/safesend-store.ts`, `src/lib/mock-scan.ts`, routing tree.

## Non-goals

- No three.js / WebGL (kept performant via CSS 3D + SVG).
- No backend, no wallet connect, no auth changes.
- No content/feature additions beyond what already exists.

Approve and I'll rebuild end-to-end in one pass.
