"use client";

import { useState, useEffect } from "react";
import { Plus, Check } from "lucide-react";

interface VillageSelectorProps {
  region: string;
  district: string;
  value: string;
  onChange: (village: string) => void;
  inputStyle?: React.CSSProperties;
}

export default function VillageSelector({ region, district, value, onChange, inputStyle = {} }: VillageSelectorProps) {
  const [villages, setVillages] = useState<{ id: string | null; name: string }[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState("");

  const defaultStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px", backgroundColor: "#0d1117",
    border: "1px solid #21262d", borderRadius: 8, color: "#e6edf3",
    fontSize: 13, outline: "none",
  };
  const style = { ...defaultStyle, ...inputStyle };

  // Fetch villages when district changes
  useEffect(() => {
    if (!district) { setVillages([]); return; }
    fetch(`/api/villages?district=${encodeURIComponent(district)}&region=${encodeURIComponent(region)}`)
      .then((r) => r.json())
      .then(setVillages)
      .catch(() => setVillages([]));
  }, [district, region]);

  const addVillage = async () => {
    if (!newName.trim() || !district) return;
    setAdding(true);
    try {
      const res = await fetch("/api/villages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), district, region }),
      });
      const data = await res.json();
      if (data.name) {
        setVillages((prev) => [...prev, { id: data.id, name: data.name }].sort((a, b) => a.name.localeCompare(b.name)));
        onChange(data.name);
        setNewName("");
        setShowAdd(false);
        setAdded(data.name);
        setTimeout(() => setAdded(""), 2000);
      }
    } catch {}
    finally { setAdding(false); }
  };

  if (!district) {
    return <input disabled placeholder="Select a district first" style={{ ...style, opacity: 0.5 }} />;
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 6 }}>
        <select value={value} onChange={(e) => onChange(e.target.value)} style={{ ...style, flex: 1 }}>
          <option value="">Select village/town</option>
          {villages.map((v) => (
            <option key={v.name} value={v.name}>{v.name}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setShowAdd(!showAdd)}
          style={{
            padding: "0 12px", borderRadius: 8, border: "1px solid #21262d",
            backgroundColor: showAdd ? "#22c55e" : "#161b22",
            color: showAdd ? "#fff" : "#8b949e",
            cursor: "pointer", fontSize: 12, fontWeight: 600,
            display: "flex", alignItems: "center", gap: 4,
          }}
        >
          <Plus size={14} /> Add
        </button>
      </div>

      {showAdd && (
        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New village/town name..."
            onKeyDown={(e) => e.key === "Enter" && addVillage()}
            style={{ ...style, flex: 1 }}
          />
          <button
            type="button"
            onClick={addVillage}
            disabled={adding || !newName.trim()}
            style={{
              padding: "0 16px", borderRadius: 8, border: "none",
              backgroundColor: "#22c55e", color: "#fff",
              cursor: adding ? "wait" : "pointer", fontSize: 12, fontWeight: 700,
              opacity: adding || !newName.trim() ? 0.5 : 1,
            }}
          >
            {adding ? "..." : "Save"}
          </button>
        </div>
      )}

      {added && (
        <p style={{ fontSize: 11, color: "#22c55e", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
          <Check size={12} /> Added "{added}"
        </p>
      )}
    </div>
  );
}
