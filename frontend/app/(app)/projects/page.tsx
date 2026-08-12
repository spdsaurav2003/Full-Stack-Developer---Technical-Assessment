"use client";

import { useEffect, useState } from "react";
import { tasksApi } from "@/lib/tasks-api";
import { Task } from "@/types";

interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  tasks: Task[];
}

const PROJECT_TEMPLATES = [
  {
    id: "p1",
    name: "Website Redesign",
    description: "Revamp the company website with a modern look and improved UX",
    color: "#7c3aed",
    icon: "🎨",
  },
  {
    id: "p2",
    name: "API Development",
    description: "Build and document RESTful APIs for the new microservices architecture",
    color: "#3b82f6",
    icon: "⚡",
  },
  {
    id: "p3",
    name: "Mobile App",
    description: "Develop cross-platform mobile application for iOS and Android",
    color: "#10b981",
    icon: "📱",
  },
];

export default function ProjectsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewProject, setShowNewProject] = useState(false);

  useEffect(() => {
    tasksApi
      .getAll()
      .then(setTasks)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const projects: Project[] = PROJECT_TEMPLATES.map((p, i) => {
    // Distribute tasks across projects for demo
    const start = Math.floor((i * tasks.length) / PROJECT_TEMPLATES.length);
    const end = Math.floor(((i + 1) * tasks.length) / PROJECT_TEMPLATES.length);
    return { ...p, tasks: tasks.slice(start, end) };
  });

  const getProgress = (tasks: Task[]) => {
    if (tasks.length === 0) return 0;
    return Math.round((tasks.filter((t) => t.status === "COMPLETED").length / tasks.length) * 100);
  };

  const getStatusColor = (progress: number) => {
    if (progress === 100) return "#10b981";
    if (progress > 50) return "#3b82f6";
    if (progress > 0) return "#f97316";
    return "#9ca3af";
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
          background: "var(--bg-primary)",
          flexShrink: 0,
        }}
      >
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>Projects</h2>
        <button
          onClick={() => setShowNewProject(true)}
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
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Project
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", padding: "24px" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 60 }}>
            <div
              style={{
                width: 28,
                height: 28,
                border: "2.5px solid var(--border-default)",
                borderTopColor: "var(--accent)",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
          </div>
        ) : (
          <>
            {/* Stats Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 16,
                marginBottom: 28,
              }}
            >
              {[
                { label: "Total Projects", value: projects.length, color: "var(--accent)" },
                { label: "Total Tasks", value: tasks.length, color: "var(--status-doing)" },
                {
                  label: "Completed",
                  value: tasks.filter((t) => t.status === "COMPLETED").length,
                  color: "var(--status-completed)",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-default)",
                    borderRadius: 12,
                    padding: "16px 20px",
                  }}
                >
                  <div style={{ fontSize: 28, fontWeight: 700, color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Section label */}
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--text-subtle)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 12,
              }}
            >
              Active Projects
            </div>

            {/* Project Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
              {projects.map((project) => {
                const progress = getProgress(project.tasks);
                const statusColor = getStatusColor(progress);
                const todoCount = project.tasks.filter((t) => t.status === "TODO").length;
                const doingCount = project.tasks.filter((t) => t.status === "DOING").length;
                const doneCount = project.tasks.filter((t) => t.status === "COMPLETED").length;

                return (
                  <div
                    key={project.id}
                    style={{
                      background: "var(--bg-primary)",
                      border: "1px solid var(--border-default)",
                      borderRadius: 12,
                      padding: "20px",
                      cursor: "pointer",
                      transition: "all 200ms",
                      position: "relative",
                      overflow: "hidden",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = project.color + "60";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 20px ${project.color}15`;
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-default)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                      (e.currentTarget as HTMLDivElement).style.transform = "none";
                    }}
                  >
                    {/* Accent bar */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 3,
                        background: project.color,
                        borderRadius: "12px 12px 0 0",
                      }}
                    />

                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          background: project.color + "20",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 20,
                          flexShrink: 0,
                        }}
                      >
                        {project.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 3 }}>
                          {project.name}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "var(--text-muted)",
                            lineHeight: 1.5,
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {project.description}
                        </div>
                      </div>
                    </div>

                    {/* Progress */}
                    <div style={{ marginBottom: 14 }}>
                      <div
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}
                      >
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Progress</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: statusColor }}>{progress}%</span>
                      </div>
                      <div
                        style={{
                          height: 5,
                          background: "var(--bg-tertiary)",
                          borderRadius: 3,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${progress}%`,
                            background: project.color,
                            borderRadius: 3,
                            transition: "width 600ms ease",
                          }}
                        />
                      </div>
                    </div>

                    {/* Task counts */}
                    <div style={{ display: "flex", gap: 8 }}>
                      {[
                        { label: "To Do", count: todoCount, color: "var(--text-muted)" },
                        { label: "In Progress", count: doingCount, color: "var(--status-doing)" },
                        { label: "Done", count: doneCount, color: "var(--status-completed)" },
                      ].map((item) => (
                        <div
                          key={item.label}
                          style={{
                            flex: 1,
                            background: "var(--bg-secondary)",
                            borderRadius: 7,
                            padding: "6px 8px",
                            textAlign: "center",
                          }}
                        >
                          <div style={{ fontSize: 14, fontWeight: 700, color: item.color }}>{item.count}</div>
                          <div style={{ fontSize: 10, color: "var(--text-subtle)", marginTop: 1 }}>{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* New Project Card */}
              <button
                onClick={() => setShowNewProject(true)}
                style={{
                  background: "var(--bg-secondary)",
                  border: "1.5px dashed var(--border-strong)",
                  borderRadius: 12,
                  padding: "20px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  minHeight: 200,
                  transition: "all 200ms",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--accent-subtle)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-strong)";
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-secondary)";
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "var(--bg-tertiary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-muted)",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", textAlign: "center" }}>
                    New Project
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-subtle)", marginTop: 3, textAlign: "center" }}>
                    Create a new project
                  </div>
                </div>
              </button>
            </div>
          </>
        )}
      </div>

      {/* New Project Modal (simple) */}
      {showNewProject && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
          onClick={() => setShowNewProject(false)}
        >
          <div
            style={{
              background: "var(--bg-primary)",
              border: "1px solid var(--border-default)",
              borderRadius: 16,
              padding: 28,
              width: "100%",
              maxWidth: 420,
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
              New Project
            </h3>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
              Projects help you organize related tasks together. Full project management coming soon!
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowNewProject(false)}
                style={{
                  padding: "8px 16px",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-default)",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Close
              </button>
              <button
                onClick={() => setShowNewProject(false)}
                style={{
                  padding: "8px 16px",
                  background: "var(--text-primary)",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--bg-primary)",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
