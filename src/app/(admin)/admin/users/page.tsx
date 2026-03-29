import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import UsersTable from "@/components/admin/UsersTable";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "ADMIN") redirect("/portal/admin-login");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
      lastLoginAt: true,
      _count: { select: { donations: true, auditLogs: true } },
    },
  });

  const serialized = users.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
    lastLoginAt: u.lastLoginAt?.toISOString() || null,
    donationCount: u._count.donations,
    activityCount: u._count.auditLogs,
  }));

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#e6edf3", margin: 0 }}>User Management</h1>
        <p style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>
          {users.length} total users — create, edit roles, activate/deactivate
        </p>
      </div>
      <UsersTable users={serialized} />
    </div>
  );
}
