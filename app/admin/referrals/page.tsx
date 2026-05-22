"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { 
  Layers, Trophy, Search, CheckCircle, RefreshCcw, Star,
  TrendingUp, Users, Percent, Gift
} from "lucide-react";

interface ReferralAccount {
  id: string;
  refCode: string;
  associatedWallet: string;
  successfulInvites: number;
  unlimitedBonusRatio: number; // in percent
  commissionsPaidEth: string;
  status: "Bronze Tier" | "Silver Syndicate" | "Gold Oracle Elite";
}

const INITIAL_REFS: ReferralAccount[] = [
  { id: "REF-001", refCode: "AXON-ALPHA", associatedWallet: "0x44c33...22bf", successfulInvites: 54, unlimitedBonusRatio: 10, commissionsPaidEth: "14.22 ETH", status: "Gold Oracle Elite" },
  { id: "REF-012", refCode: "GOLDEN-YIELD", associatedWallet: "0xab17a...8831", successfulInvites: 22, unlimitedBonusRatio: 7, commissionsPaidEth: "4.85 ETH", status: "Silver Syndicate" },
  { id: "REF-088", refCode: "STAKE-PRO", associatedWallet: "0xf11ad...d3a0", successfulInvites: 8, unlimitedBonusRatio: 5, commissionsPaidEth: "0.91 ETH", status: "Bronze Tier" },
  { id: "REF-109", refCode: "ORACLE-GEN", associatedWallet: "0x98fcf...99aa", successfulInvites: 41, unlimitedBonusRatio: 10, commissionsPaidEth: "11.04 ETH", status: "Gold Oracle Elite" }
];

export default function ReferralsAdmin() {
  const [refs, setRefs] = useState<ReferralAccount[]>(INITIAL_REFS);
  const [alert, setAlert] = useState("");

  const handleUpdateBonus = (id: string, ratio: number) => {
    setRefs(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, unlimitedBonusRatio: ratio };
      }
      return r;
    }));
    setAlert(`Adjusted bonus ratio to ${ratio}% for Syndicate Partner ${id}.`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <span className="p-1 px-3 text-[10px] bg-[#00FFB2]/10 border border-[#00FFB2]/40 text-[#00FFB2] rounded-full font-mono uppercase tracking-widest font-bold">
            SYNDICATE REBATES
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FFB2] animate-pulse" />
        </div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white mt-1">
          Syndicate & <span className="text-gradient-emerald">Referrals</span> Program
        </h1>
        <p className="text-xs text-gray-500 font-mono mt-0.5">
          Revise affiliate tier points, multipliers, tree depth limits, and commission models.
        </p>
      </div>

      {alert && (
        <div className="p-3.5 bg-[#00FFB2]/10 border border-[#00FFB2]/30 text-[#00FFB2] rounded-xl text-xs font-mono flex items-center justify-between">
          <span>{alert}</span>
          <button onClick={() => setAlert("")} className="text-gray-400 hover:text-white uppercase text-[10px]">Dismiss</button>
        </div>
      )}

      {/* Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 border-white/5" hoverEffect={false}>
          <div className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Total Referrals Registered</div>
          <div className="font-mono text-3xl font-bold text-white">1,402 Users</div>
          <p className="text-[10px] text-gray-500 mt-1">Staked through syndicate invitation portals</p>
        </GlassCard>

        <GlassCard className="p-6 border-white/5" hoverEffect={false}>
          <div className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Commissions Paid</div>
          <div className="font-mono text-3xl font-bold text-[#D4AF37]">31.02 ETH</div>
          <p className="text-[10px] text-[#00FFB2] mt-1">Dispensed automatically on node lock success</p>
        </GlassCard>

        <GlassCard className="p-6 border-white/5" hoverEffect={false}>
          <div className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Default Rebate Rate</div>
          <div className="font-mono text-3xl font-bold text-white">5.0% <span className="text-xs text-gray-500">Base</span></div>
          <p className="text-[10px] text-gray-500 mt-1">Configured for standard level accounts</p>
        </GlassCard>
      </div>

      {/* Main Registry */}
      <GlassCard className="p-6 border-white/5" hoverEffect={false}>
        <h3 className="font-display font-semibold text-white text-sm mb-4">Ecosystem Syndicate partner channels</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="p-4 text-gray-400 font-bold uppercase text-[10px]">Partner ref ID</th>
                <th className="p-4 text-gray-400 font-bold uppercase text-[10px]">Custom link code</th>
                <th className="p-4 text-gray-400 font-bold uppercase text-[10px]">Associated wallet</th>
                <th className="p-4 text-gray-400 font-bold uppercase text-[10px]">Successful invites</th>
                <th className="p-4 text-gray-400 font-bold uppercase text-[10px]">Accumulated payout</th>
                <th className="p-4 text-gray-400 font-bold uppercase text-[10px]">Loyalty Status</th>
                <th className="p-4 text-gray-300 font-bold uppercase text-[10px] text-right">Commission Multiplier settings</th>
              </tr>
            </thead>
            <tbody>
              {refs.map((r) => (
                <tr key={r.id} className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-all">
                  <td className="p-4 font-bold text-white">{r.id}</td>
                  <td className="p-4 text-gray-300 font-semibold">{r.refCode}</td>
                  <td className="p-4 text-gray-500 select-all">{r.associatedWallet}</td>
                  <td className="p-4 text-white font-bold">{r.successfulInvites} users</td>
                  <td className="p-4 text-[#D4AF37] font-semibold">{r.commissionsPaidEth}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold ${
                      r.status === "Gold Oracle Elite" ? "bg-[#D4AF37]/10 text-[#D4AF37]" :
                      r.status === "Silver Syndicate" ? "bg-purple-500/10 text-purple-400" :
                      "bg-blue-500/10 text-blue-400"
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <select 
                        value={r.unlimitedBonusRatio} 
                        onChange={(e) => handleUpdateBonus(r.id, Number(e.target.value))}
                        className="bg-black border border-white/10 rounded px-2.5 py-1 text-xs text-white text-right focus:outline-none focus:border-[#00FFB2]"
                      >
                        <option value="5">5.0%</option>
                        <option value="7">7.0%</option>
                        <option value="10">10.0%</option>
                        <option value="12">12.0%</option>
                        <option value="15">15.0%</option>
                      </select>
                      <span className="text-gray-500 text-[10px] font-mono">rebate</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
