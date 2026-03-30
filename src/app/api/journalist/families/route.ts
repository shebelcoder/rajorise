import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizePlain } from "@/lib/sanitize";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const familySchema = z.object({
  name: z.string().min(2).max(100),
  members: z.number().min(1).max(50).optional(),
  situation: z.string().max(200).optional(),
  need: z.string().max(200).optional(),
  region: z.string().max(100).default("Gedo"),
  district: z.string().max(100).optional(),
  village: z.string().max(100).optional(),
  story: z.string().max(5000).default(""),
  imageUrl: z.string().max(2000000).optional(),
  phoneContact: z.string().max(20).optional(),
  goalAmount: z.string().default("0"),
  submitForReview: z.boolean().default(false),
});

function slugify(t: string) { return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80); }

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const limit = rateLimit(`j-family:${ip}`, { max: 10, windowSeconds: 3600 });
  if (!limit.success) return NextResponse.json({ error: "Too many requests." }, { status: 429 });

  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "JOURNALIST") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = familySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });

  const { name, members, situation, need, region, district, village, story, imageUrl, phoneContact, goalAmount, submitForReview } = parsed.data;
  const slug = `${slugify(sanitizePlain(name))}-${Date.now().toString(36)}`;

  const family = await prisma.family.create({
    data: {
      slug,
      name: sanitizePlain(name),
      members: members || null,
      situation: situation ? sanitizePlain(situation) : null,
      need: need ? sanitizePlain(need) : null,
      region: sanitizePlain(region),
      district: district ? sanitizePlain(district) : null,
      village: village ? sanitizePlain(village) : null,
      story: sanitizePlain(story),
      imageUrl: imageUrl || null,
      phoneContact: phoneContact || null,
      goalAmount: parseFloat(goalAmount) || 0,
      journalistId: user.id,
      status: submitForReview ? "PENDING" : "DRAFT",
    },
  });

  return NextResponse.json({ success: true, id: family.id }, { status: 201 });
}
