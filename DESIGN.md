# Cardinal Design System

Design and implementation rules for the Cardinal web MVP.

This document is written for humans and LLM coding agents. Before adding new screens such as escrow, partner dashboards, transaction history, billing, or expanded SafeSend flows, read this file and follow the same visual language.

## Product Feeling

Cardinal should feel like security infrastructure, not a hype landing page.

The UI should communicate:

- protection before signature
- calm technical confidence
- enterprise-grade trust
- fast transaction decisioning
- Web3-native polish without visual noise

Good Cardinal screens feel like a control room: quiet, precise, premium, and readable.

Avoid:

- generic SaaS cards everywhere
- cartoon crypto visuals
- random purple gradients
- fake “AI magic” language
- noisy 3D scenes
- huge empty sections that do not explain product value

## Brand Sentence

Use this as the design anchor:

```text
Cardinal scans transaction intent before value moves.
```

Secondary language:

```text
Scan. Settle. Protect.
Protection before signature.
Trust infrastructure for digital asset transactions.
```

## Visual Identity

Cardinal uses a dark security-console aesthetic with enough light-mode support for product demos.

Core visual ingredients:

- deep ink backgrounds
- cyan signal accents
- violet secondary accents
- amber review state
- emerald safe state
- red block state
- fine grid backgrounds
- soft aurora glows
- mono telemetry labels
- large restrained headlines
- rounded pill navigation
- precise borders and hairlines

The design should never become one-note purple or one-note blue. Cyan is a signal color, not the whole palette.

## Logo

Use the Cardinal logo from:

```text
src/components/site/Logo.tsx
public/favicon.svg
```

Rules:

- Use `LogoMark` where space is tight.
- Use `Logo` for nav/header contexts.
- Do not redraw the logo manually.
- Do not stretch, recolor, or place it on busy backgrounds without a dark/light scrim.
- Keep enough empty space around the mark.

## Typography

Primary font:

```text
Geist
```

Mono font:

```text
JetBrains Mono
```

Use Geist for readable product copy. Use JetBrains Mono for:

- transaction IDs
- wallet addresses
- section eyebrows
- status labels
- telemetry
- chain/network labels
- API examples

Typography rules:

- Hero headlines can be large.
- App cards must use tighter headings.
- Avoid negative letter spacing except where already defined in existing hero styles.
- Do not scale text directly with viewport width in new compact UI.
- Do not use all-caps paragraphs.
- Eyebrows can be uppercase mono with wide tracking.

Good examples:

```text
CARDINAL VERDICT
PROTECTION ENGINE
PILOT LIVE
RISK: LOW
NETWORK: VALID
```

## Color Rules

Use CSS tokens from `src/styles.css`. Do not hardcode random colors in components unless you are drawing a brand wallet icon or external logo.

Primary semantic colors:

| Meaning | Color Direction |
| --- | --- |
| Brand signal | Cyan |
| Secondary signal | Violet |
| Safe / allow | Emerald |
| Review / hold | Amber |
| Block / threat | Red |
| Neutral surface | Tokenized surface/background |

Verdict mapping:

| Verdict | UI Treatment |
| --- | --- |
| `ALLOW` | Emerald text, subtle glow, calm copy |
| `REVIEW` | Amber text, visible but not alarming |
| `BLOCK` | Red text, clear warning, no proceed CTA |

Never rely on color alone. Always include plain English labels.

## Surfaces

Cardinal surfaces should look solid and engineered.

Use:

- subtle borders
- soft blur only for modal/backdrop contexts
- low-opacity grid layers
- restrained shadows
- 8-24px radius depending on component size
- clear internal spacing

Avoid:

- nested cards inside cards
- excessive glassmorphism
- heavy glow on every element
- big floating panels without purpose
- decorative blobs/orbs

Recommended surface types:

| Surface | Usage |
| --- | --- |
| Pill | Nav, status, small metadata |
| Panel | App steps, API docs examples, wallet modal |
| Band | Full-width marketing sections |
| Console | Scan/verdict/API code sections |
| Table | Fee breakdown, API response fields, history |

## Motion

Motion should make the product feel alive, not slow.

Use:

- fade + slight rise on entry
- subtle line/progress animations
- soft count-up for metrics
- gentle hover movement
- modal spring scale-in
- scroll reveal only when it improves comprehension

