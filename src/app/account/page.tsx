"use client";

export const dynamic = "force-dynamic";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, LogOut, DollarSign, History, FolderOpen } from "lucide-react";

interface DonationItem {
  id: string; amount: number; currency: string; status: string;
  date: string; caseTitle: string; caseSlug: string | null;
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<{ totalDonated: number; donationCount: number; lastDonation: string | null; donations: DonationItem[] } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/account").then((r) => r.json()).then(setData).catch(() => {});
    }
  }, [status]);

  if (status === "loading") {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f9fafb" }}><p style={{ color: "#6b7280" }}>Loading...</p></div>;
  }
  if (!session) return null;

  const totalDonated = data?.totalDonated || 0;
  const donationCount = data?.donationCount || 0;
  const lastDonation = data?.lastDonation ? new Date(data.lastDonation).toLocaleDateString() : "—";
  const donations = data?.donations || [];

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
          <button onClick={() => signOut({ callbackUrl: "/" })} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "0.75rem", cursor: "pointer", fontSize: "0.875rem", color: "#6b7280" }}>
            <LogOut style={{ width: "1rem", height: "1rem" }} /> Sign Out
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
          <div style={{ backgroundColor: "#fff", borderRadius: "1rem", padding: "1.5rem", border: "1px solid #f3f4f6" }}>
            <DollarSign style={{ width: "1.5rem", height: "1.5rem", color: "#16a34a", marginBottom: "0.5rem" }} />
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Total Donated</p>
            <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "#111827" }}>${totalDonated.toLocaleString()}</p>
          </div>
          <div style={{ backgroundColor: "#fff", borderRadius: "1rem", padding: "1.5rem", border: "1px solid #f3f4f6" }}>
            <Heart style={{ width: "1.5rem", height: "1.5rem", color: "#ef4444", marginBottom: "0.5rem" }} />
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Donations Made</p>
            <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "#111827" }}>{donationCount}</p>
          </div>
          <div style={{ backgroundColor: "#fff", borderRadius: "1rem", padding: "1.5rem", border: "1px solid #f3f4f6" }}>
            <History style={{ width: "1.5rem", height: "1.5rem", color: "#3b82f6", marginBottom: "0.5rem" }} />
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Last Donation</p>
            <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "#111827" }}>{lastDonation}</p>
          </div>
        </div>

        {/* Donation history */}
        <div style={{ backgroundColor: "#fff", borderRadius: "1rem", border: "1px solid #f3f4f6", overflow: "hidden" }}>
          <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827", margin: 0 }}>Donation History</h2>
            <FolderOpen size={16} style={{ color: "#9ca3af" }} />
          </div>

          {donations.length === 0 ? (
            <div style={{ padding: "3rem 1.5rem", textAlign: "center" }}>
              <p style={{ color: "#6b7280", marginBottom: "1rem" }}>You haven&apos;t made any donations yet.</p>
              <Link href="/donate" style={{ display: "inline-flex", alignItems: "center", gap: 8, backgroundColor: "#16a34a", color: "#fff", padding: "10px 20px", borderRadius: 12, fontWeight: 700, textDecoration: "none" }}>
                Make Your First Donation
              </Link>
            </div>
          ) : (
            donations.map((d, i) => (
              <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 24px", borderBottom: i < donations.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: 0 }}>
                    {d.caseSlug ? <Link href={`/cases/${d.caseSlug}`} style={{ color: "#111827", textDecoration: "none" }}>{d.caseTitle}</Link> : d.caseTitle}
                  </p>
                  <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{new Date(d.date).toLocaleDateString()}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#16a34a" }}>${d.amount}</span>
                  <span style={{ display: "block", fontSize: 10, fontWeight: 600, color: d.status === "CONFIRMED" ? "#16a34a" : "#eab308", marginTop: 2 }}>{d.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
