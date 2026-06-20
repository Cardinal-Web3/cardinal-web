# Cardinal — Design & Engineering Reference

> The protection layer between users and blockchain transactions.
> This document is the single source of truth for any LLM or human picking up the project.

---

## 1. Brand

**Voice:** confident, technical, restrained. We don't sell with hype — we sell with proof. Lines like *"Before you sign, Cardinal scans"* over *"Revolutionary Web3 security!"*.

**Logo — "Cardinal Aegis":**
- Hexagonal aperture (6 facets = 6 scan signals)
- 4 micro outward arrows = protected outbound flow
- Cyan → violet gradient stroke
- Inner core dot with cyan glow
- Wordmark `Cardinal` in Geist 600, -0.035em tracking

Lives in `src/components/site/Logo.tsx` (`LogoMark` for icon-only, used in favicon source and any cramped layout).

**Do / Don't**
- ✅ Use `LogoMark` on dark backgrounds with cyan glow.
- ✅ Keep the gradient direction NW→SE.
- ❌ Never put the logo on a busy photo without a tinted scrim.
- ❌ Never recolor the mark to a single flat color outside the brand palette.

**Favicon set** (`public/`): `favicon.svg` (theme-aware vector). Add raster fallbacks (`favicon-32.png`, `apple-touch-icon.png`, `og-cover.png`) when generated.

---

## 2. Color tokens (OKLCH)

All colors live in `src/styles.css` as CSS variables. **Never** hardcode hex/rgb in components.

| Token | Light | Dark | Usage |
| --- | --- | --- | --- |
| `--background` | `0.985 0.004 250` | `0.14 0.01 250` | Page background |
| `--surface` | `0.97 0.006 250` | `0.185 0.012 250` | Cards |
| `--surface-elevated` | `1 0 0` | `0.22 0.014 250` | Buttons, popovers |
| `--foreground` | `0.18 0.02 260` | `0.975 0.005 250` | Primary text |
| `--muted-foreground` | `0.48 0.02 260` | `0.65 0.02 250` | Secondary text |
| `--cyan` | `0.58 0.14 210` | `0.82 0.13 210` | Primary brand / scan signal |
| `--violet` | `0.52 0.2 290` | `0.66 0.18 290` | Accent / second brand stop |
| `--emerald` | `0.58 0.16 155` | `0.76 0.16 155` | ALLOW / success |
| `--amber` | `0.68 0.17 75` | `0.82 0.16 75` | REVIEW / pilot |
| `--red` | `0.58 0.22 25` | `0.67 0.22 25` | BLOCK / threat |
| `--border` | foreground @ 8% | white @ 8% | hairlines |
| `--border-strong` | foreground @ 16% | white @ 14% | buttons, dividers |

**Composite tokens:** `--gradient-brand`, `--gradient-aurora`, `--gradient-line`, `--shadow-elevated`, `--shadow-3d`, `--shadow-glow-{cyan,emerald,red,amber}`, `--ring-aurora`.

---

## 3. Typography

| Role | Family | Notes |
| --- | --- | --- |
| Display | Geist 500 | `font-display` utility, tracking -0.035em |
| Body | Geist 400 | `--font-sans`, ss01 + cv11 features |
| Mono | JetBrains Mono | tx hashes, eyebrows, telemetry, addresses |

Loaded with a `<link>` in `src/routes/__root.tsx` head — **never** `@import` a remote URL in `styles.css` (Lightning CSS resolves from the filesystem).

Hierarchy: `clamp(44px,7vw,92px)` hero · `clamp(34px,5vw,60px)` section H2 · `18–20px` H3 · `13–16px` body · `11px` eyebrow.

---

## 4. Spacing · radii · shadows

- Radii: `--radius` 10px, `-sm` 6, `-md` 8, `-lg` 10, `-xl` 14, `-2xl` 18.
- Section vertical rhythm: `py-28` (112px) on marketing, `py-8` in app.
- Container: `max-w-6xl` marketing, `max-w-3xl` text.
- Shadows: `--shadow-elevated` cards, `--shadow-3d` hero card, glow shadows for verdict states.

---

## 5. Motion vocabulary

Library: `motion/react`. Easing reused across the site:

```ts
const EASE = [0.22, 1, 0.36, 1] as const;
```

