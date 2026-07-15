# Cardinal Web Agents

This is the first file an AI coding agent or new developer should read before
changing the Cardinal Web repo.

Cardinal is live, so treat this repo as production software.

## 1. What Cardinal Is

Cardinal is Web3 transaction protection infrastructure.

The product checks risk before a wallet signs:

```text
Connect wallet
-> compose transaction
-> Cardinal scans risk
-> API returns ALLOW / REVIEW / BLOCK
-> user continues, reviews, or stops before signing
```

The broader product direction:

- B2C: Cardinal web app, SafeSend, escrow, protected transfers.
- B2B: Protection API for wallets, exchanges, marketplaces, and Web3 platforms.
- Long term: Cardinal-owned intelligence, wallet reputation, contract reputation,
  transaction simulation, fee/gas reporting, and enterprise dashboards.

## 2. Current Production Reality

Live services:

```text
Frontend: https://app.cardinalweb3.com
Backend:  https://api.cardinalweb3.com
```

Production deployment:

```text
merge to main
-> GitHub Actions runs
-> Docker image builds
-> VPS deploys container
-> live service updates
```

Important:

- `main` is production.
- Do not push experimental work directly to `main`.
- Use feature branches and PRs for meaningful changes.
- Frontend and backend run in separate Docker containers.
- Backend has production database, real API keys, CORS restrictions, and backups.
- SafeSend is currently testnet only on Arbitrum Sepolia.

## 3. Repo Map

This repo:

```text
cardinal-web
```

Purpose:

- public Cardinal product website
- SafeSend pilot frontend
- wallet connection UI
- Cardinal app flow
- API docs page
- Next.js proxy route to backend
- design and developer docs

Sibling repos in the Cardinal workspace:

```text
../cardinal-protection-api-be
../cardinal-safesend-contract
../cardinal-escrow-contract
../cardinal-multisig-escrow-contract
```

Backend repo:

```text
../cardinal-protection-api-be
```

Purpose:

- `POST /api/check-transaction`
- API key auth
- rate limiting
- usage logging
- risk scoring
- local scam/risk checks
- network validation
- `ALLOW / REVIEW / BLOCK` response
- Swagger docs at `/docs`
- health endpoint at `/health`

SafeSend contract repo:

```text
../cardinal-safesend-contract
```

Purpose:

- SafeSend smart contract
- deployed on Arbitrum Sepolia testnet
- used by the current SafeSend pilot flow

## 4. Current Product Flow

Current SafeSend MVP:

```text
Connect MetaMask
-> switch to Arbitrum Sepolia
-> create SafeSend
-> scan transaction through Cardinal backend
-> receive ALLOW / REVIEW / BLOCK
-> if not BLOCK, estimate gas and SafeSend fee
-> approve TUSDC if allowance is missing
-> call SafeSend contract
-> show receipt/dashboard
```

Frontend backend route:

```text
POST /api/protection/check
```

Backend route:

```text
POST /api/check-transaction
```

The browser must not call the backend directly with the backend API key.
The browser calls the Next.js server route. The server route calls the backend.

## 5. What Is Live vs Roadmap

Live / deployed today:

- Cardinal frontend
- Cardinal backend
- SafeSend UI flow
- MetaMask-first wallet flow
- backend scan API integration
- API docs page
- Docker deployment
- HTTPS domains
- production database
- daily backups
- SafeSend contract path on Arbitrum Sepolia

MVP-level today:

- risk scoring
- network validation
- local scam/risk signals
- warning/finding response shape
- scan request logging
- usage logging foundation
- SafeSend fee preview and gas estimate path

Roadmap / not fully production-grade yet:

- full real-time wallet activity intelligence
- external provider adapters
- transaction simulation provider integration
- contract vulnerability analysis
- Cardinal-owned intelligence graph
- admin dashboard
- billing/subscription dashboard
- free scan limits
- production escrow integration
- mainnet contract rollout
- SDK/CLI
- real-time alerts

Do not claim roadmap items are live unless they are verified in code and deployment.

## 6. Phase 5 Context

Phase 5 currently means the admin and operations dashboard layer.

Expected Phase 5 scope:

- admin dashboard UI
- admin auth/login
- API usage stats
- scan history
- partner/client accounts
- API key management
- free trial scan tracking
- subscription/billing visibility
- SafeSend/Cardinal fee tracking
- pilot/user access list
- basic metrics: scans, verdicts, latency, users, API usage

Keep Phase 5 practical. Start with a lean internal dashboard before building a
full enterprise admin system.

## 7. Business Direction

Current monetization direction:

- Protection API subscription
- pay-per-use scans for one-off/high-value users
- SafeSend/protected transfer fee
- future escrow/secure transfer fee
- free trial scans before requiring payment

Preferred fee language:

```text
Cardinal Protection Fee
Cardinal Secure Transfer Fee
```

Avoid overusing legal-sensitive wording unless Kenny confirms it.

## 8. Required Docs To Read

Read these before changing product behavior:

- [README.md](./README.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)
- [SAFESEND_INTEGRATION.md](./SAFESEND_INTEGRATION.md)
- [SECURITY.md](./SECURITY.md)

Read these before changing UI/UX:

- [DESIGN.md](./DESIGN.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)

Read these before deployment or env changes:

