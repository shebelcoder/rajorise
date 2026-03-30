"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Heart, ArrowRight } from "lucide-react";

function SuccessContent() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
        <div style={{ backgroundColor: "#fff", borderRadius: 24, border: "1px solid #e5e7eb", padding: "3rem 2.5rem", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", backgroundColor: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <CheckCircle size={40} style={{ color: "#16a34a" }} />
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", marginBottom: 8 }}>
            Thank You!
          </h1>
          <p style={{ fontSize: 16, color: "#4b5563", marginBottom: 4 }}>Your donation has been received.</p>
          <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 32 }}>
            Your generosity will change lives. A receipt will be sent to your email.
          </p>

          {sessionId && (
            <div style={{ backgroundColor: "#f9fafb", borderRadius: 12, padding: "12px 16px", marginBottom: 24, fontSize: 12, color: "#6b7280" }}>
              Reference: <span style={{ fontFamily: "monospace", color: "#374151" }}>{sessionId.slice(0, 20)}...</span>
            </div>
          )}

          <div style={{ backgroundColor: "#f0fdf4", borderRadius: 16, padding: 20, marginBottom: 24, textAlign: "left" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 12 }}>What happens next?</h3>
            {[
              "Your donation is processed securely by Stripe",
              "Funds go directly to verified cases and people",
              "Journalists document the real impact on the ground",
              "You can track progress on your account dashboard",
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                <span style={{ width: 22, height: 22, borderRadius: "50%", backgroundColor: "#dcfce7", color: "#16a34a", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: 13, color: "#4b5563" }}>{step}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link href="/impact" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              backgroundColor: "#16a34a", color: "#fff", padding: "12px", borderRadius: 12,
              fontWeight: 700, fontSize: 14, textDecoration: "none",
            }}>
              <Heart size={16} style={{ fill: "#fff" }} /> See Your Impact
            </Link>
            <Link href="/account" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              backgroundColor: "#f3f4f6", color: "#374151", padding: "12px", borderRadius: 12,
              fontWeight: 600, fontSize: 14, textDecoration: "none",
            }}>
              View My Donations
            </Link>
            <Link href="/stories" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#16a34a", fontWeight: 600, fontSize: 13, textDecoration: "none", padding: "8px" }}>
              Read Success Stories <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DonateSuccessPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
