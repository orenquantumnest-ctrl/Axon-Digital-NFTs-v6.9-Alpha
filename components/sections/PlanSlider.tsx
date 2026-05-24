"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Use same plan metadata as in page.tsx
const PLANS = [
  { id: "starter", name: "Genesis Origin Plan", badge: "CLAIM STANDARD", badgeColor: "bg-[#00FFB2]/20 text-[#00FFB2] border-[#00FFB2]/30", price: "0.00 BNB", roi: "0.12% Daily Yield Rate", image: "https://picsum.photos/seed/cyber-starter/1024/1024", features: ["Standard Protocol Allocation Pools", "Full Discord Lounge Access", "Semi-Custodial Smart Contract Audit", "Base Rate Compound Yielding System"] },
  { id: "pro", name: "Neon Sentinel Plan", badge: "MOST POPULAR", badgeColor: "bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/30", price: "0.45 BNB", roi: "0.58% Daily Yield Rate", image: "https://picsum.photos/seed/cyber-sentinel/1024/1024", features: ["10x Yield-farming Pool Multiplier", "Bi-Weekly Automated NFT Air-drops", "Direct Governance Voting Weights", "Fully Isolated Smart Custody Contract", "Custom Dashboard Metrics Webhook Access"] },
  { id: "elite", name: "Sovereign Archon Plan", badge: "FOUNDERS LEVEL", badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30", price: "2.80 BNB", roi: "1.15% Daily Yield Rate", image: "https://picsum.photos/seed/cyber-archon/1024/1024", features: ["Sovereign Core High-Tier Co-Mining", "Uncapped Protocol Leveraged Farming", "Special Elite Alpha Chat Gateways", "Early Access to Future Platform Mints", "Interactive 1-on-1 Portfolio Mentorship", "Heirloom Titanium Core Physical Tag"] }
];

export function PlanSlider() {
  const [activePlanIdx, setActivePlanIdx] = useState(1);
  const [autoplay, setAutoplay] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(() => { setActivePlanIdx((prev) => (prev + 1) % PLANS.length); }, 6000);
    return () => clearInterval(interval);
  }, [autoplay]);

  const handleNextSlide = () => { setAutoplay(false); setActivePlanIdx((prev) => (prev + 1) % PLANS.length); };
  const handlePrevSlide = () => { setAutoplay(false); setActivePlanIdx((prev) => (prev - 1 + PLANS.length) % PLANS.length); };

  const handleMouseDown = (e: React.MouseEvent) => { startX.current = e.pageX; isDragging.current = true; setAutoplay(false); };
  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const diff = e.pageX - startX.current;
    if (diff > 50) handlePrevSlide();
    else if (diff < -50) handleNextSlide();
  };

  const handleTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0].pageX; isDragging.current = true; setAutoplay(false); };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const diff = e.changedTouches[0].pageX - startX.current;
    if (diff > 50) handlePrevSlide();
    else if (diff < -50) handleNextSlide();
  };

  return (
    <section id="axon-plans-slider-component" className="py-24 border-t border-white/5 bg-[#09090C] relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] text-[#00FFB2] tracking-[0.3em] font-black uppercase block mb-3">AUTOMATED INVESTMENT ARRAYS</span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">Explore Yield Smart Catalogs</h2>
          <p className="text-sm text-zinc-400">Select an Apple-level precision-driven NFT stake catalog below. Swipe, drag, or toggle arrows. Center card is actively focused with elevated yield returns.</p>
        </div>

        <div className="relative overflow-visible py-8 px-4 flex flex-col items-center">
          <div className="absolute top-1/2 -translate-y-1/2 left-2 md:left-10 z-30">
            <button onClick={handlePrevSlide} className="w-12 h-12 rounded-full border border-white/10 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center hover:border-[#00FFB2]/50 hover:text-[#00FFB2] active:scale-90 transition shadow-lg backdrop-blur-md">
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 right-2 md:right-10 z-30">
            <button onClick={handleNextSlide} className="w-12 h-12 rounded-full border border-white/10 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center hover:border-[#00FFB2]/50 hover:text-[#00FFB2] active:scale-90 transition shadow-lg backdrop-blur-md">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div
            ref={sliderRef}
            onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}
            className="flex justify-center items-center gap-4 md:gap-8 w-full max-w-5xl h-[520px] md:h-[600px] select-none cursor-grab active:cursor-grabbing transition-all duration-500 overflow-hidden"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {PLANS.map((plan, index) => {
                const isActive = index === activePlanIdx;
                const distance = index - activePlanIdx;
                
                let scaleClass = "scale-90 opacity-40 blur-[2px] z-10 pointer-events-none max-w-[280px] hidden sm:block md:max-w-[310px]";
                let shadowClass = "border border-white/5 bg-[#121215]/30 shadow-none";

                if (isActive) {
                  scaleClass = "scale-[1.02] sm:scale-[1.05] md:scale-108 opacity-100 blur-none z-20 w-full max-w-[340px] md:max-w-[380px]";
                  shadowClass = "border-2 border-[#00FFB2]/60 bg-[#141419]/90 shadow-[0_15px_60px_rgba(0,255,178,0.25)] relative";
                } else if (distance === -1 || (activePlanIdx === 0 && index === PLANS.length - 1)) {
                  scaleClass = "scale-90 opacity-55 blur-[1px] z-10 w-1/4 max-w-[280px] md:max-w-[310px] hidden sm:block pointer-events-auto transform -translate-x-4";
                  shadowClass = "border border-white/5 bg-[#121215]/40";
                } else if (distance === 1 || (activePlanIdx === PLANS.length - 1 && index === 0)) {
                  scaleClass = "scale-90 opacity-55 blur-[1px] z-10 w-1/4 max-w-[280px] md:max-w-[310px] hidden sm:block pointer-events-auto transform translate-x-4";
                  shadowClass = "border border-white/5 bg-[#121215]/40";
                }

                return (
                  <div key={plan.id} onClick={() => { if (!isActive) { setAutoplay(false); setActivePlanIdx(index); } }} className={`${scaleClass} transition-all duration-700 h-[460px] md:h-[530px] rounded-[2.5rem] flex flex-col overflow-hidden`}>
                    <div className={`h-full p-4 md:p-6 ${shadowClass} flex flex-col justify-between rounded-[2.5rem] backdrop-blur-2xl transition`}>
                      {isActive && <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00FFB2] to-transparent" />}
                      <div className="space-y-4">
                        <div className="relative w-full aspect-[21/10] sm:aspect-video rounded-3xl overflow-hidden border border-white/5">
                          <Image src={plan.image} alt={plan.name} fill className="object-cover" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                          <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                            <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${plan.badgeColor}`}>{plan.badge}</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-baseline mb-1"><h3 className="text-lg md:text-xl font-black text-white">{plan.name}</h3><span className="text-[10px] font-mono text-zinc-500 font-bold uppercase">Rate</span></div>
                          <div className="flex justify-between items-center mb-3"><span className="font-mono text-xl font-bold text-[#D4AF37]">{plan.price}</span><span className="text-sm font-bold text-[#00FFB2] tracking-tight">{plan.roi}</span></div>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase mb-2">INTEGRATED FEATURES</p>
                          <ul className="space-y-1 md:space-y-1.5 text-xs text-zinc-300 font-medium">
                            {plan.features.slice(0, 4).map((feature, fIdx) => (
                              <li key={fIdx} className="flex items-center gap-1.5 truncate"><Check className="w-3 h-3 text-[#00FFB2] flex-shrink-0" /><span>{feature}</span></li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/5">
                        <button className={`w-full py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${isActive ? "bg-gradient-to-r from-[#00FFB2] to-[#04D194] text-black shadow-[0_0_15px_rgba(0,255,178,0.3)] hover:scale-[1.02]" : "bg-white/5 hover:bg-white/10 text-white border border-white/10"}`}>
                          <span>Get {plan.name.split(" ")[0]}</span><ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2 mt-8 z-20">
            {PLANS.map((_, dotIdx) => (
              <button key={dotIdx} onClick={() => { setAutoplay(false); setActivePlanIdx(dotIdx); }} className={`h-2.5 rounded-full transition-all duration-500 ${dotIdx === activePlanIdx ? "w-8 bg-[#00FFB2] shadow-[0_0_8px_#00FFB2]" : "w-2.5 bg-zinc-700 hover:bg-zinc-500"}`} aria-label={`Slide target ${dotIdx + 1}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
