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
- **Internationalization**: @nuxtjs/i18n (English and Russian)
- **UI Components**: Shared component library (`@task-manager/ui`) with:
  - `DataTable` - Sortable data table with actions
  - `Filters` - Advanced filtering component
  - `TextInput`, `TextArea` - Form input components
  - `StatusSelect` - Status selection dropdown
  - `DateInput` - Date picker component
- **Features**:
  - Task CRUD operations with confirmation dialogs
  - Advanced filtering (by title search and multiple statuses)
  - Sortable task lists
  - URL-synchronized filters and sorting
  - Responsive design

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

2. **Start PostgreSQL and Redis**:
   ```bash
   docker-compose up
   ```   

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your database and Redis configuration
   ```

4. **Run database migrations**:
   ```bash
   pnpm prisma:generate
   pnpm prisma:migrate
   ```

5. **Seed the database** (optional):
   ```bash
   pnpm prisma:seed
   ```

6. **Start development servers**:
   ```bash
   pnpm dev
   ```

   This will start:
   - Backend API on http://localhost:3001
   - Frontend on http://localhost:8080
   - API documentation on http://localhost:3001/api

### Docker Setup

#### Local Development (PostgreSQL and Redis only)

For local development, you can run only the database services:

1. **Start PostgreSQL and Redis**:
   ```bash
   docker-compose up
   ```

2. **Run migrations** (in a separate terminal):
   ```bash
   pnpm prisma:migrate
   ```

3. **Seed the database** (optional):
   ```bash
   pnpm prisma:seed
   ```

4. **Start the application locally**:
   ```bash
   pnpm dev
   ```

#### Production (Full Stack)

For production deployment with the application containerized:

##### Prerequisites

- Docker and Docker Compose installed on your system
- At least 2GB of free disk space for Docker images and volumes

##### Environment Variables

Before starting, you may want to customize environment variables. Create a `.env` file in the project root or set environment variables:

```bash
# Database configuration
POSTGRES_USER=taskmanager
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=taskmanager

# Redis configuration
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=  # Optional, leave empty if not using Redis password

# Application ports
PORT=3000          # Backend API port
NUXT_PORT=8080     # Frontend port
NUXT_PUBLIC_API_BASE=http://localhost:3000  # API base URL for frontend
```

##### Building and Starting Services

1. **Build and start all services** (PostgreSQL, Redis, and App):
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```
   
   The `--build` flag ensures the Docker image is built with the latest code changes. On subsequent starts, you can omit it:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

2. **Automatic Setup Process**:
   When the container starts, the entrypoint script automatically:
   - Generates Prisma client types
   - Runs database migrations (`prisma migrate deploy`)
   - Seeds the database (if seed script is configured)
   - Starts both API and Web applications using `pnpm dev`

3. **Verify services are running**:
   ```bash
   docker-compose -f docker-compose.prod.yml ps
   ```
   
   You should see three services: `postgres`, `redis`, and `app`, all with status "Up".

##### Accessing the Application

Once all services are running:
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api

##### Monitoring and Logs

**View application logs**:
```bash
docker-compose -f docker-compose.prod.yml logs -f app
```

**View all services logs**:
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

**View specific service logs**:
```bash
docker-compose -f docker-compose.prod.yml logs -f postgres
docker-compose -f docker-compose.prod.yml logs -f redis
```

##### Managing Services

**Stop all services**:
```bash
docker-compose -f docker-compose.prod.yml down
```

**Stop services and remove volumes** (⚠️ This will delete all database data):
```bash
docker-compose -f docker-compose.prod.yml down -v
```

**Restart a specific service**:
```bash
docker-compose -f docker-compose.prod.yml restart app
```

**Rebuild and restart after code changes**:
```bash
docker-compose -f docker-compose.prod.yml up -d --build app
```

##### Database Management

**Access PostgreSQL database directly**:
```bash
docker-compose -f docker-compose.prod.yml exec postgres psql -U taskmanager -d taskmanager
```

**Run migrations manually** (if needed):
```bash
docker-compose -f docker-compose.prod.yml exec app pnpm prisma:migrate
```

**Run database seed manually**:
```bash
docker-compose -f docker-compose.prod.yml exec app pnpm prisma:seed
```

##### Troubleshooting

**Check container health**:
```bash
docker-compose -f docker-compose.prod.yml ps
```

**View detailed container information**:
```bash
docker-compose -f docker-compose.prod.yml inspect app
```

**Access container shell**:
```bash
docker-compose -f docker-compose.prod.yml exec app sh
```

**Note**: The production container runs both API and Web applications using `pnpm dev` command from the root, which uses Turbo to manage the monorepo tasks. For true production deployment, you may want to build the applications separately and run them with `pnpm start` instead of `pnpm dev`.

## Available Scripts

### Root Level

- `pnpm dev` - Start all applications in development mode
- `pnpm build` - Build all applications
- `pnpm lint` - Lint all packages
- `pnpm test` - Run all tests
- `pnpm clean` - Clean build artifacts and dependencies
- `pnpm prisma:generate` - Generate Prisma client
- `pnpm prisma:migrate` - Run database migrations
- `pnpm prisma:seed` - Seed the database

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
- `GET /tasks` - Get all tasks with filtering and sorting
  - Query parameters:
    - `title` (string, optional) - Filter tasks by title (search)
    - `status` (string, optional) - Filter by status(es). Multiple values can be comma-separated (e.g., `status=PENDING,IN_PROGRESS`)
    - `sortBy` (string, optional) - Sort field (default: `dueDate`)
- `PATCH /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

API documentation is available at `/api` when the backend is running.

## Frontend Features

### Task Management
- **Create Task**: Form with validation for creating new tasks
- **Edit Task**: Update existing tasks with pre-filled form data
- **Delete Task**: Confirmation dialog before deletion
- **List Tasks**: Data table with sorting and filtering capabilities

### Filtering & Search
- **Title Search**: Real-time search by task title
- **Status Filtering**: Multi-select filter for task statuses (PENDING, IN_PROGRESS, COMPLETED)
- **URL Synchronization**: Filters and sorting are synchronized with URL query parameters for shareable links

### Sorting
- Sortable columns in the task list (title, description, status, due date)
- Default sorting by due date

### Internationalization
- Support for English and Russian languages
- Language switcher in navigation
- All UI text is internationalized

## Frontend Structure

### Components (`apps/web/components/`)
- `AppNavigation.vue` - Main navigation component with language switcher
- `TaskForm.vue` - Reusable form component for creating/editing tasks
- `DeleteTaskDialog.vue` - Confirmation dialog for task deletion

### Composables (`apps/web/composables/`)
- `useTasks.ts` - Task data management with TanStack Vue Query
  - `useTasksQuery()` - Fetch tasks with filtering and sorting
  - `useCreateTaskMutation()` - Create new tasks
  - `useUpdateTaskMutation()` - Update existing tasks
  - `useDeleteTaskMutation()` - Delete tasks
- `useTaskFilters.ts` - Filter and sort management with URL synchronization

### Pages (`apps/web/pages/`)
- `index.vue` - Home page
- `tasks/index.vue` - Task list with filters and sorting
- `tasks/new.vue` - Create new task page
- `tasks/[id].vue` - Edit task page

### UI Package (`packages/ui/`)
Shared component library with Storybook stories:
- `DataTable.vue` - Configurable data table with sorting and actions
- `Filters.vue` - Flexible filtering component
- `TextInput.vue` - Text input with validation
- `TextArea.vue` - Textarea with validation
- `StatusSelect.vue` - Status dropdown selector
- `DateInput.vue` - Date picker component

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

