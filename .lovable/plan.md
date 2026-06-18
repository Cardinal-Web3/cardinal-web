
# Cardinal — Polish & Revamp Pass (v2)

A focused upgrade across brand, hero, threat map, MVP, motion language, theming, wallet UX, immersive 3D, and SEO. Goal: Awwwards-level feel, story-driven scroll, mobile-clean, GenZ-modern brand.

---

## 1. Brand revamp — Logo + Favicon

Reference (image 3) is a padlock inside a radial "shield with outward arrows" mark. We won't copy it; we'll evolve it into a Cardinal-native mark.

**New logo — "Cardinal Aegis":**
- Hexagonal aperture (6 facets = 6 scan signals) with a centered minimal vault/lock glyph.
- 4 micro arrows emitting NE/NW/SE/SW (protected outbound flow).
- Dual-stop gradient stroke: cyan → violet (token-driven).
- Inner core dot with soft cyan glow.
- Wordmark "Cardinal" in Geist 600, -0.03em tracking.
- Hover: aperture rotates 30°, arrows pulse outward, core blooms.

**Files:** rewrite `Logo.tsx` as inline SVG with gradient defs + motion. Add `LogoMark.tsx` (icon-only). Generate `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` (180), `og-cover.png` (1200×630). Wire into `__root.tsx` head.

---

## 2. Hero scan card — 3D + cinematic (image 1)

Make `HeroScan.tsx` feel like a floating holographic device.

- `perspective: 1400px` stage; idle tilt + mouse-parallax tilt (±10°, disabled <md and under `prefers-reduced-motion`).
- 3 stacked translucent depth planes behind the card for real Z-depth.
- Animated conic-gradient border-beam tracing perimeter.
- Floating side glyph badges parallaxing at different Z offsets.
- Signal rows stagger-in; active row grows left cyan bar + horizontal sweep.
- Verdict: animated aura ring (SVG strokeDashoffset) + count-up score.
- Ambient drifting noise + secondary slow scan-line.

---

## 3. ThreatNet map (image 2)

Believable global threat constellation.

- ~38 nodes clustered around NA/EU/SEA hot-zones.
- 3 tiers: idle (1.5px), active cyan pulsing, threat red double-ring + glow.
- Animated bezier arcs flowing origin → target, 6–8 concurrent.
- "Ingest events" flip a node red and inject into the Recent list (animated insertion).
- Low-opacity rotating longitude grid behind nodes.
- Right-side metrics: count-up on enter; "TXS / day" ticks last 2 digits.
- Legend row with live counts.

---

## 4. Three.js / WebGL — selective immersion

Use sparingly where it improves investor demo. Lazy-loaded, mobile-safe, with CSS fallback when `navigator.gpu`/WebGL2 unavailable or `prefers-reduced-motion` is set. Pause when off-screen and on mobile data-saver / low DPR.

- **Hero backdrop:** R3F shader plane — slow flowing aurora + grid lattice + parallax particles reacting to cursor. Mobile: static gradient + CSS aurora.
- **Protection Engine section:** R3F instanced "transaction beads" flowing along a curved path through 6 signal gates; gate triggers a small ring burst. Mobile: SVG-only fallback already in place.
- **Verdict page (MVP):** small Three.js shield mesh (icosahedron + Fresnel shader) that morphs color per verdict (emerald/amber/red) with bloom. Mobile: 2D SVG shield.
- Wrap all in `<Suspense>` + `React.lazy`; gate with `useWebGLSupport()` hook; bundle-split so the marketing pages don't ship Three to users who never scroll.
- Deps to add: `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`. SSR-safe via dynamic import in client-only components.

---

## 5. Light + Dark theme

Professional dual-theme, default dark (cinematic), light tuned for daylight investor decks.

- All colors already token-based. Add `:root` (light) and `.dark` (dark) blocks in `src/styles.css`; flip via `<html class="dark">`.
- Light palette: paper `oklch(0.985 0.005 250)`, ink `oklch(0.18 0.02 250)`, cyan/violet accents desaturated 15%, security red/emerald rebalanced for contrast.
- `ThemeProvider` (no extra dep — local hook): persists to `localStorage`, respects `prefers-color-scheme` on first load, sets `<meta name="theme-color">` per theme.
- `ThemeToggle` in nav: animated sun↔moon SVG morph (motion path), 280ms crossfade of background using View Transitions API when supported, CSS fallback otherwise.
- All components audited to use tokens only (no `bg-black`, no hex). Hero aurora, ThreatNet, MVP all re-checked in light mode.
- Three.js scenes read theme tokens via uniforms updated on theme change.

---

## 6. Wallet connect — motion + state choreography

Even without real Web3, choreograph a believable connect/disconnect flow (wired to a local Zustand `walletStore`; ready to swap for wagmi later).

- **Connect button** (nav + hero CTA): idle pulse on the indicator dot.
- **Click → modal:** scale-in (0.96→1, spring), backdrop blur from 0 → 12px, list of wallets (MetaMask, WalletConnect, Coinbase, Rabby) with staggered entry (40ms).
- **Connecting state:** wallet row gets an orbiting ring loader; other rows fade to 40%.
- **Connected success:** modal collapses into the nav button; address pill morphs in with layoutId; confetti-free cyan ripple from the button; toast "Wallet protected by Cardinal".
- **Nav state:** connected pill shows truncated address + chain dot; hover reveals balance shimmer + disconnect.
- **Disconnect:** pill dissolves (mask wipe right→left), nav returns to "Connect Wallet" with a faint inward ripple.
- All transitions ≤ 400ms, reduced-motion uses opacity-only.
- Hooks: `useWallet()` exposes `status: 'idle' | 'connecting' | 'connected' | 'error'`, `address`, `chain`, `connect()`, `disconnect()`.

