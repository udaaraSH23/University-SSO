FROM node:20-alpine AS base

# 1. Prune dependencies
FROM base AS pruner
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=library-portal --docker

# 2. Install dependencies
FROM base AS installer
WORKDIR /app

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/package-lock.json ./package-lock.json
RUN npm install

# 3. Build the app
FROM base AS builder
WORKDIR /app
COPY --from=installer /app/ .
COPY --from=pruner /app/out/full/ .

# Invoke the build script for the specific workspace
RUN npx turbo run build --filter=library-portal...

# 4. Production Release
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder /app/apps/library-portal/public ./apps/library-portal/public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/apps/library-portal/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/library-portal/.next/static ./apps/library-portal/.next/static

CMD ["node", "apps/library-portal/server.js"]
