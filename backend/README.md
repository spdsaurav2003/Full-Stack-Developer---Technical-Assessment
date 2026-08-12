# TaskFlow – Backend API

This is the NestJS backend for the TaskFlow task management application.

## Tech Stack

- **Framework**: NestJS
- **Database**: SQLite via Prisma ORM
- **Auth**: JWT (JSON Web Tokens)
- **Language**: TypeScript

## Getting Started

### Prerequisites
- Node.js 18+

### Install & Run

```bash
npm install

# Set up database
npx prisma generate
npx prisma db push
npx prisma db seed

# Start development server
npm run start:dev
```

API will be available at `http://localhost:3001/api`.

### Environment Variables

Create a `.env` file:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

## API Overview

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/guest` | Guest login (returns JWT) |
| POST | `/api/auth/login` | Email/password login |

### Tasks
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/tasks` | List tasks (supports `?search=`) |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/:id` | Get single task |
| PATCH | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

### Subtasks
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/tasks/:taskId/subtasks` | List subtasks |
| POST | `/api/tasks/:taskId/subtasks` | Create subtask |
| PATCH | `/api/subtasks/:id` | Update subtask |
| DELETE | `/api/subtasks/:id` | Delete subtask |

### Comments
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/tasks/:taskId/comments` | List comments |
| POST | `/api/tasks/:taskId/comments` | Add comment |
| DELETE | `/api/tasks/:taskId/comments/:id` | Delete comment |

### Labels
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/labels` | List labels |
| POST | `/api/labels` | Create label |

### Users
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/users` | List users |
| GET | `/api/users/:id` | Get user |

## Data Models

### Task
```typescript
{
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'DOING' | 'COMPLETED' | 'BACKLOG';
  priority: 'NO_PRIORITY' | 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  dueDate?: Date;
  assigneeId?: string;
  labels: Label[];
  subtasks: Subtask[];
  comments: Comment[];
}
```

### Subtask
```typescript
{
  id: string;
  title: string;
  priority: Priority;
  dueDate?: Date;
  completed: boolean;
  taskId: string;
}
```

## Architecture

```
src/
├── app.module.ts         # Root module
├── main.ts               # Entry point (CORS, validation)
├── auth/                 # JWT auth module
├── tasks/                # Tasks CRUD module
├── subtasks/             # Subtasks CRUD module
├── comments/             # Comments CRUD module
├── labels/               # Labels module
├── users/                # Users module
└── prisma/               # Prisma service
```

All endpoints (except auth) require a Bearer JWT token in the `Authorization` header.
