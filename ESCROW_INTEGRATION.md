# Escrow Integration Plan

Future integration guide for Cardinal Escrow.

This is not yet implemented in the new MVP. This document defines how escrow should be added without breaking the current design, backend, or SafeSend flow.

## Product Definition

Cardinal Escrow is security-first digital asset settlement.

It should combine:

- buyer/seller agreement
- wallet and contract risk checks
- gas and fee quote
- smart contract escrow
- delivery proof
- approval or dispute
- final settlement

## Target Flow

```text
Create escrow
-> define buyer, seller, token, amount, terms
-> scan buyer/seller/contract risk
-> show Cardinal verdict
-> quote gas + escrow fee
-> fund escrow
-> seller delivers asset/service
-> buyer approves or disputes
-> smart contract releases or escalates
```

## UX Principles

Escrow should feel calmer than SafeSend because it is often higher value.

Design tone:

- clear
- contractual
- trust-first
- no hype
- no confusing blockchain jargon

Every escrow screen must answer:

1. Who is involved?
2. What asset/value is being held?
3. What condition releases funds?
4. What can go wrong?
5. What is the next safe action?

## Recommended Routes

```text
/app/escrow
/app/escrow/new
/app/escrow/new/scan
/app/escrow/new/confirm
/app/escrow/[id]
/app/escrow/[id]/dispute
```

## Escrow States

Recommended status model:

```text
draft
scanning
ready_to_fund
funded
delivery_pending
delivered
release_ready
disputed
released
cancelled
expired
```

## Required UI Sections

Escrow detail page:

- status header
- parties panel
- agreement terms
- payment/token panel
- Cardinal security verdict
- settlement timeline
- gas + fee breakdown
- contract activity
- primary action
- dispute/cancel secondary actions

## Backend Needs

The backend should eventually support:

```text
POST /v1/escrow/check
POST /v1/escrow/quote
POST /v1/escrow/report
GET  /v1/escrow/:id
```

Backend should store:

- escrow creation request
- buyer/seller wallets
- token and amount
- risk findings
- gas estimate
- fee quote
- contract transaction hashes
- final settlement status

## Contract Needs

Before frontend integration, confirm:

- deployed escrow contract address
- ABI/artifact
- token support
- fee model
- fee recipient
- dispute behavior
- cancellation behavior
- pause behavior
- admin roles
- events
- test transaction hashes

## Design Requirement

Before implementing escrow UI, read:

- [Design system](./DESIGN.md)

Escrow must visually match the current Cardinal MVP. Do not invent a new UI style.

## Safety Rules

- Never allow funding before the scan completes.
- Never hide fees.
- Never hide dispute terms.
- Never show “safe” as a guarantee.
- Never continue on `BLOCK`.
- Always show chain, token, amount, buyer, and seller before signing.

## First Implementation Recommendation

Start with read-only/demo escrow UI first:

1. `/app/escrow` dashboard
2. `/app/escrow/new` form
3. scan/verdict page using existing backend shape
4. confirmation page with placeholder fee/gas quote
5. detail page with timeline

Then wire contract calls after contract details are confirmed.

