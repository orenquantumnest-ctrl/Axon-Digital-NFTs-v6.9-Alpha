"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { 
  Activity, ArrowUp, ArrowDown, Search, CheckCircle, 
  RefreshCcw, Star, XCircle, ChevronRight
} from "lucide-react";

interface FinancialFlow {
  id: string;
  type: "Deposit" | "Withdrawal";
  address: string;
  amount: string;
  usdValue: string;
  initiatedAt: string;
  status: "Pending Validation" | "Settled" | "Failed Review";
}

const INITIAL_FLOWS: FinancialFlow[] = [
  { id: "TXF-9092", type: "Deposit", address: "0x44c...22bf", amount: "5.0 ETH", usdValue: "$17,250", initiatedAt: "2026-05-22 14:02", status: "Settled" },
  { id: "TXF-8012", type: "Withdrawal", address: "0xab1...8831", amount: "1.2 ETH", usdValue: "$4,140", initiatedAt: "2026-05-22 13:10", status: "Settled" },
  { id: "TXF-1025", type: "Withdrawal", address: "0x331...ddaa", amount: "14.5 ETH", usdValue: "$50,025", initiatedAt: "2026-05-22 14:52", status: "Pending Validation" },
  { id: "TXF-3021", type: "Deposit", address: "0xf11...d3a0", amount: "20.0 ETH", usdValue: "$69,000", initiatedAt: "2026-05-22 14:22", status: "Pending Validation" },
  { id: "TXF-0199", type: "Deposit", address: "0x98f...aa91", amount: "0.25 ETH", usdValue: "$862", initiatedAt: "2026-05-21 09:15", status: "Failed Review" }
];

export default function FinancialFlows() {
  const [flows, setFlows] = useState<FinancialFlow[]>(INITIAL_FLOWS);
  const [alert, setAlert] = useState("");

  const handleApprove = (id: string) => {
    setFlows(prev => prev.map(f => {
      if (f.id === id) {
        setAlert(`Transaction ID ${id} approved! Ledger balances adjusted.`);
        return { ...f, status: "Settled" };
      }
      return f;
    }));
  };

  const handleDecline = (id: string) => {
    setFlows(prev => prev.map(f => {
      if (f.id === id) {
        setAlert(`Transaction ID ${id} flagged and declined by operator.`);
        return { ...f, status: "Failed Review" };
      }
      return f;
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <span className="p-1 px-3 text-[10px] bg-[#00FFB2]/10 border border-[#00FFB2]/40 text-[#00FFB2] rounded-full font-mono uppercase tracking-widest font-bold">
            FINANCIAL PIPELINE
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FFB2] animate-pulse" />
        </div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white mt-1">
          Financial Flows: <span className="text-gradient-emerald">Deposits & Withdrawals</span>
        </h1>
        <p className="text-xs text-gray-500 font-mono mt-0.5">
          Validation of pending payments, automated fiat equivalent index, and asset distributions.
        </p>
      </div>

      {alert && (
        <div className="p-3.5 bg-[#00FFB2]/10 border border-[#00FFB2]/30 text-[#00FFB2] rounded-xl text-xs font-mono flex items-center justify-between">
          <span>{alert}</span>
          <button onClick={() => setAlert("")} className="text-gray-400 hover:text-white uppercase text-[10px]">Dismiss</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deposit card tracker */}
        <GlassCard className="p-6 border-white/5" hoverEffect={false}>
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Active Deposit Pools</span>
            <ArrowUp className="w-4 h-4 text-[#00FFB2]" />
          </div>
          <div className="font-mono text-3xl font-bold text-white">412.5 ETH</div>
          <p className="text-[10px] text-gray-500 mt-1">Staged in validator consensus locks indices</p>
        </GlassCard>

        {/* Withdrawal card tracker */}
        <GlassCard className="p-6 border-white/5" hoverEffect={false}>
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Withdrawal Approvals Queue</span>
            <ArrowDown className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="font-mono text-3xl font-bold text-white">34.7 ETH</div>
          <p className="text-[10px] text-[#D4AF37] mt-1">Requires manual signatures from Operators Desk</p>
        </GlassCard>
      </div>

      {/* Main Flow Grid */}
      <GlassCard className="p-6 border-white/5" hoverEffect={false}>
        <h3 className="font-display font-bold text-white text-sm mb-4">Transactions Log Pipeline</h3>
        <div className="space-y-4">
          {flows.map((f) => (
            <div key={f.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border border-white/10 ${
                  f.type === "Deposit" ? "bg-[#00FFB2]/10 text-[#00FFB2]" : "bg-purple-500/10 text-purple-400"
                }`}>
                  {f.type === "Deposit" ? <ArrowUp className="w-5 h-5" /> : <ArrowDown className="w-5 h-5" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{f.type}</span>
                    <span className="text-[10px] font-mono text-gray-500">{f.id}</span>
                  </div>
                  <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                    Wallet: <span className="text-gray-300 font-bold select-all">{f.address}</span> | Initiated: <span className="text-gray-500">{f.initiatedAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-xs font-bold font-mono text-white">{f.amount}</div>
                  <div className="text-[10px] text-gray-500 font-mono">{f.usdValue}</div>
                </div>

                <div className="flex items-center gap-3 min-w-[200px] justify-end">
                  {f.status === "Pending Validation" ? (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleApprove(f.id)}
                        className="px-2.5 py-1 text-[10px] font-bold border border-[#00FFB2]/30 text-[#00FFB2] hover:bg-[#00FFB2]/10 rounded font-mono"
                      >
                        Release
                      </button>
                      <button 
                        onClick={() => handleDecline(f.id)}
                        className="px-2.5 py-1 text-[10px] font-bold border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded font-mono"
                      >
                        Decline
                      </button>
                    </div>
                  ) : (
                    <span className={`text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded ${
                      f.status === "Settled" ? "bg-[#00FFB2]/10 text-[#00FFB2]" : "bg-red-500/10 text-red-400"
                    }`}>
                      {f.status}
                    </span>
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
