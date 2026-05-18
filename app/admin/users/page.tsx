"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Shield,
  Ban,
  CheckCircle,
} from "lucide-react";

const USERS = [
  {
    id: "1",
    email: "alex.rivera@example.com",
    username: "alexr_01",
    balance: "2,450 USDT",
    role: "user",
    status: "verified",
    joined: "Oct 24, 2023",
  },
  {
    id: "2",
    email: "crypto.whale99@example.com",
    username: "whale99",
    balance: "45,210 USDT",
    role: "user",
    status: "verified",
    joined: "Nov 12, 2023",
  },
  {
    id: "3",
    email: "s.jenkins@corp.com",
    username: "sjenkins",
    balance: "0 USDT",
    role: "user",
    status: "pending",
    joined: "Jan 05, 2024",
  },
  {
    id: "4",
    email: "admin_sys@axonnfts.com",
    username: "sysadmin",
    balance: "N/A",
    role: "admin",
    status: "verified",
    joined: "Jan 01, 2023",
  },
  {
    id: "5",
    email: "banned.user@scammer.com",
    username: "scammer42",
    balance: "0.00 USDT",
    role: "user",
    status: "banned",
    joined: "Feb 14, 2024",
  },
];

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#00FFB2]/10 text-[#00FFB2] border border-[#00FFB2]/20">
            <CheckCircle className="w-3 h-3" /> Verified
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">
            Pending
          </span>
        );
      case "banned":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/20">
            <Ban className="w-3 h-3" /> Banned
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <AdminLayout
      pageTitle="User Intelligence"
      pageDescription="Manage active accounts, verify KYC statuses, and enforce platform security policies."
      kicker="Accounts"
    >
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4 px-2">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by email, username, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#121212] border border-white/10 text-white rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#D4AF37] w-64 md:w-80 transition-colors"
            />
            <Search className="w-4 h-4 absolute left-4 top-2.5 text-slate-500" />
          </div>
          <button className="bg-[#121212] border border-white/10 hover:border-white/20 text-slate-300 px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
        <div className="text-sm text-slate-400">
          Total Users: <strong className="text-white">1,248</strong>
        </div>
      </div>

      <div className="bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  User ID
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Account Profile
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Balance
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Status / Role
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Joined Date
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {USERS.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="text-xs font-mono text-slate-500">
                      #{user.id.padStart(5, "0")}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-white font-bold text-sm">
                        {user.username.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">
                          {user.username}
                        </div>
                        <div className="text-xs text-slate-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-mono text-[#D4AF37]">
                    {user.balance}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex flex-col items-start gap-2">
                      {getStatusBadge(user.status)}
                      {user.role === "admin" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          <Shield className="w-3 h-3" /> Admin
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-400">
                    {user.joined}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-8 h-8 rounded-lg outline-none bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg outline-none bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">
            Showing 1 to 5 of 1,248
          </span>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-[#121212] border border-white/10 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
              Prev
            </button>
            <button className="px-4 py-2 bg-[#121212] border border-white/10 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
