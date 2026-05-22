"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { 
  TrendingUp, Settings, Plus, Layers, ShieldAlert,
  Percent, Clock, CircleDollarSign, CheckCircle2, ChevronRight
} from "lucide-react";

interface StakingPlan {
  id: string;
  name: string;
  apy: number;
  lockPeriodDays: number;
  minEntry: string;
  maxEntry: string;
  activeNodesCount: number;
  totalVolumeLocked: string;
  multiplier: number;
}

const INITIAL_PLANS: StakingPlan[] = [
  { id: "PLAN-STARTER", name: "Starter Protocol Core", apy: 15, lockPeriodDays: 30, minEntry: "0.5 ETH", maxEntry: "5.0 ETH", activeNodesCount: 142, totalVolumeLocked: "340.5 ETH", multiplier: 1.0 },
  { id: "PLAN-PRO", name: "Pro Syndicate Pool", apy: 22, lockPeriodDays: 90, minEntry: "5.0 ETH", maxEntry: "50.0 ETH", activeNodesCount: 89, totalVolumeLocked: "1,290.0 ETH", multiplier: 1.5 },
  { id: "PLAN-ELITE", name: "Elite Oracle Ledger", apy: 35, lockPeriodDays: 180, minEntry: "50.0 ETH", maxEntry: "Unlimited", activeNodesCount: 34, totalVolumeLocked: "3,110.4 ETH", multiplier: 2.2 }
];

export default function PlansAdmin() {
  const [plans, setPlans] = useState<StakingPlan[]>(INITIAL_PLANS);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [alertMsg, setAlertMsg] = useState("");

  const handleUpdateApy = (id: string, newApy: number) => {
    setPlans(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, apy: newApy };
      }
      return p;
    }));
    setAlertMsg(`Staking Plan "${id}" APY configuration updated to ${newApy}%.`);
  };

  const handleUpdateMultiplier = (id: string, newMultiplier: number) => {
    setPlans(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, multiplier: newMultiplier };
      }
      return p;
    }));
    setAlertMsg(`Loyalty Yield Multiplier modified to ${newMultiplier}x for plan ${id}.`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <span className="p-1 px-3 text-[10px] bg-[#00FFB2]/10 border border-[#00FFB2]/40 text-[#00FFB2] rounded-full font-mono uppercase tracking-widest font-bold">
            POOL CONFIGURATOR
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FFB2] animate-pulse" />
        </div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white mt-1">
          Staking Pools & <span className="text-gradient-emerald">APYs</span> Scheduler
        </h1>
        <p className="text-xs text-gray-500 font-mono mt-0.5">
          Revise base yield percentages, duration multipliers, and minimum stake prerequisites.
        </p>
      </div>

      {alertMsg && (
        <div className="p-3.5 bg-[#00FFB2]/10 border border-[#00FFB2]/30 text-[#00FFB2] rounded-xl text-xs font-mono flex items-center justify-between">
          <span>{alertMsg}</span>
          <button onClick={() => setAlertMsg("")} className="text-gray-400 hover:text-white uppercase text-[10px]">Dismiss</button>
        </div>
      )}

      {/* Global overview highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 border-white/5" hoverEffect={false}>
          <div className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Total Locked Deposits</div>
          <div className="font-mono text-3xl font-bold text-[#00FFB2]">4,740.9 ETH</div>
          <p className="text-[10px] text-gray-500 mt-1">Summing all distributed nodes accounts</p>
        </GlassCard>

        <GlassCard className="p-6 border-white/5" hoverEffect={false}>
          <div className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Operational Nodes</div>
          <div className="font-mono text-3xl font-bold text-white">265 Active</div>
          <p className="text-[10px] text-[#00FFB2] mt-1">Consensus validators healthy status</p>
        </GlassCard>

        <GlassCard className="p-6 border-white/5" hoverEffect={false}>
          <div className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Weighted Staking APY</div>
          <div className="font-mono text-3xl font-bold text-[#D4AF37]">24.85%</div>
          <p className="text-[10px] text-gray-500 mt-1">Yield limits audited within safety benchmarks</p>
        </GlassCard>
      </div>

      {/* Interactive Staking Plan Cards */}
      <div className="space-y-6">
        {plans.map((plan) => (
          <GlassCard key={plan.id} className="p-8 border-white/5 bg-white/[0.01]" hoverEffect={false}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              
              {/* Product Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-white font-display">{plan.name}</span>
                  <span className="text-[10px] font-mono bg-white/5 border border-white/10 text-gray-400 px-2 py-0.5 rounded">
                    {plan.id}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  <div className="font-mono text-xs">
                    <span className="text-gray-500 block">Min. Entry:</span> 
                    <span className="text-white font-bold">{plan.minEntry}</span>
                  </div>
                  <div className="font-mono text-xs">
                    <span className="text-gray-500 block">Max. Entry:</span>
                    <span className="text-white font-bold">{plan.maxEntry}</span>
                  </div>
                  <div className="font-mono text-xs">
                    <span className="text-gray-500 block">Locking Frame:</span>
                    <span className="text-white font-bold">{plan.lockPeriodDays} Days</span>
                  </div>
                  <div className="font-mono text-xs">
                    <span className="text-gray-500 block">Total Lock Allocation:</span>
                    <span className="text-[#00FFB2] font-semibold">{plan.totalVolumeLocked}</span>
                  </div>
                </div>
              </div>

              {/* Editing controls panel */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 p-4 rounded-xl border border-white/5 bg-black/40 xl:min-w-md shrink-0">
                {/* APY control */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400">Yield Return Percentage (APY)</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number"
                      value={plan.apy}
                      onChange={(e) => handleUpdateApy(plan.id, Number(e.target.value))}
                      className="w-20 bg-black border border-white/15 rounded px-2.5 py-1 text-xs font-mono font-bold text-white focus:outline-none focus:border-[#00FFB2]"
                    />
                    <span className="text-xs font-mono text-gray-400">% APY</span>
                  </div>
                </div>

                {/* Multiplier control */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400">Rank Multiplier Factor</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number"
                      step="0.1"
                      value={plan.multiplier}
                      onChange={(e) => handleUpdateMultiplier(plan.id, Number(e.target.value))}
                      className="w-20 bg-black border border-white/15 rounded px-2.5 py-1 text-xs font-mono font-bold text-white focus:outline-none"
                    />
                    <span className="text-xs font-mono text-gray-400">x weight</span>
                  </div>
                </div>
              </div>

            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
