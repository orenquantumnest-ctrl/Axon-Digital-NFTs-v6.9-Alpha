import { AdminLayout } from "@/components/admin/AdminLayout";
import { Search, Filter, Network, TrendingUp, Users } from "lucide-react";

const REFERRALS = [
  {
    id: "ref_001",
    referrer: "0x7b...3f9a",
    referred: "0x1a...b4e2",
    planPurchased: "Starter Alpha",
    commission: "50 USDT",
    date: "2026-05-18 10:30",
  },
  {
    id: "ref_002",
    referrer: "0x9c...d5b1",
    referred: "0x2b...c3d4",
    planPurchased: "Pro Beta",
    commission: "250 USDT",
    date: "2026-05-17 15:45",
  },
  {
    id: "ref_003",
    referrer: "0x7b...3f9a",
    referred: "0x4f...e8a2",
    planPurchased: "Elite Gamma",
    commission: "1,000 USDT",
    date: "2026-05-16 09:20",
  },
];

export default function AdminReferralsPage() {
  return (
    <AdminLayout
      pageTitle="Referral Network"
      pageDescription="Monitor affiliate earnings and network growth."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
            <Network className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">
              Total Network Size
            </p>
            <p className="text-2xl font-bold text-white mt-1">12,450</p>
          </div>
        </div>
        <div className="bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#00FFB2]/10 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-[#00FFB2]" />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">
              Commissions Paid
            </p>
            <p className="text-2xl font-bold text-white mt-1">45,200 USDT</p>
          </div>
        </div>
        <div className="bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">
              Active Referrers
            </p>
            <p className="text-2xl font-bold text-white mt-1">3,120</p>
          </div>
        </div>
      </div>

      <div className="bg-[#121212]/60 backdrop-blur-2xl border border-white/5 rounded-[32px] p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Search referrer wallet..."
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
                <th className="pb-4 font-bold">Referrer</th>
                <th className="pb-4 font-bold">Referred User</th>
                <th className="pb-4 font-bold">Plan Purchased</th>
                <th className="pb-4 font-bold">Commission Earned</th>
                <th className="pb-4 font-bold text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {REFERRALS.map((ref) => (
                <tr
                  key={ref.id}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="py-4 font-mono text-[#D4AF37] font-bold">
                    {ref.referrer}
                  </td>
                  <td className="py-4 font-mono text-slate-300">
                    {ref.referred}
                  </td>
                  <td className="py-4 text-white font-medium">
                    {ref.planPurchased}
                  </td>
                  <td className="py-4 text-[#00FFB2] font-bold">
                    +{ref.commission}
                  </td>
                  <td className="py-4 text-right text-slate-400">{ref.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
