"use client";

import { useState, useEffect, useCallback } from "react";
import { Task, STATUS_ORDER, TaskStatus } from "@/types";
import { tasksApi } from "@/lib/tasks-api";
import TaskGroup from "@/components/tasks/TaskGroup";
import TaskDetailPanel from "@/components/tasks/TaskDetailPanel";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import FieldsDropdown from "@/components/tasks/FieldsDropdown";

export type VisibleField = "priority" | "members" | "dueDate" | "labels" | "status";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [search, setSearch] = useState("");
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [addTaskStatus, setAddTaskStatus] = useState<TaskStatus>("TODO");
  const [visibleFields, setVisibleFields] = useState<Set<VisibleField>>(
    new Set(["priority", "members", "dueDate"])
  );
  const [collapsedGroups, setCollapsedGroups] = useState<Set<TaskStatus>>(new Set());

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await tasksApi.getAll(search ? { search } : undefined);
      setTasks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(loadTasks, 300);
    return () => clearTimeout(timer);
  }, [loadTasks]);

  const groupedTasks = STATUS_ORDER.map((status) => ({
    status,
    tasks: tasks.filter((t) => t.status === status),
  }));

  const handleTaskClick = (task: Task) => setSelectedTask(task);
  const handleClosePanel = () => setSelectedTask(null);

  const handleTaskUpdate = async (id: string, updates: Partial<Task>) => {
    try {
      const updated = await tasksApi.update(id, updates);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      if (selectedTask?.id === id) setSelectedTask(updated);
    } catch (err: any) {
      console.error("Update failed:", err.message);
    }
  };

  const handleTaskDelete = async (id: string) => {
    try {
      await tasksApi.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      if (selectedTask?.id === id) setSelectedTask(null);
    } catch (err: any) {
      console.error("Delete failed:", err.message);
    }
  };

  const handleAddTask = (status: TaskStatus) => {
    setAddTaskStatus(status);
    setShowAddTask(true);
  };

  const handleTaskCreated = (task: Task) => {
    setTasks((prev) => [...prev, task]);
    setShowAddTask(false);
  };

  const toggleGroup = (status: TaskStatus) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  };

  const toggleField = (field: VisibleField) => {
    setVisibleFields((prev) => {
      const next = new Set(prev);
      if (next.has(field)) next.delete(field);
      else next.add(field);
      return next;
    });
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Page Header */}
      <div
        style={{
          padding: "12px 20px",
          borderBottom: "1px solid var(--border-default)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          background: "var(--bg-primary)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", flexShrink: 0 }}>
            Tasks
          </h2>

          {/* Search - icon that expands on click */}
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            {searchExpanded ? (
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <svg
                  style={{
                    position: "absolute",
                    left: 9,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-subtle)",
                    flexShrink: 0,
                  }}
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  id="task-search-input"
                  type="text"
                  placeholder="Search tasks..."
                  value={search}
                  autoFocus
                  onChange={(e) => setSearch(e.target.value)}
                  onBlur={() => { if (!search) setSearchExpanded(false); }}
                  style={{
                    width: 200,
                    padding: "5px 10px 5px 28px",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-default)",
                    borderRadius: 7,
                    color: "var(--text-primary)",
                    fontSize: 13,
                    fontFamily: "inherit",
                    outline: "none",
                    transition: "all 200ms",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                />
                {search && (
                  <button
                    onClick={() => { setSearch(""); setSearchExpanded(false); }}
                    style={{
                      position: "absolute",
                      right: 6,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--text-subtle)",
                      padding: 2,
                      display: "flex",
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ) : (
              <button
                id="search-icon-btn"
                onClick={() => setSearchExpanded(true)}
                title="Search tasks"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 30,
                  height: 30,
                  borderRadius: 7,
                  border: "1px solid var(--border-default)",
                  background: "var(--bg-secondary)",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  transition: "all 150ms",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-secondary)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FieldsDropdown visibleFields={visibleFields} onToggle={toggleField} />

          {/* Filter button */}
          <button
            id="filter-btn"
            title="Filter tasks"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 30,
              height: 30,
              borderRadius: 7,
              border: "1px solid var(--border-default)",
              background: "var(--bg-secondary)",
              cursor: "pointer",
              color: "var(--text-muted)",
              transition: "all 150ms",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-secondary)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </button>

          <button
            id="add-task-btn"
            onClick={() => handleAddTask("TODO")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "6px 12px",
              background: "var(--text-primary)",
              color: "var(--bg-primary)",
              border: "none",
              borderRadius: 7,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: "pointer",
              transition: "all 150ms",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Task
          </button>
        </div>
      </div>

      {/* Main area: task list + detail panel side by side */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Task List */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Column Headers */}
          <div
            style={{
              padding: "0 20px",
              background: "var(--bg-secondary)",
              borderBottom: "1px solid var(--border-default)",
              flexShrink: 0,
            }}
          >
            <div
              className="task-table-header"
              style={{
                gridTemplateColumns: `1fr ${visibleFields.has("priority") ? "100px" : ""} ${visibleFields.has("members") ? "80px" : ""} ${visibleFields.has("dueDate") ? "110px" : ""} 60px`,
                padding: "8px 0",
              }}
            >
              <span>Task</span>
              {visibleFields.has("priority") && <span>Priority</span>}
              {visibleFields.has("members") && <span>Members</span>}
              {visibleFields.has("dueDate") && <span>Due Date</span>}
              <span>Actions</span>
            </div>
          </div>

          {/* Task Groups */}
          <div style={{ flex: 1, overflow: "auto", padding: "0 20px 24px" }}>
            {loading && !tasks.length ? (
              <div style={{ padding: "60px 0", textAlign: "center", color: "var(--text-muted)" }}>
                <div
                  className="animate-spin"
                  style={{
                    width: 28,
                    height: 28,
                    border: "2.5px solid var(--border-default)",
                    borderTopColor: "var(--accent)",
                    borderRadius: "50%",
                    margin: "0 auto 12px",
                  }}
                />
                <p style={{ fontSize: 13 }}>Loading tasks...</p>
              </div>
            ) : error ? (
              <div style={{ padding: "60px 0", textAlign: "center" }}>
                <p style={{ color: "var(--priority-urgent)", fontSize: 14, marginBottom: 12 }}>
                  Failed to load tasks: {error}
                </p>
                <button className="btn btn-secondary" onClick={loadTasks}>
                  Retry
                </button>
              </div>
            ) : (
              <div style={{ paddingTop: 12 }}>
                {groupedTasks.map(({ status, tasks: groupTasks }) => (
                  <TaskGroup
                    key={status}
                    status={status}
                    tasks={groupTasks}
                    visibleFields={visibleFields}
                    isCollapsed={collapsedGroups.has(status)}
                    onToggleCollapse={() => toggleGroup(status)}
                    onTaskClick={handleTaskClick}
                    onTaskUpdate={handleTaskUpdate}
                    onTaskDelete={handleTaskDelete}
                    onAddTask={() => handleAddTask(status)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Task Detail Panel - side panel, no overlay */}
        {selectedTask && (
          <TaskDetailPanel
            task={selectedTask}
            onClose={handleClosePanel}
            onUpdate={handleTaskUpdate}
            onDelete={handleTaskDelete}
            onRefresh={loadTasks}
          />
        )}
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <AddTaskModal
          defaultStatus={addTaskStatus}
          onClose={() => setShowAddTask(false)}
          onCreated={handleTaskCreated}
        />
      )}
    </div>
  );
}
