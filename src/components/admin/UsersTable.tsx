"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Camera, Heart, Truck, UserPlus } from "lucide-react";

interface UserItem {
  id: string;
  email: string;
  name: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  donationCount: number;
  activityCount: number;
}

const ROLE_ICONS: Record<string, { icon: typeof Shield; color: string }> = {
  ADMIN: { icon: Shield, color: "#f59e0b" },
  JOURNALIST: { icon: Camera, color: "#58a6ff" },
  DONOR: { icon: Heart, color: "#22c55e" },
  PROCUREMENT_OFFICER: { icon: Truck, color: "#a78bfa" },
  FIELD_AGENT: { icon: Truck, color: "#39d2f0" },
};

export default function UsersTable({ users }: { users: UserItem[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "DONOR" });
  const [msg, setMsg] = useState("");

  const filtered = filter ? users.filter((u) => u.role === filter) : users;

  const toggleActive = async (userId: string, active: boolean) => {
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: active }),
    });
    router.refresh();
  };

  const changeRole = async (userId: string, role: string) => {
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    router.refresh();
  };

  const createUser = async () => {
    setCreating(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("User created!");
        setNewUser({ name: "", email: "", password: "", role: "DONOR" });
        setShowCreate(false);
        router.refresh();
      } else {
        setMsg(data.error || "Failed");
      }
    } catch {
      setMsg("Network error");
    } finally {
      setCreating(false);
    }
  };

  const inputStyle = { width: "100%", padding: "8px 12px", backgroundColor: "#0d1117", border: "1px solid #21262d", borderRadius: 6, color: "#e6edf3", fontSize: 12, outline: "none" };

  return (
    <>
      {/* Filters + Create */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {[null, "ADMIN", "JOURNALIST", "DONOR"].map((r) => (
          <button key={r || "all"} onClick={() => setFilter(r)}
            style={{
              padding: "6px 14px", borderRadius: 6, fontSize: 11, fontWeight: 600,
              border: "1px solid", cursor: "pointer",
              borderColor: filter === r ? "#f59e0b" : "#1c2333",
              backgroundColor: filter === r ? "#2b1d0a" : "#111827",
              color: filter === r ? "#f59e0b" : "#6b7280",
            }}
          >
            {r || "All"} {r ? `(${users.filter((u) => u.role === r).length})` : `(${users.length})`}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={() => setShowCreate(!showCreate)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 14px", borderRadius: 6, fontSize: 11, fontWeight: 700,
            backgroundColor: "#f59e0b", color: "#000", border: "none", cursor: "pointer",
          }}
        >
          <UserPlus size={13} /> Create User
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div style={{ backgroundColor: "#111827", border: "1px solid #1c2333", borderRadius: 10, padding: 20, marginBottom: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 120px", gap: 10, alignItems: "end" }}>
            <div>
              <label style={{ fontSize: 10, color: "#6b7280", display: "block", marginBottom: 4 }}>Name</label>
              <input value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} style={inputStyle} placeholder="Full name" />
            </div>
            <div>
              <label style={{ fontSize: 10, color: "#6b7280", display: "block", marginBottom: 4 }}>Email</label>
              <input value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} style={inputStyle} placeholder="email@example.com" />
            </div>
            <div>
              <label style={{ fontSize: 10, color: "#6b7280", display: "block", marginBottom: 4 }}>Password</label>
              <input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} style={inputStyle} placeholder="Min 8 chars" />
            </div>
            <div>
              <label style={{ fontSize: 10, color: "#6b7280", display: "block", marginBottom: 4 }}>Role</label>
              <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} style={inputStyle}>
                <option value="DONOR">Donor</option>
                <option value="JOURNALIST">Journalist</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 12, alignItems: "center" }}>
            <button onClick={createUser} disabled={creating} style={{ padding: "8px 16px", borderRadius: 6, fontSize: 12, fontWeight: 700, backgroundColor: "#22c55e", color: "#fff", border: "none", cursor: "pointer" }}>
              {creating ? "Creating..." : "Create"}
            </button>
            {msg && <span style={{ fontSize: 12, color: msg.includes("created") ? "#22c55e" : "#ef4444" }}>{msg}</span>}
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ backgroundColor: "#111827", border: "1px solid #1c2333", borderRadius: 10, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1c2333" }}>
              {["User", "Role", "Status", "Donations", "Joined", "Actions"].map((h) => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => {
              const ri = ROLE_ICONS[u.role] || ROLE_ICONS.DONOR;
              const RIcon = ri.icon;
              return (
                <tr key={u.id} style={{ borderBottom: "1px solid #1c2333" }}>
                  <td style={{ padding: "10px 16px" }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#e6edf3", margin: 0 }}>{u.name || "—"}</p>
                    <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>{u.email}</p>
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <select
                      value={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                      style={{ backgroundColor: "#0d1117", border: "1px solid #21262d", borderRadius: 4, color: ri.color, fontSize: 11, fontWeight: 700, padding: "2px 6px" }}
                    >
                      {["DONOR", "JOURNALIST", "ADMIN", "PROCUREMENT_OFFICER", "FIELD_AGENT"].map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99,
                      backgroundColor: u.isActive ? "#0f2c1a" : "#2c0f0f",
                      color: u.isActive ? "#22c55e" : "#ef4444",
                    }}>
                      {u.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td style={{ padding: "10px 16px", fontSize: 12, color: "#6b7280" }}>{u.donationCount}</td>
                  <td style={{ padding: "10px 16px", fontSize: 11, color: "#6b7280" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: "10px 16px" }}>
                    <button
                      onClick={() => toggleActive(u.id, !u.isActive)}
                      style={{
                        padding: "4px 10px", borderRadius: 4, fontSize: 10, fontWeight: 600,
                        border: "1px solid #21262d", cursor: "pointer",
                        backgroundColor: u.isActive ? "#2c0f0f" : "#0f2c1a",
                        color: u.isActive ? "#ef4444" : "#22c55e",
                      }}
                    >
                      {u.isActive ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
