import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Globe, MapPin } from "lucide-react";
import { REGIONS } from "@/lib/locations";

export default async function AdminOperationsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "ADMIN") redirect("/portal/admin-login");

  // Get case counts per region
  const regionStats = await Promise.all(
    REGIONS.map(async (r) => {
      const [total, active, completed, totalRaised] = await Promise.all([
        prisma.report.count({ where: { region: r.name } }),
        prisma.report.count({ where: { region: r.name, status: { in: ["APPROVED", "FUNDING"] } } }),
        prisma.report.count({ where: { region: r.name, status: "COMPLETED" } }),
        prisma.donation.aggregate({ _sum: { amount: true }, where: { status: "CONFIRMED", report: { region: r.name } } }),
      ]);
      return {
        name: r.name,
        active: r.active,
        districts: r.districts.length,
        totalCases: total,
        activeCases: active,
        completedCases: completed,
        raised: Number(totalRaised._sum.amount || 0),
      };
    })
  );

  const activeRegions = regionStats.filter((r) => r.active);
  const inactiveRegions = regionStats.filter((r) => !r.active);

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <Globe size={22} style={{ color: "#58a6ff" }} />
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#e6edf3", margin: 0 }}>Operations</h1>
          <p style={{ color: "#6b7280", fontSize: 13, marginTop: 2 }}>Region monitoring + expansion planning</p>
        </div>
      </div>

      {/* Active regions */}
      <h2 style={{ fontSize: 14, fontWeight: 700, color: "#22c55e", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#22c55e", display: "inline-block" }} />
        Active Regions
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12, marginBottom: 32 }}>
        {activeRegions.map((r) => (
          <div key={r.name} style={{ backgroundColor: "#111827", border: "1px solid #1c2333", borderRadius: 12, padding: 20, borderTop: "3px solid #22c55e" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#e6edf3", margin: 0 }}>{r.name}</h3>
              <span style={{ fontSize: 10, fontWeight: 700, backgroundColor: "#0f2c1a", color: "#22c55e", padding: "2px 8px", borderRadius: 99 }}>ACTIVE</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { label: "Districts", value: r.districts },
                { label: "Total Cases", value: r.totalCases },
                { label: "Active Cases", value: r.activeCases },
                { label: "Completed", value: r.completedCases },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p style={{ fontSize: 20, fontWeight: 900, color: "#e6edf3", margin: 0 }}>{value}</p>
                  <p style={{ fontSize: 10, color: "#6b7280", margin: 0 }}>{label}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, padding: "8px 12px", backgroundColor: "#0f2c1a", borderRadius: 8, fontSize: 13, fontWeight: 700, color: "#22c55e" }}>
              ${r.raised.toLocaleString()} raised
            </div>
          </div>
        ))}
      </div>

      {/* Expansion pipeline */}
      <h2 style={{ fontSize: 14, fontWeight: 700, color: "#6b7280", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
        <MapPin size={14} />
        Expansion Pipeline ({inactiveRegions.length} regions)
      </h2>
      <div style={{ backgroundColor: "#111827", border: "1px solid #1c2333", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px 100px", padding: "10px 20px", borderBottom: "1px solid #1c2333" }}>
          {["Region", "Districts", "Cases", "Status"].map((h) => (
            <span key={h} style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase" }}>{h}</span>
          ))}
        </div>
        {inactiveRegions.map((r, i) => (
          <div key={r.name} style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px 100px", padding: "10px 20px", borderBottom: i < inactiveRegions.length - 1 ? "1px solid #1c2333" : "none", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#e6edf3" }}>{r.name}</span>
            <span style={{ fontSize: 12, color: "#6b7280" }}>{r.districts}</span>
            <span style={{ fontSize: 12, color: "#6b7280" }}>{r.totalCases}</span>
            <span style={{ fontSize: 10, fontWeight: 700, backgroundColor: "#21262d", color: "#6b7280", padding: "2px 8px", borderRadius: 99, width: "fit-content" }}>
              Planned
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
