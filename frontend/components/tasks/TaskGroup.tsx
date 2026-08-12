"use client";

import { useState } from "react";
import { Task, TaskStatus, Priority, PRIORITY_LABELS, PRIORITY_COLORS, STATUS_LABELS } from "@/types";
import PriorityBadge from "./PriorityBadge";
import { VisibleField } from "@/app/(app)/tasks/page";
import { formatDate } from "@/lib/utils";

interface TaskGroupProps {
  status: TaskStatus;
  tasks: Task[];
  visibleFields: Set<VisibleField>;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onTaskClick: (task: Task) => void;
  onTaskUpdate: (id: string, updates: Partial<Task>) => Promise<void>;
  onTaskDelete: (id: string) => Promise<void>;
  onAddTask: () => void;
}

const STATUS_ICONS: Record<TaskStatus, React.ReactNode> = {
  TODO: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
    </svg>
  ),
  DOING: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  COMPLETED: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  BACKLOG: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" strokeDasharray="4 2" />
    </svg>
  ),
};

const STATUS_COLORS: Record<TaskStatus, string> = {
  TODO: "var(--text-muted)",
  DOING: "var(--status-doing)",
  COMPLETED: "var(--status-completed)",
  BACKLOG: "var(--status-backlog)",
};

export default function TaskGroup({
  status,
  tasks,
  visibleFields,
  isCollapsed,
  onToggleCollapse,
  onTaskClick,
  onTaskUpdate,
  onTaskDelete,
  onAddTask,
}: TaskGroupProps) {
  const gridCols = `1fr ${visibleFields.has("priority") ? "100px" : ""} ${visibleFields.has("members") ? "80px" : ""} ${visibleFields.has("dueDate") ? "110px" : ""} 80px`;

  return (
    <div style={{ marginBottom: 8, borderRadius: 8, overflow: "hidden", border: "1px solid var(--border-default)" }}>
      {/* Group Header */}
      <div
        className="group-header"
        onClick={onToggleCollapse}
        style={{ color: STATUS_COLORS[status] }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{
            transition: "transform 200ms",
            transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
        <span style={{ color: STATUS_COLORS[status] }}>
          {STATUS_ICONS[status]}
        </span>
        <span style={{ color: "var(--text-secondary)" }}>{STATUS_LABELS[status]}</span>
        <span
          style={{
            background: "var(--bg-tertiary)",
            color: "var(--text-muted)",
            fontSize: 11,
            fontWeight: 600,
            padding: "1px 7px",
            borderRadius: 10,
          }}
        >
          {tasks.length}
        </span>
      </div>

      {/* Task Rows */}
      {!isCollapsed && (
        <>
          {tasks.length === 0 ? (
            <div
              style={{
                padding: "16px 16px",
                fontSize: 13,
                color: "var(--text-subtle)",
                fontStyle: "italic",
                background: "var(--bg-primary)",
                textAlign: "center",
              }}
            >
              No tasks yet
            </div>
          ) : (
            tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                visibleFields={visibleFields}
                gridCols={gridCols}
                onClick={() => onTaskClick(task)}
                onUpdate={(updates) => onTaskUpdate(task.id, updates)}
                onDelete={() => onTaskDelete(task.id)}
              />
            ))
          )}

          {/* Add Task */}
          <div
            style={{
              padding: "8px 12px",
              background: "var(--bg-primary)",
              borderTop: "1px solid var(--border-default)",
            }}
          >
            <button
              id={`add-task-${status.toLowerCase()}-btn`}
              onClick={onAddTask}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                color: "var(--text-subtle)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "3px 0",
                transition: "color 150ms",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-subtle)")}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Task
            </button>
          </div>
        </>
      )}
    </div>
  );
}

interface TaskRowProps {
  task: Task;
  visibleFields: Set<VisibleField>;
  gridCols: string;
  onClick: () => void;
  onUpdate: (updates: Partial<Task>) => Promise<void>;
  onDelete: () => Promise<void>;
}

