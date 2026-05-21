"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans flex flex-col items-center justify-center p-6 selection:bg-[#00FFB2] selection:text-black">
      <div className="flex flex-col items-center max-w-md text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
          <ShieldCheck className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-3">System Anomaly Detected</h1>
        <p className="text-slate-400 mb-8 max-w-sm">
          An unexpected error occurred in the AXON digital interface. Please try reloading the instance.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => reset()}
            className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white font-bold text-sm tracking-wide hover:bg-white/10 transition-colors"
          >
            Re-initialize
          </button>
          <Link
            href="/"
            className="px-6 py-2.5 rounded-full bg-[#121212] border border-[#00FFB2]/30 text-[#00FFB2] font-bold text-sm tracking-wide hover:bg-[#00FFB2]/10 transition-colors shadow-[0_0_15px_rgba(0,255,178,0.1)]"
          >
            Return to Core
          </Link>
        </div>
      </div>
    </div>
  );
}
