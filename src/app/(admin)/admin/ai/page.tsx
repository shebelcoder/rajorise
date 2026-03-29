import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Brain } from "lucide-react";
import AIConsole from "@/components/admin/AIConsole";

export default async function AdminAIPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "ADMIN") redirect("/portal/admin-login");

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <Brain size={22} style={{ color: "#a78bfa" }} />
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#e6edf3", margin: 0 }}>AI Intelligence</h1>
          <p style={{ color: "#6b7280", fontSize: 13, marginTop: 2 }}>
            Strategic insights, operational recommendations, and data analysis
          </p>
        </div>
      </div>
      <AIConsole />
    </div>
  );
}
