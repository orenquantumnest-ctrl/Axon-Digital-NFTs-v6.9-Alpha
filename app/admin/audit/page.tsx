/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Activity,
  Play,
  FastForward,
  Rewind,
  Maximize2,
  Code,
  Download,
  TerminalSquare
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminAuditReplayPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('audit_logs')
      .select('*, profiles(email, role)')
      .order('created_at', { ascending: false })
      .limit(100);
    
    setLogs(data || []);
    if (data && data.length > 0 && !selectedLog) {
      setSelectedLog(data[0]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();

    const sub = supabase.channel('audit-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'audit_logs' }, fetchLogs)
      .subscribe();

    return () => { supabase.removeChannel(sub); };
  }, []);

  const handleExportCSV = () => {
    const headers = ["ID", "Time", "Admin", "Action", "Table", "IP"];
    const csvContent = [
      headers.join(","),
      ...logs.map((log) =>
        [
          log.id,
          new Date(log.created_at).toISOString(),
          `"${log.profiles?.email || 'System'}"`,
          log.action,
          log.entity_type || 'N/A',
          log.ip_address || 'N/A',
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "audit_logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout
      pageTitle="Audit Replay Engine"
      pageDescription="Visual reconstruction and forensic analysis of administrative actions and ledger mutations."
      kicker="Security Analytics"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline List */}
        <div className="col-span-1 bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex flex-col h-[600px]">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
            <h3 className="text-lg font-bold text-white">Event Timeline</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
                disabled={logs.length === 0}
              >
                <Download className="w-3.5 h-3.5" /> CSV
              </button>
              <span className="text-xs font-bold bg-[#00FFB2]/20 text-[#00FFB2] px-2 py-1 rounded">
                LIVE
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                 <Activity className="w-8 h-8 text-[#00FFB2] animate-pulse" />
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center text-slate-500 mt-20 text-sm">No recorded events.</div>
            ) : logs.map((log) => (
              <div
                key={log.id}
                onClick={() => setSelectedLog(log)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${selectedLog?.id === log.id ? "bg-[#D4AF37]/10 border-[#D4AF37]/30" : "bg-[#0A0A0A] border-white/5 hover:border-white/20"}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm ${log.action.includes("CREATE") || log.action.includes("MINT") ? "bg-[#00FFB2]/10 text-[#00FFB2]" : "bg-sky-500/10 text-sky-400"}`}
                  >
                    {log.action}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(log.created_at).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-white font-medium truncate">
                  {log.profiles?.email || 'System Operation'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Entity:{" "}
                  <span className="font-mono text-slate-400">{log.entity_type || 'GLOBAL'}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Replay Visualizer */}
        <div className="col-span-1 lg:col-span-2 bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden flex flex-col h-[600px] shadow-2xl relative">
          <div className="p-4 border-b border-white/10 bg-[#121212] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TerminalSquare className="w-5 h-5 text-[#00FFB2]" />
              <div>
                <span className="text-xs font-mono text-slate-400 block">
                  SEQ: {selectedLog?.id || 'NO_SIGNAL'}
                </span>
                <span className="text-sm font-bold text-white">
                  {selectedLog?.action || 'AWAITING EVENT'}
                </span>
              </div>
            </div>
            <button className="text-slate-400 hover:text-white p-2 bg-white/5 rounded-lg">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 p-6 relative flex flex-col justify-center items-center bg-[#050505] overflow-y-auto custom-scrollbar">
            {selectedLog ? (
              <>
                <div className="w-full max-w-2xl mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-mono text-slate-500">
                      State Snapshot T-1 (Before)
                    </span>
                    <span className="text-xs font-mono text-[#D4AF37]">
                      State Snapshot T0 (After)
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 bg-[#121212] border border-red-500/20 p-4 rounded-xl text-xs font-mono text-slate-400 opacity-50 overflow-x-auto">
                      <pre>
                        {selectedLog.before_state ? JSON.stringify(selectedLog.before_state, null, 2) : "NULL_STATE"}
                      </pre>
                    </div>
                    <div className="flex items-center justify-center text-slate-600">
                      <FastForward className="w-4 h-4" />
                    </div>
                    <div className="flex-1 bg-[#121212] border border-[#00FFB2]/30 p-4 rounded-xl text-xs font-mono text-[#00FFB2] shadow-[0_0_15px_rgba(0,255,178,0.1)] overflow-x-auto">
                      <pre>
                        {selectedLog.after_state ? JSON.stringify(selectedLog.after_state, null, 2) : "NULL_STATE"}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="w-full max-w-2xl bg-[#121212] border border-white/5 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Code className="w-4 h-4" /> Trace Meta
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] text-slate-500 block">
                        Actor IP Address
                      </span>
                      <span className="text-sm font-mono text-white">
                        {selectedLog.ip_address || "NO_TRACE"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">
                        Agent Payload
                      </span>
                      <span className="text-sm font-mono text-slate-300 truncate block max-w-[200px]">
                        {selectedLog.user_agent || "NO_TRACE"}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-slate-500 flex flex-col items-center">
                <Activity className="w-12 h-12 mb-4 opacity-50" />
                <p>System stands ready. Awaiting event simulation sequence.</p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/10 bg-[#121212] flex justify-center items-center gap-6">
            <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <Rewind className="w-4 h-4 fill-current" />
            </button>
            <button className="w-14 h-14 rounded-full bg-gradient-to-r from-[#00FFB2] to-[#00b27c] text-black shadow-[0_0_20px_rgba(0,255,178,0.3)] flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50">
              <Play className="w-6 h-6 fill-current ml-1" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <FastForward className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
