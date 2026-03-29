"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Send, AlertCircle, CheckCircle } from "lucide-react";
import { REGIONS, getDistricts, getVillages } from "@/lib/locations";

interface CaseData {
  id?: string;
  title: string;
  story: string;
  region: string;
  district: string;
  village: string;
  goalAmount: string;
  coverImageUrl: string;
  status?: string;
}

const INITIAL: CaseData = {
  title: "",
  story: "",
  region: "Gedo",
  district: "",
  village: "",
  goalAmount: "",
  coverImageUrl: "",
};

export default function CaseEditor({ initialData }: { initialData?: CaseData }) {
  const router = useRouter();
  const [form, setForm] = useState<CaseData>(initialData || INITIAL);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const activeRegions = REGIONS.filter((r) => r.active);
  const districts = getDistricts(form.region);
  const villages = getVillages(form.region, form.district);

  const isEdit = !!form.id;
  const canSubmit = form.title.length >= 5 && form.story.length >= 50 && form.district;

  const set = (key: keyof CaseData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const saveCase = async (submitForReview: boolean) => {
    setError("");
    setSuccess("");

    if (submitForReview && !canSubmit) {
      setError("Title (5+ chars), story (50+ chars), and district are required to submit.");
      return;
    }

    const setter = submitForReview ? setSubmitting : setSaving;
    setter(true);

    try {
      const endpoint = isEdit ? `/api/journalist/cases/${form.id}` : "/api/journalist/cases";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          submitForReview,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(submitForReview ? "Submitted for review!" : "Draft saved!");
        if (!isEdit && data.id) {
          setForm((f) => ({ ...f, id: data.id }));
        }
        if (submitForReview) {
          setTimeout(() => router.push("/journalist/cases"), 1500);
        }
      } else {
        setError(data.error || "Failed to save.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setter(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    backgroundColor: "#0d1117",
    border: "1px solid #21262d",
    borderRadius: 8,
    color: "#e6edf3",
    fontSize: 13,
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    fontSize: 12,
    fontWeight: 600 as const,
    color: "#8b949e",
    marginBottom: 6,
  };

  return (
    <div style={{ backgroundColor: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: "28px 32px" }}>
      {/* Status bar */}
      {form.status && (
        <div style={{ marginBottom: 20, fontSize: 12, color: "#8b949e" }}>
          Status: <span style={{ fontWeight: 700, textTransform: "uppercase" }}>{form.status}</span>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Title */}
        <div>
          <label style={labelStyle}>Case Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={set("title")}
            placeholder="e.g. Severe drought in Baardheere — 20 families need water"
            style={inputStyle}
          />
          <p style={{ fontSize: 11, color: "#484f58", marginTop: 4 }}>{form.title.length} / 200 characters</p>
        </div>

        {/* Location row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div>
            <label style={labelStyle}>Region *</label>
            <select
              value={form.region}
              onChange={(e) => setForm((f) => ({ ...f, region: e.target.value, district: "", village: "" }))}
              style={inputStyle}
            >
              {activeRegions.map((r) => (
                <option key={r.name} value={r.name}>{r.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>District *</label>
            <select value={form.district} onChange={set("district")} style={inputStyle}>
              <option value="">Select district</option>
              {districts.map((d) => (
                <option key={d.name} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Village</label>
            {villages.length > 0 ? (
              <select value={form.village} onChange={set("village")} style={inputStyle}>
                <option value="">Select village</option>
                {villages.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            ) : (
              <input type="text" value={form.village} onChange={set("village")} placeholder="Village name" style={inputStyle} />
            )}
          </div>
        </div>

        {/* Goal amount */}
        <div>
          <label style={labelStyle}>Goal Amount (USD)</label>
          <input
            type="number"
            value={form.goalAmount}
            onChange={set("goalAmount")}
            placeholder="0"
            min={0}
            style={{ ...inputStyle, maxWidth: 200 }}
          />
        </div>

        {/* Story */}
        <div>
          <label style={labelStyle}>Full Story *</label>
          <textarea
            value={form.story}
            onChange={set("story")}
            rows={12}
            placeholder="Describe the situation in detail. Who is affected? What happened? What is urgently needed? Include key facts and numbers."
            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }}
          />
          <p style={{ fontSize: 11, color: form.story.length >= 50 ? "#22c55e" : "#484f58", marginTop: 4 }}>
            {form.story.length} characters {form.story.length < 50 ? `(need ${50 - form.story.length} more)` : "✓"}
          </p>
        </div>

        {/* Cover image URL (temporary — will be file upload later) */}
        <div>
          <label style={labelStyle}>Cover Image URL (optional)</label>
          <input
            type="url"
            value={form.coverImageUrl}
            onChange={set("coverImageUrl")}
            placeholder="https://..."
            style={inputStyle}
          />
          <p style={{ fontSize: 11, color: "#484f58", marginTop: 4 }}>
            Image upload coming soon. For now, paste a direct image URL.
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, backgroundColor: "#2c0f0f", border: "1px solid #da3633", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#f85149" }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}
        {success && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, backgroundColor: "#0f2c1a", border: "1px solid #238636", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#3fb950" }}>
            <CheckCircle size={14} /> {success}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, paddingTop: 8 }}>
          <button
            onClick={() => saveCase(false)}
            disabled={saving || !form.title}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600,
              backgroundColor: "#21262d", color: "#e6edf3", border: "1px solid #30363d",
              cursor: saving || !form.title ? "not-allowed" : "pointer",
              opacity: saving || !form.title ? 0.5 : 1,
            }}
          >
            <Save size={14} /> {saving ? "Saving..." : "Save Draft"}
          </button>

          {(!form.status || form.status === "DRAFT" || form.status === "REJECTED") && (
            <button
              onClick={() => saveCase(true)}
              disabled={submitting || !canSubmit}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700,
                backgroundColor: canSubmit ? "#22c55e" : "#21262d",
                color: "#fff", border: "none",
                cursor: submitting || !canSubmit ? "not-allowed" : "pointer",
                opacity: submitting || !canSubmit ? 0.5 : 1,
              }}
            >
              <Send size={14} /> {submitting ? "Submitting..." : "Submit for Review"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
