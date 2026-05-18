'use client';

import { useState } from 'react';
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Search, Plus, MoreVertical, Edit2, Trash2, Power, Eye, TrendingUp, Users } from 'lucide-react';

const PLANS = [
  { id: 'pln_1', name: 'Starter Alpha', price: '100 USDT', roi: '15%', duration: '30 Days', status: 'active', nftLabel: 'Common', investors: 124 },
  { id: 'pln_2', name: 'Pro Velocity', price: '500 USDT', roi: '25%', duration: '45 Days', status: 'active', nftLabel: 'Rare', investors: 89 },
  { id: 'pln_3', name: 'Elite Quantum', price: '1000 USDT', roi: '40%', duration: '60 Days', status: 'paused', nftLabel: 'Legendary', investors: 42 },
];

export default function AdminPlansPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <AdminLayout 
      pageTitle="Plan Catalog Studio" 
      pageDescription="Configure NFT investment plans, ROI percentages, and duration rules."
      kicker="Catalog"
    >
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4 px-2">
        <div className="flex flex-wrap items-center gap-4 ml-auto">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search plans..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#121212] border border-white/10 text-white rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#D4AF37] w-48 md:w-64 transition-colors"
            />
            <Search className="w-4 h-4 absolute left-4 top-2.5 text-slate-500" />
          </div>
          <button className="bg-gradient-to-r from-[#D4AF37] to-[#B8942E] text-black px-6 py-2 rounded-full font-bold text-sm hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Plan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <div key={plan.id} className="bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
            {/* Status light */}
            <div className="absolute top-6 right-6 flex items-center gap-2 bg-[#0A0A0A] px-3 py-1.5 rounded-full border border-white/5">
              <span className={`w-2 h-2 rounded-full ${plan.status === 'active' ? 'bg-[#00FFB2] shadow-[0_0_10px_#00FFB2]' : 'bg-slate-500'}`}></span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                {plan.status}
              </span>
            </div>

            <div className="flex flex-col h-full mt-2">
              <span className="text-xs font-bold text-[#D4AF37] tracking-widest uppercase mb-1">{plan.nftLabel} TIER</span>
              <h3 className="text-2xl font-light text-white mb-6">{plan.name}</h3>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <span className="text-sm text-slate-400">Entry Price</span>
                  <span className="text-sm font-bold text-white">{plan.price}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <span className="text-sm text-slate-400">Projected ROI</span>
                  <span className="text-sm font-bold text-[#00FFB2]">{plan.roi}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <span className="text-sm text-slate-400">Lockup Duration</span>
                  <span className="text-sm font-bold text-white">{plan.duration}</span>
                </div>
                <div className="flex items-center justify-between pb-3">
                  <span className="text-sm text-slate-400 flex items-center gap-2"><Users className="w-4 h-4"/> Active Wallets</span>
                  <span className="text-sm font-bold text-white">{plan.investors}</span>
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-white/5">
                <button className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  <Edit2 className="w-4 h-4"/> Edit
                </button>
                <div className="flex items-center gap-1">
                  <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                    <Power className={`w-4 h-4 ${plan.status === 'active' ? 'text-emerald-400' : 'text-slate-400'}`}/>
                  </button>
                  <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4"/>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Plan Card */}
        <div className="bg-[#121212]/30 backdrop-blur-xl border border-dashed border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[400px] cursor-pointer hover:bg-[#121212]/50 hover:border-white/20 transition-all group">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
             <Plus className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <h3 className="text-lg font-bold text-white">Create New Plan</h3>
          <p className="text-sm text-slate-400 text-center mt-2 max-w-[200px]">Launch a new NFT staking tier into the ecosystem.</p>
        </div>
      </div>
    </AdminLayout>
  );
}
