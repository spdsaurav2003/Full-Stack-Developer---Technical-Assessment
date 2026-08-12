export type TaskStatus = "TODO" | "DOING" | "COMPLETED" | "BACKLOG";
export type Priority = "NO_PRIORITY" | "URGENT" | "HIGH" | "MEDIUM" | "LOW";

export interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  color: string;
  isGuest: boolean;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Subtask {
  id: string;
  title: string;
  priority: Priority;
  dueDate?: string | null;
  completed: boolean;
  taskId: string;
  assigneeId?: string | null;
  assignee?: Pick<User, "id" | "name" | "initials" | "color"> | null;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author: Pick<User, "id" | "name" | "initials" | "color">;
  taskId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string | null;
  assigneeId?: string | null;
  assignee?: Pick<User, "id" | "name" | "initials" | "color"> | null;
  labels: Label[];
  subtasks: Subtask[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: "To Do",
  DOING: "In Progress",
  COMPLETED: "Completed",
  BACKLOG: "Backlog",
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  NO_PRIORITY: "No Priority",
  URGENT: "Urgent",
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  NO_PRIORITY: "var(--text-subtle)",
  URGENT: "var(--priority-urgent)",
  HIGH: "var(--priority-high)",
  MEDIUM: "var(--priority-medium)",
  LOW: "var(--priority-low)",
};

export const STATUS_ORDER: TaskStatus[] = ["TODO", "DOING", "COMPLETED", "BACKLOG"];
