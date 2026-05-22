"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { 
  ShieldAlert, Shield, AlertTriangle, Eye, Ban,
  Lock, RefreshCw, Layers, CheckCircle
} from "lucide-react";

interface FraudTrigger {
  id: string;
  associatedWallet: string;
  riskScore: number; // out of 100
  triggerRule: string;
  triggeredAt: string;
  status: "Flagged & Frozen" | "Resolved (Whitelisted)" | "Under Active Review";
}

const INITIAL_TRIGGERS: FraudTrigger[] = [
  { id: "FRD-392", associatedWallet: "0x7cbc...ffee", riskScore: 92, triggerRule: "Excessive high-value micro-transaction attempts", triggeredAt: "2026-05-22 14:15", status: "Flagged & Frozen" },
  { id: "FRD-201", associatedWallet: "0x98f...aa91", riskScore: 78, triggerRule: "Simultaneous multi-IP staking payouts claims", triggeredAt: "2026-05-22 12:40", status: "Under Active Review" },
  { id: "FRD-102", associatedWallet: "0xab1...8831", riskScore: 45, triggerRule: "Manual allocation transfer check override", triggeredAt: "2026-05-18 09:30", status: "Resolved (Whitelisted)" }
];

export default function AntiFraudAudits() {
  const [triggers, setTriggers] = useState<FraudTrigger[]>(INITIAL_TRIGGERS);
  const [alert, setAlert] = useState("");

  const handleFreezeWallet = (id: string) => {
    setTriggers(prev => prev.map(t => {
      if (t.id === id) {
        setAlert(`Address associated with Trigger ID ${id} frozen and blacklisted from ledger payouts.`);
        return { ...t, status: "Flagged & Frozen" };
      }
      return t;
    }));
  };

  const handleWhitelistWallet = (id: string) => {
    setTriggers(prev => prev.map(t => {
      if (t.id === id) {
        setAlert(`Address whitelist approved for Trigger ID ${id}. Warning level cleared.`);
        return { ...t, status: "Resolved (Whitelisted)" };
      }
      return t;
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <span className="p-1 px-3 text-[10px] bg-amber-500/10 border border-amber-500/40 text-amber-400 rounded-full font-mono uppercase tracking-widest font-bold">
            BLOCKED THREATS DESK
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
        </div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white mt-1">
          System Auditing & <span className="text-gradient-emerald">Anti-Fraud</span> Rules
        </h1>
        <p className="text-xs text-gray-500 font-mono mt-0.5">
          Revise risk assessment triggers, lock-out logs, blacklist registers and wallet freezes.
        </p>
      </div>

      {alert && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl text-xs font-mono flex items-center justify-between">
          <span>{alert}</span>
          <button onClick={() => setAlert("")} className="text-gray-400 hover:text-white uppercase text-[10px]">Close</button>
        </div>
      )}

      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 border-white/5 bg-white/[0.01]/10" hoverEffect={false}>
          <div className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Total High-Risk Bans</div>
          <div className="font-mono text-3xl font-bold text-red-500">14 Wallets</div>
          <p className="text-[10px] text-gray-500 mt-1">Permanently restricted from smart signing</p>
        </GlassCard>

        <GlassCard className="p-6 border-white/5 bg-white/[0.01]/10" hoverEffect={false}>
          <div className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Pending Review Logs</div>
          <div className="font-mono text-3xl font-bold text-amber-500">1 Active Case</div>
          <p className="text-[10px] text-gray-400 mt-1">Under investigation by Auditor Desk operatives</p>
        </GlassCard>

        <GlassCard className="p-6 border-white/5 bg-white/[0.01]/10 font-mono text-xs flex flex-col justify-between" hoverEffect={false}>
          <div>
            <span className="text-gray-400 font-bold uppercase block mb-1">AUDITING ENGINE STABILIZER</span>
            <div className="text-[#00FFB2] font-bold text-base flex items-center gap-1.5 mt-2">
              <CheckCircle className="w-5 h-5" />
              THREAT INDEX STABLE
            </div>
          </div>
          <div className="text-gray-500 text-[10px] mt-2">Zero undetected breaches. Safeguarded 100%.</div>
        </GlassCard>
      </div>

      {/* Main Fraud Log list */}
      <GlassCard className="p-6 border-white/5" hoverEffect={false}>
        <h3 className="font-display font-semibold text-white text-sm mb-4">Risk Logs & Security Auditing Registers</h3>
        <div className="space-y-4">
          {triggers.map((item) => (
            <div key={item.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all">
              <div className="flex items-start sm:items-center gap-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                  item.status === "Flagged & Frozen" ? "bg-red-500/10 border-red-500/30 text-red-400" :
                  item.status === "Under Active Review" ? "bg-amber-500/10 border-amber-500/30 text-amber-500" :
                  "bg-[#00FFB2]/10 border-[#00FFB2]/20 text-[#00FFB2]"
                }`}>
                  <ShieldAlert className="w-4 h-4" />
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-white">{item.triggerRule}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold font-mono ${
                      item.riskScore > 80 ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                      "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}>
                      Risk Score: {item.riskScore}/100
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono mt-1">
                    Suspect Wallet: <span className="text-gray-300 font-bold select-all">{item.associatedWallet}</span> | Reference: <span className="text-gray-400">{item.id}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-[10px] text-gray-500 font-mono">{item.triggeredAt}</div>
                  <div className={`text-xs font-mono font-bold ${
                    item.status === "Flagged & Frozen" ? "text-red-400" :
                    item.status === "Under Active Review" ? "text-amber-500" :
                    "text-[#00FFB2]"
                  }`}>{item.status}</div>
                </div>

                <div className="flex items-center gap-2 min-w-[180px] justify-end">
                  {item.status === "Under Active Review" ? (
                    <>
                      <button 
                        onClick={() => handleFreezeWallet(item.id)}
                        className="px-2.5 py-1 text-[10px] font-bold border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded font-mono"
                      >
                        Freeze Wallet
                      </button>
                      <button 
                        onClick={() => handleWhitelistWallet(item.id)}
                        className="px-2.5 py-1 text-[10px] font-bold border border-[#00FFB2]/30 text-[#00FFB2] hover:bg-[#00FFB2]/10 rounded font-mono"
                      >
                        Clear Warn
                      </button>
                    </>
                  ) : item.status === "Flagged & Frozen" ? (
                    <button 
                      onClick={() => handleWhitelistWallet(item.id)}
                      className="px-2.5 py-1 text-[10px] font-bold border border-white/10 hover:border-white/20 text-gray-300 hover:bg-white/5 rounded font-mono"
                    >
                      Override (Unfreeze)
                    </button>
                  ) : (
                    <span className="text-gray-600 text-[10px] italic">Resolved case</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
