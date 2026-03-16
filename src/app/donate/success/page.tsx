import Link from "next/link";
import { CheckCircle, Heart, ArrowRight } from "lucide-react";

export default function DonateSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20 px-4">
      <div className="max-w-lg w-full text-center">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
            Thank You! 🌱
          </h1>
          <p className="text-gray-600 mb-2 text-lg">Your donation has been received.</p>
          <p className="text-gray-500 text-sm mb-8">
            Your generosity will change lives. We will send a receipt to your email if you provided one.
          </p>

          <div className="bg-green-50 rounded-2xl p-5 mb-8 text-left">
            <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {[
                "Your donation is processed securely by Stripe",
                "Funds are directed to verified field projects",
                "Our journalists document the impact",
                "We publish monthly transparency reports",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-green-200 text-green-800 text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/impact" className="btn-primary w-full justify-center py-3">
              <Heart className="w-4 h-4 fill-white" />
              See Your Impact
            </Link>
            <Link href="/stories" className="flex items-center justify-center gap-2 text-green-600 font-semibold hover:underline py-2">
              Read Success Stories <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/" className="text-gray-400 text-sm hover:text-gray-600 transition-colors">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
