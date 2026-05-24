"use client";
import React, { useState, useEffect } from 'react';
import { Activity, Users, Award, TrendingUp } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

export function StatsSection() {
  const [mintedCount, setMintedCount] = useState(12480);
  const [activeUsers, setActiveUsers] = useState(4821);
  const [totalYieldUSD, setTotalYieldUSD] = useState(32481050.25);

  useEffect(() => {
    const counterInterval = setInterval(() => {
      setTotalYieldUSD((prev) => prev + Number((Math.random() * 1.5).toFixed(2)));
      if (Math.random() > 0.85) setActiveUsers((prev) => prev + 1);
      if (Math.random() > 0.95) setMintedCount((prev) => (prev < 15000 ? prev + 1 : 12480));
    }, 2800);
    return () => clearInterval(counterInterval);
  }, []);

  return (
    <section className="py-20 relative bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <GlassCard className="!p-10 flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-white/10 items-center justify-between">
          
          <div className="w-full lg:w-1/3 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-[#00FFB2]/10 flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-[#00FFB2]" />
            </div>
            <h4 className="text-3xl font-black text-white font-mono mb-2">{mintedCount.toLocaleString()}</h4>
            <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Total Assets Minted</p>
          </div>

          <div className="w-full lg:w-1/3 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <h4 className="text-3xl font-black text-white font-mono mb-2">{activeUsers.toLocaleString()}</h4>
            <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Active Protocol Users</p>
          </div>

          <div className="w-full lg:w-1/3 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <h4 className="text-3xl font-black text-[#D4AF37] font-mono mb-2">
              ${totalYieldUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h4>
            <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Total Staking Yield</p>
          </div>

        </GlassCard>
      </div>
    </section>
  );
}
