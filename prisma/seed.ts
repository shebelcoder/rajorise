import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaNeonHttp } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaNeonHttp(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter } as never);

async function main() {
  console.log("Seeding RajoRise v2 database...\n");

  // ── Admin account ──
  const adminHash = await bcrypt.hash("RajoRise2026!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@rajorise.com" },
    update: { passwordHash: adminHash, role: "ADMIN" },
    create: {
      name: "RajoRise Admin",
      email: "admin@rajorise.com",
      passwordHash: adminHash,
      role: "ADMIN",
    },
  });
  console.log(`  ADMIN:      ${admin.email} / RajoRise2026!`);

  // ── Journalist account ──
  const journalistHash = await bcrypt.hash("Reporter2026!", 12);
  const journalist = await prisma.user.upsert({
    where: { email: "journalist@rajorise.com" },
    update: { passwordHash: journalistHash, role: "JOURNALIST" },
    create: {
      name: "Field Reporter",
      email: "journalist@rajorise.com",
      passwordHash: journalistHash,
      role: "JOURNALIST",
    },
  });
  console.log(`  JOURNALIST: ${journalist.email} / Reporter2026!`);

  // ── Demo donor account ──
  const donorHash = await bcrypt.hash("Donor2026!", 12);
  const donor = await prisma.user.upsert({
    where: { email: "donor@rajorise.com" },
    update: { passwordHash: donorHash, role: "DONOR" },
    create: {
      name: "Demo Donor",
      email: "donor@rajorise.com",
      passwordHash: donorHash,
      role: "DONOR",
    },
  });
  console.log(`  DONOR:      ${donor.email} / Donor2026!`);

  // ── Permissions (foundation for future use) ──
  const permissions = [
    { key: "cases.create", description: "Create new cases/reports" },
    { key: "cases.approve", description: "Approve or reject cases" },
    { key: "cases.delete", description: "Delete cases" },
    { key: "users.manage", description: "Create and manage users" },
    { key: "donations.view", description: "View all donation records" },
    { key: "audit.view", description: "View audit logs" },
    { key: "po.create", description: "Create purchase orders" },
    { key: "po.approve", description: "Approve purchase orders" },
    { key: "funds.freeze", description: "Freeze fund pools" },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { key: perm.key },
      update: { description: perm.description },
      create: perm,
    });
  }
  console.log(`  PERMISSIONS: ${permissions.length} seeded`);

  // ── Audit log for seed ──
  await prisma.auditLog.create({
    data: {
      action: "DATABASE_SEEDED",
      actorId: admin.id,
      actorRole: "ADMIN",
      metadata: {
        admin: admin.email,
        journalist: journalist.email,
        donor: donor.email,
      },
    },
  });

  console.log("\nSeeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
