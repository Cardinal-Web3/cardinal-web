# Backend API Future Implementation Plan

Production and enterprise roadmap for the Cardinal Protection API.

This document captures the backend direction agreed after the SafeSend MVP work and Kenny's guidance. It explains what exists today, what must be built next, how the enterprise-grade backend should work, and a practical implementation timeline.

## Executive Summary

Cardinal should own the final protection decision.

External providers can help with data, but Cardinal must control the final:

```text
ALLOW / REVIEW / BLOCK
```

The long-term product is not just a scan endpoint. It is a protection engine with:

- transaction risk scoring
- wallet reputation
- contract reputation
- real-time gas and fee estimation
- transaction simulation
- scan history
- proprietary intelligence data
- B2B usage logs and reporting
- SafeSend and escrow settlement context

The backend should evolve into an enterprise-ready API that wallets, exchanges, marketplaces, and internal Cardinal products can call before value moves.

## Current Backend Status

The current backend already has the MVP foundation.

Implemented today:

- `POST /api/check-transaction`
- deterministic transaction risk response
- `ALLOW`, `REVIEW`, `BLOCK` recommendation shape
- risk score and risk level
- findings and warnings arrays
- wrong-network validation
- local scam/risk checks
- simulation-style warnings
- API key authentication structure
- Prisma/PostgreSQL logging structure
- Swagger/OpenAPI direction
- e2e test structure
- frontend integration through Next.js server route

Current frontend connection:

```text
SafeSend UI
-> Next.js /api/protection/check
-> Cardinal backend /api/check-transaction
-> structured verdict
-> app verdict screen
```

Important current response shape:

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

## Kenny's Backend Direction

Kenny approved the hybrid model:

```text
External providers supply intelligence.
Cardinal owns the decision engine.
```

Key requirements:

- real-time gas estimation from the target chain
- 10-15% safety buffer on gas estimates
- stale estimates should refresh before signing
- B2C users should see a simple all-in cost
- B2B/API customers should receive a detailed cost breakdown
- backend should use adapter-based integrations
- providers should be replaceable without rewriting the engine
- Cardinal should build its own intelligence database over time
- wallet age should come from first-seen on-chain activity, not assumptions

## Target Backend Architecture

Recommended high-level shape:

```text
API Gateway
-> Auth + rate limit
-> Request validation
-> Risk Orchestrator
   -> Wallet intelligence adapter(s)
   -> Contract intelligence adapter(s)
   -> Chain data adapter(s)
   -> Simulation adapter(s)
   -> Gas estimator
   -> Cardinal proprietary intelligence DB
-> Scoring engine
-> Decision engine
-> Response formatter
-> Usage + scan logging
```

## Why Adapters Matter

Adapters are small modules that let Cardinal use outside data without becoming locked to one company.

Example:

```text
WalletIntelAdapter
  -> Chainabuse
  -> Etherscan
  -> internal Cardinal DB
  -> future provider
```

The rest of Cardinal should not care where the data came from. It should receive a normalized internal format.

Good adapter output:

```json
{
  "source": "internal_wallet_reputation",
  "subject": "0x...",
  "signals": [
    {
      "type": "reported_scam",
      "severity": "HIGH",
      "confidence": 0.92,
      "description": "Address has prior scam reports"
    }
  ]
}
```

This lets Cardinal:

- start fast with providers
- replace providers later
- combine multiple sources
- build its own dataset
- keep final scoring proprietary

## Cardinal-Owned Intelligence Layer

Cardinal should build its own intelligence database from day one.

Store:

- wallet addresses
- first-seen block/time
- last-seen block/time
- scan count
- counterparties
- reported addresses
- contract addresses
- contract risk findings
- SafeSend transfer outcomes
- escrow outcomes
- user-confirmed false positives
- blocked transaction attempts
- wallet reputation score
- contract reputation score

This becomes Cardinal's moat.

External providers can bootstrap early coverage, but Cardinal's long-term value comes from its own protection graph and historical scan data.

