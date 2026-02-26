import Link from "next/link";
import { Leaf, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-8 max-w-4xl mx-auto">
      <div className="bg-green-100 p-6 rounded-3xl text-green-700 inline-block">
        <Leaf size={64} className="animate-bounce" />
      </div>

      <div className="space-y-4">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
          Rescue Food, <span className="text-green-700">Feed Hope.</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          The ultimate platform connecting food donors, NGOs, and recipients to eliminate food waste and ensure no one goes hungry.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
        <Link
          href="/register"
          className="w-full sm:w-auto px-8 py-4 bg-green-700 text-white font-bold rounded-2xl hover:bg-green-800 transition-all flex items-center justify-center gap-2 group shadow-lg"
        >
          Get Started as a Hero
          <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          href="/login"
          className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 font-bold rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all shadow-sm"
        >
          Login to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 w-full">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-left">
          <div className="text-green-700 font-bold text-lg mb-2">1. Donate</div>
          <p className="text-gray-500 text-sm">Donors post details about surplus food and their location for pickup.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-left">
          <div className="text-green-700 font-bold text-lg mb-2">2. Accept</div>
          <p className="text-gray-500 text-sm">NGOs browse a live map of available food and accept rescues instantly.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-left">
          <div className="text-green-700 font-bold text-lg mb-2">3. Deliver</div>
          <p className="text-gray-500 text-sm">Volunteers deliver food to verified recipients, tracking impact in real-time.</p>
        </div>
      </div>
    </div>
  );
}
