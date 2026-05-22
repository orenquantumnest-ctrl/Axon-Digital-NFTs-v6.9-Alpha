import { GlowButton } from "@/components/ui/GlowButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { PlanSlider } from "@/components/sections/PlanSlider";
import { NFTShowcase } from "@/components/sections/NFTShowcase";
import { StatsSection } from "@/components/sections/StatsSection";
import { Shield, Zap, Layers, Cpu, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] relative overflow-hidden text-white font-sans">
      {/* Background Lighting System */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00FFB2]/10 rounded-full blur-[150px] blob-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#D4AF37]/10 rounded-full blur-[150px] blob-float" style={{ animationDelay: '-5s' }} />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[150px] blob-float" style={{ animationDelay: '-2s' }} />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.05] bg-[#0A0A0A]/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00FFB2] to-[#008A60] p-[1px]">
              <div className="w-full h-full bg-[#0A0A0A] rounded-[7px] flex items-center justify-center">
                <div className="w-3 h-3 bg-[#00FFB2] rounded-full shadow-[0_0_10px_#00FFB2]" />
              </div>
            </div>
            <span className="font-display font-bold text-xl tracking-wider">AXON<span className="text-[#00FFB2]">.</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#showcase" className="hover:text-white transition-colors">Showcase</a>
            <a href="#plans" className="hover:text-white transition-colors">Protocols</a>
          </div>
          <GlowButton className="hidden md:flex py-2 px-6 text-sm">
            Connect Wallet
          </GlowButton>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-48 pb-32 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
          <span className="w-2 h-2 rounded-full bg-[#00FFB2] animate-pulse" />
          <span className="text-xs font-mono text-gray-300">Phase 2 Minting Live</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-tight mb-8 tracking-tighter">
          Own the Future of <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFB2] to-blue-500">Digital Assets</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 font-light">
          Unlock institutional-grade yields, automated staking, and absolute community governance wrapped in high-fidelity glassmorphism NFTs.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <GlowButton className="w-full sm:w-auto px-10 py-4 text-lg">
            Explore Collection
          </GlowButton>
          <button className="w-full sm:w-auto px-10 py-4 text-lg rounded-full border border-white/10 hover:bg-white/5 transition-colors font-medium">
            Read Whitepaper
          </button>
        </div>
      </section>

      <StatsSection />

      {/* About/Features Section */}
      <section className="py-24 relative z-10 max-w-7xl mx-auto px-6" id="about">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Built for the <span className="text-gradient-gold">Elite</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">AXON is not just a visual masterpiece. It&apos;s a fully functional smart contract ecosystem designed to maximize holder utility.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Shield, title: "Quantum Security", desc: "Multi-sig treasuries and audited smart contracts." },
            { icon: Zap, title: "Flash Yields", desc: "Automated auto-compounding staking rewards." },
            { icon: Layers, title: "L2 Architecture", desc: "Zero gas fees on internal transactions and transfers." },
            { icon: Cpu, title: "AI Analytics", desc: "Predictive algorithms for market entry strategies." }
          ].map((feat, idx) => (
            <GlassCard key={idx} className="p-8">
              <feat.icon className="w-10 h-10 text-[#00FFB2] mb-6" strokeWidth={1.5} />
              <h3 className="text-xl font-bold mb-3 font-display">{feat.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feat.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <PlanSlider />
      
      <NFTShowcase />

      {/* CTA Section */}
      <section className="py-32 relative z-10 border-t border-white/5 bg-gradient-to-b from-[#0A0A0A] to-[#00FFB2]/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-8">Join the AXON Revolution</h2>
          <p className="text-xl text-gray-400 mb-12">The private sale is closing soon. Secure your node access and become part of the next big layer in Web3.</p>
          <GlowButton className="px-12 py-5 text-lg">
            Connect Wallet to Mint <ArrowRight className="inline-block ml-2 w-5 h-5" />
          </GlowButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0A0A0A] relative z-10 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
             <span className="font-display font-bold text-xl tracking-wider opacity-80">AXON<span className="text-[#00FFB2]">.</span></span>
          </div>
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} AXON Protocol. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white">Twitter</a>
            <a href="#" className="hover:text-white">Discord</a>
            <a href="#" className="hover:text-white">OpenSea</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
