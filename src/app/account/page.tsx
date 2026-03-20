"use client";

export const dynamic = "force-dynamic";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Heart, LogOut, DollarSign, History } from "lucide-react";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f9fafb" }}>
        <p style={{ color: "#6b7280" }}>Loading...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "56rem", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#111827" }}>
              Welcome, {session.user?.name || "Donor"}
            </h1>
            <p style={{ color: "#6b7280", marginTop: "0.25rem" }}>{session.user?.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.5rem 1rem", backgroundColor: "#fff",
              border: "1px solid #e5e7eb", borderRadius: "0.75rem",
              cursor: "pointer", fontSize: "0.875rem", color: "#6b7280",
            }}
          >
            <LogOut style={{ width: "1rem", height: "1rem" }} /> Sign Out
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <div style={{ backgroundColor: "#fff", borderRadius: "1rem", padding: "1.5rem", border: "1px solid #f3f4f6" }}>
            <DollarSign style={{ width: "1.5rem", height: "1.5rem", color: "#16a34a", marginBottom: "0.5rem" }} />
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Total Donated</p>
            <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "#111827" }}>$0.00</p>
          </div>

          <div style={{ backgroundColor: "#fff", borderRadius: "1rem", padding: "1.5rem", border: "1px solid #f3f4f6" }}>
            <Heart style={{ width: "1.5rem", height: "1.5rem", color: "#ef4444", marginBottom: "0.5rem" }} />
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Cases Supported</p>
            <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "#111827" }}>0</p>
          </div>

          <div style={{ backgroundColor: "#fff", borderRadius: "1rem", padding: "1.5rem", border: "1px solid #f3f4f6" }}>
            <History style={{ width: "1.5rem", height: "1.5rem", color: "#3b82f6", marginBottom: "0.5rem" }} />
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Last Donation</p>
            <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "#111827" }}>—</p>
          </div>
        </div>

        <div style={{ backgroundColor: "#fff", borderRadius: "1rem", padding: "2rem", border: "1px solid #f3f4f6", textAlign: "center" }}>
          <p style={{ color: "#6b7280", marginBottom: "1rem" }}>You haven&apos;t made any donations yet.</p>
          <Link
            href="/donate"
            className="btn-primary"
            style={{ display: "inline-flex", padding: "0.65rem 1.5rem" }}
          >
            Make Your First Donation
          </Link>
        </div>
      </div>
    </div>
  );
}
