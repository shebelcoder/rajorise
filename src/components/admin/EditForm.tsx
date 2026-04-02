"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { REGIONS, getDistricts } from "@/lib/locations";
import VillageSelector from "@/components/VillageSelector";
import ImageUpload from "@/components/ImageUpload";

interface Field {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "select" | "region" | "district" | "village" | "url" | "image" | "boolean";
  options?: { value: string; label: string }[];
  required?: boolean;
}

interface EditFormProps {
  entityType: "cases" | "students" | "families";
  entityId: string;
  fields: Field[];
  backUrl: string;
  title: string;
}

export default function AdminEditForm({ entityType, entityId, fields, backUrl, title }: EditFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<Record<string, string | boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const activeRegions = REGIONS.filter((r) => r.active);
  const region = (form.region as string) || "Gedo";
  const district = (form.district as string) || "";
  const districts = getDistricts(region);
  // Villages loaded dynamically by VillageSelector

  useEffect(() => {
    fetch(`/api/admin/${entityType}/${entityId}`)
      .then((r) => r.json())
      .then((data) => {
        const mapped: Record<string, string | boolean> = {};
        fields.forEach((f) => {
          const val = data[f.key];
          mapped[f.key] = val !== null && val !== undefined ? (typeof val === "boolean" ? val : String(val)) : "";
        });
        setForm(mapped);
        setLoading(false);
      })
      .catch(() => { setError("Failed to load data."); setLoading(false); });
  }, [entityType, entityId, fields]);

  const set = (key: string, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }));

  const save = async () => {
    setSaving(true); setError(""); setSuccess("");
    try {
      const res = await fetch(`/api/admin/${entityType}/${entityId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess("Saved!");
        setTimeout(() => router.push(backUrl), 1000);
      } else {
        const data = await res.json();
        setError(data.error || "Save failed.");
      }
    } catch { setError("Network error."); } finally { setSaving(false); }
  };

  const inputStyle = { width: "100%", padding: "10px 14px", backgroundColor: "#0d1117", border: "1px solid #21262d", borderRadius: 8, color: "#e6edf3", fontSize: 13, outline: "none" };
  const labelStyle = { display: "block" as const, fontSize: 12, fontWeight: 600 as const, color: "#8b949e", marginBottom: 6 };

  if (loading) return <div style={{ padding: "64px 40px", textAlign: "center", color: "#6b7280" }}>Loading...</div>;

  return (
    <div style={{ padding: "32px 40px", maxWidth: 900 }}>
      <button onClick={() => router.push(backUrl)} style={{ display: "flex", alignItems: "center", gap: 6, color: "#6b7280", fontSize: 13, background: "none", border: "none", cursor: "pointer", marginBottom: 16 }}>
        <ArrowLeft size={14} /> Back
      </button>

      <h1 style={{ fontSize: 22, fontWeight: 800, color: "#e6edf3", marginBottom: 24 }}>{title}</h1>

      <div style={{ backgroundColor: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: "28px 32px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {fields.map((f) => {
            if (f.type === "textarea") {
              return (
                <div key={f.key}>
                  <label style={labelStyle}>{f.label}</label>
                  <textarea value={form[f.key] as string || ""} onChange={(e) => set(f.key, e.target.value)} rows={8} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }} />
                </div>
              );
            }
            if (f.type === "select" && f.options) {
              return (
                <div key={f.key}>
                  <label style={labelStyle}>{f.label}</label>
                  <select value={form[f.key] as string || ""} onChange={(e) => set(f.key, e.target.value)} style={inputStyle}>
                    {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              );
            }
            if (f.type === "region") {
              return (
                <div key={f.key}>
                  <label style={labelStyle}>{f.label}</label>
                  <select value={form[f.key] as string || ""} onChange={(e) => { set(f.key, e.target.value); set("district", ""); set("village", ""); }} style={inputStyle}>
                    {activeRegions.map((r) => <option key={r.name} value={r.name}>{r.name}</option>)}
                  </select>
                </div>
              );
            }
            if (f.type === "district") {
              return (
                <div key={f.key}>
                  <label style={labelStyle}>{f.label}</label>
                  <select value={form[f.key] as string || ""} onChange={(e) => { set(f.key, e.target.value); set("village", ""); }} style={inputStyle}>
                    <option value="">Select</option>
                    {districts.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
              );
            }
            if (f.type === "village") {
              return (
                <div key={f.key}>
                  <label style={labelStyle}>{f.label}</label>
                  <VillageSelector region={region} district={district} value={(form[f.key] as string) || ""} onChange={(v) => set(f.key, v)} />
                </div>
              );
            }
            if (f.type === "boolean") {
              return (
                <div key={f.key} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input type="checkbox" checked={form[f.key] === true || form[f.key] === "true"} onChange={(e) => set(f.key, e.target.checked)} style={{ width: 16, height: 16 }} />
                  <label style={{ fontSize: 13, color: "#8b949e" }}>{f.label}</label>
                </div>
              );
            }
            if (f.type === "url" || f.type === "image") {
              return (
                <div key={f.key}>
                  <ImageUpload value={(form[f.key] as string) || ""} onChange={(v) => set(f.key, v)} label={f.label} />
                </div>
              );
            }
            return (
              <div key={f.key}>
                <label style={labelStyle}>{f.label}</label>
                <input type={f.type === "number" ? "number" : "text"} value={form[f.key] as string || ""} onChange={(e) => set(f.key, e.target.value)} style={inputStyle} />
              </div>
            );
          })}

          {error && <div style={{ display: "flex", alignItems: "center", gap: 8, backgroundColor: "#2c0f0f", border: "1px solid #da3633", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#f85149" }}><AlertCircle size={14} /> {error}</div>}
          {success && <div style={{ display: "flex", alignItems: "center", gap: 8, backgroundColor: "#0f2c1a", border: "1px solid #238636", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#3fb950" }}><CheckCircle size={14} /> {success}</div>}

          <button onClick={save} disabled={saving} style={{
            display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 8,
            fontSize: 14, fontWeight: 700, backgroundColor: "#f59e0b", color: "#000",
            border: "none", cursor: saving ? "wait" : "pointer", opacity: saving ? 0.6 : 1, width: "fit-content",
          }}>
            <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