## Gas Fee Implementation

Gas estimation needs two product modes.

### B2C SafeSend UI

Show simple user-facing cost:

```text
Network gas estimate
SafeSend service fee
Total payable / total locked
```

The user should not need to understand base fee, max fee, priority fee, or execution gas unless they open details.

### B2B / API Customers

Expose detailed reporting:

```json
{
  "gas": {
    "estimated_gas_units": "145000",
    "estimated_base_fee_wei": "120000000",
    "estimated_priority_fee_wei": "50000000",
    "estimated_total_native": "0.0000261",
    "safety_buffer_bps": 1500,
    "buffered_total_native": "0.0000300",
    "estimate_expires_at": "2026-06-24T00:03:00.000Z"
  },
  "fees": {
    "safesend_fee_bps": 100,
    "platform_fee_token": "1.00",
    "recipient_receives_token": "99.00"
  }
}
```

Gas requirements:

- estimate in real time from the target chain
- add configurable 10-15% buffer
- refresh if stale before signing
- record estimated gas before execution
- record actual gas after transaction is mined when possible
- expose both estimated and actual values for B2B reconciliation

## Risk Engine Upgrade

Current scoring can remain deterministic, but the input signals need to become richer.

Recommended signal categories:

| Layer | Signals |
| --- | --- |
| Wallet intelligence | scam reports, first seen, prior interactions, known clusters |
| Contract intelligence | verified source, proxy status, dangerous permissions, blacklist functions |
| Transaction simulation | token approvals, balance changes, recipient effects, revert risk |
| Network validation | expected chain, target token, supported contract, stale chain state |
| Gas risk | abnormal gas, congestion, suspicious transaction pattern |
| Cardinal history | prior scans, prior blocked attempts, user reports, SafeSend outcomes |

Decision output should stay simple:

```text
ALLOW / REVIEW / BLOCK
```

But internal reasoning can become more advanced.

## Proposed API Versions

Do not break current MVP response shape without versioning.

Recommended future routes:

```text
POST /v1/transactions/check
POST /v1/transactions/simulate
POST /v1/gas/estimate
POST /v1/reputation/wallet
POST /v1/reputation/contract
GET  /v1/requests/:requestId
GET  /v1/usage
```

SafeSend-specific routes later:

```text
POST /v1/safesend/quote
POST /v1/safesend/report
GET  /v1/safesend/transfers/:id
```

Escrow-specific routes later:

```text
POST /v1/escrow/quote
POST /v1/escrow/check
POST /v1/escrow/report
GET  /v1/escrow/:id
```

## Database Direction

Recommended core tables:

- `api_keys`
- `api_clients`
- `scan_requests`
- `scan_findings`
- `wallet_reputation`
- `contract_reputation`
- `reported_addresses`
- `chain_observations`
- `gas_estimates`
- `transaction_reports`
- `usage_events`
- `provider_responses`
- `safesend_transfers`
- `escrow_events`

Important:

- keep raw provider response snapshots for audit/debugging
- normalize signals into Cardinal's internal format
- never let provider response shape leak into public API contracts

## Enterprise Requirements

For B2B/API users, add:

- API key management
- per-client rate limits
- usage tracking
- request logs
- response logs
- billing-ready usage events
- latency tracking
- uptime health checks
- webhook/event reporting later
- client-specific policy thresholds
- downloadable reports later

Example client policy:

```json
{
  "client_id": "wallet_partner_001",
  "block_threshold": 80,
  "review_threshold": 45,
  "supported_chains": ["arbitrum-sepolia", "ethereum", "base"],
  "gas_buffer_bps": 1500
}
```

## Implementation Timeline

### Phase 1: Stabilize Current API

Estimated time: 2-4 days

Goal:

Make the current backend clean, documented, and safe to deploy.

Tasks:

- confirm current response shape
- confirm API key auth behavior
- finish Swagger/OpenAPI docs
- finalize validation DTOs
- ensure e2e tests pass
- add rate limiting if missing
- verify Prisma migrations
- document local and production env vars
- add health checks

