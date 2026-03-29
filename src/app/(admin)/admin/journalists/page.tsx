import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Camera, CheckCircle, Clock, XCircle, FileEdit } from "lucide-react";

export default async function AdminJournalistsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "ADMIN") redirect("/portal/admin-login");

  const journalists = await prisma.user.findMany({
    where: { role: "JOURNALIST" },
    select: {
      id: true, name: true, email: true, isActive: true, createdAt: true, lastLoginAt: true,
    },
  });

  // Get case stats per journalist
  const journalistStats = await Promise.all(
    journalists.map(async (j) => {
      const [total, drafts, pending, approved, rejected] = await Promise.all([
        prisma.report.count({ where: { journalistId: j.id } }),
        prisma.report.count({ where: { journalistId: j.id, status: "DRAFT" } }),
        prisma.report.count({ where: { journalistId: j.id, status: "PENDING" } }),
        prisma.report.count({ where: { journalistId: j.id, status: { in: ["APPROVED", "FUNDING", "COMPLETED"] } } }),
        prisma.report.count({ where: { journalistId: j.id, status: "REJECTED" } }),
      ]);
      const approvalRate = total > 0 ? Math.round((approved / Math.max(total - drafts, 1)) * 100) : 0;
      return { ...j, total, drafts, pending, approved, rejected, approvalRate };
    })
  );

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <Camera size={22} style={{ color: "#58a6ff" }} />
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#e6edf3", margin: 0 }}>Journalist Panel</h1>
          <p style={{ color: "#6b7280", fontSize: 13, marginTop: 2 }}>{journalists.length} journalists — performance tracking</p>
        </div>
      </div>

      <div style={{ backgroundColor: "#111827", border: "1px solid #1c2333", borderRadius: 10, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1c2333" }}>
              {["Journalist", "Status", "Total", "Drafts", "Pending", "Approved", "Rejected", "Approval Rate"].map((h) => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {journalistStats.map((j) => (
              <tr key={j.id} style={{ borderBottom: "1px solid #1c2333" }}>
                <td style={{ padding: "10px 14px" }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#e6edf3", margin: 0 }}>{j.name || "—"}</p>
                  <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>{j.email}</p>
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, backgroundColor: j.isActive ? "#0f2c1a" : "#2c0f0f", color: j.isActive ? "#22c55e" : "#ef4444" }}>
                    {j.isActive ? "Active" : "Disabled"}
                  </span>
                </td>
                <td style={{ padding: "10px 14px", fontSize: 13, fontWeight: 700, color: "#e6edf3" }}>{j.total}</td>
                <td style={{ padding: "10px 14px" }}><span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#8b949e" }}><FileEdit size={11} /> {j.drafts}</span></td>
                <td style={{ padding: "10px 14px" }}><span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#eab308" }}><Clock size={11} /> {j.pending}</span></td>
                <td style={{ padding: "10px 14px" }}><span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#22c55e" }}><CheckCircle size={11} /> {j.approved}</span></td>
                <td style={{ padding: "10px 14px" }}><span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#ef4444" }}><XCircle size={11} /> {j.rejected}</span></td>
                <td style={{ padding: "10px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 60, height: 4, backgroundColor: "#21262d", borderRadius: 99 }}>
                      <div style={{ height: "100%", width: `${j.approvalRate}%`, backgroundColor: j.approvalRate >= 70 ? "#22c55e" : j.approvalRate >= 40 ? "#eab308" : "#ef4444", borderRadius: 99 }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#e6edf3" }}>{j.approvalRate}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