| Pattern | Where | Durations |
| --- | --- | --- |
| Page enter/exit | `PageTransition` | 420ms fade+rise (8px) |
| Section reveal | `<Reveal>` (Intersection, `-80px`) | 700ms, 60ms child stagger |
| Hero headline | Word mask reveal | 700ms, 80ms per word |
| Numbers | `<CountUp>` (Intersection, threshold 0.4) | 1400ms cubic ease-out |
| Card tilt | `useTilt` | spring 150/18, max 10° |
| Scan border-beam | conic gradient rotation | 8s linear |
| Verdict aura | SVG strokeDashoffset | 1400ms ease-out |
| Wallet modal | scale-in spring | 280/26 |

**Reduced motion:** global CSS rule kills animations under `prefers-reduced-motion: reduce`. Three.js scenes also opt out (see §6).

---

## 6. Visual performance rules

The MVP avoids WebGL and heavy 3D by default.

- Hero ambience is CSS-only: radial gradients, grid layers, and lightweight motion primitives.
- Do not add Three.js/R3F back into the first-load route unless there is a measured reason.
- Any future 3D must be opt-in, lazy-loaded, disabled under `prefers-reduced-motion`, and tested on low-power laptops.
- The app experience should prioritize responsiveness over cinematic complexity.

---

## 7. Theming

`src/hooks/use-theme.ts` owns state.

- Defaults to system preference, then persists to `localStorage['cardinal-theme']`.
- A blocking inline script in `RootShell` applies the class *before* React hydrates → no FOUC.
- Switching uses `document.startViewTransition()` when available (Chrome / Edge), CSS crossfade fallback otherwise.
- `<meta name="theme-color">` is updated on every toggle.
- Component: `src/components/site/ThemeToggle.tsx` — animated sun/moon morph.

Every component must consume tokens (`bg-surface`, `text-foreground`, `text-cyan`). Forbidden: `bg-black`, `text-white`, `bg-[#…]`.

---

## 8. Wallet state machine

`src/lib/wallet-store.ts` (Zustand + persist).

```
idle ── openModal ──► (modal open)
       │
       ├── connect(walletId) ──► connecting ──► connected
       └── closeModal ──► idle
connected ── disconnect ──► idle
```

Persisted slice: `status`, `address`, `chain`, `wallet`.
UI: `WalletButton` (pill in nav with `layoutId="wallet-pill"` morph) + `WalletModal` (mounted once at root). Simulated 1.1s connect latency — swap `connect()` body for `wagmi` when ready.

---

## 9. Component recipes

| Component | File | Purpose |
| --- | --- | --- |
| `Logo`, `LogoMark` | `site/Logo.tsx` | Brand mark with hover spin |
| `Nav` | `site/Nav.tsx` | Sticky pill nav with theme + wallet |
| `HeroScan` | `site/HeroScan.tsx` | 3D-tilt holographic scan card |
| `ThreatMap` | `site/Sections3.tsx` | 38-node constellation + live ingest feed |
| `FAQ` | `site/FAQ.tsx` | Accordion |
| `CTABand` | `site/CTABand.tsx` | Pilot email capture (UI-only) |
| `ThemeToggle` | `site/ThemeToggle.tsx` | Sun ↔ moon morph |
| `WalletButton` / `WalletModal` | `site/WalletButton.tsx` | Connect choreography |
| `AppShell` | `app/AppShell.tsx` | MVP layout with mobile bottom tabs |
| `Reveal` | `motion/Reveal.tsx` | Stagger-on-view wrapper |
| `CountUp` | `motion/CountUp.tsx` | Number animation |
| `PageTransition` | `motion/PageTransition.tsx` | Route enter/exit |
| Hero backdrop | `site/Hero.tsx` | CSS-only aurora/grid backdrop |

---

## 10. Page anatomy

- **`/`** Hero → Trust strip → Problem → How It Works → Protection Engine → SafeSend → Escrow → ThreatMap → Partners → Pilot → FAQ → CTA → Footer.
- **`/safesend`** Nav → SafeSendShowcase → Escrow → Footer.
- **`/partners`** Nav → Partners hero → Partners grid → Footer.
- **`/pilot`** Nav → Pilot section → Email capture → Footer.
- **`/app`** AppShell wraps:
  - `/app` — SafeSend dashboard
  - `/app/new` — 5-step wizard (Compose → Scan → Verdict → Confirm → Receipt)

---

## 11. MVP store (Zustand)

`src/lib/safesend-store.ts`. Key types:

```ts
type SafeSendStatus =
  | "draft" | "scanning" | "pending_release"
  | "released" | "cancelled" | "blocked";
```

