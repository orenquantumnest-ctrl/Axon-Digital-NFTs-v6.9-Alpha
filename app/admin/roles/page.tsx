'use client';

import { useState } from 'react';
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ShieldCheck, Plus, Users, Key, Monitor, Activity, Settings, Database, Edit2, Trash2 } from 'lucide-react';

const ROLES = [
  { id: '1', title: 'Super Admin', description: 'Full access to all systems, billing, encryption keys, and role management.', users: 2, scopes: ['All'] },
  { id: '2', title: 'Finance Admin', description: 'Access to deposits, withdrawals, transactions, and treasury monitoring.', users: 5, scopes: ['Deposits', 'Withdrawals', 'Transactions', 'Ledger'] },
  { id: '3', title: 'Support Admin', description: 'Access to user management, KYC, and basic system logs.', users: 12, scopes: ['Users', 'KYC', 'Logs', 'Support'] },
  { id: '4', title: 'Analyst Admin', description: 'Read-only access to analytics, revenue forecasts, and referrals.', users: 8, scopes: ['Read-Only Analytics', 'Referrals'] },
];

export default function AdminRolesPage() {
  return (
    <AdminLayout 
      pageTitle="Multi-Admin RBAC" 
      pageDescription="Manage organizational access Control, departments, and hierarchical permissions."
      kicker="Access Control"
    >
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4 px-2">
        <div className="text-sm text-slate-400">
           Total Admins: <strong className="text-white">27</strong> across <strong>4</strong> distinct roles.
        </div>
        <button className="bg-gradient-to-r from-[#D4AF37] to-[#B8942E] text-black px-6 py-2 rounded-full font-bold text-sm hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all flex items-center gap-2 w-max ml-auto">
          <Plus className="w-4 h-4" /> Create Role Policy
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 border border-white/5 rounded-3xl bg-[#121212]/60 backdrop-blur-xl p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
             <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center">
               <ShieldCheck className="w-6 h-6 text-indigo-400" />
             </div>
             <div>
               <h3 className="text-lg font-bold text-white">Security Model</h3>
               <p className="text-xs text-slate-400">Strict hierarchical derivation.</p>
             </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            Roles are cryptographically enforced via Supabase Row Level Security (RLS) policies. Only Super Admins can alter these structures.
          </p>
          <div className="space-y-4 mb-6">
             <div className="flex items-start gap-3">
               <div className="mt-1 w-2 h-2 rounded-full bg-[#00FFB2]"></div>
               <p className="text-xs text-slate-400">JWT Payload contains role claims checked during validation.</p>
             </div>
             <div className="flex items-start gap-3">
               <div className="mt-1 w-2 h-2 rounded-full bg-sky-500"></div>
               <p className="text-xs text-slate-400">Session bridge isolates wallet passwords from frontend logic.</p>
             </div>
             <div className="flex items-start gap-3">
               <div className="mt-1 w-2 h-2 rounded-full bg-[#D4AF37]"></div>
               <p className="text-xs text-slate-400">All destructive actions require MFA enforcement.</p>
             </div>
          </div>
          <div className="mt-auto">
             <button className="w-full bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-xl border border-white/10 transition-colors">
               Audit RLS Matrix
             </button>
          </div>
        </div>
        
        <div className="col-span-1 lg:col-span-2 space-y-4">
           {ROLES.map(role => (
             <div key={role.id} className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 hover:border-white/20 transition-colors">
               <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                 <div>
                   <h3 className="text-xl font-bold text-white mb-2">{role.title}</h3>
                   <p className="text-sm text-slate-400">{role.description}</p>
                 </div>
                 <div className="flex items-center gap-2">
                   <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                     <Edit2 className="w-4 h-4" />
                   </button>
                   {role.title !== 'Super Admin' && (
                     <button className="p-2 bg-white/5 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400 transition-colors">
                       <Trash2 className="w-4 h-4" />
                     </button>
                   )}
                 </div>
               </div>
               
               <div className="flex flex-wrap gap-2 mb-6">
                 {role.scopes.map(scope => (
                   <span key={scope} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300">
                     {scope}
                   </span>
                 ))}
               </div>

               <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                 <div className="flex -space-x-2">
                   <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-[#0A0A0A] flex items-center justify-center text-[10px] font-bold text-white">A</div>
                   <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-[#0A0A0A] flex items-center justify-center text-[10px] font-bold text-white">S</div>
                   {role.users > 2 && <div className="w-8 h-8 rounded-full bg-[#121212] border-2 border-[#0A0A0A] flex items-center justify-center text-[10px] font-bold text-slate-400">+{role.users - 2}</div>}
                 </div>
                 <span className="text-xs text-slate-500 font-medium">{role.users} active accounts in this policy</span>
                 
                 <button className="ml-auto text-xs font-bold uppercase tracking-widest text-sky-400 hover:text-sky-300">Manage Users</button>
               </div>
             </div>
           ))}
        </div>
      </div>
    </AdminLayout>
  );
}
