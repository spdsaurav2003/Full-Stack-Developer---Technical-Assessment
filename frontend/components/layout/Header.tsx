"use client";

import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header
      style={{
        height: 52,
        background: "var(--bg-primary)",
        borderBottom: "1px solid var(--border-default)",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        gap: 12,
        flexShrink: 0,
        transition: "background-color var(--transition-normal)",
      }}
    >
      {/* Mobile menu button */}
      <button
        id="mobile-menu-btn"
        onClick={onMenuClick}
        className="btn-ghost btn-icon"
        style={{
          display: "none",
          border: "none",
          cursor: "pointer",
          padding: 6,
          borderRadius: 6,
          color: "var(--text-muted)",
          background: "transparent",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <div style={{ flex: 1 }} />

      {/* Right section */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Notification bell */}
        <button
          id="notifications-btn"
          className="btn-ghost btn-icon"
          style={{ border: "none", cursor: "pointer", padding: 7, borderRadius: 8, color: "var(--text-muted)", background: "transparent", position: "relative" }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        </button>

        {/* User avatar */}
        <div
          className="avatar avatar-md"
          style={{ background: user?.color || "#7C3AED", cursor: "pointer" }}
          title={user?.name || "User"}
        >
          {user?.initials || "U"}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          button[id="mobile-menu-btn"] {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
