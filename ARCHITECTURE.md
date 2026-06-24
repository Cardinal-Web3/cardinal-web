# Architecture

System architecture for Cardinal Web.

## High-Level Flow

```text
User
-> Cardinal Web UI
-> Next.js server route
-> Cardinal Protection API
-> Risk engine / database / providers
-> UI verdict
-> SafeSend contract flow
```

## Main Components

| Layer | Responsibility |
| --- | --- |
| Marketing UI | Explains Cardinal, SafeSend, pilot, partners, and API |
| App UI | SafeSend creation, scan, verdict, confirmation, receipt |
| Wallet layer | MetaMask connection and Arbitrum Sepolia switching |
| Next.js API route | Server-side proxy to backend so API key stays private |
| Backend API | Risk scoring and `ALLOW / REVIEW / BLOCK` decision |
| SafeSend contract | Locks, releases, or cancels protected transfer |
| Documentation | Guides future product/backend/escrow work |

## Frontend Structure

Important folders:

```text
src/app
src/components
src/components/pages
src/components/pages/app
src/components/site
src/lib
src/styles.css
```

Key files:

| File | Purpose |
| --- | --- |
| `src/app/page.tsx` | Homepage route |
| `src/app/api-docs/page.tsx` | API docs route |
| `src/app/app/page.tsx` | App dashboard route |
| `src/components/app/AppShell.tsx` | App layout |
| `src/components/site/Nav.tsx` | Marketing nav |
| `src/components/site/Footer.tsx` | Marketing footer |
| `src/components/site/WalletButton.tsx` | Wallet connect UI |
| `src/lib/wallet-store.ts` | Wallet state |
| `src/lib/safesend-store.ts` | SafeSend UI state |
| `src/lib/protection-api.ts` | Backend API client |
| `src/lib/safesend-contract.ts` | Contract config and helpers |

## Backend Integration

Frontend route:

```text
POST /api/protection/check
```

Backend route:

```text
POST /api/check-transaction
```

The browser calls only the local Next.js route. That route calls the backend with:

```text
CARDINAL_API_URL
CARDINAL_API_KEY
```

This protects the backend API key from browser exposure.

## SafeSend Architecture

Current SafeSend flow:

```text
Compose transfer
-> backend scan
-> verdict
-> fee preview
-> gas estimate
-> ERC20 approval if required
-> createSafeSend transaction
-> receipt/dashboard
```

Contract config is centralized in:

```text
src/lib/safesend-contract.ts
```

## Data Ownership

Current frontend state:

- wallet state in Zustand
- SafeSend drafts/history in Zustand
- scan results reused through flow state

Backend-owned future state:

- scan requests
- findings
- wallet reputation
- contract reputation
- gas estimates
- usage events
- SafeSend/escrow reporting

## Security Boundary

Browser can know:

- contract address
- token address
- public RPC URL
- deployment block
- risk verdict

Browser must not know:

- backend API key
- provider API keys
- database URL
- private keys
- deployer keys

## Future Enterprise Architecture

Target backend:

```text
API Gateway
-> Auth + rate limiting
-> Validation
-> Risk orchestrator
   -> Wallet intelligence adapter
   -> Contract intelligence adapter
   -> Chain data adapter
   -> Simulation adapter
   -> Gas estimator
   -> Cardinal intelligence DB
-> Scoring engine
-> Decision engine
-> Usage logging
```

See:

- [Backend API future implementation](./BACKEND_API_FUTURE_IMPLEMENTATION.md)

## Escrow Future Architecture

Escrow should reuse the same protection engine:

```text
Create escrow
-> scan buyer/seller/contract
-> quote gas + fee
-> fund escrow
-> delivery proof
-> approve/release or dispute
-> report final outcome back to backend
```

See:

- [Escrow integration](./ESCROW_INTEGRATION.md)

