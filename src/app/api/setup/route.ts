import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.NEXTAUTH_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: string[] = [];

  try {
    const accounts = [
      { email: "admin@rajorise.com", name: "RajoRise Admin", password: "Admin123!", role: "ADMIN" as const },
      { email: "journalist@rajorise.com", name: "Field Journalist", password: "Journal123!", role: "JOURNALIST" as const },
      { email: "donor@rajorise.com", name: "Test Donor", password: "Donor123!", role: "DONOR" as const },
    ];

    for (const acc of accounts) {
      const hash = await bcrypt.hash(acc.password, 12);

      await prisma.user.upsert({
        where: { email: acc.email },
        update: { passwordHash: hash, role: acc.role, isActive: true, name: acc.name },
        create: { email: acc.email, name: acc.name, passwordHash: hash, role: acc.role },
      });

      // Verify the hash works
      const verify = await bcrypt.compare(acc.password, hash);
      results.push(`${acc.role}: ${acc.email} → hash verified: ${verify}`);
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json({ error: "Setup failed", details: String(error) }, { status: 500 });
  }
}
