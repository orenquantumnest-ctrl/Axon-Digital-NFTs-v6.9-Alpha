"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    id: "starter",
    name: "Starter Protocol",
    roi: "8% APY Target",
    price: "0.1 ETH",
    features: ["Basic Node Access", "Standard Voting Rights", "Weekly Analytics", "Community Access"],
    image: "https://picsum.photos/seed/planstarter/1024/1024"
  },
  {
    id: "pro",
    name: "Pro Protocol",
    roi: "15% APY Target",
    price: "1.0 ETH",
    features: ["Premium Node Access", "Weighted Voting Rights", "Real-time AI Analytics", "Private Discord Lounge", "Early Mint Access", "Staking Multipliers"],
    image: "https://picsum.photos/seed/planpro/1024/1024",
    popular: true
  },
  {
    id: "elite",
    name: "Elite Syndicate",
    roi: "25%+ APY Target",
    price: "5.0 ETH",
    features: ["Quantum Node Access", "Governance Proposal Rights", "Direct Core Dev Comms", "1-on-1 Strategy Calls", "Free Future Mints", "Max Staking Yields", "Whale Dashboard"],
    image: "https://picsum.photos/seed/planelite/1024/1024"
  }
];

export function PlanSlider() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % PLANS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + PLANS.length) % PLANS.length);
  };

  return (
    <section className="py-24 relative z-10 overflow-hidden" id="plans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00FFB2]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="text-center mb-16 relative z-10 px-6">
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
          <span className="text-gradient-emerald">Protocols & </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Syndicates</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Choose your entry level into the AXON ecosystem. Benefit from escalating yields, deeper analytics, and greater governance power.
        </p>
      </div>

      <div className="relative max-w-7xl mx-auto flex items-center justify-center min-h-[650px] px-4">
        
        <button onClick={handlePrev} className="absolute left-4 md:left-12 z-40 p-3 rounded-full glass-panel hover:bg-white/10 text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="relative w-full max-w-5xl h-[600px] flex items-center justify-center perspective-1000">
          <AnimatePresence mode="popLayout">
            {PLANS.map((plan, idx) => {
              const isActive = idx === currentIndex;
              const isPrev = idx === (currentIndex - 1 + PLANS.length) % PLANS.length;
              const isNext = idx === (currentIndex + 1) % PLANS.length;

              let x = 0;
              let scale = 1;
              let zIndex = 10;
              let opacity = 1;
              let blur = "0px";

              if (!isActive) {
                scale = 0.85;
                zIndex = 0;
                opacity = 0.6;
                blur = "8px";
                if (isPrev) x = -300;
                else if (isNext) x = 300;
                else {
                  opacity = 0;
                  scale = 0.5;
                }
              } else {
                scale = 1.05;
                zIndex = 20;
              }

              // Adjust layout for mobile
              const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
              if (isMobile && !isActive) opacity = 0;

              return (
                <motion.div
                  key={plan.id}
                  initial={false}
                  animate={{
                    x,
                    scale,
                    zIndex,
                    opacity,
                    filter: `blur(${blur})`,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className={cn(
                    "absolute w-full max-w-[340px] md:max-w-[380px] glass-panel rounded-[32px] overflow-hidden flex flex-col cursor-pointer",
                    isActive ? "border-[#00FFB2]/50 shadow-[0_0_40px_rgba(0,255,178,0.2)]" : "border-white/5"
                  )}
                  onClick={() => setCurrentIndex(idx)}
                >
                  <div className="relative h-48 w-full">
                    <Image src={plan.image} alt={plan.name} fill className="object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
                    {plan.popular && isActive && (
                      <div className="absolute top-4 right-4 bg-[#D4AF37] text-black text-xs font-bold px-3 py-1 rounded-full">
                        MOST POPULAR
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className={cn("text-2xl font-bold font-display mb-1", isActive ? "text-white" : "text-gray-300")}>{plan.name}</h3>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className={cn("text-3xl font-mono font-bold", isActive ? "text-[#00FFB2]" : "text-gray-400")}>{plan.price}</span>
                    </div>
                    
                    <div className="mb-6 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <p className="text-sm text-gray-400 mb-1">Target Yield</p>
                      <p className="font-mono text-[#D4AF37] font-semibold">{plan.roi}</p>
                    </div>

                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((feat, f_idx) => (
                        <li key={f_idx} className="flex items-start text-sm text-gray-300">
                          <Check className="w-4 h-4 text-[#00FFB2] mr-3 mt-0.5 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto">
                      <GlowButton className="w-full" variant={plan.popular ? "gold" : "emerald"}>
                        Select Plan
                      </GlowButton>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <button onClick={handleNext} className="absolute right-4 md:right-12 z-40 p-3 rounded-full glass-panel hover:bg-white/10 text-white transition-colors">
          <ChevronRight className="w-6 h-6" />
        </button>

      </div>
    </section>
  );
}
