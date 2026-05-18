import Image from "next/image";
import { ShieldCheck, LogIn, ChevronRight, Fingerprint } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-[#00FFB2] selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 relative rounded-xl overflow-hidden shadow-[0_0_15px_rgba(0,255,178,0.2)]">
              <Image
                src="https://axondigitalnfts.com/images/axon-logo-icon.png"
                alt="AXON Digital NFTs"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-xl font-bold tracking-widest text-white leading-none">
              AXON <br />
              <span className="text-[10px] text-[#00FFB2] tracking-[0.3em] font-normal">
                DIGITAL NFTs
              </span>
            </span>
          </div>
          <div className="hidden md:flex items-center justify-center space-x-8 text-sm font-medium tracking-wide">
            <a
              href="#"
              className="text-white hover:text-[#00FFB2] transition-colors"
            >
              Ecosystem
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Technology
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Manifesto
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/admin/login"
              className="text-xs uppercase tracking-widest font-bold text-slate-500 hover:text-white transition-colors flex items-center gap-2"
            >
              <Fingerprint className="w-4 h-4" /> Admin Access
            </a>
            <button className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8942E] text-black font-bold text-sm hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all flex items-center gap-2">
              Connect Wallet <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#00FFB2]/10 rounded-full blur-[140px] mix-blend-screen animate-pulse duration-10000"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-[#D4AF37]/5 rounded-full blur-[180px] mix-blend-screen"
            style={{ animationDelay: "2s" }}
          ></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col items-start pt-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
              <span className="flex h-2 w-2 rounded-full bg-[#00FFB2] animate-pulse shadow-[0_0_8px_#00FFB2]"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#00FFB2]">
                V6.9 Sovereign Core Live
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white leading-[1.05] mb-6">
              Own the Future <br /> of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#eadd8f]">
                Digital Wealth
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-xl leading-relaxed">
              AXON Digital NFTs provides institutional-grade digital asset
              staking, sovereign security, and high-yield automated mining
              pipelines.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button className="px-8 py-4 rounded-full bg-white text-black font-bold text-sm tracking-wide hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                Explore Plans <ChevronRight className="w-4 h-4" />
              </button>
              <button className="px-8 py-4 rounded-full bg-[#121212] border border-white/10 text-white font-bold text-sm tracking-wide hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                <Play className="w-4 h-4" /> Read Manifesto
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="relative w-full aspect-square md:aspect-video lg:aspect-square rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8)] z-10 transform lg:rotate-3 lg:hover:rotate-0 transition-transform duration-700">
              <Image
                src="https://axondigitalnfts.com/images/free-nft-plan.jpeg"
                alt="Free NFT Plan"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
              <div className="absolute bottom-10 left-10 right-10">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 rounded-full bg-[#00FFB2]/20 text-[#00FFB2] text-xs font-bold uppercase tracking-widest border border-[#00FFB2]/30">
                    Starter
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                    Free to Claim
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-white leading-tight">
                  Genesis Origin NFT
                </h3>
              </div>
            </div>
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#D4AF37]/20 blur-[80px] rounded-full z-0"></div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#00FFB2]/20 blur-[80px] rounded-full z-0"></div>
          </div>
        </div>
      </section>

      {/* Share / Social Proof */}
      <section className="py-24 border-t border-white/5 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Sovereign Architecture
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Built on advanced scalable ledger mechanics and designed for
              global institutional access.
            </p>
          </div>

          <div className="relative w-full max-w-4xl mx-auto aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <Image
              src="https://axondigitalnfts.com/images/axon-share-card.png"
              alt="AXON Architecture"
              fill
              className="object-contain bg-[#121212]"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="border-t border-white/5 py-10 text-center">
        <p className="text-xs text-slate-600 font-mono">
          © 2026 AXON DIGITAL NFTs. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
}

function Play(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  );
}
