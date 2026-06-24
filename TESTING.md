# Testing Guide

Testing checklist for Cardinal Web.

Use this before demos, commits, and deployments.

## Quick Commands

Install:

```bash
npm install
```

Build:

```bash
npm run build
```

Run frontend:

```bash
npm run dev
```

Run backend locally:

```bash
cd ../../../../cardinal-protection-api-be
docker compose up -d
npm run prisma:deploy
npm run prisma:seed
npm run start:dev
```

## Smoke Test

Open:

```text
http://localhost:3004
```

Check:

- homepage loads
- nav links work
- theme toggle works
- connect wallet button opens modal
- `/api-docs` loads
- `/safesend` loads
- `/app` loads

## Wallet Test

MetaMask is the active pilot wallet.

Steps:

1. Open `/app`.
2. Click connect wallet.
3. Select MetaMask.
4. Unlock MetaMask.
5. Approve account connection.
6. Approve Arbitrum Sepolia switch/add network.
7. Confirm wallet pill shows shortened address.

Expected:

- Modal closes after successful connection.
- Address appears in nav/app header.
- Chain is Arbitrum Sepolia or prompts user to switch.

Common blockers:

- MetaMask request already pending
- MetaMask locked
- another wallet extension overriding provider
- Arbitrum Sepolia disabled in wallet settings

## SafeSend Happy Path

Steps:

1. Open `/app/new`.
2. Enter recipient address.
3. Enter amount.
4. Select TUSDC / Arbitrum Sepolia.
5. Click scan.
6. Verify backend verdict page.
7. Continue to confirmation.
8. Review fee and gas.
9. Approve TUSDC if needed.
10. Create SafeSend.
11. Confirm receipt page.
12. Check dashboard/history.

Expected:

- `ALLOW` can proceed.
- `REVIEW` can proceed with caution.
- `BLOCK` cannot proceed to signing.
- Backend request ID appears in live mode.
- Gas and SafeSend fee are visible before signing.

## Backend Live Mode Test

Ensure `.env.local` contains:

```env
CARDINAL_SCAN_MODE=live
CARDINAL_API_URL=http://localhost:3001
CARDINAL_API_KEY=cardinal_demo_key
```

Then:

1. Start backend.
2. Start frontend.
3. Run SafeSend scan.
4. Confirm backend request ID is visible.

Expected:

- frontend calls Next.js route
- Next.js route calls backend
- browser never sees backend API key

If backend is off:

- scan should show a clear API error
- app should not silently fake live results

## Demo Mode Test

Set:

```env
CARDINAL_SCAN_MODE=demo
```

Expected:

- UI still works for demo
- no backend request ID is expected
- demo mode must stay visibly separate from live mode

## Contract Flow Test

Only run with testnet funds.

Requirements:

- MetaMask connected
- Arbitrum Sepolia selected
- TUSDC available
- SafeSend contract address configured

Check:

- allowance check works
- approve appears only when needed
- `previewFee` returns fee
- gas estimate appears
- contract transaction opens in MetaMask
- receipt records transaction hash

Do not test with mainnet funds unless explicitly approved.

## UI QA

Desktop:

- no text overlaps
- no horizontal overflow
- nav remains readable
- cards do not jump during loading
- CTA hierarchy is clear

Mobile:

- wallet modal fits
- app screens fit
- footer is not clipped
- buttons are tap-friendly
- code/API blocks scroll horizontally if needed

Theme:

- dark mode readable
- light mode readable
- verdict states visible in both modes
- grid/map lines visible in light mode

## Accessibility QA

Check:

- keyboard focus visible
- buttons are actual buttons
- links are actual links
- disabled states are clear
- color is not the only signal
- modal can be closed
- text contrast is acceptable

## Release Test Checklist

Before pushing/deploying:

- `npm run build`
- smoke test homepage
- test `/app`
- test wallet modal
- test SafeSend scan
- test `/api-docs`
- test mobile viewport
- test light mode
- test dark mode
- confirm docs links work in README

