/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ShieldAlert, Activity, AlertTriangle, ShieldCheck, Search, Filter } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SecurityMonitoringPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('security_events')
      .select('*, profiles(email, username)')
      .order('created_at', { ascending: false })
      .limit(50);
    
    setEvents(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();

    const sub = supabase.channel('security-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'security_events' }, fetchEvents)
      .subscribe();

    return () => { supabase.removeChannel(sub); };
  }, []);

  return (
    <AdminLayout
      pageTitle="Security Intelligence"
      pageDescription="Real-time fraud surveillance, anomaly detection, and RBAC threat monitoring."
      kicker="System Defense"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="md:col-span-1 bg-red-500/5 border border-red-500/20 p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[40px] rounded-full"></div>
          <span className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-2 mb-2">
            <ShieldAlert className="w-4 h-4" /> High Risk
          </span>
          <div className="text-3xl font-light text-white">
            {events.filter(e => e.severity === 'CRITICAL' || e.severity === 'HIGH').length}
          </div>
        </div>
        <div className="md:col-span-1 bg-[#D4AF37]/5 border border-[#D4AF37]/20 p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 blur-[40px] rounded-full"></div>
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4" /> Anomalies
          </span>
          <div className="text-3xl font-light text-white">
            {events.filter(e => e.severity === 'MEDIUM').length}
          </div>
        </div>
        <div className="md:col-span-2 bg-[#121212]/60 backdrop-blur-xl border border-white/5 p-6 rounded-3xl flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Defense Matrix Active</h3>
            <p className="text-xs text-slate-400 max-w-xs">Edge fraud detection and RLS constraints are strictly enforcing integrity.</p>
          </div>
          <div className="w-16 h-16 rounded-full border border-[#00FFB2]/30 flex items-center justify-center bg-[#00FFB2]/5 shadow-[0_0_20px_rgba(0,255,178,0.1)]">
            <ShieldCheck className="w-8 h-8 text-[#00FFB2]" />
          </div>
        </div>
      </div>

      <div className="bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-3xl flex flex-col min-h-[500px]">
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-slate-400" /> Live Threat Feed
          </h3>
          <div className="flex items-center gap-2">
             <button className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg text-sm text-slate-300 hover:bg-white/10 transition-colors">
               <Filter className="w-4 h-4" /> Filter Severity
             </button>
             <div className="relative">
               <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
               <input type="text" placeholder="Search logs..." className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-[#00FFB2]/50 w-48" />
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar">
          {loading ? (
             <div className="p-12 flex justify-center items-center h-full">
               <Activity className="w-8 h-8 text-[#00FFB2] animate-pulse" />
             </div>
          ) : events.length === 0 ? (
             <div className="p-12 text-center h-full flex flex-col justify-center items-center">
               <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
                 <ShieldCheck className="w-8 h-8 text-slate-500" />
               </div>
               <h3 className="text-white font-bold text-lg mb-1">No Threats Detected</h3>
               <p className="text-slate-500 text-sm">The security perimeter is currently clear of anomalies.</p>
             </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1A1A1A] sticky top-0 z-10 shadow-md">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">Time</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">Severity</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">Event Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">Target User</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {events.map((evt) => (
                  <tr key={evt.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-mono text-slate-400">
                        {new Date(evt.created_at).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                        evt.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-500 border border-red-500/30' :
                        evt.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30' :
                        evt.severity === 'MEDIUM' ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30' :
                        'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                      }`}>
                        {evt.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <strong className="text-sm text-white">{evt.event_type}</strong>
                        <span className="text-xs text-slate-500 mt-0.5 truncate max-w-md">{evt.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {evt.profiles ? (
                        <div className="flex flex-col">
                          <span className="text-sm text-slate-300">{evt.profiles.email || evt.profiles.username}</span>
                          <span className="text-[10px] text-slate-600 font-mono mt-0.5">{evt.user_id}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-600 italic">Global System</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-white hover:text-[#00FFB2] transition-colors text-xs font-bold uppercase tracking-widest border border-white/10 hover:border-[#00FFB2]/30 px-3 py-1.5 rounded-lg bg-white/5">
                        Inspect
                      </button>
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
