import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Settings } from "lucide-react";

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "ADMIN") redirect("/portal/admin-login");

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <Settings size={22} style={{ color: "#6b7280" }} />
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#e6edf3", margin: 0 }}>Settings</h1>
          <p style={{ color: "#6b7280", fontSize: 13, marginTop: 2 }}>Platform configuration</p>
        </div>
      </div>

      <div style={{ display: "grid", gap: 16, maxWidth: 600 }}>
        {[
          { label: "Platform Name", value: "RajoRise", desc: "Display name across the platform" },
          { label: "Active Region", value: "Gedo", desc: "Primary operating region" },
          { label: "Default Currency", value: "USD", desc: "All donations are processed in USD" },
          { label: "Admin Email Whitelist", value: "admin@rajorise.com", desc: "Authorized admin emails (comma-separated)" },
          { label: "AI Engine", value: "Enabled (Rule-based)", desc: "Add ANTHROPIC_API_KEY for Claude-powered analysis" },
        ].map(({ label, value, desc }) => (
          <div key={label} style={{ backgroundColor: "#111827", border: "1px solid #1c2333", borderRadius: 10, padding: "16px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#e6edf3", margin: 0 }}>{label}</p>
                <p style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{desc}</p>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#8b949e", backgroundColor: "#0d1117", padding: "4px 10px", borderRadius: 6, border: "1px solid #21262d" }}>
                {value}
              </span>
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 12, color: "#484f58", marginTop: 24 }}>
        Settings are configured via environment variables in Vercel. Contact the development team to make changes.
      </p>
    </div>
  );
}
