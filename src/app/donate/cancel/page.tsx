import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";

export default function DonateCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Donation Cancelled</h1>
          <p className="text-gray-500 mb-8">
            No worries — your payment was not processed. You can try again whenever you are ready.
          </p>
          <Link href="/donate" className="btn-primary w-full justify-center py-3 mb-3">
            <ArrowLeft className="w-4 h-4" /> Try Again
          </Link>
          <Link href="/" className="text-gray-400 text-sm hover:text-gray-600 transition-colors block">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
