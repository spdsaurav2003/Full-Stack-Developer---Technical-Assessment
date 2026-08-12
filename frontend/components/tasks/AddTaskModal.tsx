"use client";

import { useState, useEffect } from "react";
import { Task, TaskStatus, Priority, STATUS_LABELS } from "@/types";
import { tasksApi, usersApi, labelsApi } from "@/lib/tasks-api";

interface AddTaskModalProps {
  defaultStatus: TaskStatus;
  onClose: () => void;
  onCreated: (task: Task) => void;
}

const STATUSES: TaskStatus[] = ["TODO", "DOING", "COMPLETED", "BACKLOG"];
const PRIORITIES: Priority[] = ["NO_PRIORITY", "URGENT", "HIGH", "MEDIUM", "LOW"];
const PRIORITY_LABELS_MAP: Record<Priority, string> = {
  NO_PRIORITY: "No Priority", URGENT: "Urgent", HIGH: "High", MEDIUM: "Medium", LOW: "Low",
};

export default function AddTaskModal({ defaultStatus, onClose, onCreated }: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [priority, setPriority] = useState<Priority>("NO_PRIORITY");
  const [dueDate, setDueDate] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [labels, setLabels] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    usersApi.getAll().then(setUsers).catch(() => {});
    labelsApi.getAll().then(setLabels).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError("Title is required"); return; }
    setSaving(true);
    setError("");
    try {
      const task = await tasksApi.create({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        dueDate: dueDate || undefined,
        assigneeId: assigneeId || undefined,
        labelIds: selectedLabelIds.length ? selectedLabelIds : undefined,
      } as any);
      onCreated(task);
    } catch (err: any) {
      setError(err.message || "Failed to create task");
    } finally {
      setSaving(false);
    }
  };

  const toggleLabel = (id: string) => {
    setSelectedLabelIds((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  return (
    <>
      {/* Overlay */}
      <div
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)", zIndex: 60 }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="animate-scale-in"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 70,
          width: "100%",
          maxWidth: 520,
          background: "var(--bg-primary)",
          borderRadius: 16,
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
          border: "1px solid var(--border-default)",
          overflow: "hidden",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border-default)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Create Task</h3>
          <button
            onClick={onClose}
            style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4, borderRadius: 6, display: "flex" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
          {error && (
            <div style={{ background: "#fee2e2", color: "#991b1b", padding: "10px 12px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          {/* Title */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Task Title *</label>
            <input
              autoFocus
              id="new-task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              className="input-field"
              required
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Description</label>
            <textarea
              id="new-task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              rows={3}
              style={{
                width: "100%",
                padding: "8px 12px",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-default)",
                borderRadius: 8,
                color: "var(--text-primary)",
                fontSize: 14,
                fontFamily: "inherit",
                resize: "none",
                outline: "none",
                transition: "border-color 150ms",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border-default)")}
            />
          </div>

          {/* Status + Priority row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>Status</label>
              <select
                id="new-task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                style={selectStyle}
              >
                {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Priority</label>
              <select
                id="new-task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                style={selectStyle}
              >
                {PRIORITIES.map((p) => <option key={p} value={p}>{PRIORITY_LABELS_MAP[p]}</option>)}
              </select>
            </div>
          </div>

          {/* Due Date + Assignee row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>Due Date</label>
              <input
                id="new-task-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={selectStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Assignee</label>
              <select
                id="new-task-assignee"
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                style={selectStyle}
              >
                <option value="">Unassigned</option>
                {users.map((u: any) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Labels */}
          {labels.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Labels</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {labels.map((label: any) => (
                  <button
                    key={label.id}
                    type="button"
                    onClick={() => toggleLabel(label.id)}
                    style={{
                      padding: "3px 10px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 500,
                      border: selectedLabelIds.includes(label.id) ? `1.5px solid ${label.color}` : "1.5px solid var(--border-default)",
                      background: selectedLabelIds.includes(label.id) ? `${label.color}18` : "transparent",
                      color: selectedLabelIds.includes(label.id) ? label.color : "var(--text-muted)",
                      cursor: "pointer",
                      transition: "all 150ms",
                      fontFamily: "inherit",
                    }}
                  >
                    {label.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn btn-primary" id="create-task-submit-btn">
              {saving ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 500,
  color: "var(--text-muted)",
  display: "block",
  marginBottom: 5,
};

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  background: "var(--bg-secondary)",
  border: "1px solid var(--border-default)",
  borderRadius: 8,
  color: "var(--text-primary)",
  fontSize: 13,
  fontFamily: "inherit",
  cursor: "pointer",
  outline: "none",
};
