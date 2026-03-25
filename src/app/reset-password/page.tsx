"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const params = useSearchParams();
  const token = params.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.error || "Reset failed.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
        <div style={{ maxWidth: "28rem", width: "100%", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", marginBottom: "1rem" }}>Invalid Reset Link</h1>
          <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>This password reset link is invalid or has expired.</p>
          <Link href="/login" style={{ color: "#16a34a", fontWeight: 600 }}>Back to Login</Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
        <div style={{ maxWidth: "28rem", width: "100%", textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: "#f0fdf4", border: "2px solid #16a34a", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "1.5rem" }}>
            &#10003;
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", marginBottom: "0.5rem" }}>Password Reset</h1>
          <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>Your password has been updated. All existing sessions have been revoked.</p>
          <Link href="/login" style={{ display: "inline-block", backgroundColor: "#16a34a", color: "#fff", padding: "0.75rem 2rem", borderRadius: "0.75rem", fontWeight: 600, textDecoration: "none" }}>
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ maxWidth: "28rem", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
            <Image src="/logo.png" alt="RajoRise" width={40} height={40} style={{ borderRadius: 10 }} />
            <span style={{ fontWeight: 800, fontSize: "1.5rem", color: "#111827" }}>
              Rajo<span style={{ color: "#16a34a" }}>Rise</span>
            </span>
          </Link>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", marginTop: "1rem" }}>Set New Password</h1>
          <p style={{ color: "#6b7280", marginTop: "0.25rem" }}>This link expires after 30 minutes</p>
        </div>

        <div style={{ backgroundColor: "#fff", borderRadius: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", border: "1px solid #f3f4f6", padding: "2rem" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#374151", marginBottom: "0.5rem" }}>New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Min 8 chars, 1 uppercase, 1 number"
                style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid #e5e7eb", borderRadius: "0.75rem", outline: "none", fontSize: "0.875rem" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#374151", marginBottom: "0.5rem" }}>Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                placeholder="Type password again"
                style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid #e5e7eb", borderRadius: "0.75rem", outline: "none", fontSize: "0.875rem" }}
              />
            </div>

            {error && (
              <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "0.75rem", padding: "0.75rem 1rem", fontSize: "0.8rem", color: "#dc2626" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", padding: "0.85rem", backgroundColor: "#16a34a", color: "#fff", fontWeight: 600, borderRadius: "0.75rem", border: "none", cursor: loading ? "wait" : "pointer", fontSize: "0.875rem", opacity: loading ? 0.6 : 1 }}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
