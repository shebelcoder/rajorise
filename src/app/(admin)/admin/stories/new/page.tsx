"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Brain, Loader2, AlertCircle, CheckCircle, BookOpen, Sparkles } from "lucide-react";
import { REGIONS } from "@/lib/locations";
import ImageUpload from "@/components/ImageUpload";

const CATEGORIES = [
  { value: "success", label: "Success Story" },
  { value: "milestone", label: "Milestone Update" },
  { value: "farming", label: "Farming / Agriculture" },
  { value: "seasonal", label: "Seasonal Update" },
  { value: "news", label: "Community News" },
  { value: "health", label: "Health" },
  { value: "education", label: "Education" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "research", label: "Research" },
];

const RESEARCH_TOPICS = [
  "Rainy season farming tips for Gedo region",
  "Water conservation methods for drought-affected areas",
  "Livestock management during dry season in Somalia",
  "Seed distribution and crop planning for small farms",
  "Education challenges in rural Gedo communities",
  "Community health practices during rainy season",
  "Irrigation techniques for Juba river communities",
  "Food storage and preservation for Somali farmers",
];

export default function AdminNewStoryPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", content: "", category: "news", region: "Gedo", imageUrl: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // AI Research
  const [researchTopic, setResearchTopic] = useState("");
  const [researching, setResearching] = useState(false);
  const [researchResult, setResearchResult] = useState<{ title: string; content: string; category: string } | null>(null);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const doResearch = async (topic: string) => {
    setResearching(true); setResearchResult(null); setError("");
    try {
      const res = await fetch("/api/admin/ai/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      if (res.ok) {
        setResearchResult(data);
      } else {
        setError(data.error || "Research failed.");
      }
    } catch { setError("Network error."); }
    finally { setResearching(false); }
  };

  const useResearch = () => {
    if (researchResult) {
      setForm((f) => ({
        ...f,
        title: researchResult.title,
        content: researchResult.content,
        category: researchResult.category || f.category,
      }));
      setResearchResult(null);
    }
  };

  const save = async () => {
    setSaving(true); setError(""); setSuccess("");
    try {
      const res = await fetch("/api/admin/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "JOURNALIST" }),
      });
      if (res.ok) {
        setSuccess("Published!");
        setTimeout(() => router.push("/admin/stories"), 1000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed.");
      }
    } catch { setError("Network error."); } finally { setSaving(false); }
  };

  const inputStyle = { width: "100%", padding: "10px 14px", backgroundColor: "#0d1117", border: "1px solid #21262d", borderRadius: 8, color: "#e6edf3", fontSize: 13, outline: "none" };
  const labelStyle = { display: "block" as const, fontSize: 12, fontWeight: 600 as const, color: "#8b949e", marginBottom: 6 };

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <BookOpen size={22} style={{ color: "#a78bfa" }} />
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#e6edf3", margin: 0 }}>Create Story</h1>
          <p style={{ color: "#8b949e", fontSize: 13, marginTop: 2 }}>Write manually or use AI to research a topic</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20 }}>
        {/* Editor */}
        <div style={{ backgroundColor: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: "28px 32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div><label style={labelStyle}>Title</label>
              <input value={form.title} onChange={set("title")} placeholder="Story title..." style={inputStyle} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><label style={labelStyle}>Category</label>
                <select value={form.category} onChange={set("category")} style={inputStyle}>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div><label style={labelStyle}>Region</label>
                <select value={form.region} onChange={set("region")} style={inputStyle}>
                  <option value="">All</option>
                  {REGIONS.filter(r => r.active).map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                </select>
              </div>
            </div>

            <div><label style={labelStyle}>Content</label>
              <textarea value={form.content} onChange={set("content")} rows={16} placeholder="Write the story..." style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }} />
              <p style={{ fontSize: 11, color: "#484f58", marginTop: 4 }}>{form.content.length} characters</p>
            </div>

            <ImageUpload value={form.imageUrl} onChange={(url) => setForm(f => ({ ...f, imageUrl: url }))} label="Cover Image" />

            {error && <div style={{ display: "flex", alignItems: "center", gap: 8, backgroundColor: "#2c0f0f", border: "1px solid #da3633", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#f85149" }}><AlertCircle size={14} /> {error}</div>}
            {success && <div style={{ display: "flex", alignItems: "center", gap: 8, backgroundColor: "#0f2c1a", border: "1px solid #238636", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#3fb950" }}><CheckCircle size={14} /> {success}</div>}

            <button onClick={save} disabled={saving || !form.title || !form.content} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 8,
              fontSize: 14, fontWeight: 700, backgroundColor: "#f59e0b", color: "#000",
              border: "none", cursor: saving ? "wait" : "pointer", opacity: saving || !form.title ? 0.5 : 1, width: "fit-content",
            }}>
              <Save size={16} /> {saving ? "Publishing..." : "Publish Story"}
            </button>
          </div>
        </div>

        {/* AI Research Panel */}
        <div>
          <div style={{ backgroundColor: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 20, marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#a78bfa", margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8 }}>
              <Brain size={16} /> AI Deep Research
            </h3>
            <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>
              Give the AI a topic — it will research and write a full article for you to review and publish.
            </p>

            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <input value={researchTopic} onChange={(e) => setResearchTopic(e.target.value)} placeholder="Enter research topic..."
                onKeyDown={(e) => e.key === "Enter" && researchTopic && doResearch(researchTopic)}
                style={{ ...inputStyle, flex: 1 }} />
              <button onClick={() => researchTopic && doResearch(researchTopic)} disabled={researching || !researchTopic}
                style={{ padding: "10px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, backgroundColor: "#a78bfa", color: "#fff", border: "none", cursor: "pointer", opacity: researching || !researchTopic ? 0.5 : 1, whiteSpace: "nowrap" }}>
                {researching ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              </button>
            </div>

            {/* Quick topics */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {RESEARCH_TOPICS.map(t => (
                <button key={t} onClick={() => { setResearchTopic(t); doResearch(t); }} disabled={researching}
                  style={{ fontSize: 10, padding: "4px 10px", borderRadius: 6, backgroundColor: "#0d1117", color: "#8b949e", border: "1px solid #21262d", cursor: "pointer", textAlign: "left" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Research result */}
          {researching && (
            <div style={{ backgroundColor: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 20, textAlign: "center" }}>
              <Loader2 size={24} style={{ color: "#a78bfa", margin: "0 auto 8px" }} className="animate-spin" />
              <p style={{ fontSize: 13, color: "#a78bfa", fontWeight: 600 }}>Researching...</p>
              <p style={{ fontSize: 11, color: "#6b7280" }}>AI is writing a detailed article</p>
            </div>
          )}

          {researchResult && (
            <div style={{ backgroundColor: "#161b22", border: "1px solid #6e40c9", borderRadius: 12, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: "#a78bfa", margin: 0 }}>AI Suggestion</h4>
                <button onClick={useResearch} style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 6,
                  fontSize: 11, fontWeight: 700, backgroundColor: "#22c55e", color: "#fff", border: "none", cursor: "pointer",
                }}>
                  Use This
                </button>
              </div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#e6edf3", margin: "0 0 8px" }}>{researchResult.title}</p>
              <div style={{ maxHeight: 300, overflowY: "auto", fontSize: 12, color: "#8b949e", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                {researchResult.content}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
