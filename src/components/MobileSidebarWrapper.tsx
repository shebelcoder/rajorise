"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function MobileSidebarWrapper({
  children,
  sidebarWidth = 240,
}: {
  children: React.ReactNode;
  sidebarWidth?: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          top: 12,
          left: 12,
          zIndex: 60,
          width: 40,
          height: 40,
          borderRadius: 10,
          backgroundColor: "#161b22",
          border: "1px solid #21262d",
          color: "#e6edf3",
          display: "none",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
        className="mobile-sidebar-toggle"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 39,
          }}
          className="mobile-sidebar-overlay"
        />
      )}

      {/* Sidebar container */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: sidebarWidth,
          height: "100vh",
          zIndex: 45,
          transform: open ? "translateX(0)" : undefined,
          transition: "transform 0.2s ease",
        }}
        className={`sidebar-container ${open ? "sidebar-open" : ""}`}
      >
        {children}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-sidebar-toggle { display: flex !important; }
          .sidebar-container { transform: translateX(-100%); }
          .sidebar-container.sidebar-open { transform: translateX(0) !important; }
        }
      `}</style>
    </>
  );
}
