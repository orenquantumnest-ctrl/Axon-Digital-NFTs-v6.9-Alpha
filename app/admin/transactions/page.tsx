import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Search,
  Filter,
  Activity,
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";

const TRANSACTIONS = [
  {
    id: "tx_99120",
    type: "Deposit",
    user: "0x7b...3f9a",
    amount: "+5,000 USDT",
    status: "success",
    date: "2026-05-18 10:30",
  },
  {
    id: "tx_99119",
    type: "Withdrawal",
    user: "0x1a...b4e2",
    amount: "-2,500 USDT",
    status: "pending",
    date: "2026-05-18 09:45",
  },
  {
    id: "tx_99118",
    type: "Plan Purchase",
    user: "0x9c...d5b1",
    amount: "-1,000 USDT",
    status: "success",
    date: "2026-05-17 18:20",
  },
  {
    id: "tx_99117",
    type: "Referral Bonus",
    user: "0x4f...e8a2",
    amount: "+50 USDT",
    status: "success",
    date: "2026-05-17 15:10",
  },
  {
    id: "tx_99116",
    type: "ROI Payout",
    user: "0x7b...3f9a",
    amount: "+150 USDT",
    status: "success",
    date: "2026-05-17 12:00",
  },
];

export default function AdminTransactionsPage() {
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
                placeholder="Search tx ID or user..."
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

        <div className="overflow-x-auto">
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
              {TRANSACTIONS.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="py-4 font-mono text-slate-300">{tx.id}</td>
                  <td className="py-4 text-white font-medium">{tx.type}</td>
                  <td className="py-4 font-mono text-[#D4AF37]">{tx.user}</td>
                  <td
                    className={`py-4 font-bold flex items-center gap-1.5 ${tx.amount.startsWith("+") ? "text-[#00FFB2]" : "text-red-400"}`}
                  >
                    {tx.amount.startsWith("+") ? (
                      <ArrowDownRight className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                    {tx.amount}
                  </td>
                  <td className="py-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                        tx.status === "success"
                          ? "bg-[#00FFB2]/5 text-[#00FFB2] border-[#00FFB2]/20"
                          : "bg-amber-500/5 text-amber-500 border-amber-500/20"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-4 text-right text-slate-400">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
