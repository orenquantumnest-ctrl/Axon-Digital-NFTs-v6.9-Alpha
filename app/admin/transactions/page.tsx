"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase, WalletTransactionRow } from "@/lib/supabase";
import {
  Search,
  Filter,
  Activity,
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";

export default function AdminTransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions, setTransactions] = useState<WalletTransactionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const { data, error } = await supabase
          .from("wallet_transactions")
          .select("*")
          .order("created_at", { ascending: false });
        if (data && !error) {
          setTransactions(data as WalletTransactionRow[]);
        }
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, []);

  const filteredTxs = transactions.filter((tx) => {
    const q = searchQuery.toLowerCase();
    return (
      (tx.id || "").toLowerCase().includes(q) ||
      (tx.user_id || "").toLowerCase().includes(q) ||
      (tx.type || "").toLowerCase().includes(q) ||
      (tx.currency || "").toLowerCase().includes(q)
    );
  });

  return (
    <AdminLayout
      pageTitle="Global Transactions"
      pageDescription="Master ledger of all system transactions."
    >
      <div className="bg-[#121212]/60 backdrop-blur-2xl border border-white/5 rounded-[32px] p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Search tx ID, user, or currency..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-all placeholder-slate-500 shadow-inner"
              />
              <Search className="w-4 h-4 absolute left-4 top-3 text-slate-500" />
            </div>
            <button className="bg-[#050505] border border-white/10 p-2.5 rounded-full hover:bg-white/5 transition-colors text-slate-400 hover:text-white">
              <Filter className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-full text-sm font-bold transition-colors border border-white/10 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-[300px] text-[#D4AF37]">
              Loading...
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-slate-500 uppercase tracking-widest border-b border-white/5">
                <tr>
                  <th className="pb-4 font-bold">TX ID</th>
                  <th className="pb-4 font-bold">Type</th>
                  <th className="pb-4 font-bold">User</th>
                  <th className="pb-4 font-bold">Amount</th>
                  <th className="pb-4 font-bold">Status</th>
                  <th className="pb-4 font-bold text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTxs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  filteredTxs.map((tx) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="py-4 font-mono text-slate-300">{tx.id.substring(0, 10)}...</td>
                      <td className="py-4 text-white font-medium">{tx.type}</td>
                      <td className="py-4 font-mono text-[#D4AF37]">{(tx.user_id || "").substring(0, 10)}...</td>
                      <td
                        className={`py-4 font-bold flex items-center gap-1.5 ${tx.amount > 0 ? "text-[#00FFB2]" : tx.amount < 0 ? "text-red-400" : "text-slate-300"}`}
                      >
                        {tx.amount > 0 ? (
                          <ArrowDownRight className="w-4 h-4" />
                        ) : tx.amount < 0 ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : null}
                        {tx.amount > 0 ? "+" : ""}{tx.amount} {tx.currency}
                      </td>
                      <td className="py-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            tx.status === "COMPLETED" || tx.status === "SUCCESS"
                              ? "bg-[#00FFB2]/5 text-[#00FFB2] border-[#00FFB2]/20"
                              : tx.status === "FAILED" || tx.status === "REJECTED"
                              ? "bg-red-500/5 text-red-500 border-red-500/20"
                              : "bg-amber-500/5 text-amber-500 border-amber-500/20"
                          }`}
                        >
                          {tx.status || "PENDING"}
                        </span>
                      </td>
                      <td className="py-4 text-right text-slate-400">
                        {new Date(tx.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
