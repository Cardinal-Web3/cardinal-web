# Contributing

Contribution guide for Cardinal Web.

## Before You Start

Read these files first:

- [README](./README.md)
- [Design system](./DESIGN.md)
- [Architecture](./ARCHITECTURE.md)
- [Security notes](./SECURITY.md)

If you are changing UI, animations, layout, copy, SafeSend screens, escrow screens, API docs, or wallet components, you must read:

```text
DESIGN.md
```

Do not let an LLM invent a new Cardinal visual style. Use `DESIGN.md` as the source of truth.

## Development Setup

Install:

```bash
npm install
```

Copy env:

```bash
cp .env.example .env.local
```

Run:

```bash
npm run dev
```

Open:

```text
http://localhost:3004
```

## Branch Naming

Recommended:

```text
feat/safesend-history
feat/escrow-ui
fix/wallet-modal
docs/backend-roadmap
chore/deployment-env
```

## Commit Style

Use clear commits:

```text
feat: add escrow dashboard shell
fix: prevent blocked SafeSend confirmation
docs: add backend production roadmap
```

## UI Contribution Rules

Follow [DESIGN.md](./DESIGN.md).

Checklist:

- match Cardinal colors
- support dark mode
- support light mode
- support mobile
- keep motion subtle
- avoid heavy WebGL
- avoid random new palettes
- use existing components/patterns
- keep warnings plain English

## Backend/API Contribution Rules

- keep response shapes stable unless versioning
- do not expose API keys in browser code
- keep demo and live mode separate
- keep risk decisions deterministic and explainable
- log enough context for future usage reporting

## Smart Contract Contribution Rules

Before integrating a contract, confirm:

- ABI/artifact
- deployed address
- token address
- fee recipient
- fee bps
- deployment tx
- test tx hashes
- pause/admin behavior

## Required Checks

Before opening a PR or pushing major work:

```bash
npm run build
```

Manual checks:

- homepage loads
- `/app` loads
- wallet modal works
- SafeSend flow works
- `/api-docs` loads
- mobile viewport works
- light mode works
- dark mode works

## Pull Request Checklist

- What changed?
- Why did it change?
- Screenshots for UI changes
- Env changes documented
- Docs updated if behavior changed
- Build passes
- Security implications considered

## Production Rule

Do not claim production readiness unless:

- frontend deployed
- backend deployed
- live backend integration verified
- contract integration verified
- gas/fee behavior verified
- security review complete

