FROM node:20-alpine AS base

RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/eslint-config-base/package.json ./packages/eslint-config-base/
COPY packages/eslint-config-nest/package.json ./packages/eslint-config-nest/
COPY packages/eslint-config-nuxt/package.json ./packages/eslint-config-nuxt/
COPY packages/shared/package.json ./packages/shared/
COPY packages/ui/package.json ./packages/ui/
COPY packages/prisma/package.json ./packages/prisma/
COPY packages/types/package.json ./packages/types/

RUN pnpm install --frozen-lockfile

FROM base AS build

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm prisma:generate
RUN pnpm build

FROM base AS runtime

WORKDIR /app

ENV NODE_ENV=production

# Копируем node_modules из deps
COPY --from=deps /app/node_modules ./node_modules

# Копируем все файлы из build stage (включая исходники для pnpm dev)
COPY --from=build /app .

# Копируем и делаем исполняемым entrypoint скрипт
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 3000 3001

ENTRYPOINT ["/app/docker-entrypoint.sh"]

