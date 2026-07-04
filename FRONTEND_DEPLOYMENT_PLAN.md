# Cardinal Web Frontend Deployment Plan

Infra handoff document for deploying the Cardinal Web MVP.

This document explains what the frontend is, what it needs, how it should be hosted, which environment variables are required, and how to verify deployment.

## 1. What This Service Is

Cardinal Web is the public website and web app for Cardinal.

It includes:

- marketing/product website
- SafeSend pilot UI
- wallet connection UI
- API docs page
- Next.js server route that securely calls the Cardinal backend

Technology:

```text
Next.js 15
React 19
TypeScript
Node.js
```

Current local port:

```text
3004
```

## 2. Deployment Goal

Deploy the frontend to the Cardinal domain so users can open the website and use the MVP.

Recommended public URLs:

```text
https://cardinalweb3.com
https://www.cardinalweb3.com
```

If app separation is preferred later:

```text
https://app.cardinalweb3.com
```

The frontend should talk to the backend through a private server-side environment variable:

```text
CARDINAL_API_URL=https://api.cardinalweb3.com
```

## 3. Recommended Hosting Setup

Recommended:

```text
Frontend: Vercel, AWS Amplify, or Node.js server behind Nginx
Backend: Separate backend server
Database: Private database server
```

Important:

Do not host frontend, backend, and database as one casual public service long term.

The frontend can be public. Backend and database need stricter controls.

## 4. Current Repo Path

Frontend repo path:

```text
cardinal-web
```

GitHub repo:

```text
https://github.com/Cardinal-Web3/cardinal-web
```

## 5. Required Runtime

Use:

```text
Node.js 22 LTS
npm
```

Install command:

```bash
npm install
```

Build command:

```bash
npm run build
```

Start command:

```bash
npm run start
```

Development command:

```bash
npm run dev
```

## 6. Required Environment Variables

Create production environment variables on the hosting platform.

```env
CARDINAL_API_URL=https://api.cardinalweb3.com
CARDINAL_API_KEY=<production-backend-api-key>
CARDINAL_SCAN_MODE=live

NEXT_PUBLIC_SAFESEND_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
NEXT_PUBLIC_SAFESEND_CONTRACT_ADDRESS=<safesend-contract-address>
NEXT_PUBLIC_SAFESEND_USDC_ADDRESS=<test-usdc-token-address>
NEXT_PUBLIC_SAFESEND_DEPLOYMENT_BLOCK=<deployment-block>
```

## 6.1 Build-Time Environment Variables

These values are baked into the browser bundle because they start with `NEXT_PUBLIC_`.
Provide them during `docker build` or the Next.js build step.

```env
NEXT_PUBLIC_SAFESEND_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
NEXT_PUBLIC_SAFESEND_CONTRACT_ADDRESS=<safesend-contract-address>
NEXT_PUBLIC_SAFESEND_USDC_ADDRESS=<test-usdc-token-address>
NEXT_PUBLIC_SAFESEND_DEPLOYMENT_BLOCK=<deployment-block>
```

Docker build example:

```bash
docker build \
  --build-arg NEXT_PUBLIC_SAFESEND_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc \
  --build-arg NEXT_PUBLIC_SAFESEND_CONTRACT_ADDRESS=<safesend-contract-address> \
  --build-arg NEXT_PUBLIC_SAFESEND_USDC_ADDRESS=<test-usdc-token-address> \
  --build-arg NEXT_PUBLIC_SAFESEND_DEPLOYMENT_BLOCK=<deployment-block> \
  -t cardinal-web .
```

## 6.2 Runtime Environment Variables

These values should be injected when the container starts. They must not be baked
into the public image.

```env
NODE_ENV=production
PORT=3004
CARDINAL_API_URL=https://api.cardinalweb3.com
CARDINAL_API_KEY=<production-backend-api-key>
CARDINAL_SCAN_MODE=live
```

Docker run example:

```bash
docker run -d \
  --name cardinal-web \
  --restart unless-stopped \
  -p 3004:3004 \
  --env-file .env.production \
  cardinal-web
```

