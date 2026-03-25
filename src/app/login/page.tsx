"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [forgot, setForgot] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("donor-login", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
    } else {
      window.location.href = "/account";
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess("Account created! Signing you in...");
        // Auto sign in after registration
        const result = await signIn("donor-login", {
          email,
          password,
          redirect: false,
        });
        if (!result?.error) {
          window.location.href = "/account";
        } else {
          setSuccess("Account created! Please sign in.");
          setMode("login");
        }
      } else {
        setError(data.error || "Registration failed.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem 1rem 4rem" }}>
      <div style={{ maxWidth: "28rem", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", marginBottom: "1rem" }}>
            <Image src="/logo.png" alt="RajoRise" width={40} height={40} style={{ borderRadius: 10 }} />
            <span style={{ fontWeight: 800, fontSize: "1.5rem", color: "#111827" }}>
              Rajo<span style={{ color: "#16a34a" }}>Rise</span>
            </span>
          </Link>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#111827", marginTop: "0.75rem" }}>
            {mode === "login" ? "Welcome Back" : "Create Your Account"}
          </h1>
          <p style={{ color: "#6b7280", marginTop: "0.25rem" }}>
            {mode === "login" ? "Sign in to track your donations and impact" : "Join RajoRise and start making a difference"}
          </p>
        </div>

        <div style={{
          backgroundColor: "#fff", borderRadius: "1rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)", border: "1px solid #f3f4f6",
          padding: "2rem",
        }}>
          <form onSubmit={mode === "login" ? handleLogin : handleRegister} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {mode === "register" && (
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#374151", marginBottom: "0.5rem" }}>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your full name"
                  style={{
                    width: "100%", padding: "0.75rem 1rem",
                    border: "1px solid #e5e7eb", borderRadius: "0.75rem",
                    outline: "none", fontSize: "0.875rem",
                  }}
                />
              </div>
            )}

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#374151", marginBottom: "0.5rem" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={{
                  width: "100%", padding: "0.75rem 1rem",
                  border: "1px solid #e5e7eb", borderRadius: "0.75rem",
                  outline: "none", fontSize: "0.875rem",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#374151", marginBottom: "0.5rem" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="••••••••"
                  style={{
                    width: "100%", padding: "0.75rem 3rem 0.75rem 1rem",
                    border: "1px solid #e5e7eb", borderRadius: "0.75rem",
                    outline: "none", fontSize: "0.875rem",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  style={{
                    position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", color: "#9ca3af",
                  }}
                >
                  {show ? <EyeOff style={{ width: "1.25rem", height: "1.25rem" }} /> : <Eye style={{ width: "1.25rem", height: "1.25rem" }} />}
                </button>
              </div>
              {mode === "register" && (
                <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.25rem" }}>Minimum 8 characters</p>
              )}
            </div>

            {error && (
              <div style={{
                backgroundColor: "#fef2f2", border: "1px solid #fecaca",
                borderRadius: "0.75rem", padding: "0.75rem 1rem",
                fontSize: "0.8rem", color: "#dc2626",
              }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{
                backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0",
                borderRadius: "0.75rem", padding: "0.75rem 1rem",
                fontSize: "0.8rem", color: "#16a34a",
              }}>
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: "100%", padding: "0.85rem", justifyContent: "center",
                opacity: loading ? 0.6 : 1, cursor: loading ? "wait" : "pointer",
              }}
            >
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#6b7280", marginTop: "1.5rem" }}>
            {mode === "login" ? (
              <>
                No account?{" "}
                <button onClick={() => { setMode("register"); setError(""); }} style={{ color: "#16a34a", fontWeight: 600, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                  Create one free
                </button>
                {" "} — or{" "}
                <Link href="/donate" style={{ color: "#16a34a", textDecoration: "underline" }}>donate without signing in</Link>
                <br />
                <button onClick={() => setForgot(true)} style={{ color: "#6b7280", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                  Forgot your password?
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button onClick={() => { setMode("login"); setError(""); }} style={{ color: "#16a34a", fontWeight: 600, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>

        {/* Forgot Password Modal */}
        {forgot && (
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "1rem" }}>
            <div style={{ backgroundColor: "#fff", borderRadius: "1rem", padding: "2rem", maxWidth: "24rem", width: "100%", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", marginBottom: "0.5rem" }}>Reset Password</h2>
              <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "1rem" }}>Enter your email and we&apos;ll send a reset link (expires in 30 minutes).</p>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setForgotLoading(true);
                setForgotMsg("");
                try {
                  const res = await fetch("/api/auth/forgot-password", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                  });
                  const data = await res.json();
                  setForgotMsg(data.message || data.error || "Check your email.");
                } catch {
                  setForgotMsg("Network error.");
                } finally {
                  setForgotLoading(false);
                }
              }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid #e5e7eb", borderRadius: "0.75rem", outline: "none", fontSize: "0.875rem", marginBottom: "0.75rem" }}
                />
                {forgotMsg && (
                  <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "0.75rem", padding: "0.75rem", fontSize: "0.8rem", color: "#16a34a", marginBottom: "0.75rem" }}>
                    {forgotMsg}
                  </div>
                )}
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button type="submit" disabled={forgotLoading} style={{ flex: 1, padding: "0.75rem", backgroundColor: "#16a34a", color: "#fff", fontWeight: 600, borderRadius: "0.75rem", border: "none", cursor: forgotLoading ? "wait" : "pointer", opacity: forgotLoading ? 0.6 : 1 }}>
                    {forgotLoading ? "Sending..." : "Send Reset Link"}
                  </button>
                  <button type="button" onClick={() => { setForgot(false); setForgotMsg(""); }} style={{ padding: "0.75rem 1rem", backgroundColor: "#f3f4f6", color: "#374151", fontWeight: 500, borderRadius: "0.75rem", border: "none", cursor: "pointer" }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
