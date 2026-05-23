import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Search,
  Filter,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

const WITHDRAWALS = [
  {
    id: "wth_001",
    user: "0x7b...3f9a",
    amount: "2,500 USDT",
    address: "0xabc...def1",
    network: "TRC20",
    status: "pending",
    date: "2026-05-18 11:20",
  },
  {
    id: "wth_002",
    user: "0x1a...b4e2",
    amount: "15,000 USDT",
    address: "0x123...4567",
    network: "ERC20",
    status: "completed",
    date: "2026-05-18 08:15",
  },
  {
    id: "wth_003",
    user: "0x9c...d5b1",
    amount: "800 USDT",
    address: "0x987...6543",
    network: "BEP20",
    status: "rejected",
    date: "2026-05-17 22:40",
  },
];

export default function AdminWithdrawalsPage() {
  return (
    <AdminLayout
      pageTitle="Withdrawals"
      pageDescription="Review and process outgoing withdrawal requests."
    >
      <div className="bg-[#121212]/60 backdrop-blur-2xl border border-white/5 rounded-[32px] p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Search withdrawals..."
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
                <th className="pb-4 font-bold">Request ID</th>
                <th className="pb-4 font-bold">User</th>
                <th className="pb-4 font-bold">Amount</th>
                <th className="pb-4 font-bold">Destination</th>
                <th className="pb-4 font-bold">Network</th>
                <th className="pb-4 font-bold">Status</th>
                <th className="pb-4 font-bold">Date</th>
                <th className="pb-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {WITHDRAWALS.map((wth) => (
                <tr
                  key={wth.id}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="py-4 font-mono text-slate-300">{wth.id}</td>
                  <td className="py-4 font-mono text-[#D4AF37]">{wth.user}</td>
                  <td className="py-4 text-white font-bold flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4 text-red-400" />
                    {wth.amount}
                  </td>
                  <td className="py-4 font-mono text-xs text-slate-500">
                    {wth.address}
                  </td>
                  <td className="py-4 text-slate-300">{wth.network}</td>
                  <td className="py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        wth.status === "completed"
                          ? "bg-[#00FFB2]/10 text-[#00FFB2] border border-[#00FFB2]/20"
                          : wth.status === "pending"
                            ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                            : "bg-red-500/10 text-red-500 border border-red-500/20"
                      }`}
                    >
                      {wth.status === "completed" && (
                        <CheckCircle2 className="w-3 h-3" />
                      )}
                      {wth.status === "pending" && (
                        <Clock className="w-3 h-3" />
                      )}
                      {wth.status === "rejected" && (
                        <XCircle className="w-3 h-3" />
                      )}
                      {wth.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 text-slate-400">{wth.date}</td>
                  <td className="py-4 text-right">
                    {wth.status === "pending" ? (
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="bg-[#00FFB2]/10 text-[#00FFB2] hover:bg-[#00FFB2]/20 px-3 py-1 rounded-full text-xs font-bold transition-colors">
                          Approve
                        </button>
                        <button className="bg-red-500/10 text-red-500 hover:bg-red-500/20 px-3 py-1 rounded-full text-xs font-bold transition-colors">
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-600 text-xs">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