Outcome:

```text
Stable MVP backend ready for public staging deployment.
```

### Phase 2: Gas + Fee Quote API

Estimated time: 3-5 days

Goal:

Support Kenny's B2C/B2B gas and fee requirements.

Tasks:

- create gas estimator service
- estimate gas for SafeSend create/cancel/release where possible
- add 10-15% configurable buffer
- create quote response for B2C UI
- create detailed breakdown for B2B/API users
- store gas estimate records
- add stale estimate expiry
- expose quote endpoint

Outcome:

```text
Frontend can show network gas, SafeSend fee, and total cost before signing.
```

### Phase 3: Adapter Framework

Estimated time: 4-7 days

Goal:

Make provider integrations replaceable.

Tasks:

- define `WalletIntelAdapter`
- define `ContractIntelAdapter`
- define `ChainDataAdapter`
- define `SimulationAdapter`
- create internal normalized signal type
- add provider response logging
- add provider timeout handling
- add fallback behavior
- add tests per adapter contract

Outcome:

```text
Cardinal can add/remove intelligence providers without changing the risk engine.
```

### Phase 4: Proprietary Intelligence Database

Estimated time: 1-2 weeks

Goal:

Start building Cardinal's own reputation data.

Tasks:

- create wallet reputation tables
- create contract reputation tables
- store first-seen activity
- store scan history
- store findings history
- store reported addresses
- create internal reputation service
- use local Cardinal history as one risk signal
- create admin/reporting seed path

Outcome:

```text
Cardinal begins owning its own risk intelligence instead of only relying on providers.
```

### Phase 5: Simulation + Contract Analysis

Estimated time: 1-2 weeks

Goal:

Move from simple checks to deeper transaction understanding.

Tasks:

- integrate simulation provider or chain RPC simulation path
- inspect ERC20 approvals/transfers
- detect unlimited approvals
- detect suspicious recipient effects
- inspect proxy contracts
- detect dangerous ownership/admin permissions
- add confidence scoring
- add richer findings

Outcome:

```text
Cardinal can explain what a transaction may do before the user signs.
```

### Phase 6: Enterprise API Layer

Estimated time: 1-2 weeks

Goal:

Prepare for B2B pilots.

Tasks:

- client accounts
- API key dashboard/admin flow
- per-client rate limits
- usage logs
- billing-ready events
- request replay/debug logs
- client policies
- deployment monitoring
- production API docs

Outcome:

```text
Cardinal can onboard wallet/exchange/platform pilot customers.
```

## Priority Recommendation

Recommended next order:

1. Stabilize current backend.
2. Add SafeSend gas/fee quote API.
3. Add adapter contracts.
4. Add Cardinal intelligence database.
5. Add one real wallet/contract intelligence provider.
6. Add transaction simulation provider.
7. Add enterprise usage/billing layer.

This gives Cardinal a fast path to demo while building the long-term moat correctly.

## What Not To Do

Avoid these mistakes:

- do not let an external provider make the final Cardinal verdict
- do not expose provider raw response shapes to frontend customers
- do not mix demo mode and live mode silently
- do not claim production readiness before deployment and live contract tests
- do not build exchange integrations before the connected SafeSend/escrow MVP is stable
- do not make gas estimates static or hardcoded
- do not assume wallet age is directly available from providers

## Simple Explanation

The backend should work like this:

```text
User wants to send money.
Cardinal checks the wallet, recipient, contract, network, gas, and transaction behavior.
Cardinal collects signals from its own database and external data sources.
Cardinal calculates one final decision.
The user or API customer receives a clear answer: allow, review, or block.
```

External providers are useful because they already have threat data.

Cardinal's own database is important because it becomes the long-term advantage.

The best approach is both:

```text
Use providers now.
Build Cardinal intelligence over time.
Keep Cardinal in control of the final decision.
```

