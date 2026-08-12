"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* Workspace Header */}
      <div
        style={{
          padding: "14px 14px 10px",
          borderBottom: "1px solid var(--border-default)",
        }}
      >
        {/* User info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 8px",
            borderRadius: 8,
            cursor: "pointer",
            transition: "background var(--transition-fast)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <div
            className="avatar avatar-md"
            style={{ background: user?.color || "#7C3AED" }}
          >
            {user?.initials || "U"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-primary)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.name || "User"}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
              {user?.isGuest ? "Guest" : "Member"}
            </div>
          </div>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-muted)"
            strokeWidth="2"
          >
            <path d="M8 9l4-4 4 4" />
            <path d="M16 15l-4 4-4-4" />
          </svg>
        </div>

        {/* Workspace label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 8px",
            marginTop: 4,
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-subtle)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Workspace
          </span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-subtle)" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: "8px 0", flex: 1 }}>
        <Link
          href="/tasks"
          id="nav-tasks"
          className={`sidebar-nav-item ${pathname.startsWith("/tasks") ? "active" : ""}`}
          onClick={onClose}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
          Tasks
        </Link>

        <Link
          href="/projects"
          id="nav-projects"
          className={`sidebar-nav-item ${pathname.startsWith("/projects") ? "active" : ""}`}
          onClick={onClose}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
          </svg>
          Projects
        </Link>
      </nav>

      {/* Bottom Actions */}
      <div
        style={{
          padding: "10px 14px 14px",
          borderTop: "1px solid var(--border-default)",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {/* Theme Toggle */}
        <button
          id="theme-toggle-btn"
          onClick={toggleTheme}
          className="sidebar-nav-item"
          style={{ width: "100%", background: "transparent", border: "none", textAlign: "left" }}
        >
          {theme === "dark" ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
              Light Mode
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
              Dark Mode
            </>
          )}
        </button>

        {/* Logout */}
        <button
          id="logout-btn"
          onClick={logout}
          className="sidebar-nav-item"
          style={{ width: "100%", background: "transparent", border: "none", textAlign: "left", color: "var(--priority-urgent)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
