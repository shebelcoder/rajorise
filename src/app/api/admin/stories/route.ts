import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizePlain } from "@/lib/sanitize";

function slugify(t: string) { return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80); }

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const slug = `${slugify(sanitizePlain(body.title || "story"))}-${Date.now().toString(36)}`;

  const story = await prisma.story.create({
    data: {
      slug,
      title: sanitizePlain(body.title || ""),
      content: sanitizePlain(body.content || ""),
      summary: sanitizePlain((body.content || "").slice(0, 200)),
      imageUrl: body.imageUrl || null,
      storyImageUrl: body.storyImageUrl || null,
      videoUrl: body.videoUrl || null,
      pdfUrl: body.pdfUrl || null,
      source: body.source || "JOURNALIST",
      category: body.category || "news",
      region: body.region || null,
      authorId: user.id,
      status: "APPROVED",
      approvedById: user.id,
      publishedAt: new Date(),
    },
  });

  return NextResponse.json({ success: true, id: story.id });
}
