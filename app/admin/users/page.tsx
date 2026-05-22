"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { 
  Users, Search, UserCheck, ShieldAlert, BadgeInfo,
  TrendingUp, Download, CheckCircle, RefreshCcw
} from "lucide-react";

interface UserProfile {
  id: string;
  wallet: string;
  tier: "Starter" | "Pro" | "Elite";
  balance: string;
  status: "Active" | "Suspended" | "Pending Auditing";
  mintCount: number;
  referralsCount: number;
  lastActive: string;
}

const INITIAL_USERS: UserProfile[] = [
  { id: "USR-1082", wallet: "0x44c330f9a1cb1db9a1cb1ddfa99211110022bf0", tier: "Elite", balance: "156.8 ETH", status: "Active", mintCount: 12, referralsCount: 8, lastActive: "Just Now" },
  { id: "USR-5412", wallet: "0xab17a7a1bc1db9a1cb1db9a1cb1db9a1cb1db8831", tier: "Pro", balance: "42.10 ETH", status: "Active", mintCount: 5, referralsCount: 4, lastActive: "1 hour ago" },
  { id: "USR-9901", wallet: "0xf11ad63a9201a7bbfa9c1db9a1cb1db9a1cb1d3a0", tier: "Starter", balance: "8.44 ETH", status: "Active", mintCount: 2, referralsCount: 1, lastActive: "2 mins ago" },
  { id: "USR-3044", wallet: "0x98fcf7aa33bc789a1bc1db9a1cb1db9a1cb1db9aa", tier: "Elite", balance: "294.5 ETH", status: "Active", mintCount: 24, referralsCount: 19, lastActive: "41 mins ago" },
  { id: "USR-7711", wallet: "0x331e991aaf1bc1db9a1cb1db9a1cb1db9a1cb1ddaa", tier: "Starter", balance: "0.00 ETH", status: "Suspended", mintCount: 0, referralsCount: 0, lastActive: "12 days ago" },
  { id: "USR-0881", wallet: "0xee6e41fa1bc1db9a1cb1db9a1cb1db9a1cb1d22bf", tier: "Pro", balance: "31.4 ETH", status: "Pending Auditing", mintCount: 4, referralsCount: 2, lastActive: "14 hours ago" }
];

export default function UsersRegistry() {
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [alertMsg, setAlertMsg] = useState("");

  const handleToggleStatus = (id: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === "Active" ? "Suspended" : "Active";
        setAlertMsg(`Address ID ${id} status altered to ${nextStatus}.`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const handleUpdateTier = (id: string, tier: "Starter" | "Pro" | "Elite") => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        setAlertMsg(`Upgraded User ID ${id} to Premium Tier ${tier}.`);
        return { ...u, tier };
      }
      return u;
    }));
  };

  const filteredUsers = users.filter(u => 
    u.wallet.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.tier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <span className="p-1 px-3 text-[10px] bg-[#00FFB2]/10 border border-[#00FFB2]/40 text-[#00FFB2] rounded-full font-mono uppercase tracking-widest font-bold">
            ADDRESS REGISTRY
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FFB2] animate-pulse" />
        </div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white mt-1">
          Users & <span className="text-gradient-emerald">Wallets</span> Registry
        </h1>
        <p className="text-xs text-gray-500 font-mono mt-0.5">
          Audit details, user profiles, allocations, and suspension switches.
        </p>
      </div>

      {alertMsg && (
        <div className="p-3.5 bg-[#00FFB2]/10 border border-[#00FFB2]/30 text-[#00FFB2] rounded-xl text-xs font-mono flex items-center justify-between">
          <span>{alertMsg}</span>
          <button onClick={() => setAlertMsg("")} className="text-gray-400 hover:text-white uppercase text-[10px]">Dismiss</button>
        </div>
      )}

      {/* Grid Summary Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 border-white/5" hoverEffect={false}>
          <div className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Total Managed Addresses</div>
          <div className="font-mono text-3xl font-bold text-white">
            {users.length} <span className="text-xs text-gray-500">Live Profiles</span>
          </div>
          <p className="text-[10px] text-[#00FFB2] mt-1">Whitelists auto-secured via multi-sig rules</p>
        </GlassCard>

        <GlassCard className="p-6 border-white/5" hoverEffect={false}>
          <div className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Total Balance Aggregated</div>
          <div className="font-mono text-3xl font-bold text-[#D4AF37]">533.24 ETH</div>
          <p className="text-[10px] text-gray-500 mt-1">Direct from live staking pools indices</p>
        </GlassCard>

        <GlassCard className="p-6 border-white/5" hoverEffect={false}>
          <div className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Registry Coverage</div>
          <div className="font-mono text-3xl font-bold text-purple-400">100%</div>
          <p className="text-[10px] text-gray-500 mt-1">All hot wallets audited under KYC and AML laws</p>
        </GlassCard>
      </div>

      {/* Grid filter search tab */}
      <GlassCard className="p-6 border-white/5" hoverEffect={false}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search address, ID, tier levels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-full pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#00FFB2] transition'colors font-mono"
            />
          </div>
          <div className="text-xs text-gray-500 font-mono">Matched {filteredUsers.length} active registered users</div>
        </div>

        {/* Users grid list */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="p-4 text-gray-400 font-bold uppercase text-[10px]">User Ref</th>
                <th className="p-4 text-gray-400 font-bold uppercase text-[10px]">Cryptographic Wallet</th>
                <th className="p-4 text-gray-400 font-bold uppercase text-[10px]">Stake Rank</th>
                <th className="p-4 text-gray-400 font-bold uppercase text-[10px]">Balance Indexed</th>
                <th className="p-4 text-gray-400 font-bold uppercase text-[10px]">NFTs</th>
                <th className="p-4 text-gray-400 font-bold uppercase text-[10px]">State/Status</th>
                <th className="p-4 text-gray-400 font-bold uppercase text-[10px] text-right">Administrative Execution</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-all">
                  <td className="p-4 font-bold text-white">{u.id}</td>
                  <td className="p-4 text-gray-300 select-all">{u.wallet}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      u.tier === "Elite" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                      u.tier === "Pro" ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20" :
                      "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}>
                      {u.tier}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-white">{u.balance}</td>
                  <td className="p-4 text-gray-400">{u.mintCount} items</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      u.status === "Active" ? "bg-[#00FFB2]/10 text-[#00FFB2]" :
                      u.status === "Suspended" ? "bg-red-500/10 text-red-400" :
                      "bg-amber-500/10 text-amber-400"
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button 
                      onClick={() => handleToggleStatus(u.id)}
                      className={`px-3 py-1 rounded text-[10px] font-semibold border transition-all ${
                        u.status === "Active" 
                          ? "border-red-500/20 text-red-400 hover:bg-red-500/10" 
                          : "border-[#00FFB2]/20 text-[#00FFB2] hover:bg-[#00FFB2]/10"
                      }`}
                    >
                      {u.status === "Active" ? "Suspend" : "Reinstate"}
                    </button>
                    
                    <select 
                      onChange={(e) => handleUpdateTier(u.id, e.target.value as any)}
                      value={u.tier}
                      className="bg-black/80 border border-white/10 rounded px-2 py-1 text-[10px] text-gray-400 focus:outline-none focus:border-[#00FFB2]"
                    >
                      <option value="Starter">Starter</option>
                      <option value="Pro">Pro</option>
                      <option value="Elite">Elite</option>
                    </select>
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
