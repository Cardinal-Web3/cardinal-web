FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app

ARG NEXT_PUBLIC_SAFESEND_RPC_URL
ARG NEXT_PUBLIC_SAFESEND_CONTRACT_ADDRESS
ARG NEXT_PUBLIC_SAFESEND_USDC_ADDRESS
ARG NEXT_PUBLIC_SAFESEND_DEPLOYMENT_BLOCK

ENV NEXT_PUBLIC_SAFESEND_RPC_URL=$NEXT_PUBLIC_SAFESEND_RPC_URL
ENV NEXT_PUBLIC_SAFESEND_CONTRACT_ADDRESS=$NEXT_PUBLIC_SAFESEND_CONTRACT_ADDRESS
ENV NEXT_PUBLIC_SAFESEND_USDC_ADDRESS=$NEXT_PUBLIC_SAFESEND_USDC_ADDRESS
ENV NEXT_PUBLIC_SAFESEND_DEPLOYMENT_BLOCK=$NEXT_PUBLIC_SAFESEND_DEPLOYMENT_BLOCK

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3004

COPY package.json package-lock.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.ts ./next.config.ts

EXPOSE 3004
CMD ["npm", "run", "start"]
