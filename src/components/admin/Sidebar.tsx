"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  Camera,
  DollarSign,
  Globe,
  Brain,
  Settings,
  LogOut,
  Shield,
  GraduationCap,
  Home,
  BookOpen,
} from "lucide-react";

const NAV = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Cases", href: "/admin/cases", icon: FolderOpen },
  { label: "Students", href: "/admin/students", icon: GraduationCap },
  { label: "Families", href: "/admin/families", icon: Home },
  { label: "Stories", href: "/admin/stories", icon: BookOpen },
  { label: "Villages", href: "/admin/villages", icon: Globe },
  { label: "Journalists", href: "/admin/journalists", icon: Camera },
  { label: "Finance", href: "/admin/finance", icon: DollarSign },
  { label: "Operations", href: "/admin/operations", icon: Globe },
  { label: "AI Intelligence", href: "/admin/ai", icon: Brain, accent: true },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      position: "fixed", top: 0, left: 0, width: 260, height: "100vh",
      backgroundColor: "#0f1218", borderRight: "1px solid #1c2333",
      display: "flex", flexDirection: "column", zIndex: 40,
    }}>
      {/* Logo */}
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #1c2333" }}>
        <Link href="/admin/dashboard" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <Image src="/logo.png" alt="RajoRise" width={28} height={28} style={{ borderRadius: 6 }} />
          <div>
            <span style={{ fontWeight: 800, fontSize: 16, color: "#e6edf3" }}>
              Rajo<span style={{ color: "#f59e0b" }}>Rise</span>
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: "#f59e0b", fontWeight: 700, letterSpacing: 1, marginTop: 1 }}>
              <Shield size={9} /> COMMAND CENTER
            </span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ padding: "16px 12px", flex: 1, overflowY: "auto" }}>
        {NAV.map(({ label, href, icon: Icon, accent }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 14px", borderRadius: 8, marginBottom: 2,
                textDecoration: "none", fontSize: 13,
                fontWeight: isActive ? 700 : 500,
                color: accent ? "#f59e0b" : isActive ? "#e6edf3" : "#6b7280",
                backgroundColor: isActive ? "#1a2332" : "transparent",
                borderLeft: isActive ? "3px solid #f59e0b" : "3px solid transparent",
                transition: "all 0.15s",
              }}
            >
              <Icon size={16} style={{ color: accent ? "#f59e0b" : isActive ? "#f59e0b" : "#6b7280" }} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "12px", borderTop: "1px solid #1c2333" }}>
        <div style={{ padding: "8px 14px", marginBottom: 4 }}>
          <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>Logged in as</p>
          <p style={{ fontSize: 12, color: "#e6edf3", fontWeight: 600, margin: 0 }}>Admin</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/portal/admin-login" })}
          style={{
            display: "flex", alignItems: "center", gap: 10, width: "100%",
            padding: "8px 14px", borderRadius: 8, border: "none",
            backgroundColor: "transparent", cursor: "pointer",
            fontSize: 12, color: "#ef4444", textAlign: "left",
          }}
        >
          <LogOut size={14} /> Logout
        </button>
      </div>
    </aside>
  );
}
