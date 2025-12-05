#!/bin/sh
set -e

# Генерируем типы Prisma
echo "Generating Prisma types..."
cd /app
pnpm prisma:generate || echo "Warning: Prisma generate failed or already generated"

# Запускаем миграции базы данных
echo "Running database migrations..."
cd /app/packages/prisma
npx prisma migrate deploy || echo "Warning: Migration failed or already applied"
cd /app

# Запускаем seeds
echo "Running database seeds..."
pnpm prisma:seed || echo "Warning: Seeding failed or already seeded"

# Запускаем приложения через pnpm dev из корня
echo "Starting applications with pnpm dev..."
exec pnpm dev

