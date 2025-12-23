# TaskFlow - GraphQL Task Manager

A clean CRUD-based monorepo project demonstrating GraphQL with NestJS backend and Nuxt.js frontend.

## 🧩 Project Overview

**Title:** TaskFlow – GraphQL Task Manager

**Use case:** Manage tasks for users (create, update, assign, complete).

## 🏗️ Tech Stack

### Backend

- NestJS
- GraphQL (Code First approach)
- Apollo Server
- TypeScript
- PostgreSQL
- Prisma

### Frontend

- Nuxt.js 3
- Vue 3
- Apollo Client
- Tailwind CSS

## 📦 Core Entities

### 1️⃣ User

- `id` (UUID)
- `name` (String)
- `email` (String, unique)

### 2️⃣ Task

- `id` (UUID)
- `title` (String)
- `description` (String, optional)
- `status` (TODO | IN_PROGRESS | DONE)
- `priority` (LOW | MEDIUM | HIGH)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- `userId` (UUID, foreign key)

## 📐 GraphQL Schema

### Queries

- `getTasks(status: TaskStatus): [Task]` - Get all tasks, optionally filtered by status
- `getTask(id: ID!): Task` - Get a single task by ID
- `getUsers: [User]` - Get all users

### Mutations

- `createTask(input: CreateTaskInput): Task` - Create a new task
- `updateTask(id: ID!, input: UpdateTaskInput): Task` - Update an existing task
- `deleteTask(id: ID!): Boolean` - Delete a task

## 🗂️ Project Structure

```
graphql-task-poc/
├── apps/
│   ├── backend/           # Backend (NestJS)
│   │   ├── src/
│   │   │   ├── users/     # User module
│   │   │   │   ├── users.module.ts
│   │   │   │   ├── users.resolver.ts
│   │   │   │   ├── users.service.ts
│   │   │   │   └── user.entity.ts
│   │   │   ├── tasks/     # Task module
│   │   │   │   ├── tasks.module.ts
│   │   │   │   ├── tasks.resolver.ts
│   │   │   │   ├── tasks.service.ts
│   │   │   │   ├── task.entity.ts
│   │   │   │   └── dto/
│   │   │   │       ├── create-task.input.ts
│   │   │   │       └── update-task.input.ts
│   │   │   ├── prisma/    # Prisma service
│   │   │   │   ├── prisma.module.ts
│   │   │   │   └── prisma.service.ts
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── prisma/
│   │   │   └── schema.prisma  # Database schema
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── frontend/          # Frontend (Nuxt.js)
│       ├── pages/
│       ├── assets/
│       ├── nuxt.config.ts
│       └── package.json
└── package.json           # Root package.json (monorepo)
```

## ⚙️ Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- pnpm (or npm/yarn)

### 1. Install Dependencies

```bash
# Install all dependencies (root, backend, and frontend)
pnpm install:all

# Or install individually:
pnpm install                    # Root dependencies
cd apps/backend && pnpm install && cd ../..
cd apps/frontend && pnpm install && cd ../..
```

### 2. Database Setup

1. Create a PostgreSQL database:

```sql
CREATE DATABASE taskflow;
```

2. Create a `.env` file in the `apps/backend` directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/taskflow?schema=public"
PORT=3000
FRONTEND_URL=http://localhost:3001
```

3. Generate Prisma Client and run migrations:

```bash
pnpm backend:prisma:generate
pnpm backend:prisma:migrate
```

4. (Optional) Seed the database with sample data:

```bash
pnpm prisma:studio
```

### 3. Run the Application

#### Backend (GraphQL API)

```bash
# Development mode
pnpm backend:dev

# The GraphQL playground will be available at:
# http://localhost:3000/graphql
```

#### Frontend (Nuxt.js)

```bash
# In a separate terminal
pnpm frontend:dev

# The frontend will be available at:
# http://localhost:3001
```

## 🧪 Testing the API

### Using GraphQL Playground

Visit `http://localhost:3000/graphql` and try these queries:

#### Create a User (via Prisma Studio or direct SQL)

```sql
INSERT INTO "User" (id, name, email, "createdAt")
VALUES (gen_random_uuid(), 'John Doe', 'john@example.com', NOW());
```

#### Create a Task

```graphql
mutation {
  createTask(
    input: {
      title: "Complete project documentation"
      description: "Write comprehensive README and API docs"
      status: TODO
      priority: HIGH
      userId: "YOUR_USER_ID"
    }
  ) {
    id
    title
    status
    priority
  }
}
```

#### Get All Tasks

```graphql
query {
  getTasks {
    id
    title
    description
    status
    priority
    user {
      name
      email
    }
  }
}
```

#### Get Tasks by Status

```graphql
query {
  getTasks(status: TODO) {
    id
    title
    status
  }
}
```

#### Update a Task

```graphql
mutation {
  updateTask(id: "TASK_ID", input: { status: IN_PROGRESS, priority: HIGH }) {
    id
    title
    status
    priority
  }
}
```

#### Delete a Task

```graphql
mutation {
  deleteTask(id: "TASK_ID")
}
```

## 🎯 Features

✅ GraphQL Code First approach  
✅ Type-safe with TypeScript  
✅ Prisma ORM for database management  
✅ Input validation with class-validator  
✅ Clean NestJS architecture  
✅ Modern Nuxt.js frontend with Tailwind CSS  
✅ Apollo Client integration  
✅ CORS enabled for frontend communication

## 📝 Available Scripts

### Backend

- `pnpm backend:dev` - Start backend in development mode
- `pnpm backend:build` - Build the backend
- `pnpm backend:prisma:generate` - Generate Prisma Client
- `pnpm backend:prisma:migrate` - Run database migrations
- `pnpm backend:prisma:studio` - Open Prisma Studio

### Frontend

- `pnpm frontend:dev` - Start frontend in development mode
- `pnpm frontend:build` - Build the frontend

## 🚀 Deployment

### Backend

1. Set production environment variables in `apps/backend/.env`
2. Run `pnpm backend:build`
3. Run `pnpm backend:start` (or use the built files in `apps/backend/dist`)

### Frontend

1. Update `GRAPHQL_URL` in `apps/frontend/nuxt.config.ts`
2. Run `pnpm frontend:build`
3. Deploy the `.output` directory from `apps/frontend`

## 📚 Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [GraphQL Code First](https://docs.nestjs.com/graphql/quick-start#code-first)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Nuxt.js Documentation](https://nuxt.com)
- [Apollo Client](https://www.apollographql.com/docs/react)

## License

MIT
# nest-graphQL
