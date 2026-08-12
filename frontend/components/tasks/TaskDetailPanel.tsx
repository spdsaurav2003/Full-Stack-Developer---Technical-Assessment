"use client";

import { useState, useEffect, useRef } from "react";
import {
  Task, Subtask, Comment, Priority, TaskStatus,
  PRIORITY_LABELS, STATUS_LABELS,
} from "@/types";
import { subtasksApi, commentsApi } from "@/lib/tasks-api";
import { useAuth } from "@/contexts/AuthContext";
import { formatDate, formatRelativeTime, formatDateInput } from "@/lib/utils";
import PriorityBadge from "./PriorityBadge";

interface TaskDetailPanelProps {
  task: Task;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Task>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onRefresh: () => void;
}

export default function TaskDetailPanel({
  task,
  onClose,
  onUpdate,
  onDelete,
  onRefresh,
}: TaskDetailPanelProps) {
  const { user } = useAuth();
  const [subtasks, setSubtasks] = useState<Subtask[]>(task.subtasks || []);
  const [comments, setComments] = useState<Comment[]>(task.comments || []);
  const [newComment, setNewComment] = useState("");
  const [addingSubtask, setAddingSubtask] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(task.title);
  const [editingDesc, setEditingDesc] = useState(false);
  const [descValue, setDescValue] = useState(task.description || "");
  const [activeTab, setActiveTab] = useState<"subtasks" | "comments">("subtasks");
  const commentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setSubtasks(task.subtasks || []);
    setComments(task.comments || []);
    setTitleValue(task.title);
    setDescValue(task.description || "");
  }, [task]);

  const handleTitleSave = async () => {
    if (titleValue.trim() && titleValue !== task.title) {
      await onUpdate(task.id, { title: titleValue.trim() });
    }
    setEditingTitle(false);
  };

  const handleDescSave = async () => {
    if (descValue !== task.description) {
      await onUpdate(task.id, { description: descValue });
    }
    setEditingDesc(false);
  };

  const handleStatusChange = async (status: TaskStatus) => {
    await onUpdate(task.id, { status });
  };

  const handleAddSubtask = async () => {
    if (!newSubtaskTitle.trim()) return;
    try {
      const subtask = await subtasksApi.create(task.id, { title: newSubtaskTitle.trim() });
      setSubtasks((prev) => [...prev, subtask]);
      setNewSubtaskTitle("");
      setAddingSubtask(false);
    } catch (err) {
      console.error("Failed to add subtask", err);
    }
  };

  const handleToggleSubtask = async (subtask: Subtask) => {
    try {
      const updated = await subtasksApi.update(subtask.id, { completed: !subtask.completed });
      setSubtasks((prev) => prev.map((s) => (s.id === subtask.id ? updated : s)));
    } catch (err) {
      console.error("Failed to toggle subtask", err);
    }
  };

  const handleDeleteSubtask = async (id: string) => {
    try {
      await subtasksApi.delete(id);
      setSubtasks((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Failed to delete subtask", err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || submittingComment) return;
    setSubmittingComment(true);
    try {
      const comment = await commentsApi.create(task.id, newComment.trim());
      setComments((prev) => [comment, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const completedSubtasks = subtasks.filter((s) => s.completed).length;

  const STATUSES: TaskStatus[] = ["TODO", "DOING", "COMPLETED", "BACKLOG"];
  const STATUS_COLORS: Record<TaskStatus, string> = {
    TODO: "var(--text-muted)",
    DOING: "var(--status-doing)",
    COMPLETED: "var(--status-completed)",
    BACKLOG: "var(--status-backlog)",
  };

  return (
    <div className="detail-panel">
      {/* Header */}
      <div
        style={{
          padding: "10px 16px",
          borderBottom: "1px solid var(--border-default)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          background: "var(--bg-primary)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        {/* Left: close button */}
        <button
          onClick={onClose}
          title="Close"
          style={{ border: "none", cursor: "pointer", padding: 6, borderRadius: 6, background: "transparent", color: "var(--text-muted)", display: "flex", alignItems: "center" }}
          id="close-detail-panel-btn"
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Right: action icons */}
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Share */}
          <button
            title="Share"
            style={{ border: "none", cursor: "pointer", padding: 6, borderRadius: 6, background: "transparent", color: "var(--text-muted)", display: "flex", alignItems: "center" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
          {/* More */}
          <button
            title="More options"
            style={{ border: "none", cursor: "pointer", padding: 6, borderRadius: 6, background: "transparent", color: "var(--text-muted)", display: "flex", alignItems: "center" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="19" cy="12" r="1.5" />
            </svg>
          </button>
          {/* Archive/Delete */}
          <button
            onClick={() => { onDelete(task.id); }}
            title="Delete task"
            id="delete-task-detail-btn"
            style={{ border: "none", cursor: "pointer", padding: 6, borderRadius: 6, background: "transparent", color: "var(--text-muted)", display: "flex", alignItems: "center" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#fee2e2";
              (e.currentTarget as HTMLButtonElement).style.color = "#991b1b";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", padding: "20px" }}>
        {/* Title */}
        <div style={{ marginBottom: 16 }}>
          {editingTitle ? (
            <input
              autoFocus
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => { if (e.key === "Enter") handleTitleSave(); if (e.key === "Escape") setEditingTitle(false); }}
              style={{
                width: "100%",
                fontSize: 20,
                fontWeight: 700,
                color: "var(--text-primary)",
                background: "transparent",
                border: "none",
                borderBottom: "2px solid var(--accent)",
                outline: "none",
                padding: "2px 0",
                fontFamily: "inherit",
              }}
            />
          ) : (
            <h2
              style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", cursor: "text", lineHeight: 1.3 }}
              onClick={() => setEditingTitle(true)}
            >
              {task.title}
            </h2>
          )}
        </div>

        {/* Properties section - Figma style list */}
        <div style={{ marginBottom: 20, border: "1px solid var(--border-default)", borderRadius: 8, overflow: "hidden" }}>
          {/* Properties header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 12px",
              background: "var(--bg-secondary)",
              borderBottom: "1px solid var(--border-default)",
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>Properties</span>
            <div style={{ display: "flex", gap: 4 }}>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-subtle)", padding: 3, display: "flex", borderRadius: 4 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-subtle)", padding: 3, display: "flex", borderRadius: 4 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.07 4.93a10 10 0 010 14.14" />
                  <path d="M4.93 4.93a10 10 0 000 14.14" />
                </svg>
              </button>
            </div>
          </div>

          {/* Property rows */}
          {/* Assignee/Members */}
          <div style={{ display: "flex", alignItems: "center", padding: "8px 12px", borderBottom: "1px solid var(--border-default)" }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", width: 80, flexShrink: 0 }}>Members</span>
            {task.assignee ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="avatar avatar-sm" style={{ background: task.assignee.color }}>
                  {task.assignee.initials}
                </div>
                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{task.assignee.name}</span>
              </div>
            ) : (
              <span style={{ fontSize: 12, color: "var(--text-subtle)" }}>Unassigned</span>
            )}
          </div>

          {/* Priority */}
          <div style={{ display: "flex", alignItems: "center", padding: "8px 12px", borderBottom: "1px solid var(--border-default)" }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", width: 80, flexShrink: 0 }}>Priority</span>
            <PriorityBadge priority={task.priority} onChange={(p) => onUpdate(task.id, { priority: p })} />
          </div>

          {/* Due Date */}
          <div style={{ display: "flex", alignItems: "center", padding: "8px 12px", borderBottom: "1px solid var(--border-default)" }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", width: 80, flexShrink: 0 }}>Dates</span>
            <input
              type="date"
              defaultValue={formatDateInput(task.dueDate)}
              onChange={(e) => onUpdate(task.id, { dueDate: e.target.value || null } as any)}
              id="task-due-date-input"
              style={{
                background: "transparent",
                border: "none",
                color: task.dueDate ? "var(--priority-urgent)" : "var(--text-muted)",
                fontSize: 12,
                fontFamily: "inherit",
                cursor: "pointer",
                outline: "none",
                padding: 0,
              }}
            />
          </div>

          {/* Status */}
          <div style={{ display: "flex", alignItems: "center", padding: "8px 12px", borderBottom: "1px solid var(--border-default)" }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", width: 80, flexShrink: 0 }}>Status</span>
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
              id="task-status-select"
              style={{
                background: "transparent",
                border: "none",
                color: STATUS_COLORS[task.status],
                fontSize: 12,
                fontWeight: 600,
                padding: 0,
                fontFamily: "inherit",
                cursor: "pointer",
                outline: "none",
              }}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>

          {/* Labels */}
          <div style={{ display: "flex", alignItems: "flex-start", padding: "8px 12px" }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", width: 80, flexShrink: 0, paddingTop: 2 }}>Labels</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {task.labels && task.labels.length > 0 ? (
                task.labels.map((label) => (
                  <span
                    key={label.id}
                    className="label-badge"
                    style={{
                      background: `${label.color}18`,
                      color: label.color,
                      borderColor: `${label.color}40`,
                    }}
                  >
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: label.color, flexShrink: 0, display: "inline-block" }} />
                    {label.name}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: 12, color: "var(--text-subtle)" }}>No labels</span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-subtle)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>
            Description
          </label>
          {editingDesc ? (
            <textarea
              autoFocus
              value={descValue}
              onChange={(e) => setDescValue(e.target.value)}
              onBlur={handleDescSave}
              rows={4}
              id="task-description-input"
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "var(--bg-secondary)",
                border: "1px solid var(--accent)",
                borderRadius: 8,
                color: "var(--text-primary)",
                fontSize: 13,
                fontFamily: "inherit",
                resize: "vertical",
                outline: "none",
                lineHeight: 1.6,
              }}
            />
          ) : (
            <div
              onClick={() => setEditingDesc(true)}
              style={{
                padding: "10px 12px",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-default)",
                borderRadius: 8,
                fontSize: 13,
                color: task.description ? "var(--text-secondary)" : "var(--text-subtle)",
                cursor: "text",
                minHeight: 80,
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
              }}
            >
              {task.description || "Click to add description..."}
            </div>
          )}
        </div>

        {/* Tabs: Subtasks / Comments */}
        <div style={{ borderBottom: "1px solid var(--border-default)", marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 0 }}>
            {(["subtasks", "comments"] as const).map((tab) => (
              <button
                key={tab}
                id={`tab-${tab}`}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "8px 16px",
                  fontSize: 13,
                  fontWeight: 500,
                  color: activeTab === tab ? "var(--accent)" : "var(--text-muted)",
                  background: "transparent",
                  border: "none",
                  borderBottom: activeTab === tab ? "2px solid var(--accent)" : "2px solid transparent",
                  cursor: "pointer",
                  transition: "all 150ms",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {tab === "subtasks" ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 11 12 14 22 4" />
                      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                    </svg>
                    Sub-tasks
                    <span style={{ background: "var(--bg-tertiary)", color: "var(--text-muted)", fontSize: 11, padding: "0 5px", borderRadius: 10, fontWeight: 600 }}>
                      {subtasks.length}
                    </span>
                  </>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                    Comments
                    <span style={{ background: "var(--bg-tertiary)", color: "var(--text-muted)", fontSize: 11, padding: "0 5px", borderRadius: 10, fontWeight: 600 }}>
                      {comments.length}
                    </span>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Subtasks Tab */}
        {activeTab === "subtasks" && (
          <div>
            {subtasks.length > 0 && (
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    {completedSubtasks}/{subtasks.length} completed
                  </span>
                  {/* Progress bar */}
                  <div style={{ flex: 1, maxWidth: 120, height: 4, background: "var(--bg-tertiary)", borderRadius: 2, overflow: "hidden", marginLeft: 10 }}>
                    <div style={{ height: "100%", width: `${(completedSubtasks / subtasks.length) * 100}%`, background: "var(--status-completed)", borderRadius: 2, transition: "width 300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {subtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 10px",
                    background: "var(--bg-secondary)",
                    borderRadius: 8,
                    border: "1px solid var(--border-default)",
                    transition: "background 150ms",
                    group: "subtask-row",
                  }}
                >
                  {/* Checkbox */}
                  <div
                    onClick={() => handleToggleSubtask(subtask)}
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 4,
                      border: `2px solid ${subtask.completed ? "var(--status-completed)" : "var(--border-strong)"}`,
                      background: subtask.completed ? "var(--status-completed)" : "transparent",
                      flexShrink: 0,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 150ms",
                    }}
                  >
                    {subtask.completed && (
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <span style={{ flex: 1, fontSize: 13, color: subtask.completed ? "var(--text-subtle)" : "var(--text-secondary)", textDecoration: subtask.completed ? "line-through" : "none" }}>
                    {subtask.title}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {subtask.dueDate && (
                      <span style={{ fontSize: 11, color: "var(--text-subtle)" }}>{formatDate(subtask.dueDate)}</span>
                    )}
                    <button
                      onClick={() => handleDeleteSubtask(subtask.id)}
                      style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-subtle)", padding: 3, borderRadius: 4, display: "flex", alignItems: "center" }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Subtask */}
            {addingSubtask ? (
              <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
                <input
                  autoFocus
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleAddSubtask(); if (e.key === "Escape") setAddingSubtask(false); }}
                  placeholder="Subtask title..."
                  id="new-subtask-input"
                  style={{
                    flex: 1,
                    padding: "7px 10px",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--accent)",
                    borderRadius: 7,
                    fontSize: 13,
                    color: "var(--text-primary)",
                    fontFamily: "inherit",
                    outline: "none",
                  }}
                />
                <button onClick={handleAddSubtask} className="btn btn-primary btn-sm" id="save-subtask-btn">Add</button>
                <button onClick={() => setAddingSubtask(false)} className="btn btn-secondary btn-sm">Cancel</button>
              </div>
            ) : (
              <button
                onClick={() => setAddingSubtask(true)}
                id="add-subtask-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  color: "var(--text-subtle)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px 0",
                  marginTop: 6,
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
                Add Sub-task
              </button>
            )}
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === "comments" && (
          <div>
            {/* Add Comment */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div className="avatar avatar-sm" style={{ background: user?.color || "#7C3AED", flexShrink: 0, marginTop: 2 }}>
                  {user?.initials || "U"}
                </div>
                <div style={{ flex: 1 }}>
                  <textarea
                    ref={commentRef}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleAddComment(); }}
                    placeholder="Write a comment... (Ctrl+Enter to submit)"
                    rows={3}
                    id="new-comment-input"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border-default)",
                      borderRadius: 8,
                      fontSize: 13,
                      color: "var(--text-primary)",
                      fontFamily: "inherit",
                      resize: "none",
                      outline: "none",
                      transition: "border-color 150ms",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--border-default)")}
                  />
                  {newComment.trim() && (
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6, gap: 6 }}>
                      <button onClick={() => setNewComment("")} className="btn btn-secondary btn-sm">Cancel</button>
                      <button onClick={handleAddComment} disabled={submittingComment} className="btn btn-primary btn-sm" id="submit-comment-btn">
                        {submittingComment ? "Posting..." : "Post"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Comment List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {comments.length === 0 ? (
                <p style={{ fontSize: 13, color: "var(--text-subtle)", textAlign: "center", padding: "20px 0" }}>No comments yet. Be the first!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} style={{ display: "flex", gap: 10 }}>
                    <div className="avatar avatar-sm" style={{ background: comment.author?.color || "#7C3AED", flexShrink: 0, marginTop: 2 }}>
                      {comment.author?.initials || "U"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{comment.author?.name || "User"}</span>
                        <span style={{ fontSize: 11, color: "var(--text-subtle)" }}>{formatRelativeTime(comment.createdAt)}</span>
                      </div>
                      <div style={{
                        padding: "10px 12px",
                        background: "var(--bg-secondary)",
                        borderRadius: 8,
                        fontSize: 13,
                        color: "var(--text-secondary)",
                        lineHeight: 1.6,
                        borderTopLeftRadius: 2,
                      }}>
                        {comment.content}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetaField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-subtle)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 4 }}>
        {label}
      </label>
      {children}
    </div>
  );
}
