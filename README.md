<p align="center">
  <img src="./public/favicon.svg" width="88" height="88" alt="Cardinal logo" />
</p>

<h1 align="center">Cardinal Web</h1>

<p align="center">
  <strong>Protection before signature. Safer settlement after approval.</strong>
</p>

<p align="center">
  Cardinal is a Web3 transaction protection MVP that scans transaction intent, explains risk, and routes users into safer flows like SafeSend and escrow.
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a>
  ·
  <a href="#product-flow">Product Flow</a>
  ·
  <a href="#environment">Environment</a>
  ·
  <a href="#pilot-status">Pilot Status</a>
</p>

---

## What Cardinal Is

Cardinal is building the trust layer for digital asset transactions.

The product goal is simple:

```text
Before a wallet signs, Cardinal checks the transaction.
If the transaction is safe, the user continues.
If it looks risky, Cardinal warns or blocks the flow.
```

This repo contains the new Cardinal web MVP:

- a polished Next.js marketing/product site
- the SafeSend pilot app
- live backend risk scan integration
- MetaMask wallet flow
- SafeSend contract integration scaffolding
- developer-facing API documentation

## Why It Exists

Most Web3 products ask users to sign first and understand the risk later.

Cardinal reverses that order.

It checks transaction intent, recipient signals, network validity, backend risk findings, and SafeSend settlement details before value moves.

## Core Features

| Area | What It Does |
| --- | --- |
| Protection Scan | Sends proposed transaction details to the Cardinal backend and receives `ALLOW`, `REVIEW`, or `BLOCK`. |
| SafeSend Flow | Lets a user compose, scan, confirm, and track protected token transfers. |
| Wallet Connection | MetaMask-first pilot flow for Arbitrum Sepolia. |
| Backend Integration | Uses a Next.js server route so the browser never sees the backend API key. |
| Contract Path | Prepares approval, fee preview, gas estimate, and SafeSend contract execution. |
| API Docs | Explains the Cardinal Protection API for future B2B/platform users. |
| Demo/Pilot UX | Keeps the MVP usable for investor/client demos while preserving a live backend path. |

## Product Flow

```text
Connect wallet
-> Create SafeSend
-> Scan with Cardinal
-> Receive backend verdict
-> Continue, review, or block
-> Estimate gas + SafeSend fee
-> Approve token if needed
-> Create SafeSend on contract
-> View receipt and dashboard
```

## App Routes

| Route | Purpose |
| --- | --- |
| `/` | Cardinal marketing/product homepage |
| `/safesend` | SafeSend product page |
| `/partners` | Partner/client positioning |
| `/pilot` | Pilot program page |
| `/api-docs` | Protection API overview and examples |
| `/app` | Cardinal app dashboard |
| `/app/new` | Create SafeSend |
| `/app/new/scan` | Backend scan step |
| `/app/new/verdict` | Cardinal risk verdict |
| `/app/new/confirm` | Gas, fee, approval, and contract confirmation |

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Motion
- Zustand
- Ethers v6
- Radix UI primitives

## Quick Start

Install dependencies:

```bash
npm install
```

Create local env:

```bash
cp .env.example .env.local
```

Run the web app:

```bash
npm run dev
```

Open:

```text
http://localhost:3004
```

## Backend Mode

The MVP supports two scan modes:

```env
CARDINAL_SCAN_MODE=live
```

Live mode calls the Cardinal backend through the internal Next.js route:

```text
POST /api/protection/check
```

The browser does not call the backend directly. The backend API key stays server-side.

For local backend testing, run the backend first:

```bash
cd ../../../../cardinal-protection-api-be
docker compose up -d
npm run prisma:deploy
npm run prisma:seed
npm run start:dev
```

Then run this web app:

```bash
npm run dev
```

## Environment

```env
CARDINAL_API_URL=http://localhost:3001
CARDINAL_API_KEY=cardinal_demo_key
CARDINAL_SCAN_MODE=live

NEXT_PUBLIC_SAFESEND_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
NEXT_PUBLIC_SAFESEND_CONTRACT_ADDRESS=0xC2b58B0CB938d35836E5a4E34b79Bd5E8EcD8f78
NEXT_PUBLIC_SAFESEND_USDC_ADDRESS=0x15EA32f1eF5c28225E3c9FFbd7741785Cff752d0
NEXT_PUBLIC_SAFESEND_DEPLOYMENT_BLOCK=272068714
```

