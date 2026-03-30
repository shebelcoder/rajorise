"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FolderOpen,
  Plus,
  FileEdit,
  Send,
  CheckCircle,
  XCircle,
  User,
  LogOut,
  GraduationCap,
  Users,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/journalist/dashboard", icon: LayoutDashboard },
  { label: "My Cases", href: "/journalist/cases", icon: FolderOpen },
  { label: "Create Case", href: "/journalist/cases/new", icon: Plus, accent: true },
  { label: "Add Student", href: "/journalist/students/new", icon: GraduationCap, accent: true },
  { label: "Add Family", href: "/journalist/families/new", icon: Users, accent: true },
];

const FILTER_ITEMS = [
  { label: "Drafts", href: "/journalist/cases?status=DRAFT", icon: FileEdit, color: "#9ca3af" },
  { label: "Submitted", href: "/journalist/cases?status=PENDING", icon: Send, color: "#eab308" },
  { label: "Approved", href: "/journalist/cases?status=APPROVED", icon: CheckCircle, color: "#22c55e" },
  { label: "Rejected", href: "/journalist/cases?status=REJECTED", icon: XCircle, color: "#ef4444" },
];

export default function JournalistSidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 240,
        height: "100vh",
        backgroundColor: "#161b22",
        borderRight: "1px solid #21262d",
        display: "flex",
        flexDirection: "column",
        zIndex: 40,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #21262d" }}>
        <Link href="/journalist/dashboard" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <Image src="/logo.png" alt="RajoRise" width={28} height={28} style={{ borderRadius: 6 }} />
          <div>
            <span style={{ fontWeight: 800, fontSize: 16, color: "#e6edf3" }}>
              Rajo<span style={{ color: "#22c55e" }}>Rise</span>
            </span>
            <span style={{ display: "block", fontSize: 10, color: "#8b949e", fontWeight: 500, letterSpacing: 0.5 }}>
              JOURNALIST STUDIO
            </span>
          </div>
        </Link>
      </div>

      {/* Main nav */}
      <nav style={{ padding: "16px 12px", flex: 1, overflowY: "auto" }}>
        <div style={{ marginBottom: 24 }}>
          {NAV_ITEMS.map(({ label, href, icon: Icon, accent }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 8,
                  marginBottom: 2,
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 500,
                  color: accent ? "#22c55e" : isActive ? "#e6edf3" : "#8b949e",
                  backgroundColor: isActive ? "#1f2937" : accent ? "rgba(34,197,94,0.08)" : "transparent",
                  transition: "background 0.15s",
                  border: accent ? "1px solid rgba(34,197,94,0.2)" : "1px solid transparent",
                }}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </div>

        {/* Filter shortcuts */}
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#484f58", textTransform: "uppercase", letterSpacing: 1, padding: "0 12px", marginBottom: 8 }}>
            Quick Filters
          </p>
          {FILTER_ITEMS.map(({ label, href, icon: Icon, color }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 12px",
                borderRadius: 8,
                textDecoration: "none",
                fontSize: 12,
                fontWeight: 500,
                color: "#8b949e",
                transition: "background 0.15s",
              }}
            >
              <Icon size={14} style={{ color }} />
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Bottom */}
      <div style={{ padding: "12px", borderTop: "1px solid #21262d" }}>
        <Link
          href="/journalist/dashboard"
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "8px 12px", borderRadius: 8, textDecoration: "none",
            fontSize: 12, color: "#8b949e",
          }}
        >
          <User size={14} />
          Profile
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/portal/journalist-login" })}
          style={{
            display: "flex", alignItems: "center", gap: 10, width: "100%",
            padding: "8px 12px", borderRadius: 8, border: "none",
            backgroundColor: "transparent", cursor: "pointer",
            fontSize: 12, color: "#8b949e", textAlign: "left",
          }}
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </aside>
  );
}
