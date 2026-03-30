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
  const slug = `${slugify(sanitizePlain(body.name || "family"))}-${Date.now().toString(36)}`;

  const family = await prisma.family.create({
    data: {
      slug,
      name: sanitizePlain(body.name || ""),
      members: body.members ? parseInt(body.members) : null,
      situation: body.situation || null,
      need: body.need || null,
      country: "Somalia",
      region: body.region || "Gedo",
      district: body.district || null,
      village: body.village || null,
      story: sanitizePlain(body.story || ""),
      imageUrl: body.imageUrl || null,
      phoneContact: body.phoneContact || null,
      goalAmount: parseFloat(body.goalAmount) || 0,
      journalistId: user.id,
      status: "APPROVED",
      approvedById: user.id,
    },
  });

  return NextResponse.json({ success: true, id: family.id });
}
