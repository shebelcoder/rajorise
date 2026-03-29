"use client";

import { useState } from "react";
import { Brain, Zap, AlertTriangle, TrendingUp, Lightbulb, Send, Loader2 } from "lucide-react";

interface AIResponse {
  insights: string[];
  risks: string[];
  opportunities: string[];
  actions: string[];
  summary: string;
}

const QUICK_PROMPTS = [
  { label: "Platform Overview", prompt: "Analyze current platform performance. What are the key metrics and trends?" },
  { label: "Region Analysis", prompt: "Analyze Gedo region performance. Which districts have the most activity? Where should we focus?" },
  { label: "Donation Trends", prompt: "What are the donation trends? Average amounts, frequency, peak times?" },
  { label: "Expansion Plan", prompt: "Based on current data, which region should we expand to next and why?" },
  { label: "Journalist Performance", prompt: "Analyze journalist submission quality. Who needs support? Who is performing well?" },
  { label: "Seasonal Planning", prompt: "What seasonal factors should we prepare for? Rainy season, drought, farming cycles?" },
];

export default function AIConsole() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResponse | null>(null);
  const [error, setError] = useState("");

  const analyze = async (queryPrompt: string) => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/admin/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: queryPrompt }),
      });
      const data = await res.json();

      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || "AI analysis failed.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  const sectionStyle = (color: string) => ({
    backgroundColor: "#111827",
    border: `1px solid #1c2333`,
    borderLeft: `3px solid ${color}`,
    borderRadius: 10,
    padding: "16px 20px",
  });

  return (
    <div>
      {/* Quick prompts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 20 }}>
        {QUICK_PROMPTS.map(({ label, prompt: qp }) => (
          <button
            key={label}
            onClick={() => { setPrompt(qp); analyze(qp); }}
            disabled={loading}
            style={{
              padding: "12px 16px", borderRadius: 10, fontSize: 12, fontWeight: 600,
              backgroundColor: "#111827", border: "1px solid #1c2333",
              color: "#e6edf3", cursor: loading ? "wait" : "pointer",
              textAlign: "left", transition: "border-color 0.15s",
            }}
          >
            <Lightbulb size={14} style={{ color: "#a78bfa", marginBottom: 6 }} />
            <br />
            {label}
          </button>
        ))}
      </div>

      {/* Custom prompt */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask the AI anything about your platform data..."
          onKeyDown={(e) => e.key === "Enter" && prompt && analyze(prompt)}
          style={{
            flex: 1, padding: "12px 16px", backgroundColor: "#0d1117",
            border: "1px solid #1c2333", borderRadius: 10, color: "#e6edf3",
            fontSize: 13, outline: "none",
          }}
        />
        <button
          onClick={() => prompt && analyze(prompt)}
          disabled={loading || !prompt}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "12px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700,
            backgroundColor: "#a78bfa", color: "#fff", border: "none",
            cursor: loading || !prompt ? "not-allowed" : "pointer",
            opacity: loading || !prompt ? 0.5 : 1,
          }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {error && (
        <div style={{ backgroundColor: "#2c0f0f", border: "1px solid #da3633", borderRadius: 10, padding: "12px 16px", fontSize: 12, color: "#f85149", marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Summary */}
          <div style={{ ...sectionStyle("#a78bfa"), display: "flex", gap: 12, alignItems: "flex-start" }}>
            <Brain size={20} style={{ color: "#a78bfa", flexShrink: 0, marginTop: 2 }} />
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#a78bfa", margin: "0 0 6px" }}>Summary</h3>
              <p style={{ fontSize: 13, color: "#e6edf3", lineHeight: 1.7, margin: 0 }}>{result.summary}</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Insights */}
            <div style={sectionStyle("#58a6ff")}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: "#58a6ff", margin: "0 0 10px", display: "flex", alignItems: "center", gap: 6 }}>
                <TrendingUp size={14} /> Insights
              </h3>
              {result.insights.map((item, i) => (
                <p key={i} style={{ fontSize: 12, color: "#8b949e", margin: "0 0 6px", paddingLeft: 12, borderLeft: "2px solid #1c2333", lineHeight: 1.6 }}>
                  {item}
                </p>
              ))}
            </div>

            {/* Risks */}
            <div style={sectionStyle("#ef4444")}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: "#ef4444", margin: "0 0 10px", display: "flex", alignItems: "center", gap: 6 }}>
                <AlertTriangle size={14} /> Risks
              </h3>
              {result.risks.map((item, i) => (
                <p key={i} style={{ fontSize: 12, color: "#8b949e", margin: "0 0 6px", paddingLeft: 12, borderLeft: "2px solid #1c2333", lineHeight: 1.6 }}>
                  {item}
                </p>
              ))}
            </div>

            {/* Opportunities */}
            <div style={sectionStyle("#22c55e")}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: "#22c55e", margin: "0 0 10px", display: "flex", alignItems: "center", gap: 6 }}>
                <Lightbulb size={14} /> Opportunities
              </h3>
              {result.opportunities.map((item, i) => (
                <p key={i} style={{ fontSize: 12, color: "#8b949e", margin: "0 0 6px", paddingLeft: 12, borderLeft: "2px solid #1c2333", lineHeight: 1.6 }}>
                  {item}
                </p>
              ))}
            </div>

            {/* Actions */}
            <div style={sectionStyle("#f59e0b")}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: "#f59e0b", margin: "0 0 10px", display: "flex", alignItems: "center", gap: 6 }}>
                <Zap size={14} /> Recommended Actions
              </h3>
              {result.actions.map((item, i) => (
                <p key={i} style={{ fontSize: 12, color: "#8b949e", margin: "0 0 6px", paddingLeft: 12, borderLeft: "2px solid #f59e0b", lineHeight: 1.6 }}>
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {!result && !loading && (
        <div style={{ textAlign: "center", padding: "64px 20px", color: "#6b7280" }}>
          <Brain size={48} style={{ color: "#1c2333", margin: "0 auto 16px" }} />
          <p style={{ fontSize: 14, marginBottom: 4 }}>Select a quick analysis or ask a custom question</p>
          <p style={{ fontSize: 12, color: "#484f58" }}>The AI reads your platform data and provides actionable insights</p>
        </div>
      )}
    </div>
  );
}