- [DEPLOYMENT.md](./DEPLOYMENT.md)
- [FRONTEND_DEPLOYMENT_PLAN.md](./FRONTEND_DEPLOYMENT_PLAN.md)
- [TESTING.md](./TESTING.md)

Read these before backend roadmap, enterprise, billing, or provider work:

- [BACKEND_API_FUTURE_IMPLEMENTATION.md](./BACKEND_API_FUTURE_IMPLEMENTATION.md)
- [ESCROW_INTEGRATION.md](./ESCROW_INTEGRATION.md)

Also inspect sibling backend docs when working across repos:

- `../cardinal-protection-api-be/README.md`
- `../cardinal-protection-api-be/BACKEND_ARCHITECTURE.md`
- `../cardinal-protection-api-be/BACKEND_DEPLOYMENT_PLAN.md`
- `../cardinal-protection-api-be/RISK_ENGINE_ROADMAP.md`

## 9. Design Rules

The current UI has been approved as the main MVP direction.

Do not redesign the product from scratch unless explicitly requested.

Follow:

- dark/light mode support
- clean Web3 security aesthetic
- subtle motion, not heavy WebGL
- responsive mobile layout
- clear risk language
- no decorative clutter
- no fake metrics unless clearly marked as demo
- no giant cards inside cards
- no random new color palette

Use [DESIGN.md](./DESIGN.md) as the source of truth for UI work.

## 10. Security Rules

Never expose these in browser code:

- backend API keys
- database URLs
- provider API keys
- private keys
- deployer keys

Browser-safe values:

- public RPC URL
- testnet contract address
- token address
- deployment block
- public risk verdict

Production live mode must not silently fall back to demo/local keys.

## 11. Environment Rules

Frontend runtime envs:

```env
CARDINAL_API_URL=https://api.cardinalweb3.com
CARDINAL_API_KEY=<server-side-api-key>
CARDINAL_SCAN_MODE=live
PORT=3004
```

Frontend public build envs:

```env
NEXT_PUBLIC_SAFESEND_RPC_URL=<public-rpc-url>
NEXT_PUBLIC_SAFESEND_CONTRACT_ADDRESS=<safesend-contract-address>
NEXT_PUBLIC_SAFESEND_USDC_ADDRESS=<token-address>
NEXT_PUBLIC_SAFESEND_DEPLOYMENT_BLOCK=<deployment-block>
```

Backend runtime envs live in the backend repo deployment docs.

## 12. Testing Rules

Before merging frontend changes:

```bash
npm run build
```

For meaningful UI changes, test:

- `/`
- `/safesend`
- `/api-docs`
- `/pilot`
- `/app`
- `/app/new`
- `/app/new/scan`
- `/app/new/verdict`
- `/app/new/confirm`

For production-sensitive changes, also verify:

- wallet modal opens
- MetaMask path still works
- backend verdict still appears
- no API key leaks to browser
- mobile layout is not broken
- light and dark modes are readable

## 13. Backend Contract Boundary

Do not change the backend response shape casually.

Frontend expects:

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

If response shape changes, update:

- frontend mapper
- API docs
- backend Swagger docs
- tests
- relevant docs

## 14. SafeSend Rules

Current SafeSend assumptions:

- network: Arbitrum Sepolia
- wallet: MetaMask
- token: TUSDC
- contract integration is testnet pilot
- `BLOCK` verdict must not proceed to contract signing
- gas estimate and SafeSend fee should be shown before confirmation

Before changing contract behavior, confirm:

- latest ABI
- deployed proxy address
- token address
- fee recipient
- fee bps
- deployment block
- pause behavior
- test results

## 15. Deployment Rules

Because CI/CD deploys on merge to `main`:

- do not push experiments to `main`
- open a feature branch
- run build locally
- review diff
- merge only when ready for live deployment

Frontend live URL:

```text
https://app.cardinalweb3.com
```

Backend live URL:

```text
https://api.cardinalweb3.com
```

Health checks:

```text
Frontend: GET /api/health
Backend:  GET /health
```

## 16. What Not To Do

Do not:

- claim mainnet support unless verified
- claim full AI auditor is live
- claim full real-time exploit tracking is live
- claim production firewall blocking is live
- claim SDK/CLI is live
- claim CRDX staking/token-gated features unless Kenny/Muhammad confirm
- replace the design system without approval
- leak secrets into frontend code
- weaken the wallet warning flow
- skip docs when changing architecture

## 17. New Developer First Steps

For a new developer:

1. Read this file.
2. Read [README.md](./README.md).
3. Read [ARCHITECTURE.md](./ARCHITECTURE.md).
4. Read [DESIGN.md](./DESIGN.md) before UI work.
5. Read [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) before API work.
6. Read [SAFESEND_INTEGRATION.md](./SAFESEND_INTEGRATION.md) before SafeSend work.
7. Run the app locally.
8. Do not merge to `main` until the change is ready to go live.

## 18. Current Priority

Near-term priorities:

- keep live MVP stable
- complete Phase 5 admin dashboard
- improve usage/billing/free-scan tracking
- strengthen backend intelligence adapters
- improve gas/fee reporting
- prepare escrow integration without breaking SafeSend

When unsure, preserve the live MVP and ask before changing production behavior.
