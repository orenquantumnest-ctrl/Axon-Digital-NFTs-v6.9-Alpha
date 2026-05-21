import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans flex flex-col items-center justify-center p-6 selection:bg-[#00FFB2] selection:text-black">
      <div className="flex flex-col items-center max-w-md text-center">
        <div className="w-16 h-16 bg-[#eadd8f]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#D4AF37]/20 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
          <ShieldCheck className="w-8 h-8 text-[#D4AF37]" />
        </div>
        <h1 className="text-5xl font-bold text-white tracking-tighter mb-4">404</h1>
        <h2 className="text-xl font-medium text-white mb-3">Sector Not Found</h2>
        <p className="text-slate-400 mb-8 max-w-sm">
          The quadrant you are attempting to access does not exist or has been restricted.
        </p>
        <Link
          href="/"
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8942E] text-black font-bold text-sm tracking-wide hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all flex items-center gap-2"
        >
          Return to Core
        </Link>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
    </div>
  );
}
