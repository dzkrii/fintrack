# Tahap 1: Base image
FROM node:20-alpine AS base

# Tahap 2: Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json dan pnpm-lock.yaml
COPY package.json pnpm-lock.yaml* ./

# Install dependencies (termasuk devDependencies agar bisa build)
RUN pnpm i --frozen-lockfile

# Tahap 3: Build aplikasi
FROM base AS builder
WORKDIR /app
RUN npm install -g pnpm

# Copy node_modules dari tahap deps
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client (PENTING: agar prisma client terbawa saat build)
RUN npx prisma generate

# Build Next.js
RUN pnpm run build

# Tahap 4: Production image (Hanya file yang dibutuhkan yang diambil)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy file hasil build (standalone)
COPY --from=builder /app/public ./public
# Folder .next/standalone otomatis terbuat karena output: "standalone" di config tadi
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]