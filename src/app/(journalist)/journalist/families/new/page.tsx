"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Send, AlertCircle, CheckCircle, Users } from "lucide-react";
import { REGIONS, getDistricts, getVillages } from "@/lib/locations";
import ImageUpload from "@/components/ImageUpload";

export default function NewFamilyPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", members: "", situation: "", need: "", region: "Gedo", district: "", village: "", story: "", imageUrl: "", phoneContact: "", goalAmount: "" });
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const activeRegions = REGIONS.filter((r) => r.active);
  const districts = getDistricts(form.region);
  const villages = getVillages(form.region, form.district);
  const canSubmit = form.name.length >= 2 && form.story.length >= 20 && form.district;

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async (submit: boolean) => {
    setError(""); setSuccess("");
    const setter = submit ? setSubmitting : setSaving;
    setter(true);
    try {
      const res = await fetch("/api/journalist/families", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, members: form.members ? parseInt(form.members) : undefined, submitForReview: submit }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(submit ? "Submitted for review!" : "Draft saved!");
        if (submit) setTimeout(() => router.push("/journalist/dashboard"), 1500);
      } else setError(data.error || "Failed.");
    } catch { setError("Network error."); } finally { setter(false); }
  };

  const inputStyle = { width: "100%", padding: "10px 14px", backgroundColor: "#0d1117", border: "1px solid #21262d", borderRadius: 8, color: "#e6edf3", fontSize: 13, outline: "none" };
  const labelStyle = { display: "block" as const, fontSize: 12, fontWeight: 600 as const, color: "#8b949e", marginBottom: 6 };

  return (
    <div style={{ padding: "32px 40px", maxWidth: 900 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <Users size={22} style={{ color: "#ea580c" }} />
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#e6edf3", margin: 0 }}>Add Family</h1>
          <p style={{ color: "#8b949e", fontSize: 13, marginTop: 2 }}>Document a family that needs support</p>
        </div>
      </div>

      <div style={{ backgroundColor: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: "28px 32px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
            <div><label style={labelStyle}>Family Name *</label><input value={form.name} onChange={set("name")} placeholder="e.g. Al-Hassan Family" style={inputStyle} /></div>
            <div><label style={labelStyle}>Members</label><input type="number" value={form.members} onChange={set("members")} placeholder="6" min={1} max={50} style={inputStyle} /></div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label style={labelStyle}>Situation</label><input value={form.situation} onChange={set("situation")} placeholder="e.g. Drought, Displacement" style={inputStyle} /></div>
            <div><label style={labelStyle}>Primary Need</label><input value={form.need} onChange={set("need")} placeholder="e.g. Food Support, Shelter" style={inputStyle} /></div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div><label style={labelStyle}>Region *</label>
              <select value={form.region} onChange={(e) => setForm((f) => ({ ...f, region: e.target.value, district: "", village: "" }))} style={inputStyle}>
                {activeRegions.map((r) => <option key={r.name} value={r.name}>{r.name}</option>)}
              </select></div>
            <div><label style={labelStyle}>District *</label>
              <select value={form.district} onChange={set("district")} style={inputStyle}>
                <option value="">Select</option>
                {districts.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
              </select></div>
            <div><label style={labelStyle}>Village</label>
              {villages.length > 0 ? (
                <select value={form.village} onChange={set("village")} style={inputStyle}>
                  <option value="">Select</option>
                  {villages.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              ) : <input value={form.village} onChange={set("village")} placeholder="Village name" style={inputStyle} />}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label style={labelStyle}>Goal Amount (USD)</label>
              <input type="number" value={form.goalAmount} onChange={set("goalAmount")} placeholder="250" min={0} style={inputStyle} /></div>
            <div><label style={labelStyle}>Contact Phone (optional)</label>
              <input value={form.phoneContact} onChange={set("phoneContact")} placeholder="+252..." style={inputStyle} /></div>
          </div>

          <div><label style={labelStyle}>Story *</label>
            <textarea value={form.story} onChange={set("story")} rows={6} placeholder="Describe the family's situation, how many children, what they need, and how donations will help..." style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }} />
            <p style={{ fontSize: 11, color: form.story.length >= 20 ? "#22c55e" : "#484f58", marginTop: 4 }}>{form.story.length} chars {form.story.length < 20 ? `(need ${20 - form.story.length} more)` : "✓"}</p>
          </div>

          <ImageUpload value={form.imageUrl} onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))} label="Family Photo" />

          {error && <div style={{ display: "flex", alignItems: "center", gap: 8, backgroundColor: "#2c0f0f", border: "1px solid #da3633", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#f85149" }}><AlertCircle size={14} /> {error}</div>}
          {success && <div style={{ display: "flex", alignItems: "center", gap: 8, backgroundColor: "#0f2c1a", border: "1px solid #238636", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#3fb950" }}><CheckCircle size={14} /> {success}</div>}

          <div style={{ display: "flex", gap: 12, paddingTop: 8 }}>
            <button onClick={() => save(false)} disabled={saving || !form.name} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, backgroundColor: "#21262d", color: "#e6edf3", border: "1px solid #30363d", cursor: "pointer", opacity: saving || !form.name ? 0.5 : 1 }}>
              <Save size={14} /> {saving ? "Saving..." : "Save Draft"}
            </button>
            <button onClick={() => save(true)} disabled={submitting || !canSubmit} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700, backgroundColor: canSubmit ? "#22c55e" : "#21262d", color: "#fff", border: "none", cursor: "pointer", opacity: submitting || !canSubmit ? 0.5 : 1 }}>
              <Send size={14} /> {submitting ? "Submitting..." : "Submit for Review"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