function TaskRow({ task, visibleFields, gridCols, onClick, onUpdate, onDelete }: TaskRowProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
    setShowMenu(false);
  };

  return (
    <div
      className="task-row"
      style={{ gridTemplateColumns: gridCols }}
      onClick={onClick}
    >
      {/* Task title */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        {/* Checkbox */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onUpdate({ status: task.status === "COMPLETED" ? "TODO" : "COMPLETED" });
          }}
          style={{
            width: 16,
            height: 16,
            borderRadius: 4,
            border: `2px solid ${task.status === "COMPLETED" ? "var(--status-completed)" : "var(--border-strong)"}`,
            background: task.status === "COMPLETED" ? "var(--status-completed)" : "transparent",
            flexShrink: 0,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 150ms",
          }}
        >
          {task.status === "COMPLETED" && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
        <span
          style={{
            fontSize: 13.5,
            fontWeight: 500,
            color: task.status === "COMPLETED" ? "var(--text-subtle)" : "var(--text-primary)",
            textDecoration: task.status === "COMPLETED" ? "line-through" : "none",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {task.title}
        </span>

        {/* Labels */}
        {visibleFields.has("labels") && task.labels.length > 0 && (
          <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
            {task.labels.slice(0, 2).map((label) => (
              <span
                key={label.id}
                className="label-badge"
                style={{
                  background: `${label.color}18`,
                  color: label.color,
                  borderColor: `${label.color}40`,
                }}
              >
                {label.name}
              </span>
            ))}
            {task.labels.length > 2 && (
              <span className="label-badge" style={{ background: "var(--bg-tertiary)", color: "var(--text-muted)", borderColor: "var(--border-default)" }}>
                +{task.labels.length - 2}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Priority */}
      {visibleFields.has("priority") && (
        <div onClick={(e) => e.stopPropagation()}>
          <PriorityBadge
            priority={task.priority}
            onChange={(p) => onUpdate({ priority: p })}
          />
        </div>
      )}

      {/* Members / Assignee */}
      {visibleFields.has("members") && (
        <div style={{ display: "flex", alignItems: "center" }}>
          {task.assignee ? (
            <div
              className="avatar avatar-sm"
              style={{ background: task.assignee.color }}
              title={task.assignee.name}
            >
              {task.assignee.initials}
            </div>
          ) : (
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                border: "1.5px dashed var(--border-strong)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--text-subtle)" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          )}
        </div>
      )}

      {/* Due Date */}
      {visibleFields.has("dueDate") && (
        <div>
          {task.dueDate ? (
            <span
              style={{
                fontSize: 12,
                color: isOverdue(task.dueDate) ? "var(--priority-urgent)" : "var(--text-muted)",
                background: isOverdue(task.dueDate) ? "rgba(239,68,68,0.08)" : "var(--bg-tertiary)",
                padding: "2px 8px",
                borderRadius: 6,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {formatDate(task.dueDate)}
            </span>
          ) : (
            <span style={{ fontSize: 12, color: "var(--text-subtle)" }}>—</span>
          )}
        </div>
      )}

      {/* Actions */}
      <div
        style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ position: "relative" }}>
          <button
            id={`task-menu-${task.id}`}
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="btn-ghost btn-icon"
            style={{ border: "none", cursor: "pointer", padding: 5, borderRadius: 6, background: "transparent", color: "var(--text-muted)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="19" cy="12" r="1.5" />
            </svg>
          </button>

          {showMenu && (
            <>
              <div
                style={{ position: "fixed", inset: 0, zIndex: 10 }}
                onClick={() => setShowMenu(false)}
              />
              <div
                className="dropdown-menu"
                style={{ position: "absolute", right: 0, top: "100%", zIndex: 20, minWidth: 160 }}
              >
                <div
                  className="dropdown-item"
                  onClick={(e) => handleMenuAction(e, onClick)}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                  Open detail
                </div>
                <div
                  className="dropdown-item"
                  style={{ color: "var(--priority-urgent)" }}
                  onClick={(e) => handleMenuAction(e, onDelete)}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                  </svg>
                  Delete task
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function isOverdue(dateStr: string): boolean {
  return new Date(dateStr) < new Date();
}
