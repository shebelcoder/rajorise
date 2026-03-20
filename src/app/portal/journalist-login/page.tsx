"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Camera, Eye, EyeOff, Shield } from "lucide-react";

export default function JournalistLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("journalist-login", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Access denied. Invalid credentials or not an approved journalist.");
      setLoading(false);
    } else {
      window.location.href = "/journalist/dashboard";
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#111827", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ maxWidth: "28rem", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: "4rem", height: "4rem", backgroundColor: "rgba(22,163,74,0.15)",
            border: "1px solid rgba(22,163,74,0.4)", borderRadius: "1rem",
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem",
          }}>
            <Camera style={{ width: "2rem", height: "2rem", color: "#4ade80" }} />
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff", marginBottom: "0.5rem" }}>
            Journalist Portal
          </h1>
          <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>Sign in to upload field reports</p>
        </div>

        <div style={{
          backgroundColor: "#1f2937", borderRadius: "1rem",
          border: "1px solid #374151", padding: "2rem",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            backgroundColor: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)",
            borderRadius: "0.75rem", padding: "0.75rem 1rem", marginBottom: "1.5rem",
            fontSize: "0.8rem", color: "#93c5fd",
          }}>
            <Shield style={{ width: "1rem", height: "1rem", flexShrink: 0 }} />
            Secure login for approved journalists only
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#d1d5db", marginBottom: "0.5rem" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="journalist@example.com"
                style={{
                  width: "100%", padding: "0.75rem 1rem", backgroundColor: "#111827",
                  border: "1px solid #374151", borderRadius: "0.75rem", color: "#fff",
                  outline: "none", fontSize: "0.875rem",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#d1d5db", marginBottom: "0.5rem" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{
                    width: "100%", padding: "0.75rem 3rem 0.75rem 1rem", backgroundColor: "#111827",
                    border: "1px solid #374151", borderRadius: "0.75rem", color: "#fff",
                    outline: "none", fontSize: "0.875rem",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  style={{
                    position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", color: "#6b7280",
                  }}
                >
                  {show ? <EyeOff style={{ width: "1.25rem", height: "1.25rem" }} /> : <Eye style={{ width: "1.25rem", height: "1.25rem" }} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "0.75rem", padding: "0.75rem 1rem",
                fontSize: "0.8rem", color: "#fca5a5",
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "0.85rem", backgroundColor: "#16a34a",
                color: "#fff", fontWeight: 600, borderRadius: "0.75rem",
                border: "none", cursor: loading ? "wait" : "pointer",
                opacity: loading ? 0.6 : 1, fontSize: "0.875rem",
              }}
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "0.8rem", color: "#6b7280", marginTop: "1.5rem" }}>
            Not yet approved? Contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
