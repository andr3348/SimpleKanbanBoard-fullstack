# Simple Kanban Board

Fullstack Kanban board built with NestJS (backend), Next.js (frontend), and PostgreSQL.

## Prerequisites

- Node.js >= 18
- Docker (for PostgreSQL)

## Setup

```sh
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp packages/database/.env.example packages/database/.env

# 3. Start PostgreSQL
docker compose up -d

# 4. Apply database migrations
npx turbo run db:deploy

# 5. Start development servers (frontend + backend)
npx turbo run dev
```

Frontend: http://localhost:3000  
Backend API: http://localhost:3001

## Build

```sh
npx turbo run build
```

## Project structure

```
apps/
  api/          # NestJS backend (port 3001)
  web/          # Next.js frontend (port 3000)
packages/
  database/     # Prisma schema + client
  ui/           # Shared UI components
  types/        # Shared TypeScript types
```
