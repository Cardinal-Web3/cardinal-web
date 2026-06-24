# Security Notes

Security expectations for Cardinal Web.

This project touches wallets, transaction signing, backend API keys, and smart contracts. Treat every change as security-sensitive.

## Core Rule

Cardinal should protect users before value moves.

Do not add UX that encourages blind signing.

## Secrets

Never expose these in browser code:

- backend API key
- database URL
- private key
- deployer key
- provider API key
- admin wallet credential

Only expose values prefixed with `NEXT_PUBLIC_*` if they are safe to be public.

Safe public examples:

- SafeSend contract address
- TUSDC token address
- public RPC URL
- deployment block

## Wallet Safety

Rules:

- show recipient before signing
- show amount before signing
- show chain before signing
- show token before signing
- show fee/gas before signing
- show Cardinal verdict before signing
- block signing on `BLOCK`

Do not hide risk warnings behind small text.

## Backend API Safety

The browser must call:

```text
POST /api/protection/check
```

The Next.js server route calls the backend:

```text
POST /api/check-transaction
```

This keeps `CARDINAL_API_KEY` server-side.

## Demo vs Live Mode

Demo mode must never pretend to be live.

```env
CARDINAL_SCAN_MODE=demo
CARDINAL_SCAN_MODE=live
```

If live backend fails, show an error. Do not silently fall back to demo data for real users.

## Smart Contract Safety

Before production:

- verify final ABI
- verify final proxy address
- verify token address
- verify fee recipient
- verify fee basis points
- verify pause behavior
- verify test transaction hashes
- verify deployment transaction
- confirm contract audit/security review

Known note:

The current SafeSend contract has pause roles, but main functions may not use `whenNotPaused`. Confirm this before production.

## Gas and Fee Safety

Gas estimates should:

- come from the target chain
- include a 10-15% safety buffer
- refresh when stale
- show user-facing total before signing
- record estimated and actual values where possible

Never hardcode production gas estimates.

## Frontend Security Checklist

Before release:

- no secrets in browser bundle
- no private keys in repo
- no accidental `.env.local` committed
- no unsafe external scripts
- no unverified contract addresses
- no silent demo fallback in live mode
- wallet signing actions are explicit
- all risk states are clear

## Reporting Issues

For security issues, do not open a public GitHub issue with exploit details.

Contact the Cardinal team privately first.