## SafeSend Pilot

SafeSend is the first protected transfer flow in the MVP.

It is designed to show how Cardinal can protect a user before the final wallet signature:

1. User enters recipient and amount.
2. Cardinal scans the transaction.
3. Backend returns a clear verdict.
4. Only `ALLOW` or `REVIEW` can continue.
5. The app estimates gas and SafeSend fee.
6. User approves TUSDC if needed.
7. User creates the SafeSend transfer on Arbitrum Sepolia.

Current pilot assumptions:

- Active wallet: MetaMask
- Network: Arbitrum Sepolia
- Token: TUSDC
- Contract fee is read through `previewFee`
- Gas is estimated client-side with a safety buffer

## Cardinal Backend Response Shape

The frontend expects a structured protection response:

```json
{
  "request_id": "req_...",
  "risk_score": 18,
  "risk_level": "LOW",
  "network_valid": true,
  "warnings": [],
  "findings": [],
  "recommended_action": "ALLOW",
  "checked_at": "2026-06-24T00:00:00.000Z"
}
```

The product decision is intentionally simple:

| Decision | Meaning |
| --- | --- |
| `ALLOW` | User can continue normally. |
| `REVIEW` | User can continue after seeing risk context. |
| `BLOCK` | User should not sign or proceed. |

## Scripts

```bash
npm run dev      # Start local Next.js app on port 3004
npm run build    # Build production bundle
npm run start    # Start production server
npm run lint     # Run ESLint
npm run format   # Format project files
```

## Documentation

Core repo documents:

| Document | Purpose |
| --- | --- |
| [Agent onboarding](./AGENTS.md) | First-read context for Codex/new developers: production status, repo map, rules, Phase 5, and required docs. |
| [Design system](./DESIGN.md) | UI/UX rules, brand, motion, layout, mobile, light/dark mode, and future LLM guidance. |
| [Architecture](./ARCHITECTURE.md) | Frontend, backend, SafeSend, security boundary, and future escrow architecture. |
| [Deployment](./DEPLOYMENT.md) | Local/staging/production deployment rules, env vars, and release checklist. |
| [Frontend deployment plan](./FRONTEND_DEPLOYMENT_PLAN.md) | Infra handoff for hosting Cardinal Web, domains, env vars, Nginx, and verification. |
| [Testing](./TESTING.md) | Manual QA, wallet testing, SafeSend testing, backend live mode, and release checks. |
| [Security](./SECURITY.md) | Wallet, API key, smart contract, gas/fee, and demo/live safety rules. |
| [Contributing](./CONTRIBUTING.md) | Developer workflow, branch style, PR checklist, and required `DESIGN.md` reference. |
| [Backend integration](./BACKEND_INTEGRATION.md) | Current frontend-to-backend scan integration. |
| [Backend API future implementation](./BACKEND_API_FUTURE_IMPLEMENTATION.md) | Production-grade backend, adapters, intelligence layer, gas/fee roadmap, and timeline. |
| [SafeSend integration](./SAFESEND_INTEGRATION.md) | Current SafeSend contract integration notes and production caveats. |
| [Escrow integration](./ESCROW_INTEGRATION.md) | Future escrow product, backend, contract, and UI integration plan. |
| [Environment example](./.env.example) | Required local environment variables. |

## Pilot Status

This is a connected MVP, not a production release.

Completed:

- New Cardinal web/product UI
- SafeSend user flow
- MetaMask connection flow
- Backend scan route
- API docs page
- SafeSend contract integration path
- Local environment docs

Still required before production:

- Public backend deployment
- Final SafeSend contract verification
- Final deployed addresses and ABI confirmation
- Real intelligence providers/adapters
- Production gas and fee reconciliation
- Usage tracking and rate limits
- Mainnet security review

## Product Direction

Cardinal is not trying to be another wallet.

Cardinal is becoming the protection layer that wallets, exchanges, marketplaces, and users can ask before value moves..

```text
Scan. Settle. Protect.
```
