"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Check } from "lucide-react";
import { REGIONS, getDistricts } from "@/lib/locations";

interface VillageItem {
  id: string;
  name: string;
  district: string;
  region: string;
  addedById: string | null;
  createdAt: string;
}

export default function VillagesManager({ villages }: { villages: VillageItem[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newRegion, setNewRegion] = useState("Gedo");
  const [newDistrict, setNewDistrict] = useState("");
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState("");

  const activeRegions = REGIONS.filter((r) => r.active);
  const districts = getDistricts(newRegion);
  const filtered = filter ? villages.filter((v) => v.district === filter) : villages;

  // Group by district
  const byDistrict: Record<string, VillageItem[]> = {};
  for (const v of filtered) {
    const key = `${v.district}, ${v.region}`;
    if (!byDistrict[key]) byDistrict[key] = [];
    byDistrict[key].push(v);
  }

  const deleteVillage = async (id: string, name: string) => {
    if (!confirm(`Delete village "${name}"?`)) return;
    await fetch(`/api/villages/${id}`, { method: "DELETE" });
    router.refresh();
  };

  const addVillage = async () => {
    if (!newName.trim() || !newDistrict) return;
    setAdding(true); setMsg("");
    try {
      const res = await fetch("/api/villages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), district: newDistrict, region: newRegion }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg(`Added "${data.name}"`);
        setNewName("");
        router.refresh();
      }
    } catch {} finally { setAdding(false); }
  };

  const allDistricts = [...new Set(villages.map((v) => v.district))].sort();
  const inputStyle = { padding: "8px 12px", backgroundColor: "#0d1117", border: "1px solid #21262d", borderRadius: 6, color: "#e6edf3", fontSize: 12, outline: "none" };

  return (
    <>
      {/* Add new village */}
      <div style={{ backgroundColor: "#161b22", border: "1px solid #21262d", borderRadius: 10, padding: 20, marginBottom: 20 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: "#e6edf3", marginBottom: 12 }}>Add New Village / Town</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr auto", gap: 8, alignItems: "end" }}>
          <div>
            <label style={{ fontSize: 10, color: "#6b7280", display: "block", marginBottom: 4 }}>Region</label>
            <select value={newRegion} onChange={(e) => { setNewRegion(e.target.value); setNewDistrict(""); }} style={{ ...inputStyle, width: "100%" }}>
              {activeRegions.map((r) => <option key={r.name} value={r.name}>{r.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 10, color: "#6b7280", display: "block", marginBottom: 4 }}>District</label>
            <select value={newDistrict} onChange={(e) => setNewDistrict(e.target.value)} style={{ ...inputStyle, width: "100%" }}>
              <option value="">Select</option>
              {districts.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 10, color: "#6b7280", display: "block", marginBottom: 4 }}>Village / Town Name</label>
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Enter name..." onKeyDown={(e) => e.key === "Enter" && addVillage()} style={{ ...inputStyle, width: "100%" }} />
          </div>
          <button onClick={addVillage} disabled={adding || !newName.trim() || !newDistrict} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 6,
            fontSize: 12, fontWeight: 700, backgroundColor: "#22c55e", color: "#fff", border: "none",
            cursor: "pointer", opacity: adding || !newName.trim() ? 0.5 : 1,
          }}>
            <Plus size={14} /> Add
          </button>
        </div>
        {msg && <p style={{ fontSize: 12, color: "#22c55e", marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}><Check size={14} /> {msg}</p>}
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        <button onClick={() => setFilter("")} style={{
          padding: "6px 14px", borderRadius: 6, fontSize: 11, fontWeight: 600, border: "1px solid",
          cursor: "pointer", borderColor: !filter ? "#22c55e" : "#1c2333",
          backgroundColor: !filter ? "#0f2c1a" : "#111827", color: !filter ? "#22c55e" : "#6b7280",
        }}>All ({villages.length})</button>
        {allDistricts.map((d) => (
          <button key={d} onClick={() => setFilter(d)} style={{
            padding: "6px 14px", borderRadius: 6, fontSize: 11, fontWeight: 600, border: "1px solid",
            cursor: "pointer", borderColor: filter === d ? "#22c55e" : "#1c2333",
            backgroundColor: filter === d ? "#0f2c1a" : "#111827", color: filter === d ? "#22c55e" : "#6b7280",
          }}>{d} ({villages.filter((v) => v.district === d).length})</button>
        ))}
      </div>

      {/* Villages list */}
      <div style={{ backgroundColor: "#111827", border: "1px solid #1c2333", borderRadius: 10, overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <p style={{ padding: "48px 20px", textAlign: "center", color: "#6b7280", fontSize: 13 }}>No user-added villages yet</p>
        ) : (
          Object.entries(byDistrict).map(([districtKey, vills]) => (
            <div key={districtKey}>
              <div style={{ padding: "10px 20px", backgroundColor: "#0d1117", borderBottom: "1px solid #1c2333" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#22c55e" }}>{districtKey}</span>
                <span style={{ fontSize: 11, color: "#6b7280", marginLeft: 8 }}>({vills.length} villages)</span>
              </div>
              {vills.map((v, i) => (
                <div key={v.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px", borderBottom: i < vills.length - 1 ? "1px solid #1c2333" : "none" }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#e6edf3" }}>{v.name}</span>
                    <span style={{ fontSize: 11, color: "#6b7280", marginLeft: 12 }}>{new Date(v.createdAt).toLocaleDateString()}</span>
                  </div>
                  <button onClick={() => deleteVillage(v.id, v.name)} style={{
                    display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 4,
                    fontSize: 10, fontWeight: 600, backgroundColor: "#1a0a0a", color: "#ef4444",
                    border: "1px solid #3d1212", cursor: "pointer",
                  }}>
                    <Trash2 size={11} /> Delete
                  </button>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </>
  );
}
