"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Send, AlertCircle, CheckCircle, BookOpen } from "lucide-react";
import { REGIONS } from "@/lib/locations";

const CATEGORIES = [
  { value: "success", label: "Success Story" },
  { value: "milestone", label: "Milestone Update" },
  { value: "farming", label: "Farming / Agriculture" },
  { value: "seasonal", label: "Seasonal Update" },
  { value: "news", label: "Community News" },
  { value: "impact", label: "Impact Report" },
];

export default function NewStoryPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", content: "", category: "success", region: "Gedo", imageUrl: "", relatedType: "", relatedId: "" });
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const activeRegions = REGIONS.filter((r) => r.active);
  const canSubmit = form.title.length >= 5 && form.content.length >= 50;

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async (submit: boolean) => {
    setError(""); setSuccess("");
    const setter = submit ? setSubmitting : setSaving;
    setter(true);
    try {
      const res = await fetch("/api/journalist/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, submitForReview: submit }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(submit ? "Submitted for review!" : "Draft saved!");
        if (submit) setTimeout(() => router.push("/journalist/cases"), 1500);
      } else setError(data.error || "Failed.");
    } catch { setError("Network error."); } finally { setter(false); }
  };

  const inputStyle = { width: "100%", padding: "10px 14px", backgroundColor: "#0d1117", border: "1px solid #21262d", borderRadius: 8, color: "#e6edf3", fontSize: 13, outline: "none" };
  const labelStyle = { display: "block" as const, fontSize: 12, fontWeight: 600 as const, color: "#8b949e", marginBottom: 6 };

  return (
    <div style={{ padding: "32px 40px", maxWidth: 900 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <BookOpen size={22} style={{ color: "#a78bfa" }} />
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#e6edf3", margin: 0 }}>Write a Story</h1>
          <p style={{ color: "#8b949e", fontSize: 13, marginTop: 2 }}>Share success stories, field updates, farming news</p>
        </div>
      </div>

      <div style={{ backgroundColor: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: "28px 32px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div><label style={labelStyle}>Title *</label>
            <input value={form.title} onChange={set("title")} placeholder="e.g. How clean water transformed Barwaaqo village" style={inputStyle} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label style={labelStyle}>Category *</label>
              <select value={form.category} onChange={set("category")} style={inputStyle}>
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div><label style={labelStyle}>Region</label>
              <select value={form.region} onChange={set("region")} style={inputStyle}>
                <option value="">All regions</option>
                {activeRegions.map((r) => <option key={r.name} value={r.name}>{r.name}</option>)}
              </select>
            </div>
          </div>

          <div><label style={labelStyle}>Story Content *</label>
            <textarea value={form.content} onChange={set("content")} rows={12} placeholder="Write the full story here. Include details about the impact, the people involved, and what changed..." style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }} />
            <p style={{ fontSize: 11, color: form.content.length >= 50 ? "#22c55e" : "#484f58", marginTop: 4 }}>{form.content.length} chars {form.content.length < 50 ? `(need ${50 - form.content.length} more)` : "✓"}</p>
          </div>

          <div><label style={labelStyle}>Cover Image URL (optional)</label>
            <input value={form.imageUrl} onChange={set("imageUrl")} placeholder="https://..." style={inputStyle} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label style={labelStyle}>Related to (optional)</label>
              <select value={form.relatedType} onChange={set("relatedType")} style={inputStyle}>
                <option value="">None</option>
                <option value="student">Student</option>
                <option value="family">Family</option>
                <option value="case">Case</option>
              </select>
            </div>
            {form.relatedType && (
              <div><label style={labelStyle}>Related ID</label>
                <input value={form.relatedId} onChange={set("relatedId")} placeholder="Paste the ID" style={inputStyle} />
              </div>
            )}
          </div>

          {error && <div style={{ display: "flex", alignItems: "center", gap: 8, backgroundColor: "#2c0f0f", border: "1px solid #da3633", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#f85149" }}><AlertCircle size={14} /> {error}</div>}
          {success && <div style={{ display: "flex", alignItems: "center", gap: 8, backgroundColor: "#0f2c1a", border: "1px solid #238636", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#3fb950" }}><CheckCircle size={14} /> {success}</div>}

          <div style={{ display: "flex", gap: 12, paddingTop: 8 }}>
            <button onClick={() => save(false)} disabled={saving || !form.title} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, backgroundColor: "#21262d", color: "#e6edf3", border: "1px solid #30363d", cursor: "pointer", opacity: saving || !form.title ? 0.5 : 1 }}>
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
