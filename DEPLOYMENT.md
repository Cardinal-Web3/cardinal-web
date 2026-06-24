# Deployment Guide

Deployment notes for the Cardinal web MVP.

This document explains how to deploy the frontend safely, how it connects to the backend, which environment variables matter, and what must be verified before calling a deployment production-ready.

## Deployment Model

Cardinal Web is a Next.js app.

Recommended deployment shape:

```text
Browser
-> Cardinal Web frontend
-> Next.js server route /api/protection/check
-> Cardinal Protection API backend
-> PostgreSQL / providers / chain RPC
```

The browser should never receive the backend API key.

## Environments

Use separate environments:

| Environment | Purpose |
| --- | --- |
| Local | Developer testing |
| Staging | Client/internal demos with real backend |
| Production | Public users and pilots |

Recommended URLs:

```text
local:      http://localhost:3004
staging:    https://staging.cardinalweb3.com
production: https://app.cardinalweb3.com
```

Use actual domains decided by the Cardinal team.

## Frontend Environment Variables

Create `.env.local` locally and configure environment variables in the deployment platform.

```env
CARDINAL_API_URL=http://localhost:3001
CARDINAL_API_KEY=cardinal_demo_key
CARDINAL_SCAN_MODE=live

NEXT_PUBLIC_SAFESEND_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
NEXT_PUBLIC_SAFESEND_CONTRACT_ADDRESS=0xC2b58B0CB938d35836E5a4E34b79Bd5E8EcD8f78
NEXT_PUBLIC_SAFESEND_USDC_ADDRESS=0x15EA32f1eF5c28225E3c9FFbd7741785Cff752d0
NEXT_PUBLIC_SAFESEND_DEPLOYMENT_BLOCK=272068714
```

## Variable Rules

Use `NEXT_PUBLIC_*` only for values that are safe to expose in the browser.

Safe to expose:

- public RPC URL
- deployed contract address
- token address
- deployment block

Never expose:

- backend API key
- provider API keys
- database URLs
- private keys
- deployer keys
- admin wallet credentials

## Local Build

Before deployment:

```bash
npm install
npm run build
```

Run locally:

```bash
npm run dev
```

Open:

```text
http://localhost:3004
```

## Backend Requirement

If `CARDINAL_SCAN_MODE=live`, the backend must be running and reachable.

Local backend:

```bash
cd ../../../../cardinal-protection-api-be
docker compose up -d
npm run prisma:deploy
npm run prisma:seed
npm run start:dev
```

Production backend should expose:

```text
GET  /health
POST /api/check-transaction
GET  /docs
```

## Deployment Checklist

Before deploying:

- build passes
- `.env.example` is current
- backend URL is correct
- API key is configured server-side
- SafeSend contract address is correct
- TUSDC token address is correct
- Arbitrum Sepolia RPC works
- `/api-docs` renders
- `/app/new` scan flow works
- wallet modal works with MetaMask
- light mode and dark mode are readable
- mobile layout does not overflow

## Staging Verification

After deployment:

1. Open homepage.
2. Check nav and footer links.
3. Open `/app`.
4. Connect MetaMask.
5. Switch/add Arbitrum Sepolia.
6. Create a SafeSend draft.
7. Run Cardinal scan.
8. Confirm backend request ID appears.
9. Continue to confirmation.
10. Verify gas/fee estimate appears.

Do not run mainnet transactions from staging unless explicitly configured and approved.

## Production Readiness Criteria

Do not call this production-ready until:

- backend is publicly deployed
- API keys are rotated from demo values
- rate limiting is enabled
- usage logging is enabled
- SafeSend contract is final and verified
- contract ABI/address/token address are confirmed
- test transactions are recorded
- gas/fee estimate behavior is verified
- monitoring/alerts exist
- security review is complete

## Rollback Plan

If frontend deployment fails:

1. Revert to last successful frontend deployment.
2. Confirm backend is still healthy.
3. Disable live scan mode only if needed for demo fallback.
4. Record the failed commit and error.

If backend deployment fails:

1. Keep frontend live.
2. Show clear API error in live mode.
3. Do not silently switch production users to demo mode.

## Notes

Demo mode is acceptable for UI demos only.

Live mode is required for real pilot testing.

