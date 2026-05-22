"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { 
  FileSpreadsheet, Search, CheckCircle, RefreshCcw, ArrowUpRight,
  Shield, Brain, Filter, Download
} from "lucide-react";

interface TransactionReceipt {
  hash: string;
  block: number;
  from: string;
  to: string;
  value: string;
  gasPaid: string;
  method: string;
  status: "Success" | "Reverted" | "Pending Approval";
  timestamp: string;
}

const INITIAL_TXS: TransactionReceipt[] = [
  { hash: "0x98fcf7aa33bc789a1bc1db9a1cb1db9aff12918231aa", block: 19284004, from: "0x7bbc...db9a", to: "0x44c3...bf0", value: "2.5 ETH", gasPaid: "0.00213 ETH", method: "Mint Token", status: "Success", timestamp: "2026-05-22 14:30:12" },
  { hash: "0xb7c89aaf33bc789a1bc1db9a1cb1db9aff1c3388831b", block: 19284002, from: "0xab17...831", to: "Staking Pool #2", value: "10.0 ETH", gasPaid: "0.00412 ETH", method: "Deposit Stake", status: "Success", timestamp: "2026-05-22 14:15:10" },
  { hash: "0xee6e41fa1bc1db9a1cb1db9a1cb1db9af1c3044108a", block: 19283995, from: "Ecosystem Wallet", to: "0xee6e...22bf", value: "0.54 ETH", gasPaid: "0.00199 ETH", method: "Distribute APY", status: "Success", timestamp: "2026-05-22 13:42:00" },
  { hash: "0xcc71d3a01bc1db9a1cb1db9a1cb1db9af1c99011116", block: 19283988, from: "0xf11a...3a0", to: "0x7bbc...db9a", value: "1.8 ETH", gasPaid: "0.00201 ETH", method: "Buy NFT", status: "Success", timestamp: "2026-05-22 12:05:41" },
  { hash: "0x331e991aaf1bc1db9a1cb1db9a1cb1db9af1c771192", block: 19284042, from: "0x331e...ddaa", to: "0x7cbc...ffee", value: "45.0 ETH", gasPaid: "0.00512 ETH", method: "Withdraw Principal", status: "Pending Approval", timestamp: "Just Now" },
  { hash: "0xfa12eeea1bc1db9a1cb1db9a1cb1db9af1c1212884a", block: 19283912, from: "0x98fc...99aa", to: "0x1234...9010", value: "6.0 ETH", gasPaid: "0.00000 ETH", method: "Internal Transfer", status: "Reverted", timestamp: "2026-05-21 17:01:21" }
];

