"use client";

import { useState } from "react";
import { CreditCard, Smartphone, Heart } from "lucide-react";

const AMOUNTS = [1, 5, 10, 25, 50, 100];

export default function DonationWidget({ compact = false }: { compact?: boolean }) {
  const [selected, setSelected] = useState<number | null>(10);
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);

  const amount = custom ? parseFloat(custom) : selected;

  const handleDonate = async () => {
    if (!amount || amount <= 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/donate/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency: "usd" }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-xl border border-gray-100 ${compact ? "p-5" : "p-8"}`}>
      {!compact && (
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Make a Difference Today</h3>
          <p className="text-gray-500 mt-1 text-sm">Every dollar changes a life</p>
        </div>
      )}

      {/* Amount grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {AMOUNTS.map((a) => (
          <button
            key={a}
            onClick={() => { setSelected(a); setCustom(""); }}
            className={`py-3 rounded-xl font-bold text-sm transition-all ${
              selected === a && !custom
                ? "bg-green-600 text-white shadow-md scale-105"
                : "bg-gray-50 text-gray-700 hover:bg-green-50 hover:text-green-700 border border-gray-200"
            }`}
          >
            ${a}
          </button>
        ))}
      </div>

      {/* Custom amount */}
      <div className="relative mb-5">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
        <input
          type="number"
          placeholder="Custom amount"
          value={custom}
          min={1}
          onChange={(e) => { setCustom(e.target.value); setSelected(null); }}
          className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none text-gray-900 font-medium"
        />
      </div>

      {/* Donate button */}
      <button
        onClick={handleDonate}
        disabled={!amount || loading}
        className="w-full btn-primary justify-center text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-white" />
            Donate {amount ? `$${amount}` : "Now"}
          </span>
        )}
      </button>

      {/* Payment icons */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <CreditCard className="w-5 h-5 text-gray-400" />
        <Smartphone className="w-5 h-5 text-gray-400" />
        <span className="text-xs text-gray-400 font-medium">Apple Pay • Google Pay • Card</span>
      </div>

      <p className="text-center text-xs text-gray-400 mt-3">
        Secured by Stripe • No account required
      </p>
    </div>
  );
}
