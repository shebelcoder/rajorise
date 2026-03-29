import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

/**
 * One-time setup endpoint to seed admin + journalist accounts.
 * Requires SETUP_SECRET query param for security.
 * DELETE THIS FILE after initial setup is complete.
 */
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");

  // Require a secret to prevent unauthorized seeding
  if (secret !== process.env.NEXTAUTH_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: string[] = [];

  try {
    // Admin account
    const adminEmail = "admin@rajorise.com";
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!existingAdmin) {
      await prisma.user.create({
        data: {
          email: adminEmail,
          name: "RajoRise Admin",
          passwordHash: await bcrypt.hash("Admin123!", 12),
          role: "ADMIN",
        },
      });
      results.push("Admin account created");
    } else {
      results.push("Admin account already exists");
    }

    // Journalist account
    const journalistEmail = "journalist@rajorise.com";
    const existingJournalist = await prisma.user.findUnique({ where: { email: journalistEmail } });
    if (!existingJournalist) {
      await prisma.user.create({
        data: {
          email: journalistEmail,
          name: "Field Journalist",
          passwordHash: await bcrypt.hash("Journal123!", 12),
          role: "JOURNALIST",
        },
      });
      results.push("Journalist account created");
    } else {
      results.push("Journalist account already exists");
    }

    // Test donor account
    const donorEmail = "donor@rajorise.com";
    const existingDonor = await prisma.user.findUnique({ where: { email: donorEmail } });
    if (!existingDonor) {
      await prisma.user.create({
        data: {
          email: donorEmail,
          name: "Test Donor",
          passwordHash: await bcrypt.hash("Donor123!", 12),
          role: "DONOR",
        },
      });
      results.push("Donor account created");
    } else {
      results.push("Donor account already exists");
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json({ error: "Setup failed", details: String(error) }, { status: 500 });
  }
}