export default function TransactionsAdmin() {
  const [txs, setTxs] = useState<TransactionReceipt[]>(INITIAL_TXS);
  const [search, setSearch] = useState("");
  const [filterMethod, setFilterMethod] = useState("ALL");
  const [alertMsg, setAlertMsg] = useState("");

  const handleApproveTx = (hash: string) => {
    setTxs(prev => prev.map(t => {
      if (t.hash === hash) {
        setAlertMsg(`Contract receipt ${hash.substring(0, 10)}... approved on high-speed consensus bridge.`);
        return { ...t, status: "Success" };
      }
      return t;
    }));
  };

  const handleRejectTx = (hash: string) => {
    setTxs(prev => prev.map(t => {
      if (t.hash === hash) {
        setAlertMsg(`Cryptographic signature failed. Receipt ${hash.substring(0, 10)}... aborted.`);
        return { ...t, status: "Reverted" };
      }
      return t;
    }));
  };

  const filteredTxs = txs.filter(t => {
    const matchesSearch = t.hash.toLowerCase().includes(search.toLowerCase()) || 
                          t.from.toLowerCase().includes(search.toLowerCase()) ||
                          t.to.toLowerCase().includes(search.toLowerCase());
    const matchesMethod = filterMethod === "ALL" || t.method === filterMethod;
    return matchesSearch && matchesMethod;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <span className="p-1 px-3 text-[10px] bg-[#00FFB2]/10 border border-[#00FFB2]/40 text-[#00FFB2] rounded-full font-mono uppercase tracking-widest font-bold">
            BLOCKED RECEIPTS
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FFB2] animate-pulse" />
        </div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white mt-1">
          Ecosystem <span className="text-gradient-emerald">Ledger</span> Transactions
        </h1>
        <p className="text-xs text-gray-500 font-mono mt-0.5">
          Full transactional pipeline audit trail, multi-sig proofs, and manual approval gateways.
        </p>
      </div>

      {alertMsg && (
        <div className="p-3.5 bg-[#00FFB2]/10 border border-[#00FFB2]/30 text-[#00FFB2] rounded-xl text-xs font-mono flex items-center justify-between">
          <span>{alertMsg}</span>
          <button onClick={() => setAlertMsg("")} className="text-gray-400 hover:text-white uppercase text-[10px]">Dismiss</button>
        </div>
      )}

      {/* Primary table sheet */}
      <GlassCard className="p-6 border-white/5" hoverEffect={false}>
        
        {/* Controls ribbon */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search hashes, nodes, or callers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-full pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#00FFB2] transition-colors font-mono"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="bg-black/60 border border-white/10 rounded-full px-3 py-1.5 text-xs text-gray-400 focus:outline-none"
            >
              <option value="ALL">All Operations</option>
              <option value="Mint Token">Mint Token</option>
              <option value="Deposit Stake">Deposit Stake</option>
              <option value="Distribute APY">Distribute APY</option>
              <option value="Buy NFT">Buy NFT</option>
              <option value="Withdraw Principal">Withdraw Principal</option>
              <option value="Internal Transfer">Internal Transfer</option>
            </select>
          </div>
        </div>

        {/* Transactions list */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="p-4 text-gray-400 font-bold uppercase text-[10px]">Hash receipt</th>
                <th className="p-4 text-gray-400 font-bold uppercase text-[10px]">Indexed Block</th>
                <th className="p-4 text-gray-400 font-bold uppercase text-[10px]">Sender</th>
                <th className="p-4 text-gray-400 font-bold uppercase text-[10px]">Recipient</th>
                <th className="p-4 text-gray-400 font-bold uppercase text-[10px]">Value Allocation</th>
                <th className="p-4 text-gray-400 font-bold uppercase text-[10px]">Function</th>
                <th className="p-4 text-gray-400 font-bold uppercase text-[10px]">Fee Gwei</th>
                <th className="p-4 text-gray-400 font-bold uppercase text-[10px]">Timestamp / Status</th>
                <th className="p-4 text-gray-300 text-right uppercase text-[10px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTxs.map((t) => (
                <tr key={t.hash} className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-all">
                  <td className="p-4 text-gray-400 font-semibold select-all text-[11px] truncate max-w-[120px]" title={t.hash}>{t.hash}</td>
                  <td className="p-4 text-gray-300 font-bold">{t.block}</td>
                  <td className="p-4 text-gray-400 select-all">{t.from}</td>
                  <td className="p-4 text-gray-400 select-all">{t.to}</td>
                  <td className="p-4 font-bold text-white">{t.value}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-gray-300 font-semibold text-[10px]">
                      {t.method}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 font-medium">{t.gasPaid}</td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-gray-500 text-[9px]">{t.timestamp}</span>
                      <span className={`text-[10px] font-bold ${
                        t.status === "Success" ? "text-[#00FFB2]" :
                        t.status === "Reverted" ? "text-red-400" :
                        "text-amber-400 animate-pulse"
                      }`}>
                        {t.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    {t.status === "Pending Approval" ? (
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleApproveTx(t.hash)}
                          className="px-2.5 py-1 text-[10px] font-bold border border-[#00FFB2]/30 text-[#00FFB2] hover:bg-[#00FFB2]/10 rounded transition-all"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleRejectTx(t.hash)}
                          className="px-2.5 py-1 text-[10px] font-bold border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded transition-all"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-600 text-[10px] italic">Immutable</span>
                    )}
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