Avoid:

- heavy WebGL on first load
- infinite aggressive animation
- large parallax that makes reading difficult
- scroll hijacking that feels sticky or jittery
- motion that blocks quick app use

Preferred easing:

```ts
const EASE = [0.22, 1, 0.36, 1] as const;
```

Performance rules:

- Every screen must feel responsive on a laptop.
- Prefer CSS gradients, SVG, and lightweight motion over 3D rendering.
- Honor `prefers-reduced-motion`.
- Do not add Three.js/R3F unless explicitly approved and lazy-loaded.

## Layout

Marketing pages:

- centered max-width content
- large hero area
- strong first-viewport signal
- clear next section hint
- full-width bands, not stacked floating cards
- footer can be cinematic, but must remain mobile-safe

App pages:

- denser, calmer layout
- sidebar on desktop
- mobile-safe navigation
- clear step state
- no marketing fluff inside workflow
- CTAs must be obvious

Recommended app flow layout:

```text
Sidebar / Header
-> Step label
-> Progress
-> Main task panel
-> Secondary details
-> Primary CTA
```

## Navigation

Main nav should remain a rounded pill with:

- Cardinal logo
- key links
- theme toggle
- launch/app button
- wallet button

Do not overload the nav. If a feature is experimental, place it inside the app or docs first.

Current marketing links:

```text
SafeSend
Partners
API
Pilot
```

Only add new links if the route has real content.

## Wallet Modal

Wallet modal rules:

- MetaMask is active for pilot.
- Other wallets may be shown as “Coming soon” only if disabled.
- Use recognizable wallet marks, not plain colored squares.
- Show plain instructions if MetaMask is missing or a request is pending.
- Keep the modal compact and centered.
- In light mode, preserve contrast and visible borders.

Good footer copy:

```text
MetaMask required for pilot testing
```

Avoid:

```text
Connect to the future of decentralized security
```

## SafeSend UI Rules

SafeSend is a protected transfer, not a generic send form.

Every SafeSend screen should make the safety story clear:

```text
Create transfer
-> Scan risk
-> Review verdict
-> Confirm fee and gas
-> Lock funds
-> Release or cancel
```

SafeSend pages should show:

- chain
- token
- recipient
- amount
- Cardinal verdict
- risk score
- backend request ID when available
- network validity
- SafeSend fee
- estimated gas
- total lock amount
- clear next action

Do not hide fees behind vague copy. Use direct labels:

```text
Network gas estimate
SafeSend service fee
Amount locked
Recipient receives
```

## Escrow UI Rules

Future escrow must follow Cardinal’s existing security-first style.

Escrow is not just “buyer pays seller.” It should be presented as controlled settlement:

```text
Agreement
-> Security scan
-> Fund escrow
-> Delivery proof
-> Approve / dispute
-> Settlement
```

Escrow screens should include:

- buyer
- seller
- asset/payment amount
- chain/token
- escrow terms
- dispute window
- arbiter status if applicable
- security scan result
- contract status
- timeline

Recommended escrow page structure:

```text
Header: Escrow Vault
Status strip: Draft / Funded / Delivered / Disputed / Released
Agreement panel
Security verdict panel
Settlement timeline
Fee + gas breakdown
Primary action
Secondary actions
```

Design tone:

- calm
- legal/financial clarity
- no playful language
- every state must explain what happens next

## API Docs Design Rules

API docs should feel like a product surface, not raw Swagger only.

Use:

- short value headline
- one clear endpoint example
- request/response examples
- field tables
- decision explanation
- link to Swagger/open API reference

Avoid:

- huge theory blocks
- too many cards
- walls of code before explaining purpose
- vague “AI-powered” wording

Docs should answer:

1. What does this endpoint do?
2. What do I send?
3. What do I get back?
4. How do I use the decision?
5. What errors should I expect?

## Backend Verdict Copy

Keep verdict copy plain English.

Examples:

ALLOW:

```text
Low Risk · Proceed
No risk findings were returned by the backend.
```

REVIEW:

```text
Review Required
This transaction has signals that need one more look.
```

BLOCK:

```text
Blocked
Do not sign. Cardinal found risk signals above threshold.
```

Never say:

