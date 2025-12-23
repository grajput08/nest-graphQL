# Quick Setup Guide

## Prerequisites

- Node.js 18+
- PostgreSQL 12+
- pnpm (or npm/yarn)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
# Install all dependencies (root, backend, and frontend)
pnpm install:all

# Or install individually:
pnpm install                    # Root dependencies
cd apps/backend && pnpm install && cd ../..
cd apps/frontend && pnpm install && cd ../..
```

### 2. Database Configuration

1. **Create PostgreSQL database:**

```bash
# Using psql
psql -U postgres
CREATE DATABASE taskflow;
\q
```

2. **Create `.env` file in `apps/backend` directory:**

```env
DATABASE_URL="postgresql://username:password@localhost:5432/taskflow?schema=public"
PORT=3000
FRONTEND_URL=http://localhost:3001
```

3. **Run Prisma migrations:**

```bash
pnpm backend:prisma:generate
pnpm backend:prisma:migrate
```

This will:

- Generate Prisma Client
- Create database tables (User, Task)
- Set up relationships

### 3. Seed Sample Data (Optional)

You can use Prisma Studio to add sample data:

```bash
pnpm backend:prisma:studio
```

Or use SQL directly:

```sql
INSERT INTO "User" (id, name, email, "createdAt")
VALUES
  (gen_random_uuid(), 'John Doe', 'john@example.com', NOW()),
  (gen_random_uuid(), 'Jane Smith', 'jane@example.com', NOW());
```

### 4. Start the Applications

**Terminal 1 - Backend:**

```bash
pnpm backend:dev
```

Backend runs on: http://localhost:3000
GraphQL Playground: http://localhost:3000/graphql

**Terminal 2 - Frontend:**

```bash
pnpm frontend:dev
```

Frontend runs on: http://localhost:3001

### 5. Test the Application

1. Open http://localhost:3001 in your browser
2. You should see the TaskFlow interface
3. Create a task by clicking "+ New Task"
4. Select a user and fill in task details
5. View tasks, filter by status, edit, and delete

### 6. Test GraphQL API

Visit http://localhost:3000/graphql and try:

```graphql
query {
  getUsers {
    id
    name
    email
  }
}
```

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running: `pg_isready`
- Check DATABASE_URL in `.env` matches your PostgreSQL credentials
- Ensure database `taskflow` exists

### Port Already in Use

- Backend: Change `PORT` in `apps/backend/.env`
- Frontend: Change port in `apps/frontend/nuxt.config.ts`

### Prisma Issues

- Run `pnpm backend:prisma:generate` after schema changes
- Run `pnpm backend:prisma:migrate` to apply migrations
- Use `pnpm backend:prisma:studio` to inspect database

### Frontend Not Loading

- Ensure backend is running first
- Check CORS settings in `apps/backend/src/main.ts`
- Verify `GRAPHQL_URL` in `apps/frontend/nuxt.config.ts`

## Next Steps

- Add authentication (JWT)
- Implement pagination
- Add real-time subscriptions
- Add file uploads
- Deploy to production