Wizard mutates `drafts[key]`, then `createSend` produces a `SafeSend` with `releaseAt = createdAt + delayHours*3600_000`. Dashboard renders countdown to release; `cancelSend` flips status before release.

---

## 12. Accessibility checklist

- ✅ Single H1 per route.
- ✅ All interactive elements ≥ 44px on mobile.
- ✅ `aria-hidden` on decorative SVGs (logo mark, threat map).
- ✅ Focus ring uses `--color-ring` (cyan).
- ✅ Color isn't sole signaling — every verdict carries text (ALLOW/REVIEW/BLOCK).
- ✅ `prefers-reduced-motion` honored globally.
- ✅ Form inputs labeled (placeholder + aria where needed).

---

## 13. SEO checklist

- ✅ Per-route `head()` with unique `title` (<60 chars) + `description` (<160).
- ✅ OG/Twitter tags per route; root provides defaults.
- ✅ Canonical link per route.
- ✅ `public/robots.txt` allows all + points to sitemap.
- ✅ `public/sitemap.xml` lists every shareable route.
- ✅ JSON-LD `SoftwareApplication` on `/`.
- ✅ `theme-color` meta updated on theme toggle.

---

## 14. File map — "where to change X"

| Want to change… | Edit |
| --- | --- |
| Colors / theme | `src/styles.css` (`:root` light, `.dark` dark) |
| Logo / favicon | `src/components/site/Logo.tsx`, `public/favicon.svg` |
| Nav links | `src/components/site/Nav.tsx` |
| Hero copy/animation | `src/components/site/Hero.tsx`, `HeroScan.tsx` |
| Scan signals | `src/lib/mock-scan.ts` |
| Threat map density | `generateNodes()` in `Sections3.tsx` |
| Wallet behavior | `src/lib/wallet-store.ts`, `WalletButton.tsx` |
| Theme persistence | `src/hooks/use-theme.ts` |
| Motion easings | `src/components/motion/*` |
| Hero backdrop | `src/components/site/Hero.tsx` |
| SEO defaults | `src/routes/__root.tsx` head |
| Per-route SEO | each `src/routes/*.tsx` `head()` |
| MVP nav (mobile tabs) | `src/components/app/AppShell.tsx` |
| MVP store | `src/lib/safesend-store.ts` |

---

## 15. Changelog — v2 Revamp

**Brand**
- New `LogoMark` (hex aperture + outward arrows + glow core).
- Vector favicon (`public/favicon.svg`).

**Theming**
- Full light + dark token system in `styles.css`.
- `useTheme` + `ThemeToggle` with View Transitions API.
- FOUC-blocking inline script in `RootShell`.

**Wallet**
- `wallet-store` (Zustand + persist) with `idle/connecting/connected/error`.
- `WalletButton` with `layoutId` morph + `WalletModal` (blur + spring + per-wallet ring loader).

**Hero**
- 3D mouse-parallax tilt (`useTilt`) on the scan card.
- Conic-gradient animated border-beam.
- Layered depth planes (real Z-depth, not just shadow).
- Floating side glyphs.
- Verdict score count-up + aura ring stroke animation.
- Word-mask reveal headline.
- Lazy R3F backdrop (aurora shader + 700 particles, gated by capability + viewport).
- Trust strip with chain names.

**Threat map**
- 38 zoned nodes (NA/EU/SEA clusters), 3 tiers, bezier arcs with flowing dashes.
- Live-streaming ingest feed (rotates every 3.2s).
- Metric tiles count up on view.
- Legend.

**Marketing**
- New `FAQ` section.
- New `CTABand` with email capture (UI-only).

**MVP**
- AppShell mobile bottom tab bar (≥ 44px targets) with `layoutId` pill.
- Theme toggle + wallet in app header.

**Motion**
- `Reveal`, `CountUp`, `PageTransition` primitives.
- `useSmoothNav` for fade-out before route changes.
- Global reduced-motion respect.

**SEO**
- `robots.txt`, `sitemap.xml`.
- JSON-LD on `/`.
- Per-route canonical + OG.

**Engineering**
- Removed WebGL/R3F from the active MVP path to keep the app responsive.
- No new runtime deps for theming, wallet, or motion.

---

## 16. Roadmap

- Real wagmi/viem wiring on top of `wallet-store`.
- `VerdictShield` (R3F icosahedron + Fresnel) in MVP verdict page.
- `EngineFlow` instanced beads in Protection Engine.
- Generated PNG fallbacks for favicon + 1200×630 OG image.
- i18n.
