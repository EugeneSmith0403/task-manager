# Task Manager - Mini Fullstack Application

A fullstack task management application built with NestJS, Nuxt 3, Prisma, PostgreSQL, and Redis in a Turborepo monorepo.

## Architecture

### Monorepo Structure

- **apps/api** - NestJS backend API
- **apps/web** - Nuxt 3 frontend application
- **packages/eslint-config-base** - Base ESLint configuration
- **packages/eslint-config-nest** - NestJS-specific ESLint configuration
- **packages/eslint-config-nuxt** - Nuxt-specific ESLint configuration
- **packages/ui** - Shared UI component library with Storybook
- **packages/shared** - Shared types and utilities

### Backend (NestJS)

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis for task list caching
- **API Documentation**: Swagger/OpenAPI
- **Validation**: class-validator and class-transformer

### Frontend (Nuxt 3)

- **Framework**: Nuxt 3 with Vue 3
- **UI Library**: Vuetify 3 + Tailwind CSS
- **Form Validation**: vee-validate with Zod
- **State Management**: TanStack Vue Query
- **Internationalization**: @nuxtjs/i18n

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Docker and Docker Compose (optional, for containerized setup)
- PostgreSQL (if running locally)
- Redis (if running locally)

### Local Development

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your database and Redis configuration
   ```

3. **Run database migrations**:
   ```bash
   pnpm prisma:generate
   pnpm db:migrate
   ```

4. **Seed the database** (optional):
   ```bash
   pnpm db:seed
   ```

5. **Start development servers**:
   ```bash
   pnpm dev
   ```

   This will start:
   - Backend API on http://localhost:3000
   - Frontend on http://localhost:3001
   - API documentation on http://localhost:3000/api

### Docker Setup

1. **Start all services**:
   ```bash
   docker-compose up
   ```

2. **Run migrations** (in a separate terminal):
   ```bash
   docker-compose exec app pnpm db:migrate
   ```

3. **Seed the database** (optional):
   ```bash
   docker-compose exec app pnpm db:seed
   ```

## Available Scripts

### Root Level

- `pnpm dev` - Start all applications in development mode
- `pnpm build` - Build all applications
- `pnpm lint` - Lint all packages
- `pnpm test` - Run all tests
- `pnpm prisma:generate` - Generate Prisma client
- `pnpm db:migrate` - Run database migrations
- `pnpm db:seed` - Seed the database

### Backend (apps/api)

- `pnpm dev` - Start NestJS in watch mode
- `pnpm build` - Build the application
- `pnpm start` - Start production server
- `pnpm test` - Run unit tests
- `pnpm test:e2e` - Run e2e tests

### Frontend (apps/web)

- `pnpm dev` - Start Nuxt dev server
- `pnpm build` - Build for production
- `pnpm start` - Start production server

### UI Library (packages/ui)

- `pnpm storybook` - Start Storybook
- `pnpm build-storybook` - Build Storybook for deployment

## Testing

### Backend Tests

```bash
cd apps/api
pnpm test          # Unit tests
pnpm test:e2e      # E2E tests
pnpm test:cov      # Coverage report
```

### Frontend Tests

```bash
cd apps/web
pnpm test          # Run Vitest tests
```

## API Endpoints

- `POST /tasks` - Create a new task
- `GET /tasks` - Get all tasks (supports `status` and `sortBy` query parameters)
- `PATCH /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

API documentation is available at `/api` when the backend is running.

## Database Schema

The `Task` model includes:
- `id` (UUID)
- `title` (string, required)
- `description` (string, optional)
- `status` (enum: PENDING, IN_PROGRESS, COMPLETED)
- `dueDate` (DateTime)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

## Caching Strategy

Tasks are cached in Redis with the following keys:
- `tasks:all` - All tasks
- `tasks:status:<STATUS>` - Tasks filtered by status

Cache is invalidated on create, update, or delete operations.

## Possible Improvements

- [ ] Pagination for task lists
- [ ] Advanced filtering and search
- [ ] User authentication and authorization
- [ ] Task assignments and collaboration
- [ ] File attachments
- [ ] Task comments and activity log
- [ ] Email notifications
- [ ] Real-time updates with WebSockets
- [ ] Enhanced monitoring and logging
- [ ] Performance optimizations
- [ ] Comprehensive error handling
- [ ] API rate limiting
- [ ] CI/CD pipeline improvements
- [ ] End-to-end testing with Playwright/Cypress

## License

Private project

