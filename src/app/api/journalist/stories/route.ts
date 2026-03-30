import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizePlain } from "@/lib/sanitize";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const storySchema = z.object({
  title: z.string().min(5).max(200),
  content: z.string().min(50).max(10000),
  category: z.string().max(50).default("success"),
  region: z.string().max(100).optional(),
  imageUrl: z.string().max(500).optional(),
  relatedType: z.string().max(20).optional(),
  relatedId: z.string().max(50).optional(),
  submitForReview: z.boolean().default(false),
});

function slugify(t: string) { return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80); }

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const limit = rateLimit(`j-story:${ip}`, { max: 10, windowSeconds: 3600 });
  if (!limit.success) return NextResponse.json({ error: "Too many requests." }, { status: 429 });

  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "JOURNALIST") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = storySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });

  const { title, content, category, region, imageUrl, relatedType, relatedId, submitForReview } = parsed.data;
  const slug = `${slugify(sanitizePlain(title))}-${Date.now().toString(36)}`;

  const story = await prisma.story.create({
    data: {
      slug,
      title: sanitizePlain(title),
      content: sanitizePlain(content),
      summary: sanitizePlain(content.slice(0, 200)),
      category,
      region: region || null,
      imageUrl: imageUrl || null,
      source: "JOURNALIST",
      authorId: user.id,
      relatedType: relatedType || null,
      relatedId: relatedId || null,
      status: submitForReview ? "PENDING" : "DRAFT",
    },
  });

  return NextResponse.json({ success: true, id: story.id }, { status: 201 });
}
