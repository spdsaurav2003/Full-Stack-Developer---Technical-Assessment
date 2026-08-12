"use client";

import { useState, useRef, useEffect } from "react";
import { Priority, PRIORITY_LABELS, PRIORITY_COLORS } from "@/types";

interface PriorityBadgeProps {
  priority: Priority;
  onChange?: (priority: Priority) => void;
  readOnly?: boolean;
}

const PRIORITY_ICONS: Record<Priority, React.ReactNode> = {
  NO_PRIORITY: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
    </svg>
  ),
  URGENT: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <rect x="2" y="14" width="4" height="8" rx="1" />
      <rect x="9" y="9" width="4" height="13" rx="1" />
      <rect x="16" y="4" width="4" height="18" rx="1" />
      <circle cx="20" cy="1.5" r="2" />
    </svg>
  ),
  HIGH: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <rect x="2" y="14" width="4" height="8" rx="1" />
      <rect x="9" y="9" width="4" height="13" rx="1" />
      <rect x="16" y="4" width="4" height="18" rx="1" opacity="0.3" />
    </svg>
  ),
  MEDIUM: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <rect x="2" y="14" width="4" height="8" rx="1" />
      <rect x="9" y="9" width="4" height="13" rx="1" opacity="0.3" />
      <rect x="16" y="4" width="4" height="18" rx="1" opacity="0.3" />
    </svg>
  ),
  LOW: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <rect x="2" y="14" width="4" height="8" rx="1" />
      <rect x="9" y="9" width="4" height="13" rx="1" opacity="0.3" />
      <rect x="16" y="4" width="4" height="18" rx="1" opacity="0.3" />
    </svg>
  ),
};

const PRIORITIES: Priority[] = ["NO_PRIORITY", "URGENT", "HIGH", "MEDIUM", "LOW"];

export default function PriorityBadge({ priority, onChange, readOnly }: PriorityBadgeProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const color = PRIORITY_COLORS[priority];

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-flex" }}>
      <button
        onClick={() => !readOnly && setOpen(!open)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          padding: "3px 8px",
          borderRadius: 6,
          border: "1px solid transparent",
          background: "transparent",
          color,
          fontSize: 12,
          fontWeight: 500,
          cursor: readOnly ? "default" : "pointer",
          fontFamily: "inherit",
          transition: "background 150ms",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => {
          if (!readOnly) e.currentTarget.style.background = "var(--bg-hover)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
      >
        <span style={{ color }}>{PRIORITY_ICONS[priority]}</span>
        {PRIORITY_LABELS[priority]}
        {!readOnly && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        )}
      </button>

      {open && onChange && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 30 }} onClick={() => setOpen(false)} />
          <div
            className="dropdown-menu"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              zIndex: 40,
              minWidth: 160,
              padding: 4,
            }}
          >
            <div style={{ padding: "6px 10px 4px", fontSize: 11, fontWeight: 600, color: "var(--text-subtle)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Priority
            </div>
            {PRIORITIES.map((p) => (
              <div
                key={p}
                id={`priority-option-${p.toLowerCase()}`}
                className={`dropdown-item ${priority === p ? "active" : ""}`}
                style={{ color: PRIORITY_COLORS[p] }}
                onClick={() => {
                  onChange(p);
                  setOpen(false);
                }}
              >
                {PRIORITY_ICONS[p]}
                <span style={{ color: "var(--text-primary)" }}>{PRIORITY_LABELS[p]}</span>
                {priority === p && (
                  <svg style={{ marginLeft: "auto" }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
