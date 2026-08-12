"use client";

import { useState, useRef, useEffect } from "react";
import { VisibleField } from "@/app/(app)/tasks/page";

interface FieldsDropdownProps {
  visibleFields: Set<VisibleField>;
  onToggle: (field: VisibleField) => void;
}

const FIELDS: { key: VisibleField; label: string; icon: React.ReactNode }[] = [
  {
    key: "priority",
    label: "Priority",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <rect x="2" y="14" width="4" height="8" rx="1" />
        <rect x="9" y="9" width="4" height="13" rx="1" />
        <rect x="16" y="4" width="4" height="18" rx="1" />
      </svg>
    ),
  },
  {
    key: "members",
    label: "Members",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    key: "dueDate",
    label: "Due Date",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    key: "labels",
    label: "Labels",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
  },
  {
    key: "status",
    label: "Status",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
];

export default function FieldsDropdown({ visibleFields, onToggle }: FieldsDropdownProps) {
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

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        id="fields-dropdown-btn"
        onClick={() => setOpen(!open)}
        className="btn btn-secondary btn-sm"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
        Fields
        {visibleFields.size > 0 && (
          <span style={{ background: "var(--accent)", color: "white", fontSize: 10, fontWeight: 700, padding: "0 5px", borderRadius: 10 }}>
            {visibleFields.size}
          </span>
        )}
      </button>

      {open && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 30 }} onClick={() => setOpen(false)} />
          <div
            className="dropdown-menu"
            style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", zIndex: 40, minWidth: 180, padding: 4 }}
          >
            <div style={{ padding: "6px 10px 4px", fontSize: 11, fontWeight: 600, color: "var(--text-subtle)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Toggle Columns
            </div>
            {FIELDS.map(({ key, label, icon }) => (
              <div
                key={key}
                id={`field-toggle-${key}`}
                className="dropdown-item"
                onClick={() => onToggle(key)}
              >
                <span style={{ color: "var(--text-muted)" }}>{icon}</span>
                <span style={{ flex: 1 }}>{label}</span>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    border: `2px solid ${visibleFields.has(key) ? "var(--accent)" : "var(--border-strong)"}`,
                    background: visibleFields.has(key) ? "var(--accent)" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 150ms",
                    flexShrink: 0,
                  }}
                >
                  {visibleFields.has(key) && (
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
