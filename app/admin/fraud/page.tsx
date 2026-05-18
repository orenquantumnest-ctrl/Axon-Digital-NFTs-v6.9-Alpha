"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  AlertTriangle,
  ShieldAlert,
  Laptop,
  Users,
  Bot,
  History,
  Search,
  RefreshCw,
} from "lucide-react";
import { LineChart } from "@/components/admin/Charts";

const FRAUD_ALERTS = [
  {
    id: "fra_1",
    type: "Multi-Device",
    user: "wallet_0x7b...9a41",
    risk: "High",
    description: "5 unique device fingerprints in 2 hours",
    time: "10 mins ago",
    status: "investigating",
  },
  {
    id: "fra_2",
    type: "Suspicious Withdrawal",
    user: "user_david99",
    risk: "Critical",
    description: "Attempted to withdraw 500% of deposited amount",
    time: "1 hour ago",
    status: "blocked",
  },
  {
    id: "fra_3",
    type: "Fake Referrals",
    user: "network_bot",
    risk: "Medium",
    description: "12 rapid signups from same subnet",
    time: "3 hours ago",
    status: "flagged",
  },
  {
    id: "fra_4",
    type: "Bot Mining",
    user: "miner_x23",
    risk: "High",
    description: "Perfect 24/7 cyclical free miner claiming",
    time: "5 hours ago",
    status: "banned",
  },
];

export default function AdminFraudEnginePage() {
  const [filter, setFilter] = useState("All");

  const riskData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Fraud Alerts Generated",
        data: [12, 19, 15, 25, 22, 30, 28],
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#64748b" } },
      y: {
        border: { display: false },
        grid: { color: "rgba(255,255,255,0.05)" },
        ticks: { color: "#64748b" },
      },
    },
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Critical":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      case "High":
        return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      case "Medium":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      default:
        return "text-slate-400 bg-white/5 border-white/10";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "Multi-Device":
        return <Laptop className="w-5 h-5" />;
      case "Suspicious Withdrawal":
        return <AlertTriangle className="w-5 h-5" />;
      case "Fake Referrals":
        return <Users className="w-5 h-5" />;
      case "Bot Mining":
        return <Bot className="w-5 h-5" />;
      default:
        return <ShieldAlert className="w-5 h-5" />;
    }
  };

  return (
    <AdminLayout
      pageTitle="AI Fraud Engine"
      pageDescription="Monitor, detect, and automatically block malicious activities across the V6.9 deployment."
      kicker="Security Model AI"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex flex-col justify-between min-h-[200px]">
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500" /> Active Threats
            </h3>
            <span className="text-4xl text-white font-light mt-4 block">
              14
            </span>
            <span className="text-sm text-red-400 mt-1 block">
              +3 since last hour
            </span>
          </div>
        </div>
        <div className="col-span-1 md:col-span-2 bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 h-[200px] relative">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest absolute top-6 left-6 z-10">
            Threat Frequency
          </h3>
          <div className="h-full pt-8 pl-4">
            <LineChart data={riskData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden relative">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex gap-2">
            {["All", "Critical", "High", "Medium", "Resolved"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${filter === f ? "bg-white/10 text-white border border-white/20" : "bg-[#050505] text-slate-500 border border-white/5 hover:text-white"}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search logs..."
                className="bg-[#050505] border border-white/10 text-white rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-red-500/50 w-48 transition-colors"
              />
              <Search className="w-4 h-4 absolute left-4 top-2.5 text-slate-500" />
            </div>
            <button className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="divide-y divide-white/5 flex flex-col">
          {FRAUD_ALERTS.filter(
            (a) =>
              filter === "All" ||
              a.risk === filter ||
              (filter === "Resolved" &&
                ["blocked", "banned"].includes(a.status)),
          ).map((alert) => (
            <div
              key={alert.id}
              className="p-6 flex flex-col md:flex-row md:items-center gap-6 hover:bg-white/[0.02] transition-colors"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border flex-shrink-0 ${getRiskColor(alert.risk)}`}
              >
                {getIcon(alert.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="text-base font-bold text-white">
                    {alert.type}
                  </h4>
                  <span
                    className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full border ${getRiskColor(alert.risk)}`}
                  >
                    {alert.risk}
                  </span>
                </div>
                <p className="text-sm text-slate-400">{alert.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs font-mono text-slate-500">
                  <span className="text-sky-400">{alert.user}</span>
                  <span>•</span>
                  <span>{alert.time}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 md:flex-col md:items-end">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-2.5 py-1 rounded-full">
                  {alert.status}
                </span>
                <div className="flex items-center gap-2 mt-2">
                  <button className="text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors border border-white/5">
                    Details
                  </button>
                  <button className="text-xs font-bold text-red-500 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors border border-red-500/20">
                    Ban User
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
