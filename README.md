# TaskFlow – Full Stack Task Management System

A full-featured task management application built for the Full Stack Developer (Fresher) Technical Assessment. The project implements a pixel-faithful recreation of the provided Figma design using Next.js 14, NestJS, Tailwind CSS, and SQLite via Prisma.

---

## Live Demo

> **Frontend**: http://localhost:3000  
> **Backend API**: http://localhost:3001/api  
> Use **"Continue as Guest"** to log in without an account.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS v4 + Custom CSS tokens |
| Backend | NestJS |
| Database | SQLite (via Prisma ORM) |
| Auth | JWT (access tokens, guest login) |
| Language | TypeScript |

---

## Project Structure

```
├── frontend/               # Next.js 14 App
│   ├── app/
│   │   ├── (app)/
│   │   │   ├── tasks/      # Task management page
│   │   │   └── projects/   # Projects overview page
│   │   ├── login/          # Login page
│   │   └── globals.css     # Design tokens + global styles
│   ├── components/
│   │   ├── layout/         # Sidebar, Header
│   │   └── tasks/          # TaskGroup, TaskDetailPanel, AddTaskModal, etc.
│   ├── contexts/           # AuthContext, ThemeContext
│   ├── lib/                # API client, utils
│   └── types/              # TypeScript type definitions
│
└── backend/                # NestJS API
    ├── src/
    │   ├── auth/           # JWT auth, guest login
    │   ├── tasks/          # Task CRUD
    │   ├── subtasks/       # Subtask CRUD
    │   ├── comments/       # Comment CRUD
    │   ├── labels/         # Label management
    │   └── users/          # User management
    └── prisma/
        ├── schema.prisma   # Database schema
        └── seed.ts         # Demo data seeder
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### 1. Clone & Install

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Set Up the Database

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Run migrations (creates dev.db SQLite file)
npx prisma db push

# Seed with demo data
npx prisma db seed
```

### 3. Start the Servers

**Terminal 1 – Backend (NestJS)**
```bash
cd backend
npm run start:dev
# API running at http://localhost:3001/api
```

**Terminal 2 – Frontend (Next.js)**
```bash
cd frontend
npm run dev
# App running at http://localhost:3000
```

### 4. Open the App

Navigate to **http://localhost:3000** and click **"Continue as Guest"**.

---

## Features

### ✅ Task Management
- **Grouped task list** by status: To Do, In Progress, Completed, Backlog
- **Collapsible groups** with animated chevron icon
- **Task detail side panel** – opens beside the list (no overlay)
- **Inline "+ Add Task"** in each group
- **Quick status change** via dropdown in task row
- **Priority badge** with color-coded levels (Urgent, High, Medium, Low)
- **Due dates** with calendar picker
- **Assignee avatars** with colored initials
- **Label pills** with custom colors
- **Horizontal "⋯" action menu** per task row (open detail, delete)

### ✅ Task Detail Panel
- **Properties section** – Members, Priority, Dates, Status, Labels in a structured card
- **Editable title** (click to edit inline)
- **Editable description** (click to edit)
- **Sub-tasks** with progress bar and per-item completion toggle
- **Comments** with author avatar, timestamp, and text input
- **Share / More / Delete** actions in header

### ✅ Add Task Modal
- Title, description, status, priority, due date, assignee
- Form validation and error handling
- Task creation via REST API

### ✅ Search & Filter
- Collapsible search (icon → input on click)
- Debounced search against backend
- Fields visibility toggle (Priority, Members, Due Date)
- Filter button (UI ready)

### ✅ Auth
- **Guest login** via JWT (no password required)
- Auth persisted in `localStorage`
- Protected routes via Next.js middleware

### ✅ Theme
- **Dark / Light mode** toggle
- CSS custom properties for all tokens
- Persisted in `localStorage`

### ✅ Projects Page
- Summary cards showing task counts and progress
- Animated project cards with hover effects

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/guest` | Guest login |
| GET | `/api/tasks` | List all tasks (with `?search=`) |
| POST | `/api/tasks` | Create task |
| PATCH | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| GET | `/api/tasks/:id/subtasks` | List subtasks |
| POST | `/api/tasks/:id/subtasks` | Create subtask |
| PATCH | `/api/subtasks/:id` | Update subtask |
| DELETE | `/api/subtasks/:id` | Delete subtask |
| GET | `/api/tasks/:id/comments` | List comments |
| POST | `/api/tasks/:id/comments` | Add comment |
| DELETE | `/api/tasks/:id/comments/:id` | Delete comment |
| GET | `/api/labels` | List labels |
| GET | `/api/users` | List users |

---

## Design Fidelity

The implementation closely follows the provided Figma design:

| Element | Implementation |
|---------|---------------|
| Login page | Dark card with glassmorphic blurred background, TaskFlow logo, guest login |
| Sidebar | User avatar, Workspace label, Tasks + Projects nav, theme toggle, sign out |
| Task list | Table layout with sortable columns (TASK, PRIORITY, MEMBERS, DUE DATE, ACTIONS) |
| Task row | Checkbox, title, priority badge, assignee avatar, due date chip, action menu |
| Detail panel | Side panel (not overlay), Properties card, tabs for subtasks/comments |
| Add Task modal | Centered modal with all fields |
| Status colors | To Do (gray), In Progress (blue), Completed (green), Backlog (orange) |
| Priority colors | Urgent (red), High (orange), Medium (yellow), Low (gray) |

### Intentional Deviations
- **Google OAuth** is shown as a button but not wired (scope: demo only)
- **Projects** page shows summary cards instead of a full project board (Figma only shows one screen)
- **Filter** button is present in the UI but the filter panel is not yet implemented
- Due to SQLite usage instead of PostgreSQL, array-type fields are simulated via join tables

---

## Environment Variables

### Backend (`backend/.env`)
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="task-manager-secret-key-2024-assessment"
JWT_EXPIRES_IN="7d"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## Known Limitations
- Google OAuth is not implemented (demo stub only)
- File uploads for avatars are not supported
- Real-time collaboration (WebSocket) is not implemented
- The app uses SQLite for simplicity; production would use PostgreSQL

---

## Assessment Checklist

- [x] Task CRUD (Create, Read, Update, Delete)
- [x] Status grouping (To Do, In Progress, Completed, Backlog)
- [x] Priority levels with color badges
- [x] Due dates
- [x] Assignees
- [x] Labels / Tags
- [x] Subtasks with completion toggle
- [x] Comments
- [x] Search
- [x] Task detail side panel
- [x] Add Task modal
- [x] Dark / Light mode
- [x] JWT Authentication (guest login)
- [x] Figma design fidelity
- [x] Next.js App Router
- [x] NestJS backend
- [x] Prisma ORM
- [x] TypeScript throughout
- [x] RESTful API
