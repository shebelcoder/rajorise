"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart, CreditCard, Smartphone, Shield, CheckCircle } from "lucide-react";
import Link from "next/link";

const AMOUNTS = [1, 5, 10, 25, 50, 100, 250, 500];

const CATEGORIES = [
  { id: "general", label: "General Fund", description: "Split across all projects", icon: "🌍" },
  { id: "water", label: "Water Delivery", description: "Clean water trucks", icon: "💧" },
  { id: "food", label: "Food Aid", description: "Emergency food packages", icon: "🌾" },
  { id: "education", label: "Education", description: "School fees & supplies", icon: "📚" },
  { id: "medical", label: "Medical", description: "Village medical camps", icon: "🏥" },
];

function DonateForm() {
  const params = useSearchParams();
  const { data: session } = useSession();
  const preAmount = params.get("amount");
  const caseSlug = params.get("case");

  const [amount, setAmount] = useState<number | null>(preAmount ? Number(preAmount) : 10);
  const [custom, setCustom] = useState(preAmount && !AMOUNTS.includes(Number(preAmount)) ? preAmount : "");
  const [category, setCategory] = useState("general");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const finalAmount = custom ? parseFloat(custom) : amount;

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalAmount || finalAmount < 1) { setError("Please enter a valid amount (min $1)"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/donate/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalAmount, currency: "usd", category, name, email, message, anonymous,
          reportId: caseSlug || undefined,
          userId: (session?.user as { id?: string } | undefined)?.id || undefined,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setError(data.error || "Something went wrong.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleDonate} className="space-y-8">
      {/* Amount selection */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 text-lg">Choose an Amount</h3>
        <div className="grid grid-cols-4 gap-3 mb-4">
          {AMOUNTS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => { setAmount(a); setCustom(""); }}
              className={`py-3 rounded-xl font-bold text-sm transition-all ${
                amount === a && !custom
                  ? "bg-green-600 text-white shadow-md scale-105"
                  : "bg-gray-50 text-gray-700 hover:bg-green-50 hover:text-green-700 border border-gray-200"
              }`}
            >
              ${a}
            </button>
          ))}
        </div>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
          <input
            type="number"
            min={1}
            placeholder="Other amount"
            value={custom}
            onChange={(e) => { setCustom(e.target.value); setAmount(null); }}
            className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 text-lg">Direct Your Donation</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                category === c.id
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-green-300"
              }`}
            >
              <span className="text-2xl">{c.icon}</span>
              <div>
                <p className="font-semibold text-sm text-gray-900">{c.label}</p>
                <p className="text-xs text-gray-500">{c.description}</p>
              </div>
              {category === c.id && <CheckCircle className="w-5 h-5 text-green-600 ml-auto flex-shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      {/* Donor info */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 text-lg">Your Information <span className="text-gray-400 font-normal text-sm">(optional)</span></h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={anonymous}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none disabled:opacity-40"
          />
          <input
            type="email"
            placeholder="Email (for receipt)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none"
          />
          <textarea
            placeholder="Leave a message of hope (optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none resize-none"
          />
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="w-4 h-4 rounded accent-green-600"
            />
            <span className="text-sm text-gray-600">Donate anonymously</span>
          </label>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!finalAmount || loading}
        className="w-full btn-primary justify-center text-lg py-4 disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Redirecting to Stripe...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-white" />
            Donate {finalAmount ? `$${finalAmount}` : "Now"}
          </span>
        )}
      </button>

      <div className="flex items-center justify-center gap-6 text-gray-400 text-xs">
        <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> SSL Encrypted</span>
        <span className="flex items-center gap-1"><CreditCard className="w-3.5 h-3.5" /> Powered by Stripe</span>
        <span className="flex items-center gap-1"><Smartphone className="w-3.5 h-3.5" /> Apple / Google Pay</span>
      </div>
    </form>
  );
}

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 mb-4 text-sm font-medium text-green-700">
            <Heart className="w-4 h-4 fill-green-700" />
            Every dollar changes a life
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3">
            Make a Donation
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Your contribution goes directly to communities in need — water, food, education, and medical support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <Suspense fallback={<div className="animate-pulse h-96 bg-gray-50 rounded-xl" />}>
              <DonateForm />
            </Suspense>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Impact */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Your Impact</h3>
              <ul className="space-y-3 text-sm">
                {[
                  { amount: "$1", impact: "Provides clean water for 1 person for a week" },
                  { amount: "$5", impact: "Feeds a child for a week" },
                  { amount: "$10", impact: "Supplies one month of medicine" },
                  { amount: "$25", impact: "School supplies for one student" },
                  { amount: "$50", impact: "One month of food for a family" },
                  { amount: "$120", impact: "Full year of school for one student" },
                ].map(({ amount, impact }) => (
                  <li key={amount} className="flex gap-3">
                    <span className="font-bold text-green-600 min-w-[40px]">{amount}</span>
                    <span className="text-gray-600">{impact}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sponsor instead */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl border border-green-100 p-6">
              <h3 className="font-bold text-gray-900 mb-2">Sponsor a Person</h3>
              <p className="text-sm text-gray-600 mb-4">
                Follow one student or family's journey and receive progress updates directly.
              </p>
              <Link href="/students" className="btn-primary text-sm py-2.5 px-5 w-full justify-center">
                View Students
              </Link>
            </div>

            {/* Trust */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-3">You Can Trust Us</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {[
                  "Payments secured by Stripe",
                  "We never store card data",
                  "100% of your donation goes to the cause",
                  "Admin-verified projects only",
                  "Monthly transparency reports",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
