import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Search,
  Filter,
  ArrowDownRight,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

const DEPOSITS = [
  {
    id: "dep_001",
    user: "0x7b...3f9a",
    amount: "5,000 USDT",
    network: "TRC20",
    txHash: "0x8f2...c8a1",
    status: "completed",
    date: "2026-05-18 10:30",
  },
  {
    id: "dep_002",
    user: "0x1a...b4e2",
    amount: "1,200 USDT",
    network: "ERC20",
    txHash: "0x3b1...f9c2",
    status: "pending",
    date: "2026-05-18 09:45",
  },
  {
    id: "dep_003",
    user: "0x9c...d5b1",
    amount: "10,000 USDT",
    network: "BEP20",
    txHash: "0xa4e...b2d5",
    status: "failed",
    date: "2026-05-17 18:20",
  },
  {
    id: "dep_004",
    user: "0x4f...e8a2",
    amount: "250 USDT",
    network: "TRC20",
    txHash: "0xc7f...e1a4",
    status: "completed",
    date: "2026-05-17 15:10",
  },
];

export default function AdminDepositsPage() {
  return (
    <AdminLayout
      pageTitle="Deposits"
      pageDescription="Manage and verify incoming network deposits."
    >
      <div className="bg-[#121212]/60 backdrop-blur-2xl border border-white/5 rounded-[32px] p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Search deposits..."
                className="w-full bg-[#050505] border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-all placeholder-slate-500 shadow-inner"
              />
              <Search className="w-4 h-4 absolute left-4 top-3 text-slate-500" />
            </div>
            <button className="bg-[#050505] border border-white/10 p-2.5 rounded-full hover:bg-white/5 transition-colors text-slate-400 hover:text-white">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-slate-500 uppercase tracking-widest border-b border-white/5">
              <tr>
                <th className="pb-4 font-bold">Transaction ID</th>
                <th className="pb-4 font-bold">User Wallet</th>
                <th className="pb-4 font-bold">Amount</th>
                <th className="pb-4 font-bold">Network</th>
                <th className="pb-4 font-bold">Hash</th>
                <th className="pb-4 font-bold">Status</th>
                <th className="pb-4 font-bold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {DEPOSITS.map((dep) => (
                <tr
                  key={dep.id}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="py-4 font-mono text-slate-300">{dep.id}</td>
                  <td className="py-4 font-mono text-[#D4AF37]">{dep.user}</td>
                  <td className="py-4 text-white font-bold flex items-center gap-2">
                    <ArrowDownRight className="w-4 h-4 text-[#00FFB2]" />
                    {dep.amount}
                  </td>
                  <td className="py-4 text-slate-300">{dep.network}</td>
                  <td className="py-4 font-mono text-xs text-slate-500 truncate max-w-[100px]">
                    {dep.txHash}
                  </td>
                  <td className="py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        dep.status === "completed"
                          ? "bg-[#00FFB2]/10 text-[#00FFB2] border border-[#00FFB2]/20"
                          : dep.status === "pending"
                            ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                            : "bg-red-500/10 text-red-500 border border-red-500/20"
                      }`}
                    >
                      {dep.status === "completed" && (
                        <CheckCircle2 className="w-3 h-3" />
                      )}
                      {dep.status === "pending" && (
                        <Clock className="w-3 h-3" />
                      )}
                      {dep.status === "failed" && (
                        <XCircle className="w-3 h-3" />
                      )}
                      {dep.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 text-slate-400">{dep.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
