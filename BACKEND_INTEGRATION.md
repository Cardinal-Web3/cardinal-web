# Cardinal Protection API Integration

This Next.js MVP connects SafeSend scans to the Cardinal Protection API through a server route.

## Flow

```text
/app/new
-> user composes SafeSend
-> /app/new/scan calls POST /api/protection/check
-> Next.js server route calls cardinal-protection-api-be
-> backend returns ALLOW / REVIEW / BLOCK with findings
-> verdict and confirm pages reuse the same scan result
```

The browser never calls the backend directly and never receives the backend API key.

## Runtime Variables

Create `.env.local` from `.env.example`:

```bash
CARDINAL_API_URL=http://localhost:3001
CARDINAL_API_KEY=cardinal_demo_key
CARDINAL_SCAN_MODE=live
```

- `CARDINAL_API_URL` points to the NestJS backend.
- `CARDINAL_API_KEY` is used only by the Next.js server route.
- `CARDINAL_SCAN_MODE=live` calls the backend.
- `CARDINAL_SCAN_MODE=demo` uses local mock scan logic for UI-only demos.

## Local Test

Start the backend first:

```bash
cd ../../../../cardinal-protection-api-be
docker compose up -d
npm run prisma:deploy
npm run prisma:seed
npm run start:dev
```

Then start this MVP:

```bash
cd ../cardinal-security-wallet/apps/web-modified-app/cardinal-protocol
npm run dev
```

Open `http://localhost:3004/app/new`, compose a SafeSend, and click `Scan with Cardinal`.

## Expected Behavior

- Live mode returns a backend `requestId` on the verdict screen.
- `ALLOW` can continue to confirmation.
- `REVIEW` can continue with caution.
- `BLOCK` cannot continue to signing.
- If the backend is down in live mode, the scan page shows an API error instead of silently using mock data.

## Notes For Future Agents

- Keep demo and live modes visibly separate.
- Do not expose `CARDINAL_API_KEY` through `NEXT_PUBLIC_*`.
- Preserve the backend response shape unless intentionally versioning the API.
- SafeSend contract calls are still separate from this scan integration.
