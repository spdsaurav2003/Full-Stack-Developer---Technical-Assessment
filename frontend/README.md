# TaskFlow – Frontend

This is the Next.js 14 frontend for the TaskFlow task management application.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v4 + custom CSS design tokens
- **Language**: TypeScript
- **Auth**: JWT (stored in localStorage)

## Getting Started

### Prerequisites
- Node.js 18+
- Backend running at `http://localhost:3001`

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Project Structure

```
app/
├── (app)/
│   ├── layout.tsx       # Sidebar + header shell
│   ├── tasks/page.tsx   # Main task management view
│   └── projects/page.tsx # Projects overview
├── login/page.tsx       # Login page
├── globals.css          # Design tokens + component styles
└── layout.tsx           # Root layout with providers

components/
├── layout/
│   └── Sidebar.tsx      # Navigation sidebar
└── tasks/
    ├── TaskGroup.tsx    # Status group + task rows
    ├── TaskDetailPanel.tsx # Right-side detail panel
    ├── AddTaskModal.tsx # Create task modal
    ├── PriorityBadge.tsx # Priority selector badge
    └── FieldsDropdown.tsx # Column visibility dropdown

contexts/
├── AuthContext.tsx      # Auth state + guest login
└── ThemeContext.tsx     # Dark/light mode

lib/
├── api.ts              # Base HTTP client
├── tasks-api.ts        # Task/subtask/comment/label API calls
└── utils.ts            # Date formatting, etc.

types/
└── index.ts            # TypeScript interfaces
```

## Design System

All design tokens are defined as CSS custom properties in `globals.css`:

- Background: `--bg-primary`, `--bg-secondary`, `--bg-tertiary`
- Text: `--text-primary`, `--text-secondary`, `--text-muted`, `--text-subtle`
- Accent: `--accent`, `--accent-hover`, `--accent-subtle`
- Priority: `--priority-urgent`, `--priority-high`, `--priority-medium`, `--priority-low`
- Status: `--status-todo`, `--status-doing`, `--status-completed`, `--status-backlog`

Both light and dark mode are fully supported via `[data-theme="dark"]` selector.
