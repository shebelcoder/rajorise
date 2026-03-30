"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Send, AlertCircle, CheckCircle, GraduationCap } from "lucide-react";
import { REGIONS, getDistricts, getVillages } from "@/lib/locations";

export default function NewStudentPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", age: "", grade: "", region: "Gedo", district: "", village: "", story: "", imageUrl: "", goalAmount: "" });
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
      const res = await fetch("/api/journalist/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, age: form.age ? parseInt(form.age) : undefined, submitForReview: submit }),
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
        <GraduationCap size={22} style={{ color: "#58a6ff" }} />
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#e6edf3", margin: 0 }}>Add Student</h1>
          <p style={{ color: "#8b949e", fontSize: 13, marginTop: 2 }}>Document a student who needs sponsorship</p>
        </div>
      </div>

      <div style={{ backgroundColor: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: "28px 32px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12 }}>
            <div><label style={labelStyle}>Name *</label><input value={form.name} onChange={set("name")} placeholder="Student's name" style={inputStyle} /></div>
            <div><label style={labelStyle}>Age</label><input type="number" value={form.age} onChange={set("age")} placeholder="12" min={1} max={25} style={inputStyle} /></div>
            <div><label style={labelStyle}>Grade</label><input value={form.grade} onChange={set("grade")} placeholder="Grade 6" style={inputStyle} /></div>
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

          <div><label style={labelStyle}>Goal Amount (USD/year)</label>
            <input type="number" value={form.goalAmount} onChange={set("goalAmount")} placeholder="120" min={0} style={{ ...inputStyle, maxWidth: 200 }} />
          </div>

          <div><label style={labelStyle}>Story *</label>
            <textarea value={form.story} onChange={set("story")} rows={6} placeholder="Describe the student's situation, needs, and dreams..." style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }} />
            <p style={{ fontSize: 11, color: form.story.length >= 20 ? "#22c55e" : "#484f58", marginTop: 4 }}>{form.story.length} chars {form.story.length < 20 ? `(need ${20 - form.story.length} more)` : "✓"}</p>
          </div>

          <div><label style={labelStyle}>Photo URL (optional)</label>
            <input value={form.imageUrl} onChange={set("imageUrl")} placeholder="https://..." style={inputStyle} />
          </div>

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