## 7. Environment Variable Security

These must stay server-side only:

```text
CARDINAL_API_URL
CARDINAL_API_KEY
CARDINAL_SCAN_MODE
```

These are safe to expose in browser:

```text
NEXT_PUBLIC_SAFESEND_RPC_URL
NEXT_PUBLIC_SAFESEND_CONTRACT_ADDRESS
NEXT_PUBLIC_SAFESEND_USDC_ADDRESS
NEXT_PUBLIC_SAFESEND_DEPLOYMENT_BLOCK
```

Never expose:

- backend API key
- backend database URL
- provider API keys
- private keys
- deployer wallet keys

## 8. Backend Dependency

The frontend live scan mode requires backend API availability.

Expected backend URL:

```text
https://api.cardinalweb3.com
```

Frontend server route:

```text
POST /api/protection/check
```

Backend route it calls:

```text
POST /api/check-transaction
```

The browser calls the frontend server route. The frontend server route calls the backend with the private API key.

## 9. Suggested Domain Setup

Frontend:

```text
cardinalweb3.com
www.cardinalweb3.com
```

Backend:

```text
api.cardinalweb3.com
```

Optional future admin:

```text
admin.cardinalweb3.com
```

## 10. DNS Requirements

Infra team should configure DNS based on the hosting provider.

Typical setup:

```text
A record or CNAME for cardinalweb3.com
CNAME for www.cardinalweb3.com
CNAME or A record for api.cardinalweb3.com
```

Enable HTTPS/TLS for all public domains.

## 11. Deployment Steps

1. Pull latest frontend code from GitHub.
2. Set Node.js version to 22.
3. Install dependencies.
4. Add production environment variables.
5. Run build.
6. Start the app.
7. Point domain to deployment.
8. Enable HTTPS.
9. Test public website.

Commands for Node server deployment:

```bash
npm install
npm run build
npm run start
```

If using PM2:

```bash
pm2 start npm --name cardinal-web -- run start
pm2 save
```

Docker deployment:

```bash
docker build -t cardinal-web .
docker run -d --name cardinal-web --restart unless-stopped -p 3004:3004 --env-file .env.production cardinal-web
```

## 12. Nginx Example

If hosted on a Linux server with Nginx:

```nginx
server {
  server_name cardinalweb3.com www.cardinalweb3.com;

  location / {
    proxy_pass http://127.0.0.1:3004;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

Use Certbot or another certificate manager for HTTPS.

## 13. Health Checks

Uptime endpoint:

```text
GET /api/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "Cardinal Web"
}
```

Frontend pages to test:

```text
/
/safesend
/partners
/pilot
/api-docs
/app
/app/new
```

Expected:

- pages load with no server error
- nav works
- wallet modal opens
- API docs render
- app dashboard loads

## 14. Live Scan Verification

After backend is deployed:

1. Open `/app/new`.
2. Enter SafeSend details.
3. Click scan.
4. Confirm backend request ID appears on verdict page.

If backend is down, frontend should show an API error. It should not silently fake live backend results.

## 15. Pilot Access Form

Current status:

```text
UI confirmation only
```

Needs future integration:

- email provider
- CRM
- database capture
- webhook

For now, this is not a real lead collection system unless connected separately.

## 16. Backups

Frontend code is backed by GitHub.

No user data should be stored directly in the frontend app.

Important data lives in backend/database and should be backed up there.

## 17. Rollback

If a frontend deployment fails:

1. Revert to previous successful deployment.
2. Confirm backend health.
3. Confirm `/` and `/app` load.
4. Check environment variables.

Do not change backend or database while rolling back frontend unless required.

## 18. Production Checklist

Before sharing publicly:

- domain points to frontend
- HTTPS works
- production backend URL configured
- production backend API key configured
- no local `localhost` values in production env
- SafeSend contract address confirmed
- token address confirmed
- `/api-docs` works
- `/app/new` works
- mobile layout checked
- light/dark mode checked
