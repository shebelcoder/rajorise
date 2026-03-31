import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import AdminStoriesManager from "@/components/admin/StoriesManager";

export default async function AdminStoriesPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "ADMIN") redirect("/portal/admin-login");

  const stories = await prisma.story.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    select: {
      id: true, slug: true, title: true, content: true, summary: true,
      source: true, category: true, region: true, status: true,
      imageUrl: true, createdAt: true, publishedAt: true,
    },
  });

  const serialized = stories.map((s) => ({
    ...s,
    createdAt: s.createdAt.toISOString(),
    publishedAt: s.publishedAt?.toISOString() || null,
  }));

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <BookOpen size={22} style={{ color: "#a78bfa" }} />
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#e6edf3", margin: 0 }}>Stories & News</h1>
            <p style={{ color: "#6b7280", fontSize: 13, marginTop: 2 }}>{stories.length} total</p>
          </div>
        </div>
        <Link href="/admin/stories/new" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, backgroundColor: "#a78bfa", color: "#fff", textDecoration: "none" }}>+ Create Story</Link>
      </div>
      <AdminStoriesManager stories={serialized} />
    </div>
  );
}
