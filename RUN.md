# How to Run the Project

## Prerequisites
- Node.js 18+ installed
- PostgreSQL database running
- pnpm installed (or npm/yarn)

## Quick Start

### 1. Install Dependencies

```bash
# Install all dependencies (root, backend, and frontend)
pnpm install
```

This will install dependencies for all workspace packages automatically.

### 2. Setup Database

1. **Create PostgreSQL database:**
```sql
CREATE DATABASE taskflow;
```

2. **Configure backend environment:**
   - Copy `apps/backend/.env.example` to `apps/backend/.env`
   - Update `DATABASE_URL` with your PostgreSQL credentials:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/taskflow?schema=public"
   PORT=3000
   FRONTEND_URL=http://localhost:3001
   ```

3. **Run Prisma migrations:**
```bash
cd apps/backend
pnpm prisma:generate
pnpm prisma:migrate
cd ../..
```

Or from root:
```bash
pnpm backend:prisma:generate
pnpm backend:prisma:migrate
```

### 3. Configure Frontend (Optional)

- Copy `apps/frontend/.env.example` to `apps/frontend/.env`
- Update if your backend runs on a different port:
  ```env
  GRAPHQL_URL=http://localhost:3000/graphql
  PORT=3001
  ```

### 4. Start the Applications

**Terminal 1 - Backend:**
```bash
pnpm backend:dev
```

Backend will run on: http://localhost:3000
GraphQL Playground: http://localhost:3000/graphql

**Terminal 2 - Frontend:**
```bash
pnpm frontend:dev
```

Frontend will run on: http://localhost:3001

### 5. Access the Application

- **Frontend UI:** http://localhost:3001
- **GraphQL Playground:** http://localhost:3000/graphql

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running: `pg_isready`
- Check `DATABASE_URL` in `apps/backend/.env`
- Ensure database `taskflow` exists

### Port Already in Use
- Backend: Change `PORT` in `apps/backend/.env`
- Frontend: Change port in `apps/frontend/nuxt.config.ts` or `.env`

### Module Not Found Errors
- Run `pnpm install` in the respective app directory
- Delete `node_modules` and reinstall if issues persist

### Prisma Client Not Generated
```bash
cd apps/backend
pnpm prisma:generate
```

## Production Build

### Backend
```bash
cd apps/backend
pnpm build
pnpm start:prod
```

### Frontend
```bash
cd apps/frontend
pnpm build
# Deploy the .output directory
```

