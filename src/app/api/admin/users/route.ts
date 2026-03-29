import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
  role: z.enum(["DONOR", "JOURNALIST", "ADMIN", "PROCUREMENT_OFFICER", "FIELD_AGENT"]),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const { name, email, password, role } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return NextResponse.json({ error: "Email already exists." }, { status: 409 });
  }

  const newUser = await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      passwordHash: await bcrypt.hash(password, 12),
      role,
    },
  });

  await prisma.auditLog.create({
    data: {
      action: "USER_CREATED",
      actorId: user.id,
      actorRole: "ADMIN",
      targetId: newUser.id,
      targetType: "User",
      metadata: { email: normalizedEmail, role },
    },
  });

  return NextResponse.json({ success: true, id: newUser.id });
}
