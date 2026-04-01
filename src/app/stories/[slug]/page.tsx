import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Camera, Brain, Zap } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = await prisma.story.findUnique({ where: { slug }, select: { title: true, summary: true } });
  if (!s) return { title: "Story Not Found" };
  return {
    title: `${s.title} — RajoRise`,
    description: (s.summary || "").slice(0, 160),
    openGraph: { title: s.title, description: (s.summary || "").slice(0, 160) },
  };
}

export default async function StoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = await prisma.story.findUnique({ where: { slug } });

  if (!story || story.status !== "APPROVED") notFound();

  const sourceLabel = story.source === "JOURNALIST" ? "Field Report" : story.source === "AI" ? "AI-Generated News" : "Progress Update";
  const SourceIcon = story.source === "JOURNALIST" ? Camera : story.source === "AI" ? Brain : Zap;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <div style={{
        height: 280,
        background: story.imageUrl ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${story.imageUrl}) center/cover` : "linear-gradient(135deg, #16a34a, #1d4ed8)",
        display: "flex", alignItems: "flex-end", padding: "2rem",
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto", width: "100%", color: "#fff" }}>
          <Link href="/stories" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.7)", fontSize: 13, textDecoration: "none", marginBottom: 12 }}>
            <ArrowLeft size={14} /> Back to Stories
          </Link>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: 0, lineHeight: 1.3 }}>{story.title}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}><SourceIcon size={14} /> {sourceLabel}</span>
            {story.region && <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}><MapPin size={14} /> {story.region}</span>}
            {story.publishedAt && <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}><Calendar size={14} /> {new Date(story.publishedAt).toLocaleDateString()}</span>}
            {story.category && <span style={{ backgroundColor: "rgba(255,255,255,0.2)", padding: "2px 10px", borderRadius: 99, fontSize: 12 }}>{story.category}</span>}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "2.5rem 1.25rem" }}>
        <article style={{ fontSize: 16, color: "#374151", lineHeight: 1.9, whiteSpace: "pre-wrap" }}>
          {story.content}
        </article>

        <div style={{ marginTop: "3rem", padding: "2rem", backgroundColor: "#f0fdf4", borderRadius: 16, border: "1px solid #bbf7d0", textAlign: "center" }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Want to make an impact?</h3>
          <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 16 }}>Your donation directly supports communities in need.</p>
          <Link href="/donate" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            backgroundColor: "#16a34a", color: "#fff", padding: "12px 24px",
            borderRadius: 12, fontWeight: 700, textDecoration: "none",
          }}>
            Donate Now
          </Link>
        </div>
      </div>
    </div>
  );
}
