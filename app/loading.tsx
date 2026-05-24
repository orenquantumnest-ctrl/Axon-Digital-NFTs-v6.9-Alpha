import { Activity } from "lucide-react";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505]/80 backdrop-blur-2xl">
      <div className="relative flex items-center justify-center mb-6">
        <div className="absolute inset-0 bg-[#D4AF37]/20 blur-[30px] rounded-full w-24 h-24 mx-auto animate-pulse"></div>
        <Image 
          src="/axon-logo-icon.png" 
          alt="AXON Loading" 
          width={64}
          height={64}
          className="w-16 h-16 object-contain z-10 animate-bounce"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="flex flex-col items-center gap-3">
        <Activity className="w-6 h-6 text-[#00FFB2] animate-pulse" />
        <p className="text-xs font-mono text-[#00FFB2] uppercase tracking-[0.2em] animate-pulse">
          Establishing Secure Connection...
        </p>
      </div>
    </div>
  );
}
