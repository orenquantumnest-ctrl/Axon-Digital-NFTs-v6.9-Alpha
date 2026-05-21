"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase, ProfileRow } from "@/lib/supabase";
import {
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Shield,
  Ban,
  CheckCircle,
  ArrowUpDown,
  RefreshCw,
  X,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type SortField = "username" | "email" | "total_rewards" | "created_at";
type SortOrder = "asc" | "desc";

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Granular loading states for table operations
  const [opsLoading, setOpsLoading] = useState(false);

  // Sorting states
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Selection & management modal
  const [manageUser, setManageUser] = useState<ProfileRow | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (data && !error) {
        setUsers(data as ProfileRow[]);
      } else {
        console.error("Supabase fetch users error:", error);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, []);

  // Handler for custom sorting with granular animation triggers
  const handleSort = (field: SortField) => {
    setOpsLoading(true);
    setTimeout(() => {
      if (sortField === field) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortField(field);
        setSortOrder("desc");
      }
      setOpsLoading(false);
    }, 280); // Quick elegant loading feedback
  };

  // Live filter and sort logic
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      (u.email || "").toLowerCase().includes(q) ||
      (u.username || "").toLowerCase().includes(q) ||
      (u.id || "").toLowerCase().includes(q) ||
      (u.wallet_address || "").toLowerCase().includes(q)
    );
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let valA: any = a[sortField] ?? "";
    let valB: any = b[sortField] ?? "";

    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const getStatusBadge = (status?: string) => {
    const s = (status || "verified").toLowerCase();
    switch (s) {
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
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-slate-500/10 text-slate-400 border border-slate-500/20">
            Unknown
          </span>
        );
    }
  };

  const handleUpdateUserStatus = async (status: string) => {
    if (!manageUser) return;
    setIsUpdating(true);
    setModalMessage(null);
    try {
      // In Supabase databases, status can be saved directly on profiles, otherwise fall back gracefully
      const { error } = await supabase
        .from("profiles")
        .update({ role: status }) // or toggle fields
        .eq("id", manageUser.id);

      if (error) {
        throw error;
      }

      setModalMessage("User access security parameters updated successfully!");
      await fetchUsers();
      setTimeout(() => {
        setManageUser(null);
        setModalMessage(null);
      }, 1200);
    } catch (err: any) {
      setModalMessage(`Update error: ${err.message}`);
    } finally {
      setIsUpdating(false);
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
              onChange={(e) => {
                setOpsLoading(true);
                setSearchQuery(e.target.value);
                setTimeout(() => setOpsLoading(false), 200);
              }}
              className="bg-[#121212] border border-white/10 text-white rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#D4AF37] w-64 md:w-80 transition-colors"
              aria-label="Search users list"
            />
            <Search className="w-4 h-4 absolute left-4 top-2.5 text-slate-500 hover:text-[#00FFB2] transition-colors" />
          </div>
          <button 
            onClick={() => {
              setOpsLoading(true);
              fetchUsers().then(() => setOpsLoading(false));
            }}
            className="bg-[#121212] border border-white/10 hover:border-white/20 text-slate-300 px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-all relative overflow-hidden"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${opsLoading ? 'animate-spin text-[#00FFB2]' : ''}`} />
            <span>Sync Registry</span>
          </button>
        </div>
        <div className="text-sm text-slate-400">
          Enrolled Holders: <strong className="text-white">{users.length}</strong>
        </div>
      </div>

      {/* Main Table wrapper with ARIA configurations */}
      <div className="bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden relative">
        
        {/* Shimmer / Loader Overlay for granular operation feedback */}
        <AnimatePresence>
          {opsLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#050505]/30 backdrop-blur-[2px] z-10 flex items-center justify-center"
            >
              <div className="flex items-center gap-2 bg-black/60 px-4 py-2 rounded-full border border-white/10 shadow-2xl">
                 <RefreshCw className="w-4 h-4 text-[#00FFB2] animate-spin" />
                 <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Filtering registry...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-[300px] text-[#D4AF37] font-semibold uppercase tracking-widest text-xs animate-pulse">
              Syncing Holder Registry...
            </div>
          ) : (
            <table 
              className="w-full text-left border-collapse"
              role="grid"
              aria-label="User accounts table"
            >
              <thead>
                <tr className="border-b border-white/5" role="row">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest" role="columnheader">
                    <button 
                      onClick={() => handleSort("username")}
                      className="flex items-center gap-1.5 hover:text-white transition-colors"
                      aria-label="Sort by username"
                    >
                      <span>User</span>
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest" role="columnheader">
                    <span className="text-slate-500">Wallet Address</span>
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest" role="columnheader">
                    <button 
                      onClick={() => handleSort("total_rewards")}
                      className="flex items-center gap-1.5 hover:text-white transition-colors"
                      aria-label="Sort by total staking rewards"
                    >
                      <span>Rewards Allocation</span>
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest" role="columnheader">
                    <span>Role / Status</span>
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest" role="columnheader">
                    <button 
                      onClick={() => handleSort("created_at")}
                      className="flex items-center gap-1.5 hover:text-white transition-colors"
                      aria-label="Sort by registry joined date"
                    >
                      <span>Enrolled Date</span>
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right" role="columnheader">
                    <span>Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5" role="rowgroup">
                {sortedUsers.length === 0 ? (
                  <tr role="row">
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 uppercase tracking-wider font-bold text-xs">
                      No matching holders recorded in ledger
                    </td>
                  </tr>
                ) : (
                  sortedUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                      role="row"
                    >
                      <td className="px-6 py-5" role="gridcell">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-white font-bold text-xs overflow-hidden">
                            {user.avatar_url ? (
                              <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              (user.username || user.email || "??").substring(0, 2).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">
                              {user.username || "Unknown Holder"}
                            </div>
                            <div className="text-xs text-slate-400">
                              {user.email || "No email"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-xs font-mono text-slate-500" role="gridcell">
                        {user.wallet_address || "N/A"}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-mono text-[#D4AF37] font-bold" role="gridcell">
                        {user.total_rewards || 0} USDT
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap" role="gridcell">
                        <div className="flex flex-col items-start gap-1.5">
                          {getStatusBadge("verified")}
                          {user.role === "ADMIN" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                              <Shield className="w-2.5 h-2.5" /> Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Holder Node
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-xs text-slate-400 font-mono" role="gridcell">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right" role="gridcell">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setManageUser(user)}
                            className="w-8 h-8 rounded-lg outline-none bg-white/5 hover:bg-[#00FFB2]/20 flex items-center justify-center text-slate-400 hover:text-white transition-all border border-white/5 hover:border-[#00FFB2]/30"
                            aria-label={`Manage user accounts parameters for ${user.username}`}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">
            Showing {sortedUsers.length} of {users.length} Records
          </span>
        </div>
      </div>

      {/* USER MANAGEMENT SECURITY POLICY MODAL */}
      <AnimatePresence>
        {manageUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#121212] border border-white/10 rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 bg-[#1A1A1A] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest">Security Controls</h3>
                </div>
                <button 
                  onClick={() => setManageUser(null)}
                  className="w-7 h-7 bg-white/5 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 mx-auto border border-white/10 flex items-center justify-center text-white font-bold font-mono text-sm">
                  {manageUser.username?.substring(0, 2).toUpperCase() || "??"}
                </div>
                <div>
                  <h4 className="text-white font-bold text-base leading-snug">{manageUser.username || "Operator"}</h4>
                  <p className="text-xs font-mono text-[#D4AF37] mt-1">{manageUser.email}</p>
                </div>

                {modalMessage && (
                  <p className="text-xs font-semibold text-[#00FFB2] mt-3 bg-[#00FFB2]/10 p-2 border border-[#00FFB2]/20 rounded-xl">
                    {modalMessage}
                  </p>
                )}

                <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-3.5">
                  <button
                    disabled={isUpdating}
                    onClick={() => handleUpdateUserStatus("ADMIN")}
                    className="py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-white/10"
                  >
                    Promote to Admin
                  </button>
                  <button
                    disabled={isUpdating}
                    onClick={() => handleUpdateUserStatus("USER")}
                    className="py-3 bg-[#00FFB2]/10 hover:bg-[#00FFB2]/20 text-[#00FFB2] rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-[#00FFB2]/20"
                  >
                    Demote to Holder
                  </button>
                </div>
              </div>

              <div className="p-4 bg-black/40 border-t border-white/5 flex justify-end">
                <button 
                  onClick={() => setManageUser(null)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wide transition-colors"
                >
                  Close controls
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </AdminLayout>
  );
}
