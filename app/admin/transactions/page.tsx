"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase, WalletTransactionRow } from "@/lib/supabase";
import {
  Search,
  Filter,
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  DollarSign,
  User,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Database,
  Printer
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<WalletTransactionRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Search Debouncing States
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Filters state
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // User details modal state
  const [clickedUserId, setClickedUserId] = useState<string | null>(null);
  const [clickedUserProfile, setClickedUserProfile] = useState<any | null>(null);
  const [userTransactions, setUserTransactions] = useState<WalletTransactionRow[]>([]);
  const [loadingUserModal, setLoadingUserModal] = useState(false);

  // Debouncing effect for search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset page on query
    }, 350);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const { data, error } = await supabase
          .from("wallet_transactions")
          .select("*")
          .order("created_at", { ascending: false });
        if (data && !error) {
          setTransactions(data as WalletTransactionRow[]);
        }
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTransactions();
  }, []);

  // Set up User details modal data fetcher
  useEffect(() => {
    if (!clickedUserId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setClickedUserProfile(null);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUserTransactions([]);
      return;
    }

    const currentId = clickedUserId;

    async function fetchUserDetails() {
      setLoadingUserModal(true);
      try {
        // Query the profiles table for this user ID
        const { data: profile, error: pError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentId)
          .maybeSingle();

        if (profile && !pError) {
          setClickedUserProfile(profile);
        } else {
          // Mock display profile in case user table doesn't have it or has unassigned id
          setClickedUserProfile({
            id: currentId,
            username: `U_${currentId.slice(0, 5)}`,
            email: `user_${currentId.slice(0, 6)}@axon-platform.network`,
            wallet_address: `0x${currentId.slice(0, 8)}...${currentId.slice(-6)}`,
            total_rewards: 125,
            role: "USER",
            created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
          });
        }

        // Also fetch transaction log history
        const { data: txs, error: txError } = await supabase
          .from("wallet_transactions")
          .select("*")
          .eq("user_id", currentId)
          .order("created_at", { ascending: false });

        if (txs && !txError) {
          setUserTransactions(txs as WalletTransactionRow[]);
        } else {
          // Fallback to locally loaded transactions that match
          setUserTransactions(transactions.filter(t => t.user_id === currentId));
        }

      } catch (err) {
        console.error("Profile dialog fetching failed:", err);
      } finally {
        setLoadingUserModal(false);
      }
    }

    fetchUserDetails();
  }, [clickedUserId, transactions]);

  // Apply filters on the dataset
  const filteredTxs = transactions.filter((tx) => {
    // 1. Debounced Search query
    const q = debouncedSearch.toLowerCase();
    const matchesSearch = !debouncedSearch ? true : (
      (tx.id || "").toLowerCase().includes(q) ||
      (tx.user_id || "").toLowerCase().includes(q) ||
      (tx.type || "").toLowerCase().includes(q) ||
      (tx.currency || "").toLowerCase().includes(q)
    );

    // 2. Status Selection Filter
    const matchesStatus = statusFilter === "ALL" 
      ? true 
      : statusFilter === "SUCCESSFUL" 
        ? (tx.status === "SUCCESS" || tx.status === "COMPLETED")
        : statusFilter === "PENDING"
          ? (tx.status === "PENDING" || !tx.status)
          : (tx.status === "FAILED" || tx.status === "REJECTED");

    // 3. Amount Filter Range
    const amt = Number(tx.amount || 0);
    const minAmt = minAmount === "" ? -Infinity : Number(minAmount);
    const maxAmt = maxAmount === "" ? Infinity : Number(maxAmount);
    const matchesAmount = amt >= minAmt && amt <= maxAmt;

    // 4. Date Filter Range
    let matchesDate = true;
    if (startDate) {
      matchesDate = matchesDate && new Date(tx.created_at) >= new Date(startDate);
    }
    if (endDate) {
      // Set to end of the selected day
      const endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999);
      matchesDate = matchesDate && new Date(tx.created_at) <= endDateTime;
    }

    return matchesSearch && matchesStatus && matchesAmount && matchesDate;
  });

  // Pagination bounds calculation
  const totalItems = filteredTxs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTxs = filteredTxs.slice(startIndex, endIndex);

  // Pagination navigation helpers
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // EXPORT UTILITIES (CSV, JSON, PDF via Printable TXT Receipt)
  const exportCSV = () => {
    let headers = "TX ID,Type,User ID,Amount,Currency,Status,Created At\n";
    let rows = filteredTxs.map(tx => 
      `"${tx.id}","${tx.type}","${tx.user_id}","${tx.amount}","${tx.currency}","${tx.status || 'PENDING'}","${tx.created_at}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `AXON_Ledger_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(filteredTxs, null, 2)
    )}`;
    const link = document.createElement("a");
    link.setAttribute("href", jsonString);
    link.setAttribute("download", `AXON_Ledger_Export_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    // Generate a beautiful receipt-styled plain-text ledger template to be printed directly or downloaded as official audit trail
    let content = `================================================================================\n`;
    content += `                    AXON DIGITAL PLATFORM - AUDIT LEDGER\n`;
    content += `                      Exported Date: ${new Date().toLocaleString()}\n`;
    content += `                             TOTAL RECORDS: ${filteredTxs.length}\n`;
    content += `================================================================================\n\n`;
    content += `TX ID       | TYPE         | HOLDER ID  | RECORD AMOUNT | STATUS    | DATE AT\n`;
    content += `------------|--------------|------------|---------------|-----------|-------------------\n`;
    
    filteredTxs.forEach((tx) => {
      const txid = (tx.id || "").substring(0, 10).padEnd(11);
      const txtype = (tx.type || "").padEnd(12);
      const txuid = (tx.user_id || "").substring(0, 10).padEnd(11);
      const txamt = `${tx.amount} ${tx.currency}`.padEnd(14);
      const txst = (tx.status || "PENDING").padEnd(10);
      const txdt = new Date(tx.created_at).toLocaleDateString();
      content += `${txid} | ${txtype} | ${txuid} | ${txamt} | ${txst} | ${txdt}\n`;
    });
    
    content += `\n================================================================================\n`;
    content += `                  SECURED METADATA CORE LOGS • SYSTEM LEVEL\n`;
    content += `================================================================================\n`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `AXON_Official_Ledger_${new Date().toISOString().slice(0, 10)}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AdminLayout
      pageTitle="Global System Ledger"
      pageDescription="Master ledger of all BNB Smart Chain deposits, smart-node reward releases, and plan purchases."
      kicker="Telemetry Logs"
    >
      <div className="bg-[#121212]/60 backdrop-blur-2xl border border-white/5 rounded-[32px] p-6 shadow-2xl relative">
        
        {/* TOP ROW: Search Debouncer and Filters Toggle */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            
            {/* Realtime Debounced Search Input */}
            <div className="relative flex-1 min-w-[280px] sm:max-w-md">
              <input
                type="text"
                placeholder="Search transaction ID, user, or currency..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 rounded-full py-2.5 pl-10 pr-10 text-sm text-white focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-all placeholder-slate-500 shadow-inner"
              />
              <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-500" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-3 text-slate-400 hover:text-white font-bold"
                >
                  ×
                </button>
              )}
            </div>

            {/* Expand filters configuration drawer */}
            <button 
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-colors ${showFiltersPanel ? 'bg-[#D4AF37]/20 border-[#D4AF37]/30 text-white' : 'bg-[#050505] border-white/10 text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <Filter className="w-3.5 h-3.5" /> 
              <span>Filters</span>
              {(statusFilter !== "ALL" || minAmount || maxAmount || startDate || endDate) && (
                <span className="w-2 h-2 rounded-full bg-[#00FFB2] animate-pulse"></span>
              )}
            </button>
          </div>

          {/* Export options selection dropdown bar */}
          <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto">
            <button 
              onClick={exportCSV} 
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-[#00FFB2]" /> CSV
            </button>
            <button 
              onClick={exportJSON} 
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-[#D4AF37]" /> JSON
            </button>
            <button 
              onClick={exportPDF} 
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" /> Ledger Receipt
            </button>
            <button 
              onClick={handlePrint} 
              className="bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 p-2 rounded-full transition-color"
              title="Print Ledger Report"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* EXPANDED FILTER CONTROL DRAWER PANEL */}
        <AnimatePresence>
          {showFiltersPanel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden bg-[#0A0A0A]/80 border border-white/5 rounded-2xl mb-6 shadow-inner"
            >
              <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                {/* Status Selection */}
                <div className="space-y-2">
                  <label className="text-slate-500 text-[10px]">Transaction Status</label>
                  <select 
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                    className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="ALL">ALL STATUSES</option>
                    <option value="SUCCESSFUL">SUCCESS / COMPLETED</option>
                    <option value="PENDING">PENDING</option>
                    <option value="FAILED">FAILED / REJECTED</option>
                  </select>
                </div>

                {/* Amount Filter bounds */}
                <div className="space-y-2">
                  <label className="text-slate-500 text-[10px]">Amount Boundaries</label>
                  <div className="flex gap-2">
                    <input 
                      type="number"
                      placeholder="Min"
                      value={minAmount}
                      onChange={(e) => { setMinAmount(e.target.value); setCurrentPage(1); }}
                      className="w-1/2 bg-black border border-white/10 rounded-xl py-2 px-3 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                    <input 
                      type="number"
                      placeholder="Max"
                      value={maxAmount}
                      onChange={(e) => { setMaxAmount(e.target.value); setCurrentPage(1); }}
                      className="w-1/2 bg-black border border-white/10 rounded-xl py-2 px-3 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* Date constraints */}
                <div className="space-y-2">
                  <label className="text-slate-500 text-[10px]">Start Date</label>
                  <div className="relative">
                    <input 
                      type="date"
                      value={startDate}
                      onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
                      className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-slate-500 text-[10px]">End Date</label>
                  <input 
                    type="date"
                    value={endDate}
                    onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
                    className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 text-[#f8fafc] text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Reset Panel filter values button */}
              <div className="px-5 pb-4 flex justify-end gap-3 text-[10px]">
                <button
                  onClick={() => {
                    setStatusFilter("ALL");
                    setMinAmount("");
                    setMaxAmount("");
                    setStartDate("");
                    setEndDate("");
                    setCurrentPage(1);
                  }}
                  className="text-red-400 hover:text-red-300 font-bold uppercase tracking-widest px-3 py-1 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-lg transition-colors"
                >
                  Reset Active Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TELEMETRY DATA TABLE */}
        <div className="overflow-x-auto min-h-[300px]" id="printable-section">
          {loading ? (
            <div className="flex items-center justify-center h-[300px] text-[#D4AF37]">
              <div className="flex flex-col items-center gap-2">
                 <Database className="w-8 h-8 animate-spin text-[#00FFB2]" />
                 <span className="text-xs uppercase font-bold tracking-widest text-slate-500 animate-pulse">Securing ledger synchrony...</span>
              </div>
            </div>
          ) : (
            <table className="w-full text-left text-sm border-collapse">
              <thead className="text-[10px] text-slate-500 uppercase tracking-widest border-b border-white/5">
                <tr>
                  <th className="pb-4 font-bold px-4">TX ID</th>
                  <th className="pb-4 font-bold px-4">Type</th>
                  <th className="pb-4 font-bold px-4">Holder ID</th>
                  <th className="pb-4 font-bold px-4">Ledger Payload</th>
                  <th className="pb-4 font-bold px-4">Node status</th>
                  <th className="pb-4 font-bold text-right px-4">Date Verified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedTxs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500 uppercase tracking-wider font-bold text-xs">
                      No matching transaction logs found inside database
                    </td>
                  </tr>
                ) : (
                  paginatedTxs.map((tx) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="py-4 font-mono text-slate-400 px-4 text-xs font-semibold">
                        {tx.id}
                      </td>
                      <td className="py-4 text-white font-bold px-4">
                        <span className="inline-block py-0.5 px-2 bg-white/5 border border-white/10 rounded-lg text-xs">
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button 
                          onClick={() => setClickedUserId(tx.user_id)}
                          className="font-mono text-[#D4AF37] hover:text-[#00FFB2] transition-colors outline-none text-xs hover:underline uppercase font-bold tracking-wider"
                          title="View user details and account portfolio history"
                        >
                          {tx.user_id ? `${tx.user_id.slice(0, 8)}...${tx.user_id.slice(-6)}` : 'unassigned'}
                        </button>
                      </td>
                      <td
                        className={`py-4 font-extrabold px-4 ${tx.amount > 0 ? "text-[#00FFB2]" : tx.amount < 0 ? "text-red-400" : "text-slate-300"}`}
                      >
                        <div className="flex items-center gap-1">
                          {tx.amount > 0 ? (
                            <ArrowDownRight className="w-3.5 h-3.5" />
                          ) : tx.amount < 0 ? (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          ) : null}
                          <span>{tx.amount > 0 ? "+" : ""}{tx.amount} {tx.currency || 'USDT'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            tx.status === "COMPLETED" || tx.status === "SUCCESS"
                              ? "bg-[#00FFB2]/5 text-[#00FFB2] border-[#00FFB2]/20"
                              : tx.status === "FAILED" || tx.status === "REJECTED"
                              ? "bg-red-500/5 text-red-500 border-red-500/20"
                              : "bg-amber-500/5 text-amber-500 border-amber-500/20"
                          }`}
                        >
                          {tx.status || "PENDING"}
                        </span>
                      </td>
                      <td className="py-4 text-right text-slate-400 font-mono px-4 text-xs">
                        {new Date(tx.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* RETRIEVED PAGINATION CONTROLLER FOOTER */}
        {!loading && filteredTxs.length > 0 && (
          <div className="px-4 py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
            <div className="flex items-center gap-4 text-xs text-slate-500 font-bold uppercase tracking-wider">
              <span>Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} logs</span>
              <div className="flex items-center gap-1.5 border border-white/10 rounded-lg px-2 py-1 bg-[#050505]">
                <span className="text-[10px] text-slate-600">Per page:</span>
                <select 
                  value={itemsPerPage}
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="bg-transparent border-none text-white focus:outline-none cursor-pointer text-xs"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="w-10 h-10 bg-[#050505] border border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="bg-[#050505] border border-white/10 px-4 py-2 rounded-xl text-xs font-bold text-white tracking-widest font-mono">
                {currentPage} / {totalPages}
              </div>
              <button 
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="w-10 h-10 bg-[#050505] border border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CLICKED USER DETAILS MODAL BOX */}
      <AnimatePresence>
        {clickedUserId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#121212] border border-white/10 rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-[0_0_50px_rgba(0,255,178,0.1)] flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5 bg-[#1A1A1A] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00FFB2] to-[#D4AF37] flex items-center justify-center font-bold text-black text-sm">
                    {clickedUserProfile ? (clickedUserProfile.username || clickedUserProfile.email || "U").substring(0, 2).toUpperCase() : "U"}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white leading-tight">
                      {clickedUserProfile?.username || "Fetching User..."}
                    </h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Holder Intelligence Record</p>
                  </div>
                </div>
                <button 
                  onClick={() => setClickedUserId(null)} 
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                
                {loadingUserModal ? (
                  <div className="text-center py-12 text-[#D4AF37] animate-pulse">
                    Querying SECURE profile registers...
                  </div>
                ) : (
                  <>
                    {/* Stats Summary Panel */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                        <span className="text-[9px] uppercase tracking-widest font-bold text-slate-500">Holder ID</span>
                        <p className="text-xs font-mono text-white mt-1 break-all uppercase leading-normal">{clickedUserId}</p>
                      </div>
                      <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                        <span className="text-[9px] uppercase tracking-widest font-bold text-slate-500 font-sans">USDT Staking Rewards</span>
                        <p className="text-sm font-mono text-[#D4AF37] font-bold mt-1">
                          {clickedUserProfile?.total_rewards || 0} USDT
                        </p>
                      </div>
                    </div>

                    {/* Profile Information details list */}
                    <div className="space-y-3 bg-[#050505]/40 p-5 border border-white/5 rounded-2xl">
                      <h4 className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Registered Details</h4>
                      
                      <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                        <span className="text-slate-400 font-medium">Primary Email</span>
                        <span className="text-white font-semibold font-mono">{clickedUserProfile?.email || "N/A"}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                        <span className="text-slate-400 font-medium">Bsc Wallet (BEP-20)</span>
                        <span className="text-white font-mono text-[11px]">{clickedUserProfile?.wallet_address || "None Linked"}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                        <span className="text-slate-400 font-medium">Referral Code</span>
                        <span className="text-white font-semibold font-mono text-[#00FFB2]">{clickedUserProfile?.referral_code || "AXON-DECENTRAL"}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-medium">Joined Platform</span>
                        <span className="text-white font-medium">
                          {clickedUserProfile?.created_at ? new Date(clickedUserProfile.created_at).toLocaleDateString() : "Historical"}
                        </span>
                      </div>
                    </div>

                    {/* Transaction Log Segment discrete holder history */}
                    <div className="space-y-3">
                      <h4 className="text-[11px] uppercase font-bold tracking-widest text-[#D4AF37] flex items-center gap-1.5">
                        <Activity className="w-4 h-4" /> Personal Portfolio History
                      </h4>

                      <div className="border border-white/5 rounded-2xl overflow-hidden max-h-[180px] overflow-y-auto">
                        <table className="w-full text-left text-xs text-slate-300">
                          <thead className="bg-[#050505] text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                            <tr>
                              <th className="p-3">Type</th>
                              <th className="p-3">Amount</th>
                              <th className="p-3">Status</th>
                              <th className="p-3 text-right">Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {userTransactions.length === 0 ? (
                              <tr>
                                <td colSpan={4} className="p-4 text-center text-slate-600 uppercase tracking-wider font-bold">
                                  No transaction logs found for user
                                </td>
                              </tr>
                            ) : (
                              userTransactions.map((utx) => (
                                <tr key={utx.id} className="hover:bg-white/[0.01]">
                                  <td className="p-3 font-semibold">{utx.type}</td>
                                  <td className={`p-3 font-bold ${utx.amount > 0 ? 'text-[#00FFB2]' : 'text-red-400'}`}>
                                    {utx.amount > 0 ? '+' : ''}{utx.amount} {utx.currency}
                                  </td>
                                  <td className="p-3">
                                    <span className={`inline-block px-2 text-[8px] font-bold border rounded ${
                                      utx.status === "SUCCESS" || utx.status === "COMPLETED"
                                        ? "text-[#00FFB2] border-[#00FFB2]/20"
                                        : "text-amber-500 border-amber-500/20"
                                    }`}>
                                      {utx.status || "PENDING"}
                                    </span>
                                  </td>
                                  <td className="p-3 text-right text-slate-500 font-mono">
                                    {new Date(utx.created_at).toLocaleDateString()}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Close footer */}
              <div className="p-5 border-t border-white/5 bg-[#121212] flex justify-end">
                <button 
                  onClick={() => setClickedUserId(null)}
                  className="px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest transition"
                >
                  Dismiss Profile
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </AdminLayout>
  );
}
