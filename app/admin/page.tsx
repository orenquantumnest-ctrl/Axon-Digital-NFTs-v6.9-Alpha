'use client';

import { useState, useEffect } from 'react';
import { BarChart, LineChart, DoughnutChart, RadarChart } from "@/components/admin/Charts";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { 
  Users, BarChart2, Bell, Activity, ChevronRight, Shield, 
  Database, Zap, ArrowUpRight, ShieldCheck, AlertTriangle
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [filter, setFilter] = useState('24h');

  const [data, setData] = useState<any>({
    traffic: [65, 59, 80, 81, 56, 90, 110],
    sales: [12, 19, 3, 5, 2, 10, 14]
  });

  const lineOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { 
        mode: 'index',
        intersect: false,
        backgroundColor: '#0a0a0a',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: '#1e293b',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => `Sessions: ${context.parsed.y}`,
        }
      }
    },
    scales: {
      x: { display: false },
      y: { display: false }
    },
    elements: {
      line: { tension: 0.4 },
      point: { radius: 0, hitRadius: 10, hoverRadius: 4 }
    }
  };

  const lineChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Traffic',
      data: data.traffic,
      borderColor: '#00FFB2',
      backgroundColor: 'rgba(0, 255, 178, 0.1)',
      borderWidth: 3,
      fill: true,
    }]
  };

  const storageData = {
    labels: ['Used', 'Free'],
    datasets: [{
      data: [75, 25],
      backgroundColor: ['#00FFB2', 'transparent'],
      borderColor: ['#00FFB2', '#1e293b'],
      borderWidth: 0,
      cutout: '80%'
    }]
  };
  const storageOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    animation: { animateScale: true }
  };

  const radarData = {
    labels: ['Auth', 'Tx', 'Network', 'API', 'DB'],
    datasets: [{
      label: 'Load',
      data: [35, 65, 40, 80, 50],
      backgroundColor: 'rgba(0, 255, 178, 0.2)',
      borderColor: '#00FFB2',
      pointBackgroundColor: '#00FFB2',
      pointBorderColor: '#0a0a0a',
      borderWidth: 2,
    }]
  };
  const radarOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.05)' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        pointLabels: { color: '#94a3b8', font: { size: 10 } },
        ticks: { display: false }
      }
    },
    plugins: { legend: { display: false } }
  };

  const getStatusColor = (color: string) => {
    switch (color) {
      case 'emerald': return 'bg-[#00FFB2]';
      case 'sky': return 'bg-sky-500';
      case 'amber': return 'bg-[#D4AF37]';
      case 'slate': return 'bg-slate-500';
      case 'indigo': return 'bg-indigo-500';
      default: return 'bg-slate-500';
    }
  }

  return (
    <AdminLayout 
      pageTitle="Operations Cockpit" 
      pageDescription="Live control center for users, plans, deposits, withdrawals, transactions, and audit telemetry."
      kicker="Overview"
    >
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4 px-2">
        <div className="flex flex-wrap items-center gap-4 ml-auto">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#121212] border border-white/10 text-slate-300 rounded-full py-2 px-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-[#D4AF37] cursor-pointer"
          >
            <option value="24h">LATEST 24H</option>
            <option value="7d">LATEST 7D</option>
            <option value="30d">LATEST 30D</option>
          </select>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(120px,auto)] gap-4 md:gap-6 min-h-[580px]">
        
        {/* Main Stats Card */}
        <div className="col-span-1 md:col-span-2 row-span-2 bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 relative overflow-hidden flex flex-col min-h-[300px]">
          <div className="relative z-10 pointer-events-none">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00FFB2]">System Traffic</span>
            <div className="flex items-baseline gap-3 mt-4">
              <h2 className="text-4xl md:text-5xl font-light text-white">12.8k</h2>
              <span className="text-xl text-[#00FFB2] font-bold tracking-tighter flex items-center">
                <ArrowUpRight className="w-5 h-5 mr-1" /> 14%
              </span>
            </div>
            <p className="text-slate-400 mt-2 text-sm max-w-sm">Unique visitor sessions tracked in the last interval based on your filter.</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-40 md:h-56 pt-10 opacity-80 pointer-events-auto">
             <LineChart data={lineChartData} options={lineOptions} />
          </div>
        </div>

        {/* Quick Action Card */}
        <div className="col-span-1 row-span-2 bg-gradient-to-br from-[#121212] to-[#0A0A0A] border border-[#D4AF37]/20 rounded-3xl p-6 flex flex-col justify-between shadow-[0_0_30px_rgba(212,175,55,0.05)] min-h-[300px] relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 blur-[50px] rounded-full group-hover:bg-[#D4AF37]/20 transition-colors"></div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <h3 className="text-2xl font-bold text-white leading-tight">Plan<br/>Catalog</h3>
            <p className="text-slate-400 mt-3 text-sm leading-relaxed">Instantly suspend, hide, or deploy new smart catalog plans.</p>
          </div>
          <button className="relative z-10 w-full bg-gradient-to-r from-[#D4AF37] to-[#B8942E] text-black py-3 rounded-2xl font-bold text-sm hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all mt-6 shadow-[0_0_10px_rgba(212,175,55,0.2)]">Open Catalog</button>
        </div>

        {/* Active Nodes Card */}
        <div className="col-span-1 row-span-1 bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-5 flex items-center justify-between group cursor-pointer hover:border-white/10 transition">
          <div>
            <span className="block text-xs text-slate-500 uppercase font-bold tracking-wider">Active RPC Nodes</span>
            <span className="text-2xl font-mono text-white mt-1 block">48/50</span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-[#00FFB2]/20 border-t-[#00FFB2] flex items-center justify-center group-hover:rotate-90 transition-transform duration-500 mt-1">
             <div className="w-2 h-2 rounded-full bg-[#00FFB2] shadow-[0_0_10px_#00FFB2]"></div>
          </div>
        </div>

        {/* Error Rate Card */}
        <div className="col-span-1 row-span-1 bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-5 flex items-center justify-between cursor-pointer hover:border-white/10 transition">
          <div>
            <span className="block text-xs text-slate-500 uppercase font-bold tracking-wider">Audit Alert</span>
            <span className="text-2xl font-mono text-white mt-1 block text-[#D4AF37]">0.02%</span>
          </div>
          <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mt-1">
            <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
          </div>
        </div>

        {/* Recent Events List */}
        <div className="col-span-1 md:col-span-2 row-span-4 bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Real-time Ledger Telemetry</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00FFB2] animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"></span>
              <span className="text-xs text-slate-400 font-bold tracking-widest uppercase">Live</span>
            </div>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {[
              { c: 'emerald', label: 'Admin Authentication', sub: 'Supabase • Super Admin', time: '2m' },
              { c: 'amber', label: 'Payment Proof Submitted', sub: 'Pending Deposit • 0x8a...4b12', time: '14m' },
              { c: 'slate', label: 'Withdrawal Request', sub: 'Queue • USDT TRC20', time: '1h' },
              { c: 'sky', label: 'KYC Document Uploaded', sub: 'User Intelligence • ID Verification', time: '3h' },
              { c: 'indigo', label: 'Smart Contract Call', sub: 'Plan Purchase • Premium Gold', time: '5h' },
              { c: 'emerald', label: 'Referral Bonus Distributed', sub: 'Network • Level 1 Reward', time: '6h' },
            ].map((evt, i) => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-white/10">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(evt.c)} flex-shrink-0`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{evt.label}</p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{evt.sub}</p>
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase flex-shrink-0">{evt.time} ago</span>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-xs text-slate-300 font-bold uppercase tracking-widest transition-colors border border-white/5">
            View Full Audit Log
          </button>
        </div>

        {/* Storage / Resource Card */}
        <div className="col-span-1 row-span-2 bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex flex-col justify-between min-h-[250px]">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest text-center md:text-left">Postgres Load</h3>
          <div className="relative w-28 h-28 mx-auto my-auto">
             <DoughnutChart data={storageData} options={storageOptions} />
             <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className="text-xl font-bold text-white leading-none">75%</span>
               <span className="text-[10px] text-slate-500 mt-1">Optimal</span>
             </div>
          </div>
          <p className="text-xs text-slate-500 text-center mt-4 border-t border-white/5 pt-4">Supabase connection pool healthy.</p>
        </div>

        {/* Database Performance */}
        <div className="col-span-1 row-span-4 bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex flex-col min-h-[400px]">
          <div className="flex items-center gap-2 mb-8">
            <Database className="w-5 h-5 text-slate-400" />
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Supabase Node</h3>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-8">
             <div className="space-y-2">
               <div className="flex justify-between text-xs">
                 <span className="text-slate-400 font-medium tracking-wide">CPU Usage</span>
                 <span className="text-white font-mono">22%</span>
               </div>
               <div className="w-full h-1.5 bg-[#050505] border border-white/5 rounded-full overflow-hidden">
                 <div className="bg-sky-500 h-full w-[22%] rounded-full shadow-[0_0_10px_rgba(14,165,233,0.5)]"></div>
               </div>
             </div>
             <div className="space-y-2">
               <div className="flex justify-between text-xs">
                 <span className="text-slate-400 font-medium tracking-wide">RAM Usage</span>
                 <span className="text-white font-mono">68%</span>
               </div>
               <div className="w-full h-1.5 bg-[#050505] border border-white/5 rounded-full overflow-hidden">
                 <div className="bg-[#D4AF37] h-full w-[68%] rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]"></div>
               </div>
             </div>
             <div className="space-y-2">
               <div className="flex justify-between text-xs">
                 <span className="text-slate-400 font-medium tracking-wide">Active Conn</span>
                 <span className="text-white font-mono">142</span>
               </div>
               <div className="w-full h-1.5 bg-[#050505] border border-white/5 rounded-full overflow-hidden">
                 <div className="bg-[#00FFB2] h-full w-[40%] rounded-full shadow-[0_0_10px_rgba(0,255,178,0.5)]"></div>
               </div>
             </div>
             <div className="space-y-2">
               <div className="flex justify-between text-xs">
                 <span className="text-slate-400 font-medium tracking-wide">I/O Wait</span>
                 <span className="text-white font-mono">3%</span>
               </div>
               <div className="w-full h-1.5 bg-[#050505] border border-white/5 rounded-full overflow-hidden">
                 <div className="bg-amber-500 h-full w-[3%] rounded-full"></div>
               </div>
             </div>
          </div>
          <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between bg-[#00FFB2]/5 -mx-6 -mb-6 px-6 pb-6 pt-5 rounded-b-3xl">
            <span className="text-xs text-[#00FFB2] font-bold uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-4 h-4" /> Status: Optimal
            </span>
          </div>
        </div>

        {/* System Load Radar */}
        <div className="col-span-1 row-span-2 bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex flex-col min-h-[250px]">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Fraud Monitor</h3>
          </div>
          <div className="flex-1 relative w-full h-full min-h-[140px] flex items-center justify-center mt-2">
            <RadarChart data={radarData} options={radarOptions} />
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
