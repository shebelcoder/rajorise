"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, AlertCircle, CheckCircle } from "lucide-react";
import { REGIONS, getDistricts } from "@/lib/locations";
import ImageUpload from "@/components/ImageUpload";
import VillageSelector from "@/components/VillageSelector";

interface Field {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "url" | "region" | "district" | "village" | "boolean" | "image";
}

interface CreateFormProps {
  entityType: string;
  fields: Field[];
  backUrl: string;
  title: string;
  subtitle: string;
}

export default function AdminCreateForm({ entityType, fields, backUrl, title, subtitle }: CreateFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<Record<string, string | boolean>>({ region: "Gedo" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const region = (form.region as string) || "Gedo";
  const district = (form.district as string) || "";
  const districts = getDistricts(region);
  // Villages loaded dynamically by VillageSelector

  const set = (key: string, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }));

  const save = async () => {
    setSaving(true); setError(""); setSuccess("");
    try {
      const res = await fetch(`/api/admin/${entityType}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess("Created and published!");
        setTimeout(() => router.push(backUrl), 1000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed.");
      }
    } catch { setError("Network error."); } finally { setSaving(false); }
  };

  const inputStyle = { width: "100%", padding: "10px 14px", backgroundColor: "#0d1117", border: "1px solid #21262d", borderRadius: 8, color: "#e6edf3", fontSize: 13, outline: "none" };
  const labelStyle = { display: "block" as const, fontSize: 12, fontWeight: 600 as const, color: "#8b949e", marginBottom: 6 };

  return (
    <div style={{ padding: "32px 40px", maxWidth: 900 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "#e6edf3", marginBottom: 4 }}>{title}</h1>
      <p style={{ color: "#8b949e", fontSize: 13, marginBottom: 24 }}>{subtitle}</p>

      <div style={{ backgroundColor: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: "28px 32px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {fields.map((f) => {
            if (f.type === "image") {
              return <ImageUpload key={f.key} value={(form[f.key] as string) || ""} onChange={(url) => set(f.key, url)} label={f.label} />;
            }
            if (f.type === "textarea") {
              return <div key={f.key}><label style={labelStyle}>{f.label}</label><textarea value={(form[f.key] as string) || ""} onChange={(e) => set(f.key, e.target.value)} rows={8} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }} /></div>;
            }
            if (f.type === "region") {
              return <div key={f.key}><label style={labelStyle}>{f.label}</label><select value={region} onChange={(e) => { set("region", e.target.value); set("district", ""); set("village", ""); }} style={inputStyle}>{REGIONS.filter(r => r.active).map(r => <option key={r.name} value={r.name}>{r.name}</option>)}</select></div>;
            }
            if (f.type === "district") {
              return <div key={f.key}><label style={labelStyle}>{f.label}</label><select value={district} onChange={(e) => { set("district", e.target.value); set("village", ""); }} style={inputStyle}><option value="">Select</option>{districts.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}</select></div>;
            }
            if (f.type === "village") {
              return <div key={f.key}><label style={labelStyle}>{f.label}</label><VillageSelector region={region} district={district} value={(form.village as string) || ""} onChange={(v) => set("village", v)} /></div>;
            }
            if (f.type === "boolean") {
              return <div key={f.key} style={{ display: "flex", alignItems: "center", gap: 10 }}><input type="checkbox" checked={form[f.key] === true} onChange={(e) => set(f.key, e.target.checked)} /><label style={{ fontSize: 13, color: "#8b949e" }}>{f.label}</label></div>;
            }
            return <div key={f.key}><label style={labelStyle}>{f.label}</label><input type={f.type === "number" ? "number" : "text"} value={(form[f.key] as string) || ""} onChange={(e) => set(f.key, e.target.value)} style={inputStyle} /></div>;
          })}

          {error && <div style={{ display: "flex", alignItems: "center", gap: 8, backgroundColor: "#2c0f0f", border: "1px solid #da3633", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#f85149" }}><AlertCircle size={14} /> {error}</div>}
          {success && <div style={{ display: "flex", alignItems: "center", gap: 8, backgroundColor: "#0f2c1a", border: "1px solid #238636", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#3fb950" }}><CheckCircle size={14} /> {success}</div>}

          <button onClick={save} disabled={saving} style={{
            display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 8,
            fontSize: 14, fontWeight: 700, backgroundColor: "#f59e0b", color: "#000",
            border: "none", cursor: saving ? "wait" : "pointer", opacity: saving ? 0.6 : 1, width: "fit-content",
          }}>
            <Save size={16} /> {saving ? "Creating..." : "Create & Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
