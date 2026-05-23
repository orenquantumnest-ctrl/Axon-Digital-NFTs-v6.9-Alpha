/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Search, Filter, Network, TrendingUp, Users, ShieldAlert, Activity } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminReferralsPage() {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    totalNetwork: 0,
    commissionsPaid: 0,
    activeReferrers: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchReferralsData = async () => {
    setLoading(true);
    
    // Fetch live referrals network
    const { data: refData } = await supabase
      .from('referrals')
      .select('*, referrer:profiles!referrals_referrer_id_fkey(email, wallet_address), referred:profiles!referrals_referred_id_fkey(email, wallet_address)')
      .order('created_at', { ascending: false });
      
    // Fetch aggregated rewards
    const { data: rewardsData } = await supabase
      .from('referral_rewards')
      .select('amount, is_paid');

    const networkSize = refData?.length || 0;
    const paidSum = rewardsData?.filter(r => r.is_paid).reduce((acc, r) => acc + (r.amount || 0), 0) || 0;
    
    // Unique referrers
    const uniqueIds = new Set(refData?.map(r => r.referrer_id));

    setMetrics({
      totalNetwork: networkSize,
      commissionsPaid: paidSum,
      activeReferrers: uniqueIds.size
    });

    setReferrals(refData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchReferralsData();

    const sub = supabase.channel('referrals-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'referrals' }, fetchReferralsData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'referral_rewards' }, fetchReferralsData)
      .subscribe();

    return () => { supabase.removeChannel(sub); };
  }, []);

  return (
    <AdminLayout
      pageTitle="Referral Network Engine"
      pageDescription="Monitor affiliate deep-links, dynamic rewards, and fraud-detection layers."
      kicker="V7.1 Restored"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-xl flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 blur-[40px] rounded-full group-hover:bg-[#D4AF37]/10 transition-colors"></div>
          <div className="w-12 h-12 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 flex items-center justify-center relative z-10">
            <Network className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div className="relative z-10">
            <p className="text-xs tracking-widest text-slate-500 font-bold uppercase">
              Total Network Size
            </p>
            <p className="text-3xl font-light text-white mt-1">{metrics.totalNetwork.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-xl flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FFB2]/5 blur-[40px] rounded-full group-hover:bg-[#00FFB2]/10 transition-colors"></div>
          <div className="w-12 h-12 rounded-full border border-[#00FFB2]/20 bg-[#00FFB2]/10 flex items-center justify-center relative z-10">
            <TrendingUp className="w-6 h-6 text-[#00FFB2]" />
          </div>
          <div className="relative z-10">
            <p className="text-xs tracking-widest text-slate-500 font-bold uppercase">
              Commissions Paid
            </p>
            <p className="text-3xl font-light text-white mt-1">{metrics.commissionsPaid.toLocaleString()} <span className="text-sm font-bold text-[#00FFB2]">AXN</span></p>
          </div>
        </div>
        
        <div className="bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-xl flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 blur-[40px] rounded-full group-hover:bg-sky-500/10 transition-colors"></div>
          <div className="w-12 h-12 rounded-full border border-sky-500/20 bg-sky-500/10 flex items-center justify-center relative z-10">
            <Users className="w-6 h-6 text-sky-400" />
          </div>
          <div className="relative z-10">
            <p className="text-xs tracking-widest text-slate-500 font-bold uppercase">
              Active Referrers
            </p>
            <p className="text-3xl font-light text-white mt-1">{metrics.activeReferrers.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-[#121212]/60 backdrop-blur-2xl border border-white/5 rounded-[32px] p-6 shadow-2xl flex flex-col min-h-[500px]">
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

        <div className="flex-1 overflow-x-auto custom-scrollbar">
          {loading ? (
             <div className="p-12 flex justify-center items-center h-full">
               <Activity className="w-8 h-8 text-[#D4AF37] animate-pulse" />
             </div>
          ) : referrals.length === 0 ? (
             <div className="p-12 text-center h-full flex flex-col justify-center items-center">
               <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
                 <Network className="w-8 h-8 text-slate-500" />
               </div>
               <h3 className="text-white font-bold text-lg mb-1">No Traceable Network</h3>
               <p className="text-slate-500 text-sm">No referrals mapped yet.</p>
             </div>
          ) : (
             <table className="w-full text-left text-sm border-collapse">
               <thead className="text-xs text-slate-500 uppercase tracking-widest border-b border-white/5">
                 <tr>
                   <th className="pb-4 font-bold px-4">Referrer</th>
                   <th className="pb-4 font-bold px-4">Referred User</th>
                   <th className="pb-4 font-bold px-4">Level</th>
                   <th className="pb-4 font-bold px-4">Status</th>
                   <th className="pb-4 font-bold px-4">Est. Reward</th>
                   <th className="pb-4 font-bold px-4 text-right">Date Connected</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                 {referrals.map((ref) => (
                   <tr key={ref.id} className="hover:bg-white/5 transition-colors group">
                     <td className="py-4 px-4">
                        <span className="font-mono text-[#D4AF37] font-bold block">{ref.referrer?.wallet_address ? `${ref.referrer_id.slice(0, 8)}...` : ref.referrer_id.slice(0, 8)}</span>
                        <span className="text-[10px] text-slate-500">{ref.referrer?.email || 'Unknown'}</span>
                     </td>
                     <td className="py-4 px-4">
                        <span className="font-mono text-slate-300 block">{ref.referred?.wallet_address ? `${ref.referred_id.slice(0, 8)}...` : ref.referred_id.slice(0, 8)}</span>
                        <span className="text-[10px] text-slate-500">{ref.referred?.email || 'Unknown'}</span>
                     </td>
                     <td className="py-4 px-4 text-white font-medium">
                       Tier {ref.level || 1}
                     </td>
                     <td className="py-4 px-4">
                        <span className={`inline-flex px-2 py-1 bg-[#121212] border rounded text-[10px] font-bold uppercase tracking-widest ${
                          ref.status === 'BLOCKED' || ref.status === 'FLAGGED' ? 'border-red-500/30 text-red-500 bg-red-500/10' :
                          ref.status === 'REWARDED' ? 'border-[#00FFB2]/30 text-[#00FFB2] bg-[#00FFB2]/10' :
                          'border-[#D4AF37]/30 text-[#D4AF37] bg-[#D4AF37]/10'
                        }`}>
                          {ref.status || 'ACTIVE'}
                        </span>
                     </td>
                     <td className="py-4 px-4 text-[#00FFB2] font-bold">
                       +{ref.reward_amount || '0'} AXN
                     </td>
                     <td className="py-4 px-4 text-right text-slate-400 font-mono text-xs">
                       {new Date(ref.created_at).toLocaleDateString()}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}