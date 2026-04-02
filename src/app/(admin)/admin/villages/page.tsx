import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { MapPin } from "lucide-react";
import VillagesManager from "@/components/admin/VillagesManager";

export default async function AdminVillagesPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "ADMIN") redirect("/portal/admin-login");

  const villages = await prisma.village.findMany({
    orderBy: [{ region: "asc" }, { district: "asc" }, { name: "asc" }],
  });

  const serialized = villages.map((v) => ({
    ...v,
    createdAt: v.createdAt.toISOString(),
  }));

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <MapPin size={22} style={{ color: "#22c55e" }} />
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#e6edf3", margin: 0 }}>Villages & Towns</h1>
          <p style={{ color: "#6b7280", fontSize: 13, marginTop: 2 }}>{villages.length} user-added villages across all districts</p>
        </div>
      </div>
      <VillagesManager villages={serialized} />
    </div>
  );
}
