/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Database, Search, RefreshCw, ChevronDown, ListFilter, Play } from "lucide-react";
import { supabase } from "@/lib/supabase";

const tables = [
  "profiles",
  "nfts",
  "referrals",
  "wallet_transactions",
  "audit_logs",
  "system_metrics",
  "referral_rewards",
  "security_events"
];

export default function DatabaseExplorerPage() {
  const [activeTable, setActiveTable] = useState("profiles");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async (tableName: string) => {
    setLoading(true);
    setError("");
    try {
      const { data: tableData, error: fetchError } = await supabase
        .from(tableName)
        .select("*")
        .limit(100);

      if (fetchError) throw fetchError;
      setData(tableData || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch table data");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTable);

    const subscription = supabase
      .channel("admin-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: activeTable },
        (payload) => {
          fetchData(activeTable); // Refresh on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [activeTable]);

  return (
    <AdminLayout
      pageTitle="Database Explorer"
      pageDescription="Real-time schema visualization and record inspector hooked directly to Supabase PostgREST."
      kicker="System"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[600px]">
        {/* Table List Sidebar */}
        <div className="lg:col-span-1 bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-4 px-2">
            <Database className="w-4 h-4 text-[#D4AF37]" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-300">Schemas</h2>
          </div>
          
          <div className="space-y-1 overflow-y-auto custom-scrollbar flex-1 pr-2">
            {tables.map(t => (
              <button
                key={t}
                onClick={() => setActiveTable(t)}
                className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-medium transition-all flex items-center justify-between ${
                  activeTable === t 
                    ? "bg-[#00FFB2]/10 text-[#00FFB2] border border-[#00FFB2]/20" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
                }`}
              >
                {t}
                {activeTable === t && <div className="w-2 h-2 rounded-full bg-[#00FFB2] shadow-[0_0_10px_#00FFB2]"></div>}
              </button>
            ))}
          </div>
        </div>

        {/* Data View */}
        <div className="lg:col-span-3 bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-3xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center border border-[#D4AF37]/20">
                <Database className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">public.{activeTable}</h3>
                <p className="text-xs text-slate-500 font-mono">{data.length} records retrieved</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button onClick={() => fetchData(activeTable)} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 transition-colors border border-white/10">
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#00FFB2]" : ""}`} />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 text-sm font-bold transition-colors border border-white/10">
                <ListFilter className="w-4 h-4" /> Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B8942E] text-black rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all">
                <Play className="w-4 h-4" /> SQL Editor
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto custom-scrollbar relative">
            {loading && data.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center bg-[#050505]/50 backdrop-blur-sm z-10">
                <RefreshCw className="w-8 h-8 text-[#00FFB2] animate-spin" />
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <div className="inline-block p-4 rounded-2xl bg-red-500/10 border border-red-500/20 mb-4">
                  <Database className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Query Failed</h3>
                <p className="text-slate-400 font-mono text-sm max-w-lg mx-auto">{error}</p>
                <button 
                  onClick={() => fetchData(activeTable)}
                  className="mt-6 px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10"
                >
                  Retry Query
                </button>
              </div>
            ) : data.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <Database className="w-6 h-6 text-slate-500" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Table is empty</h3>
                <p className="text-slate-400 text-sm">No records found within this schema.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-max">
                <thead>
                  <tr className="bg-[#1A1A1A] sticky top-0 z-10 shadow-md">
                    {Object.keys(data[0]).map(key => (
                      <th key={key} className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-white/10 whitespace-nowrap">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.map((row, i) => (
                    <tr key={row.id || i} className="hover:bg-white/5 transition-colors group">
                      {Object.values(row).map((val: any, j) => (
                        <td key={j} className="px-4 py-3 text-sm text-slate-300 max-w-[200px] truncate">
                          {typeof val === 'object' && val !== null ? JSON.stringify(val) : String(val ?? "NULL")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
