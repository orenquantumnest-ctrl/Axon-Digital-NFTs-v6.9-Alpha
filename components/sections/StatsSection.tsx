"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";

function useCountUp(end: number, duration: number = 2) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    let startTime: number;
    let animationFrame: number;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Easing function (easeOutQuart)
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeProgress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isInView]);

  return { count, ref };
}

function StatItem({ value, label, prefix = "", suffix = "" }: { value: number, label: string, prefix?: string, suffix?: string }) {
  const { count, ref } = useCountUp(value, 2.5);

  return (
    <GlassCard className="text-center p-8" hoverEffect={false}>
      <motion.div 
        ref={ref}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-4xl md:text-5xl font-mono font-bold text-gradient-emerald mb-2">
          {prefix}{count.toLocaleString()}{suffix}
        </div>
        <div className="text-sm tracking-widest text-gray-400 uppercase font-semibold">{label}</div>
      </motion.div>
    </GlassCard>
  );
}

export function StatsSection() {
  return (
    <section className="py-24 relative z-10 max-w-7xl mx-auto px-6 border-y border-white/5 bg-black/50">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatItem value={12400} label="NFTs Minted" suffix="+" />
        <StatItem value={8200} label="Active Holders" suffix="+" />
        <StatItem value={168} label="Average ROI" prefix="$" suffix="M" />
      </div>
    </section>
  );
}
