import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DollarSign, TrendingUp, CreditCard, ArrowDownRight } from "lucide-react";

export default async function AdminFinancePage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "ADMIN") redirect("/portal/admin-login");

  const [totalAgg, confirmedCount, donations, topCases] = await Promise.all([
    prisma.donation.aggregate({
      _sum: { amount: true },
      _avg: { amount: true },
      _count: true,
      where: { status: "CONFIRMED" },
    }),
    prisma.donation.count({ where: { status: "CONFIRMED" } }),
    prisma.donation.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true, amount: true, currency: true, paymentMethod: true,
        isAnonymous: true, status: true, createdAt: true,
        user: { select: { name: true, email: true } },
        report: { select: { title: true, slug: true } },
      },
    }),
    prisma.report.findMany({
      where: { status: { in: ["APPROVED", "FUNDING", "COMPLETED"] } },
      orderBy: { raisedAmount: "desc" },
      take: 5,
      select: { id: true, title: true, goalAmount: true, raisedAmount: true, status: true },
    }),
  ]);

  const totalRaised = Number(totalAgg._sum.amount || 0);
  const avgDonation = Number(totalAgg._avg.amount || 0);

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <DollarSign size={22} style={{ color: "#22c55e" }} />
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#e6edf3", margin: 0 }}>Finance</h1>
          <p style={{ color: "#6b7280", fontSize: 13, marginTop: 2 }}>Donation tracking + per-case funding</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
        {[
          { label: "Total Raised", value: `$${totalRaised.toLocaleString()}`, icon: DollarSign, color: "#22c55e" },
          { label: "Total Donations", value: confirmedCount, icon: CreditCard, color: "#58a6ff" },
          { label: "Avg Donation", value: `$${avgDonation.toFixed(2)}`, icon: TrendingUp, color: "#f59e0b" },
          { label: "Pending", value: donations.filter((d) => d.status === "PENDING").length, icon: ArrowDownRight, color: "#eab308" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} style={{ backgroundColor: "#111827", border: "1px solid #1c2333", borderRadius: 12, padding: "18px 16px", textAlign: "center" }}>
            <Icon size={18} style={{ color, margin: "0 auto 8px" }} />
            <p style={{ fontSize: 22, fontWeight: 900, color: "#e6edf3", lineHeight: 1, margin: 0 }}>{value}</p>
            <p style={{ fontSize: 10, color: "#6b7280", marginTop: 6 }}>{label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        {/* Donation log */}
        <div style={{ backgroundColor: "#111827", border: "1px solid #1c2333", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #1c2333" }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#e6edf3", margin: 0 }}>Recent Donations</h2>
          </div>
          {donations.map((d, i) => (
            <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px", borderBottom: i < donations.length - 1 ? "1px solid #1c2333" : "none" }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#e6edf3", margin: 0 }}>
                  {d.isAnonymous ? "Anonymous" : d.user?.name || d.user?.email || "Unknown"}
                </p>
                <p style={{ fontSize: 10, color: "#6b7280", marginTop: 2 }}>
                  {d.report?.title?.slice(0, 40) || "General"} · {d.paymentMethod} · {new Date(d.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: "#22c55e" }}>${Number(d.amount)}</span>
                <span style={{
                  display: "block", fontSize: 9, fontWeight: 700, marginTop: 2,
                  color: d.status === "CONFIRMED" ? "#22c55e" : "#eab308",
                }}>{d.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Top funded cases */}
        <div style={{ backgroundColor: "#111827", border: "1px solid #1c2333", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #1c2333" }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#e6edf3", margin: 0 }}>Top Funded Cases</h2>
          </div>
          {topCases.map((c, i) => {
            const goal = Number(c.goalAmount);
            const raised = Number(c.raisedAmount);
            const pct = goal > 0 ? Math.min(Math.round((raised / goal) * 100), 100) : 0;
            return (
              <div key={c.id} style={{ padding: "12px 20px", borderBottom: i < topCases.length - 1 ? "1px solid #1c2333" : "none" }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#e6edf3", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.title}</p>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "#6b7280" }}>
                  <span>${raised.toLocaleString()} / ${goal.toLocaleString()}</span>
                  <span style={{ fontWeight: 700, color: pct >= 100 ? "#22c55e" : "#e6edf3" }}>{pct}%</span>
                </div>
                <div style={{ height: 3, backgroundColor: "#21262d", borderRadius: 99, marginTop: 4 }}>
                  <div style={{ height: "100%", backgroundColor: pct >= 100 ? "#22c55e" : "#f59e0b", borderRadius: 99, width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