```text
This is 100% safe.
Guaranteed secure.
Fraud-proof.
```

## Forms

Form rules:

- labels are required
- inputs must have visible focus
- chain/token selectors should look like product controls
- invalid addresses need immediate explanation
- amounts must show token units
- paste buttons should be compact
- CTAs should never shift layout during loading

Button hierarchy:

| Type | Usage |
| --- | --- |
| Primary | Main action for current step |
| Secondary | Edit/back/reset |
| Danger | Cancel/block/destructive |
| Ghost | Low-emphasis utility |

## Mobile Rules

Mobile is first-class.

Check:

- no horizontal overflow
- nav does not cover hero text
- buttons are at least 44px tall
- wallet modal fits without clipping
- footer does not cut off content
- tables become stacked rows
- code blocks can scroll horizontally
- app sidebar becomes mobile nav

Avoid fixed-height desktop assumptions.

## Light Mode Rules

Light mode must not look washed out.

Required:

- borders visible
- map lines visible
- cards have enough contrast
- cyan remains readable
- amber/red/emerald states are not too pale
- text is not low-opacity gray on white

If a component looks good only in dark mode, it is unfinished.

## Accessibility

Required:

- one H1 per route
- semantic buttons/links
- clear focus states
- text labels alongside color states
- readable contrast
- reduced-motion support
- disabled states that are visibly disabled
- loading states with text or accessible label

Do not use clickable `div`s.

## Copywriting Rules

Use simple product language.

Good:

```text
Cardinal checks this transaction before your wallet signs.
SafeSend locks funds after the transaction passes review.
This recipient has not appeared in prior activity.
```

Bad:

```text
Harness the revolutionary power of decentralized AI protection.
```

Keep copy short in the app. Marketing pages can explain more, but still stay direct.

## Route Map

Current user-facing routes:

| Route | Design Role |
| --- | --- |
| `/` | Product story and trust positioning |
| `/safesend` | SafeSend explanation |
| `/partners` | Partner/enterprise positioning |
| `/pilot` | Pilot entry point |
| `/api-docs` | Protection API overview |
| `/app` | App dashboard |
| `/app/new` | Compose SafeSend |
| `/app/new/scan` | Scan step |
| `/app/new/verdict` | Verdict step |
| `/app/new/confirm` | Fee/gas/contract confirmation |
| `/app/new/receipt/[id]` | Receipt |

Future routes should follow this naming pattern and not create duplicate experiences.

## Component Ownership

Important files:

| Area | Files |
| --- | --- |
| Global styles | `src/styles.css` |
| Site layout | `src/components/layout/site-layout.tsx` |
| App layout | `src/components/app/AppShell.tsx` |
| Navigation | `src/components/site/Nav.tsx` |
| Footer | `src/components/site/Footer.tsx` |
| Logo | `src/components/site/Logo.tsx` |
| Wallet | `src/components/site/WalletButton.tsx`, `src/lib/wallet-store.ts` |
| SafeSend state | `src/lib/safesend-store.ts` |
| Backend API client | `src/lib/protection-api.ts` |
| SafeSend contract | `src/lib/safesend-contract.ts` |
| API docs page | `src/components/pages/ApiDocsPage.tsx` |
| App pages | `src/components/pages/app/*` |

## Implementation Rules For LLMs

When building a new Cardinal screen:

1. Inspect existing pages first.
2. Reuse existing tokens and utilities.
3. Keep visual density similar to nearby screens.
4. Do not introduce a new color palette.
5. Do not add a new animation library.
6. Do not add heavy 3D or WebGL.
7. Make dark and light mode both readable.
8. Make mobile responsive before finishing.
9. Keep warnings in plain English.
10. Preserve backend response shape unless intentionally versioning.

## Quality Bar

Before saying a design task is done:

- run the app
- check desktop width
- check mobile width
- check light mode
- check dark mode
- check hover/focus states
- confirm no text overlaps
- confirm no horizontal scroll
- confirm build still passes

## Current MVP Direction

Cardinal’s next product work should extend the same design system into:

- escrow creation
- escrow detail/status page
- transaction history
- fee and gas reconciliation
- richer API docs
- partner usage dashboard
- backend intelligence results

Every future feature should keep the same product story:

```text
Cardinal protects the user before value moves.
```

