import Link from "next/link";
import { MapPin, Calendar, BookOpen, Zap, Brain, Camera } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

async function getStories() {
  try {
    return await prisma.story.findMany({
      where: { status: "APPROVED" },
      orderBy: { publishedAt: "desc" },
    });
  } catch {
    return [];
  }
}

const SOURCE_INFO: Record<string, { label: string; color: string; bg: string }> = {
  JOURNALIST: { label: "Field Report", color: "#1d4ed8", bg: "#dbeafe" },
  AUTO: { label: "Progress Update", color: "#16a34a", bg: "#f0fdf4" },
  AI: { label: "Regional News", color: "#7c3aed", bg: "#f5f3ff" },
};

const CATEGORY_EMOJI: Record<string, string> = {
  success: "🌟",
  milestone: "📈",
  farming: "🌾",
  agriculture: "🚜",
  seasonal: "🌧️",
  news: "📰",
  impact: "💚",
};

export default async function StoriesPage() {
  const stories = await getStories();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <div className="gradient-hero" style={{ color: "#fff", padding: "4rem 1rem" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, marginBottom: 12 }}>
            Stories & Updates
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.1rem" }}>
            Success stories, community milestones, farming updates, and real impact from the field.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "3rem 1.25rem" }}>
        {stories.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 1rem", color: "#6b7280" }}>
            <BookOpen size={48} style={{ color: "#e5e7eb", margin: "0 auto 16px" }} />
            <p style={{ fontSize: "1.1rem", marginBottom: 8 }}>No stories published yet.</p>
            <p style={{ fontSize: "0.9rem" }}>Check back soon — our team is documenting impact from the field.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {stories.map((s) => {
              const si = SOURCE_INFO[s.source] || SOURCE_INFO.JOURNALIST;
              const emoji = CATEGORY_EMOJI[s.category || ""] || "📖";

              return (
                <Link
                  key={s.id}
                  href={`/stories/${s.slug}`}
                  style={{
                    display: "flex", gap: 20, backgroundColor: "#fff", borderRadius: 16,
                    border: "1px solid #e5e7eb", overflow: "hidden", textDecoration: "none",
                    transition: "box-shadow 0.15s",
                  }}
                >
                  {/* Image or emoji */}
                  <div style={{
                    width: 200, minHeight: 160, flexShrink: 0,
                    background: s.imageUrl ? `url(${s.imageUrl}) center/cover` : "linear-gradient(135deg, #f0fdf4, #dbeafe)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {!s.imageUrl && <span style={{ fontSize: 48 }}>{emoji}</span>}
                  </div>

                  <div style={{ padding: "20px 20px 20px 0", flex: 1, display: "flex", flexDirection: "column" }}>
                    {/* Source + category badges */}
                    <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99, backgroundColor: si.bg, color: si.color }}>
                        {si.label}
                      </span>
                      {s.category && (
                        <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99, backgroundColor: "#f3f4f6", color: "#6b7280" }}>
                          {s.category}
                        </span>
                      )}
                    </div>

                    <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 8px", lineHeight: 1.3 }}>
                      {s.title}
                    </h2>

                    <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6, flex: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {s.summary || s.content.slice(0, 200)}
                    </p>

                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 12, fontSize: 12, color: "#9ca3af" }}>
                      {s.region && <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={12} /> {s.region}</span>}
                      {s.publishedAt && <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={12} /> {new Date(s.publishedAt).toLocaleDateString()}</span>}
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        {s.source === "JOURNALIST" ? <Camera size={12} /> : s.source === "AI" ? <Brain size={12} /> : <Zap size={12} />}
                        {s.source === "JOURNALIST" ? "Field Report" : s.source === "AI" ? "AI News" : "Auto-Update"}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
