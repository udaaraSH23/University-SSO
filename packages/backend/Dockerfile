FROM node:20-alpine AS base

# 1. Prune dependencies
FROM base AS pruner
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=@repo/backend --docker

# 2. Install dependencies
FROM base AS installer
WORKDIR /app
RUN apk add --no-cache libc6-compat
RUN apk update

COPY .gitignore .gitignore
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/package-lock.json ./package-lock.json
RUN npm install

# 3. Build the app
FROM base AS builder
WORKDIR /app
COPY --from=installer /app/ .
COPY --from=pruner /app/out/full/ .

RUN npx turbo run build --filter=@repo/backend...

# 4. Production Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 backenduser
USER backenduser

COPY --from=builder --chown=backenduser:nodejs /app/packages/backend/dist ./dist
COPY --from=builder --chown=backenduser:nodejs /app/packages/backend/package.json ./package.json
# Need node_modules for runtime dependencies
COPY --from=builder --chown=backenduser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=backenduser:nodejs /app/packages/backend/node_modules ./packages/backend/node_modules

WORKDIR /dist
CMD ["node", "index.js"]
