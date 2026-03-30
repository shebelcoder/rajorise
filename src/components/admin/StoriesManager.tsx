"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Trash2, Zap, Brain, Camera, Loader2 } from "lucide-react";

interface StoryItem {
  id: string; slug: string; title: string; content: string; summary: string | null;
  source: string; category: string | null; region: string | null; status: string;
  imageUrl: string | null; createdAt: string; publishedAt: string | null;
}

const SOURCE_LABELS: Record<string, { label: string; color: string; icon: typeof Camera }> = {
  JOURNALIST: { label: "Journalist", color: "#58a6ff", icon: Camera },
  AUTO: { label: "Auto-Generated", color: "#22c55e", icon: Zap },
  AI: { label: "AI-Generated", color: "#a78bfa", icon: Brain },
};

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  DRAFT: { bg: "#21262d", text: "#8b949e" },
  PENDING: { bg: "#2b1d0a", text: "#eab308" },
  APPROVED: { bg: "#0f2c1a", text: "#22c55e" },
  REJECTED: { bg: "#2c0f0f", text: "#ef4444" },
};

export default function AdminStoriesManager({ stories }: { stories: StoryItem[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<string | null>("PENDING");
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [genResult, setGenResult] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  let filtered = filter ? stories.filter((s) => s.status === filter) : stories;
  if (sourceFilter) filtered = filtered.filter((s) => s.source === sourceFilter);

  const review = async (id: string, action: string) => {
    await fetch(`/api/admin/stories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    router.refresh();
  };

  const generate = async (type: string) => {
    setGenerating(true); setGenResult("");
    try {
      const res = await fetch("/api/admin/stories/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (res.ok) {
        setGenResult(`Generated ${data.created?.length || 0} stories`);
        router.refresh();
      } else setGenResult(data.error || "Failed");
    } catch { setGenResult("Error"); }
    finally { setGenerating(false); }
  };

  return (
    <>
      {/* Generate buttons */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        <button onClick={() => generate("auto")} disabled={generating}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, backgroundColor: "#0f2c1a", color: "#22c55e", border: "1px solid #238636", cursor: generating ? "wait" : "pointer" }}>
          <Zap size={14} /> Generate Milestones
        </button>
        <button onClick={() => generate("ai")} disabled={generating}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, backgroundColor: "#1e1040", color: "#a78bfa", border: "1px solid #6e40c9", cursor: generating ? "wait" : "pointer" }}>
          {generating ? <Loader2 size={14} className="animate-spin" /> : <Brain size={14} />} Generate AI News
        </button>
        {genResult && <span style={{ fontSize: 12, color: "#22c55e", alignSelf: "center" }}>{genResult}</span>}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        {[
          { label: "Pending", value: "PENDING" }, { label: "All", value: null },
          { label: "Approved", value: "APPROVED" }, { label: "Rejected", value: "REJECTED" },
        ].map(({ label, value }) => (
          <button key={label} onClick={() => setFilter(value)}
            style={{ padding: "6px 14px", borderRadius: 6, fontSize: 11, fontWeight: 600, border: "1px solid", cursor: "pointer", borderColor: filter === value ? "#f59e0b" : "#1c2333", backgroundColor: filter === value ? "#2b1d0a" : "#111827", color: filter === value ? "#f59e0b" : "#6b7280" }}>
            {label}
          </button>
        ))}
        <div style={{ width: 1, backgroundColor: "#1c2333", margin: "0 4px" }} />
        {Object.entries(SOURCE_LABELS).map(([key, { label, color }]) => (
          <button key={key} onClick={() => setSourceFilter(sourceFilter === key ? null : key)}
            style={{ padding: "6px 14px", borderRadius: 6, fontSize: 11, fontWeight: 600, border: "1px solid", cursor: "pointer", borderColor: sourceFilter === key ? color : "#1c2333", backgroundColor: sourceFilter === key ? "#111827" : "#111827", color: sourceFilter === key ? color : "#6b7280" }}>
            {label}
          </button>
        ))}
      </div>

      {/* Stories list */}
      <div style={{ backgroundColor: "#111827", border: "1px solid #1c2333", borderRadius: 10, overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <p style={{ padding: "48px 20px", textAlign: "center", color: "#6b7280", fontSize: 13 }}>No stories</p>
        ) : filtered.map((s, i) => {
          const sc = STATUS_STYLES[s.status] || STATUS_STYLES.DRAFT;
          const sl = SOURCE_LABELS[s.source] || SOURCE_LABELS.JOURNALIST;
          const isExpanded = expanded === s.id;

          return (
            <div key={s.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #1c2333" : "none" }}>
              <div style={{ padding: "14px 20px", cursor: "pointer" }} onClick={() => setExpanded(isExpanded ? null : s.id)}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, backgroundColor: `${sl.color}20`, color: sl.color }}>{sl.label}</span>
                      {s.category && <span style={{ fontSize: 10, color: "#6b7280" }}>{s.category}</span>}
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#e6edf3", margin: 0 }}>{s.title}</p>
                    <p style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>
                      {s.region || "All regions"} · {new Date(s.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 99, backgroundColor: sc.bg, color: sc.text, textTransform: "uppercase" }}>{s.status}</span>
                </div>
              </div>

              {/* Expanded: full content + actions */}
              {isExpanded && (
                <div style={{ padding: "0 20px 16px", borderTop: "1px solid #1c2333" }}>
                  <div style={{ padding: "16px 0", fontSize: 13, color: "#8b949e", lineHeight: 1.7, whiteSpace: "pre-wrap", maxHeight: 300, overflowY: "auto" }}>
                    {s.content}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {s.status === "PENDING" && (
                      <>
                        <button onClick={() => review(s.id, "approve")} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 14px", borderRadius: 6, fontSize: 11, fontWeight: 700, backgroundColor: "#0f2c1a", color: "#22c55e", border: "1px solid #238636", cursor: "pointer" }}>
                          <CheckCircle size={12} /> Approve & Publish
                        </button>
                        <button onClick={() => review(s.id, "reject")} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 14px", borderRadius: 6, fontSize: 11, fontWeight: 700, backgroundColor: "#2c0f0f", color: "#ef4444", border: "1px solid #da3633", cursor: "pointer" }}>
                          <XCircle size={12} /> Reject
                        </button>
                      </>
                    )}
                    <button onClick={() => review(s.id, "delete")} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 14px", borderRadius: 6, fontSize: 11, fontWeight: 600, backgroundColor: "#21262d", color: "#8b949e", border: "1px solid #30363d", cursor: "pointer" }}>
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
