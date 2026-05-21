/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { 
  Package, Search, PlusCircle, Filter, ArrowUpRight, 
  ShieldCheck, Activity, X, ChevronDown, CheckSquare, 
  Square, Trash2, Tag, Edit2, Flame
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function NFTsManagementPage() {
  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filters
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [tierFilter, setTierFilter] = useState("ALL");
  const [attrKey, setAttrKey] = useState("");
  const [attrValue, setAttrValue] = useState("");
  
  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Manage Modal
  const [manageNftId, setManageNftId] = useState<string | null>(null);

  // Transfer ownership states
  const [transferring, setTransferring] = useState(false);
  const [transferSearch, setTransferSearch] = useState("");
  const [candidateProfiles, setCandidateProfiles] = useState<any[]>([]);
  const [searchingProfiles, setSearchingProfiles] = useState(false);
  const [selectedTargetProfile, setSelectedTargetProfile] = useState<any | null>(null);
  const [modalMessage, setModalMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchNFTs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('nfts')
      .select('*, profiles(email, wallet_address)')
      .order('minted_at', { ascending: false });
    
    setNfts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchNFTs();

    const sub = supabase.channel('nfts-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'nfts' }, fetchNFTs)
      .subscribe();

    return () => { supabase.removeChannel(sub); };
  }, []);

  const filteredNfts = nfts.filter(nft => {
    const matchesSearch = 
      (nft.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (nft.token_id || '').toLowerCase().includes(search.toLowerCase()) ||
      (nft.status || '').toLowerCase().includes(search.toLowerCase()) ||
      JSON.stringify(nft.attributes || {}).toLowerCase().includes(search.toLowerCase());
      
    const matchesStatus = statusFilter === 'ALL' || (nft.status || '').toUpperCase() === statusFilter;
    
    // Attempt to extract tier from attributes or name for logic
    const tierValue = (nft.attributes?.tier || nft.attributes?.Tier || '').toUpperCase();
    const nameUpper = (nft.name || '').toUpperCase();
    
    const matchesTier = tierFilter === 'ALL' || 
      tierValue === tierFilter.toUpperCase() || 
      nameUpper.includes(tierFilter.toUpperCase());

    // Attribute key & value search filters
    const matchesAttrKey = !attrKey || Object.keys(nft.attributes || {}).some(k => 
      k.toLowerCase().includes(attrKey.toLowerCase())
    );
    const matchesAttrValue = !attrValue || Object.values(nft.attributes || {}).some(v => 
      String(v).toLowerCase().includes(attrValue.toLowerCase())
    );
      
    return matchesSearch && matchesStatus && matchesTier && matchesAttrKey && matchesAttrValue;
  });

  const handleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  
  const handleSelectAll = () => {
    if (selectedIds.length === filteredNfts.length && filteredNfts.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNfts.map(n => n.id));
    }
  };

  const handleBulkAction = async (newStatus: string) => {
    if (selectedIds.length === 0) return;
    
    setLoading(true);
    for (const id of selectedIds) {
      await supabase.from('nfts').update({ status: newStatus }).eq('id', id);
    }
    setSelectedIds([]);
    await fetchNFTs();
  };

  const handleSearchProfiles = async (val: string) => {
    setTransferSearch(val);
    if (!val.trim()) {
      setCandidateProfiles([]);
      return;
    }
    setSearchingProfiles(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, wallet_address')
        .or(`email.ilike.%${val}%,wallet_address.ilike.%${val}%`)
        .limit(5);
      if (!error) {
        setCandidateProfiles(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSearchingProfiles(false);
    }
  };

  const executeTransfer = async () => {
    if (!activeNft || !selectedTargetProfile) return;
    setLoading(true);
    setModalMessage(null);
    
    const beforeState = { 
      owner_id: activeNft.owner_id, 
      email: activeNft.profiles?.email, 
      wallet_address: activeNft.profiles?.wallet_address,
      status: activeNft.status 
    };

    try {
      const { error } = await supabase
        .from('nfts')
        .update({ 
          owner_id: selectedTargetProfile.id,
          status: 'TRANSFERRED'
        })
        .eq('id', activeNft.id);

      if (!error) {
        // Log transaction to audit log table
        await supabase.from('audit_logs').insert({
          action: 'TRANSFER_NFT',
          entity_type: 'NFT',
          entity_id: activeNft.id,
          before_state: beforeState,
          after_state: { 
            owner_id: selectedTargetProfile.id, 
            email: selectedTargetProfile.email, 
            status: 'TRANSFERRED' 
          },
          ip_address: '127.0.0.1',
          user_agent: 'AXON Client Engine'
        });

        setModalMessage({ type: 'success', text: `Asset ownership successfully transferred to ${selectedTargetProfile.email}!` });
        
        setTimeout(async () => {
          setManageNftId(null);
          setTransferring(false);
          setTransferSearch("");
          setCandidateProfiles([]);
          setSelectedTargetProfile(null);
          setModalMessage(null);
          await fetchNFTs();
        }, 1500);
      } else {
        setModalMessage({ type: 'error', text: `Transfer Failed: ${error.message}` });
      }
    } catch (e: any) {
      setModalMessage({ type: 'error', text: `Transfer Error: ${e.message}` });
    } finally {
      setLoading(false);
    }
  };

  const activeNft = nfts.find(n => n.id === manageNftId);

  return (
    <AdminLayout
      pageTitle="NFT Lifecycle Tracker"
      pageDescription="Command center for smart catalog, minted assets, and digital owner transfers."
      kicker="Asset Core"
    >
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 relative">
        <div className="relative max-w-md flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="Search attributes, Token ID, Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#121212] border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
          />
        </div>
        <div className="flex gap-3 items-center">
          <div className="relative">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl border text-sm font-bold tracking-wide transition-colors ${showFilters ? 'bg-white/10 border-white/20 text-white' : 'bg-[#121212] border-white/10 text-white hover:bg-white/5'}`}
            >
              <Filter className="w-4 h-4" /> Filters
            </button>
            {showFilters && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-[#1A1A1A] border border-white/10 rounded-2xl p-4 shadow-xl z-20">
                <div className="mb-4">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Status</label>
                  <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-[#00FFB2]"
                  >
                    <option value="ALL">All Status</option>
                    <option value="MINTED">Minted</option>
                    <option value="LISTED">Listed</option>
                    <option value="SOLD">Sold</option>
                    <option value="TRANSFERRED">Transferred</option>
                    <option value="BURNED">Burned</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Tier</label>
                  <select 
                    value={tierFilter} 
                    onChange={(e) => setTierFilter(e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-[#00FFB2]"
                  >
                    <option value="ALL">All Tiers</option>
                    <option value="COMMON">Common</option>
                    <option value="RARE">Rare</option>
                    <option value="LEGENDARY">Legendary</option>
                  </select>
                </div>
                <div className="border-t border-white/5 pt-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Search Attributes</label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Trait Name (e.g. skin)"
                      value={attrKey}
                      onChange={(e) => setAttrKey(e.target.value)}
                      className="w-full bg-[#050505] border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#D4AF37] placeholder:text-slate-600"
                    />
                    <input
                      type="text"
                      placeholder="Trait Value (e.g. gold)"
                      value={attrValue}
                      onChange={(e) => setAttrValue(e.target.value)}
                      className="w-full bg-[#050505] border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#D4AF37] placeholder:text-slate-600"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#00FFB2] to-[#00CC8E] text-black font-bold text-sm tracking-wide hover:shadow-[0_0_20px_rgba(0,255,178,0.3)] transition-all">
            <PlusCircle className="w-4 h-4" /> Mint Asset
          </button>
        </div>
      </div>

      {/* Selected Active Filters Display */}
      {(statusFilter !== "ALL" || tierFilter !== "ALL" || attrKey || attrValue) && (
        <div className="flex flex-wrap items-center gap-2 mb-6 bg-[#121212]/40 border border-white/5 p-3 rounded-2xl">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mr-2">Active Filters:</span>
          {statusFilter !== "ALL" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#00FFB2]/10 text-[#00FFB2] border border-[#00FFB2]/20">
              Status: {statusFilter}
              <button onClick={() => setStatusFilter("ALL")} className="hover:text-white font-bold ml-1 text-sm line-none">×</button>
            </span>
          )}
          {tierFilter !== "ALL" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#D4AF37]/10 text-white border border-[#D4AF37]/30">
              Tier: {tierFilter}
              <button onClick={() => setTierFilter("ALL")} className="hover:text-white font-bold ml-1 text-sm line-none">×</button>
            </span>
          )}
          {attrKey && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Trait: {attrKey}
              <button onClick={() => setAttrKey("")} className="hover:text-white font-bold ml-1 text-sm line-none">×</button>
            </span>
          )}
          {attrValue && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
              Value: {attrValue}
              <button onClick={() => setAttrValue("")} className="hover:text-white font-bold ml-1 text-sm line-none">×</button>
            </span>
          )}
          <button 
            onClick={() => {
              setStatusFilter("ALL");
              setTierFilter("ALL");
              setAttrKey("");
              setAttrValue("");
            }} 
            className="text-xs text-red-400 hover:text-red-300 font-bold uppercase tracking-widest ml-auto px-2"
          >
            Clear All
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        <div className="bg-[#121212]/60 backdrop-blur-xl border border-white/5 p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FFB2]/5 blur-[40px] rounded-full group-hover:bg-[#00FFB2]/10 transition-colors"></div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2">
            <Package className="w-4 h-4" /> Minted Total
          </span>
          <div className="text-3xl font-light text-white flex items-baseline gap-2">
            {nfts.filter(n => n.status === 'MINTED').length}
            <span className="text-sm text-[#00FFB2] font-bold">+12%</span>
          </div>
        </div>
        <div className="bg-[#121212]/60 backdrop-blur-xl border border-white/5 p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 blur-[40px] rounded-full group-hover:bg-[#D4AF37]/10 transition-colors"></div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2">
            <ArrowUpRight className="w-4 h-4" /> Transferred
          </span>
          <div className="text-3xl font-light text-white flex items-baseline gap-2">
            {nfts.filter(n => n.status === 'TRANSFERRED' || n.status === 'SOLD').length}
            <span className="text-sm text-[#D4AF37] font-bold">Active</span>
          </div>
        </div>
        <div className="bg-[#121212]/60 backdrop-blur-xl border border-white/5 p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 blur-[40px] rounded-full group-hover:bg-sky-500/10 transition-colors"></div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4" /> Validated Nodes
          </span>
          <div className="text-3xl font-light text-white flex items-baseline gap-2">
            100%
            <span className="text-sm text-sky-400 font-bold">Secure</span>
          </div>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="mb-4 bg-[#0A0A0A] border border-[#00FFB2]/20 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm font-bold text-white">
            <div className="bg-[#00FFB2]/10 text-[#00FFB2] px-3 py-1 rounded-full">
              {selectedIds.length} Selected
            </div>
            Bulk Actions
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleBulkAction('LISTED')}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold tracking-widest text-[#D4AF37] uppercase transition-colors"
            >
              <Tag className="w-3 h-3" /> List Selected
            </button>
            <button 
              onClick={() => handleBulkAction('BURNED')}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-xs font-bold tracking-widest text-red-500 uppercase transition-colors"
            >
              <Flame className="w-4 h-4" /> Burn Selected
            </button>
          </div>
        </div>
      )}

      <div className="bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="p-20 flex justify-center items-center">
            <Activity className="w-8 h-8 text-[#00FFB2] animate-pulse" />
          </div>
        ) : filteredNfts.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
              <Package className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">No Assets Found</h3>
            <p className="text-slate-500 text-sm">Query returned no matching tokens.</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar pb-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1A1A1A] text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-white/5">
                  <th className="px-6 py-5 w-12 pt-6">
                    <button onClick={handleSelectAll} className="text-slate-500 hover:text-white pt-1">
                      {selectedIds.length === filteredNfts.length ? <CheckSquare className="w-5 h-5 text-[#00FFB2]" /> : <Square className="w-5 h-5" />}
                    </button>
                  </th>
                  <th className="px-6 py-5">Asset Core</th>
                  <th className="px-6 py-5">Token ID</th>
                  <th className="px-6 py-5">Holder</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredNfts.map((nft) => (
                  <tr key={nft.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <button onClick={() => handleSelect(nft.id)} className="text-slate-500 hover:text-white">
                        {selectedIds.includes(nft.id) ? <CheckSquare className="w-5 h-5 text-[#00FFB2]" /> : <Square className="w-5 h-5" />}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative group/tooltip">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 border border-white/10 cursor-pointer">
                            {nft.image_url ? (
                              <img src={nft.image_url} alt={nft.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-500">N/A</div>
                            )}
                          </div>
                          {/* Large Image Tooltip */}
                          {nft.image_url && (
                             <div className="absolute left-1/2 -translate-x-1/2 bottom-[120%] z-50 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible pointer-events-none transition-all duration-300 transform scale-95 group-hover/tooltip:scale-100">
                               <div className="w-48 h-48 rounded-xl overflow-hidden border border-white/20 shadow-2xl bg-black">
                                 <img src={nft.image_url} alt={nft.name} className="w-full h-full object-cover" />
                               </div>
                               <div className="w-3 h-3 bg-white/20 rotate-45 mx-auto -mt-1.5 border-b border-r border-white/20" />
                             </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white leading-tight">{nft.name || 'Unknown Asset'}</p>
                          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">{nft.attributes?.tier || 'Standard'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono text-slate-400 bg-[#050505] px-2 py-1 rounded-md border border-white/5">
                        ...{nft.token_id ? nft.token_id.slice(-8) : 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {nft.profiles ? (
                        <div>
                          <p className="text-sm font-medium text-slate-200">{nft.profiles.email || 'Anonymous'}</p>
                          <p className="text-[10px] text-[#D4AF37] font-mono mt-0.5">
                            {nft.profiles.wallet_address ? `${nft.profiles.wallet_address.slice(0, 6)}...${nft.profiles.wallet_address.slice(-4)}` : 'No wallet'}
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        (nft.status || '').toUpperCase() === 'MINTED' ? 'bg-[#00FFB2]/10 text-[#00FFB2] border border-[#00FFB2]/20' :
                        (nft.status || '').toUpperCase() === 'SOLD' ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20' :
                        (nft.status || '').toUpperCase() === 'LISTED' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                        (nft.status || '').toUpperCase() === 'TRANSFERRED' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                        (nft.status || '').toUpperCase() === 'BURNED' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                        'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                      }`}>
                        {nft.status || 'UNKNOWN'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setManageNftId(nft.id)}
                        className="text-[#00FFB2] hover:text-white transition-colors text-xs font-bold uppercase tracking-widest bg-[#00FFB2]/5 px-3 py-1.5 rounded-lg border border-[#00FFB2]/20 hover:bg-[#00FFB2]/20"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MANAGE Modal */}
      {manageNftId && activeNft && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
          <div className="bg-[#121212] border border-white/10 rounded-[2rem] w-full max-w-3xl overflow-hidden flex flex-col md:flex-row shadow-[0_0_50px_rgba(0,255,178,0.05)]">
            {/* Image Side */}
            <div className="w-full md:w-1/2 bg-[#050505] p-8 flex flex-col relative border-b md:border-b-0 md:border-r border-white/5">
              <button 
                 onClick={() => setManageNftId(null)}
                 className="absolute top-4 left-4 md:hidden w-8 h-8 flex items-center justify-center bg-white/10 rounded-full text-white"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-full aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl mb-6 relative">
                  {activeNft.image_url ? (
                    <img src={activeNft.image_url} alt="NFT" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-500">
                       <Package className="w-12 h-12 opacity-50" />
                       <span className="text-xs uppercase tracking-widest font-bold">No Image</span>
                    </div>
                  )}
                  {/* Status Overlay Badge */}
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                     <span className={`w-2 h-2 rounded-full ${(activeNft.status || '').toUpperCase() === 'MINTED' ? 'bg-[#00FFB2]' : 'bg-[#D4AF37]'}`} />
                     <span className="text-[10px] font-bold uppercase tracking-widest text-white">{activeNft.status || 'UNKNOWN'}</span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-light text-white text-center">{activeNft.name}</h3>
                <p className="text-slate-400 font-mono text-sm mt-2">{activeNft.token_id || 'unassigned_token_id'}</p>
              </div>
            </div>
            
            {/* Content Side */}
            <div className="w-full md:w-1/2 p-8 flex flex-col relative bg-[#121212]">
              <button 
                 onClick={() => {
                   setManageNftId(null);
                   setTransferring(false);
                   setTransferSearch("");
                   setCandidateProfiles([]);
                   setSelectedTargetProfile(null);
                   setModalMessage(null);
                 }}
                 className="hidden md:flex absolute top-6 right-6 w-8 h-8 items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              {modalMessage && (
                <div className={`mb-4 p-3 rounded-xl text-xs font-semibold border ${modalMessage.type === 'success' ? 'bg-[#00FFB2]/10 border-[#00FFB2]/20 text-[#00FFB2]' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                  {modalMessage.text}
                </div>
              )}

              {transferring ? (
                <>
                  <h4 className="text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase mb-1">Ownership Transfer Portal</h4>
                  <p className="text-xs text-slate-400 mb-4">Enter a user email or wallet address to find candidates on the AXON ledger.</p>
                  
                  <div className="space-y-4">
                    <div>
                      <input 
                        type="text"
                        placeholder="Type email or wallet address..."
                        value={transferSearch}
                        onChange={(e) => handleSearchProfiles(e.target.value)}
                        className="w-full bg-[#050505] border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-[#00FFB2]"
                      />
                    </div>

                    <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                      {searchingProfiles ? (
                        <div className="text-center py-4 text-xs font-mono text-slate-500 animate-pulse">Searching AXON Registry...</div>
                      ) : candidateProfiles.length === 0 ? (
                        transferSearch.trim() ? (
                          <div className="text-center py-4 text-xs text-slate-500">No profile matches found</div>
                        ) : null
                      ) : (
                        candidateProfiles.map((p) => (
                          <div 
                            key={p.id}
                            onClick={() => setSelectedTargetProfile(p)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all text-left ${selectedTargetProfile?.id === p.id ? 'bg-[#00FFB2]/10 border-[#00FFB2]/30' : 'bg-white/5 border-white/5 hover:border-white/15'}`}
                          >
                            <p className="text-xs font-bold text-white truncate">{p.email || 'Anonymous'}</p>
                            <p className="text-[10px] font-mono text-slate-400 truncate mt-1">
                              {p.wallet_address || 'No Wallet Attached'}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-white/5 flex items-center gap-3">
                    <button 
                      onClick={() => {
                        setTransferring(false);
                        setSelectedTargetProfile(null);
                        setTransferSearch("");
                        setCandidateProfiles([]);
                      }} 
                      className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-bold transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={executeTransfer}
                      disabled={!selectedTargetProfile || loading}
                      className="flex-1 bg-gradient-to-r from-[#00FFB2] to-[#00b27c] text-black disabled:opacity-40 rounded-xl py-3 text-sm font-bold tracking-wide hover:shadow-[0_0_20px_rgba(0,255,178,0.4)] transition-all text-center animate-pulse"
                    >
                      {loading ? 'Transferring...' : 'Confirm Transfer'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h4 className="text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase mb-1">Details & Payload</h4>
                  
                  <div className="mt-4 mb-6">
                     <p className="text-sm text-slate-300 leading-relaxed">
                       {activeNft.description || 'No description embedded in this asset.'}
                     </p>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div className="bg-white/5 rounded-xl block overflow-hidden border border-white/5">
                       <div className="px-4 py-2 border-b border-white/5 bg-white/[0.02]">
                         <span className="text-xs uppercase font-bold tracking-widest text-slate-500">Ownership Root</span>
                       </div>
                       <div className="p-4">
                         <p className="text-sm text-white mb-1">{activeNft.profiles?.email || 'Unassigned User'}</p>
                         <p className="text-xs font-mono text-[#00FFB2] truncate">{activeNft.profiles?.wallet_address || 'No Wallet Attached'}</p>
                       </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-xl block overflow-hidden border border-white/5">
                       <div className="px-4 py-2 border-b border-white/5 bg-white/[0.02]">
                         <span className="text-xs uppercase font-bold tracking-widest text-slate-500">Attributes JSON</span>
                       </div>
                       <div className="p-4 overflow-y-auto max-h-[140px]">
                         {activeNft.attributes ? (
                           <pre className="text-[10px] font-mono text-slate-400 overflow-x-auto">
                             {JSON.stringify(activeNft.attributes, null, 2)}
                           </pre>
                         ) : (
                           <p className="text-xs text-slate-500 italic">No attributes found.</p>
                         )}
                       </div>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between gap-3">
                     <button onClick={() => setManageNftId(null)} className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-bold transition-colors">
                       Close
                     </button>
                     <button 
                       onClick={() => setTransferring(true)}
                       className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#B8942E] text-black rounded-xl py-3 text-sm font-bold tracking-wide hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all text-center"
                     >
                       Transfer Ownership
                     </button>
                  </div>
                </>
              )}
            </div>
            
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

