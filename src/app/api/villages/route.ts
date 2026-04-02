import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizePlain } from "@/lib/sanitize";

const createSchema = z.object({
  name: z.string().min(2).max(100),
  district: z.string().min(2).max(100),
  region: z.string().max(100).default("Gedo"),
});

// GET — list villages for a district
export async function GET(req: NextRequest) {
  const district = req.nextUrl.searchParams.get("district");
  const region = req.nextUrl.searchParams.get("region") || "Gedo";

  if (!district) return NextResponse.json([]);

  // Get DB villages
  const dbVillages = await prisma.village.findMany({
    where: { district, region },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  // Also include hardcoded ones from locations.ts
  const { getVillages } = await import("@/lib/locations");
  const hardcodedVillages = getVillages(region, district);

  // Merge and deduplicate
  const allNames = new Set<string>();
  const result: { id: string | null; name: string }[] = [];

  for (const v of hardcodedVillages) {
    if (!allNames.has(v)) {
      allNames.add(v);
      result.push({ id: null, name: v });
    }
  }
  for (const v of dbVillages) {
    if (!allNames.has(v.name)) {
      allNames.add(v.name);
      result.push({ id: v.id, name: v.name });
    }
  }

  return NextResponse.json(result.sort((a, b) => a.name.localeCompare(b.name)));
}

// POST — add a new village
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;

  if (!user?.id || !["JOURNALIST", "ADMIN"].includes(user.role || "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });

  const { name, district, region } = parsed.data;
  const cleanName = sanitizePlain(name.trim());

  // Check if already exists
  const existing = await prisma.village.findFirst({
    where: { name: cleanName, district, region },
  });
  if (existing) return NextResponse.json({ success: true, id: existing.id, name: existing.name });

  const village = await prisma.village.create({
    data: { name: cleanName, district, region, addedById: user.id },
  });

  return NextResponse.json({ success: true, id: village.id, name: village.name }, { status: 201 });
}