---

## 7. Site-wide motion language ("story" feel)

Consistent vocabulary, not random effects.

- **Page enter/exit:** route-level fade+rise (12px, 500ms easeOut). Intercept internal links via `useSmoothNav` to play 220ms exit before navigation.
- **Section reveal:** Intersection-triggered, 80px threshold, child stagger 60ms, cubic-bezier `[0.22,1,0.36,1]`.
- **Hero headline:** word-by-word mask reveal.
- **Numbers:** count-up on view.
- **Scroll-pinned beat:** Protection Engine 3-beat scrubbed timeline via `useScroll` + `useTransform`.
- **Cursor:** subtle cyan dot follower (desktop only).

---

## 8. MVP polish + mobile responsiveness

- AppShell: bottom-tab on mobile (<md), top-bar on desktop. Active tab uses `layoutId` pill.
- Wizard: animated progress bar with moving glow head; AnimatePresence slide+fade between step routes.
- Scan: live signal-confidence sparkline; finding cards stream in.
- Verdict: full-screen bloom (aura scales, score counts up, recommendation types in) + Three.js shield (see §4).
- Receipt: ticket-style card with perforated SVG edge, share button, paper texture.
- Dashboard: empty state illustration + shimmer CTA.
- Tap targets ≥ 44px; rows use `grid-cols-[minmax(0,1fr)_auto]`; text containers `min-w-0`; icons `shrink-0`.
- Tested viewports: 360, 375, 414, 768, 1024, 1280, 1920.
- Performance: lazy Three scenes, `content-visibility:auto` on below-fold sections, image lazy, fonts `display=swap`.

---

## 9. SEO + metadata

- Per-route `head()` with unique title (<60ch) + description (<160ch).
- OG/Twitter cards with `og-cover.png`, per-route overrides at leaves.
- JSON-LD Organization + SoftwareApplication on `/`.
- `sitemap.xml`, `robots.txt` in `public/`.
- Single H1, semantic landmarks, alt text, `aria-hidden` on decorative SVGs.
- Canonical tag.
- Theme-color meta updated per light/dark.

---

## 10. Gaps to fill

- Hero **trust strip** with chain logos (Ethereum/Base/Arbitrum/Solana).
- **Pull-quote** band (security researcher persona).
- **Without vs With Cardinal** comparison (red/emerald).
- **FAQ accordion** (5 Qs) above footer.
- **CTA band** before footer ("Join the Pilot", UI-only email capture).

---

## 11. DESIGN.md (root)

Create `DESIGN.md` so any LLM/human can pick up the project. Sections:
1. Brand voice, logo rules, favicon set, do/don't.
2. Color tokens (OKLCH table) — light + dark + when to use.
3. Typography scale (Geist + JetBrains Mono).
4. Spacing, radii, shadow, blur, gradient tokens.
5. Motion vocabulary (durations, easings, reveal, reduced-motion).
6. Three.js/WebGL usage rules + fallbacks.
7. Theming architecture (provider, View Transitions, persistence).
8. Wallet state machine + animation contract.
9. Component recipes (Card, Pill, SignalRow, VerdictBadge, MetricTile, ThemeToggle, WalletButton).
10. Page anatomy per route.
11. MVP Zustand store shape + status machine.
12. Accessibility + SEO checklists.
13. File map ("where to change X").
14. Changelog of this revamp pass.

---

## Technical notes

- **New deps:** `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`. Optional `@number-flow/react` for count-ups.
- **No new deps for:** theming (local provider), wallet (local Zustand), motion (already have `motion`).
- All colors via `var(--…)`; extend tokens for `--gradient-brand`, `--shadow-3d`, `--ring-aurora`, plus full light variants.
- **New files:**
  - `src/components/site/{LogoMark,TrustStrip,Comparison,FAQ,CTABand,ThemeToggle,WalletButton,WalletModal}.tsx`
  - `src/components/three/{HeroScene,EngineFlow,VerdictShield,useWebGLSupport}.tsx`
  - `src/components/motion/{Reveal,CountUp,SmoothLink}.tsx`
  - `src/hooks/{use-smooth-nav,use-tilt,use-theme,use-wallet,use-in-view-stagger}.ts`
  - `src/lib/{theme-store,wallet-store}.ts`
  - `public/{favicon.svg,favicon-32.png,apple-touch-icon.png,og-cover.png,sitemap.xml,robots.txt}`
  - `DESIGN.md`
- **Edited:** `Logo.tsx`, `Nav.tsx`, `HeroScan.tsx`, `Hero.tsx`, `Sections1/2/3.tsx`, `ProtectionEngine.tsx`, `AppShell.tsx`, `app.new.*`, `__root.tsx`, `styles.css`, all top-level routes for per-route `head()`.

---

## Out of scope

No real wallet RPC (UI-only choreography, swap-ready for wagmi). No backend. No payments.
