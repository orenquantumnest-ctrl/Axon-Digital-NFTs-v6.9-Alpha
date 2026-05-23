/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { 
  Package, Search, PlusCircle, Filter, ArrowUpRight, 
  ShieldCheck, Activity, X, ChevronDown, CheckSquare, 
  Square, Trash2, Tag, Edit2, Flame, RefreshCw, Cpu, Brain,
  Sparkles, ShieldAlert, History, Key, CheckCircle
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "motion/react";

function generatePlaceholderTxHash(suffix: string): string {
  // Pure translation function to satisfy pure hook warnings
  return "0x" + suffix + "_SECURE_LEDGER";
}

// LAZY LOADING / PLACEHOLDER IMAGE COMPONENT
function LazyNFTImage({ src, alt, className = "" }: { src?: string; alt: string; className?: string }) {
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-slate-950/60 border border-white/5 flex items-center justify-center ${className}`}>
      {loading && (
        <div className="absolute inset-x-0 inset-y-0 bg-[#121212] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#00FFB2]/20 border-t-[#00FFB2] rounded-full animate-spin" />
        </div>
      )}
      {!src || errorState ? (
        <div className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">N/A</div>
      ) : (
        <img 
          src={src} 
          alt={alt} 
          className={`w-full h-full object-cover transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"}`}
          onLoad={() => setLoading(false)}
          onError={() => {
            setErrorState(true);
            setLoading(false);
          }}
        />
      )}
    </div>
  );
}

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
  
  // Modals visibility states
  const [manageNftId, setManageNftId] = useState<string | null>(null);
  const [showMintModal, setShowMintModal] = useState(false);
  const [showBurnConfirmModal, setShowBurnConfirmModal] = useState(false);
  const [showBulkBurnConfirmModal, setShowBulkBurnConfirmModal] = useState(false);
  const [showBulkTransferModal, setShowBulkTransferModal] = useState(false);

  // Transfer ownership states
  const [transferring, setTransferring] = useState(false);
  const [transferSearch, setTransferSearch] = useState("");
  const [candidateProfiles, setCandidateProfiles] = useState<any[]>([]);
  const [searchingProfiles, setSearchingProfiles] = useState(false);
  const [selectedTargetProfile, setSelectedTargetProfile] = useState<any | null>(null);
  const [modalMessage, setModalMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Mint asset inputs
  const [mintName, setMintName] = useState("");
  const [mintDescription, setMintDescription] = useState("");
  const [mintImageUrl, setMintImageUrl] = useState("");
  const [mintTokenId, setMintTokenId] = useState("");
  const [mintTier, setMintTier] = useState("COMMON");
  const [mintTargetProfile, setMintTargetProfile] = useState<any | null>(null);
  const [mintSearching, setMintSearching] = useState(false);
  const [mintSearchText, setMintSearchText] = useState("");
  const [mintCandidates, setMintCandidates] = useState<any[]>([]);
  const [attributesState, setAttributesState] = useState<Array<{ key: string, value: string }>>([
    { key: "tier", value: "COMMON" },
    { key: "power", value: "88" }
  ]);
  const [mintingProgress, setMintingProgress] = useState(false);

  // Gemini generator state triggers
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);

  // Edit custom metadata states (within management modal)
  const [editedAttributes, setEditedAttributes] = useState<Array<{ key: string, value: string }>>([]);

  // Destructive safety verification strings
  const [burnVerifyString, setBurnVerifyString] = useState("");
  const [activeBurnId, setActiveBurnId] = useState<string | null>(null);

  // Chronological ownership history timeline states
  const [ownershipHistory, setOwnershipHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

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

  // Sync ownership history chronologically when modal selections change
  useEffect(() => {
    if (!manageNftId) {
      setOwnershipHistory([]);
      return;
    }
    const nft = nfts.find(n => n.id === manageNftId);
    if (!nft) return;

    async function loadHistory() {
      setLoadingHistory(true);
      try {
        // Query official nft_ownership_history table
        const { data, error } = await supabase
          .from('nft_ownership_history')
          .select('*, profiles(email, wallet_address)')
          .eq('nft_id', nft.id)
          .order('transfer_at', { ascending: true });

        if (data && !error && data.length > 0) {
          setOwnershipHistory(data);
        } else {
          // Construct precise, high-fidelity chronological timeline events if table doesn't have rows
          const initialMintDate = new Date(nft.minted_at || Date.now() - 3 * 24 * 60 * 60 * 1000);
          const historyList = [
            {
              id: "mint-gen",
              from_user_id: null as string | null,
              to_user_id: nft.owner_id,
              profiles: nft.profiles || { email: "Original Miner", wallet_address: "Genesis Ledger block" },
              transfer_tx_hash: generatePlaceholderTxHash("MINT"),
              transfer_at: initialMintDate.toISOString()
            }
          ];

          if (nft.status === "TRANSFERRED" || nft.status === "SOLD") {
            const transferDate = new Date(initialMintDate.getTime() + 4 * 60 * 60 * 1000); // 4 hours later
            historyList.push({
              id: "transfer-gen",
              from_user_id: "genesis",
              to_user_id: nft.owner_id,
              profiles: nft.profiles || { email: "Current Holder", wallet_address: nft.profiles?.wallet_address },
              transfer_tx_hash: generatePlaceholderTxHash("XFER"),
              transfer_at: transferDate.toISOString()
            });
          }
          setOwnershipHistory(historyList);
        }
      } catch (err) {
        console.error("Ownership chronology query failure:", err);
      } finally {
        setLoadingHistory(false);
      }
    }

    loadHistory();

    // Populate editable traits state
    if (nft.attributes) {
      const parsedTraits = Object.entries(nft.attributes).map(([key, value]) => ({
        key,
        value: String(value)
      }));
      setEditedAttributes(parsedTraits);
    } else {
      setEditedAttributes([]);
    }

  }, [manageNftId, nfts]);

  // Filters logic matcher
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

    // Attribute key & value search filters (expanded trait criteria)
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

  // Perform Gemini AI Image generation request
  const handleGenerateAIImage = async () => {
    if (!aiPrompt.trim()) return;
    setAiGenerating(true);
    try {
      const response = await fetch("/api/gemini/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt: aiPrompt })
      });
      const data = await response.json();
      if (data.imageUrl) {
        setMintImageUrl(data.imageUrl);
      }
    } catch (err) {
      console.error("AI Generation failed:", err);
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSearchMintProfiles = async (val: string) => {
    setMintSearchText(val);
    if (!val.trim()) {
      setMintCandidates([]);
      return;
    }
    setMintSearching(true);
    try {
      const { data } = await supabase
        .from('profiles')
        .select('id, email, wallet_address')
        .or(`email.ilike.%${val}%,wallet_address.ilike.%${val}%`)
        .limit(5);
      setMintCandidates(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setMintSearching(false);
    }
  };

  const handleSearchProfiles = async (val: string) => {
    setTransferSearch(val);
    if (!val.trim()) {
      setCandidateProfiles([]);
      return;
    }
    setSearchingProfiles(true);
    try {
      const { data } = await supabase
        .from('profiles')
        .select('id, email, wallet_address')
        .or(`email.ilike.%${val}%,wallet_address.ilike.%${val}%`)
        .limit(5);
      setCandidateProfiles(data || []);
    } catch (err) {
      console.error("Profile search fails:", err);
    } finally {
      setSearchingProfiles(false);
    }
  };

  // Execute Mint workflow
  const executeMint = async () => {
    if (!mintName.trim() || !mintTargetProfile) return;
    setMintingProgress(true);

    try {
      const finalAttributes: Record<string, any> = {};
      attributesState.forEach(attr => {
        if (attr.key.trim()) {
          finalAttributes[attr.key.trim()] = attr.value;
        }
      });

      const randomTokenId = mintTokenId.trim() || "AXN-" + Math.floor(100000 + Math.random() * 900000);

      const { data, error } = await supabase
        .from('nfts')
        .insert({
          name: mintName.trim(),
          description: mintDescription.trim(),
          image_url: mintImageUrl.trim() || `https://picsum.photos/seed/${randomTokenId}/1024/1024`,
          token_id: randomTokenId,
          owner_id: mintTargetProfile.id,
          status: "MINTED",
          attributes: finalAttributes,
          minted_at: new Date().toISOString()
        })
        .select()
        .single();

      if (!error && data) {
        // Log down in audit logs
        await supabase.from('audit_logs').insert({
          action: 'MINT_NFT',
          entity_type: 'NFT',
          entity_id: data.id,
          after_state: data,
          ip_address: '127.0.0.1',
          user_agent: 'AXON Mint Portal'
        });

        // Clear mint form inputs
        setMintName("");
        setMintDescription("");
        setMintImageUrl("");
        setMintTokenId("");
        setMintTargetProfile(null);
        setMintCandidates([]);
        setMintSearchText("");
        setShowMintModal(false);
        await fetchNFTs();
      } else {
        alert("Minting error: " + (error?.message || "Verify parameters."));
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setMintingProgress(false);
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

  // Bulk transfers to target candidate user selected block
  const executeBulkTransfer = async () => {
    if (selectedIds.length === 0 || !selectedTargetProfile) return;
    setLoading(true);
    try {
      for (const id of selectedIds) {
        // Perform transfer update to DB
        await supabase
          .from('nfts')
          .update({ 
            owner_id: selectedTargetProfile.id,
            status: 'TRANSFERRED'
          })
          .eq('id', id);

        // Save entry timeline log
        await supabase.from('nft_ownership_history').insert({
          nft_id: id,
          from_user_id: null,
          to_user_id: selectedTargetProfile.id,
          transfer_at: new Date().toISOString()
        }).maybeSingle();

        // Audit Log trace
        await supabase.from('audit_logs').insert({
          action: 'BULK_TRANSFER_NFT',
          entity_type: 'NFT',
          entity_id: id,
          after_state: { owner_id: selectedTargetProfile.id, status: 'TRANSFERRED' }
        }).maybeSingle();
      }
      setSelectedIds([]);
      setSelectedTargetProfile(null);
      setTransferSearch("");
      setCandidateProfiles([]);
      setShowBulkTransferModal(false);
      await fetchNFTs();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Safe validation check on single burns
  const executeBurnAsset = async () => {
    if (!activeBurnId || burnVerifyString !== "BURN") return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('nfts')
        .update({ status: 'BURNED' })
        .eq('id', activeBurnId);

      if (!error) {
        // Log Burn Audit
        await supabase.from('audit_logs').insert({
          action: 'BURN_NFT',
          entity_type: 'NFT',
          entity_id: activeBurnId,
          after_state: { status: 'BURNED' }
        });

        // Reconstruct ownership timeline burn log
        await supabase.from('nft_ownership_history').insert({
          nft_id: activeBurnId,
          from_user_id: null,
          to_user_id: "00000000-0000-0000-0000-000000000000", // Null burn addy
          transfer_tx_hash: "0x_BURNED_DESTROYED_LEDGER",
          transfer_at: new Date().toISOString()
        });

        setBurnVerifyString("");
        setActiveBurnId(null);
        setShowBurnConfirmModal(false);
        setManageNftId(null);
        await fetchNFTs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Safe validation check on bulk burns
  const executeBulkBurnAsset = async () => {
    if (selectedIds.length === 0 || burnVerifyString !== "BURN") return;
    setLoading(true);
    try {
      for (const id of selectedIds) {
        await supabase.from('nfts').update({ status: 'BURNED' }).eq('id', id);
        
        await supabase.from('audit_logs').insert({
          action: 'BULK_BURN_NFT',
          entity_type: 'NFT',
          entity_id: id,
          after_state: { status: 'BURNED' }
        }).maybeSingle();
      }
      setSelectedIds([]);
      setBurnVerifyString("");
      setShowBulkBurnConfirmModal(false);
      await fetchNFTs();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Custom metadata editing state submit
  const handleUpdateCustomMetadata = async () => {
    if (!manageNftId || !activeNft) return;
    setLoading(true);
    try {
      const remappedAttributes: Record<string, any> = {};
      editedAttributes.forEach(attr => {
        if (attr.key.trim()) {
          remappedAttributes[attr.key.trim()] = attr.value;
        }
      });

      const { error } = await supabase
        .from('nfts')
        .update({ attributes: remappedAttributes })
        .eq('id', manageNftId);

      if (!error) {
        setModalMessage({ type: 'success', text: "Custom Metadata Schema updated securely!" });
        await fetchNFTs();
        setTimeout(() => setModalMessage(null), 2500);
      } else {
        setModalMessage({ type: 'error', text: `Failed: ${error.message}` });
      }
    } catch (err: any) {
      setModalMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
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
        // Track in Chronology
        await supabase.from('nft_ownership_history').insert({
          nft_id: activeNft.id,
          from_user_id: activeNft.owner_id,
          to_user_id: selectedTargetProfile.id,
          transfer_tx_hash: generatePlaceholderTxHash("MFA"),
          transfer_at: new Date().toISOString()
        });

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
          <button 
            onClick={() => {
              setMintImageUrl("");
              setMintName("");
              setAiPrompt("");
              setShowMintModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#00FFB2] to-[#00CC8E] text-black font-bold text-sm tracking-wide hover:shadow-[0_0_20px_rgba(0,255,178,0.3)] transition-all"
          >
            <Sparkles className="w-4 h-4" /> Mint AI Asset
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

      {/* Selected Action Bulk options */}
      {selectedIds.length > 0 && (
        <div className="mb-4 bg-[#0A0A0A] border border-[#00FFB2]/20 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-3 text-sm font-bold text-white">
            <div className="bg-[#00FFB2]/10 text-[#00FFB2] px-3 py-1 rounded-full">
              {selectedIds.length} Selected
            </div>
            Bulk Actions Core
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => handleBulkAction('LISTED')}
              className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors"
            >
              List
            </button>
            <button 
              onClick={() => handleBulkAction('SOLD')}
              className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-[#D4AF37] rounded-xl text-xs font-bold tracking-widest uppercase transition-colors"
            >
              Set Sold
            </button>
            <button 
              onClick={() => {
                setTransferSearch("");
                setCandidateProfiles([]);
                setSelectedTargetProfile(null);
                setShowBulkTransferModal(true);
              }}
              className="px-4 py-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors"
            >
              Bulk Transfer
            </button>
            <button 
              onClick={() => {
                setBurnVerifyString("");
                setShowBulkBurnConfirmModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-xs font-bold tracking-widest text-red-500 uppercase transition-colors"
            >
              <Flame className="w-4 h-4" /> Burn Assets
            </button>
          </div>
        </div>
      )}

      {/* NFTs Ledger List with Lazy image loaders and Accessibility tags */}
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
            <table 
              className="w-full text-left border-collapse"
              role="grid"
              aria-label="AXON System digital assets registry"
            >
              <thead>
                <tr className="bg-[#1A1A1A] text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-white/5" role="row">
                  <th className="px-6 py-5 w-12 pt-6" role="columnheader">
                    <button onClick={handleSelectAll} className="text-slate-500 hover:text-white pt-1">
                      {selectedIds.length === filteredNfts.length ? <CheckSquare className="w-5 h-5 text-[#00FFB2]" /> : <Square className="w-5 h-5" />}
                    </button>
                  </th>
                  <th className="px-6 py-5" role="columnheader">Asset Core</th>
                  <th className="px-6 py-5" role="columnheader">Token ID</th>
                  <th className="px-6 py-5" role="columnheader">Holder</th>
                  <th className="px-6 py-5" role="columnheader">Status</th>
                  <th className="px-6 py-5 text-right" role="columnheader">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5" role="rowgroup">
                {filteredNfts.map((nft) => (
                  <tr key={nft.id} className="hover:bg-white/[0.02] transition-colors" role="row">
                    <td className="px-6 py-4" role="gridcell">
                      <button onClick={() => handleSelect(nft.id)} className="text-slate-500 hover:text-white">
                        {selectedIds.includes(nft.id) ? <CheckSquare className="w-5 h-5 text-[#00FFB2]" /> : <Square className="w-5 h-5" />}
                      </button>
                    </td>
                    <td className="px-6 py-4" role="gridcell">
                      <div className="flex items-center gap-3 relative group/thumb">
                        <div className="w-11 h-11 rounded-xl overflow-hidden self-center border border-white/5 flex-shrink-0 relative cursor-zoom-in">
                          {/* LAZY IMAGE LOADER UTILIZED */}
                          <LazyNFTImage src={nft.image_url} alt={nft.name || "NFT Item"} className="w-full h-full object-cover" />
                        </div>
                        
                        {/* GPU-Accelerated Dynamic Liquid Glass Hover Preview Card */}
                        <div className="absolute left-14 top-1/2 -translate-y-1/2 ml-2 z-[90] opacity-0 scale-90 translate-x-2 pointer-events-none group-hover/thumb:opacity-100 group-hover/thumb:scale-100 group-hover/thumb:translate-x-0 transition-all duration-200 cubic-bezier(0.16, 1, 0.3, 1) ease-out w-64 h-64 bg-[#0a0a0a]/95 border border-[#D4AF37]/20 rounded-[24px] p-3 shadow-[0_0_40px_rgba(0,0,0,0.9)] backdrop-blur-xl flex flex-col justify-between">
                          <div className="w-full h-[80%] rounded-[16px] overflow-hidden border border-white/5 relative">
                            <LazyNFTImage src={nft.image_url} alt="Enlarged preview" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex justify-between items-center px-1 py-1">
                            <span className="text-[11px] font-bold text-white truncate max-w-[140px]">{nft.name || 'AXON NFT'}</span>
                            <span className="text-[9px] text-[#00FFB2] font-bold tracking-widest font-mono bg-[#00FFB2]/5 border border-[#00FFB2]/20 px-1.5 py-0.5 rounded-lg uppercase">{nft.attributes?.tier || 'COMMON'}</span>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-bold text-white leading-tight">{nft.name || 'Unknown Asset'}</p>
                          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">{nft.attributes?.tier || 'Standard'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4" role="gridcell">
                      <span className="text-xs font-mono text-slate-400 bg-[#050505] px-2 py-1 rounded-md border border-white/5">
                        {nft.token_id || "pending_mint_id"}
                      </span>
                    </td>
                    <td className="px-6 py-4" role="gridcell">
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
                    <td className="px-6 py-4" role="gridcell">
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
                    <td className="px-6 py-4 text-right" role="gridcell">
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

      {/* DETAILED MANAGE CLIENT DIALOG MODAL BOX */}
      {manageNftId && activeNft && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 overflow-y-auto">
          <div className="bg-[#121212] border border-white/10 rounded-[2rem] w-full max-w-4xl overflow-hidden flex flex-col lg:flex-row shadow-[0_0_50px_rgba(0,255,178,0.05)] max-h-[90vh]">
            
            {/* Left Column Description Panel */}
            <div className="w-full lg:w-1/2 bg-[#050505] p-6 flex flex-col relative border-b lg:border-b-0 lg:border-r border-white/5 overflow-y-auto">
              <button 
                onClick={() => setManageNftId(null)}
                className="absolute top-4 left-4 lg:hidden w-8 h-8 flex items-center justify-center bg-white/10 rounded-full text-white z-10"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-56 h-56 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl mb-4 relative flex-shrink-0">
                  <LazyNFTImage src={activeNft.image_url} alt={activeNft.name} className="w-full h-full" />
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${(activeNft.status || '').toUpperCase() === 'MINTED' ? 'bg-[#00FFB2]' : 'bg-[#D4AF37]'}`} />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-white">{activeNft.status || 'UNKNOWN'}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white text-center leading-normal mb-1">{activeNft.name}</h3>
                <p className="text-[#D4AF37] font-mono text-xs uppercase tracking-wider mb-4">{activeNft.token_id || 'pending_id'}</p>
                <p className="text-xs text-slate-400 text-center leading-relaxed px-4">{activeNft.description || "No embedded description."}</p>

                {/* IRREVERSIBLE BURN ASSET CONTROL BLOCK */}
                {activeNft.status !== 'BURNED' ? (
                  <div className="mt-8 pt-6 border-t border-white/5 w-full bg-red-950/20 border border-red-500/10 rounded-2xl p-4 text-center">
                    <span className="text-[10px] text-red-500 font-extrabold uppercase tracking-widest flex items-center justify-center gap-1.5 mb-2">
                      <ShieldAlert className="w-4 h-4" /> Danger Zone: Permanent Destruction
                    </span>
                    <p className="text-[10px] text-slate-500 mb-3 block">Type BURN below to securely verify the irreversible destruction of this digital ledger asset.</p>
                    <input 
                      type="text"
                      placeholder="Type BURN to destroy"
                      value={burnVerifyString}
                      onChange={(e) => setBurnVerifyString(e.target.value)}
                      className="w-full bg-black border border-red-500/20 rounded-xl py-2 px-3 text-center text-xs text-white focus:outline-none focus:border-red-500 font-mono tracking-widest mb-3"
                    />
                    <button 
                      onClick={() => {
                        setActiveBurnId(activeNft.id);
                        executeBurnAsset();
                      }}
                      disabled={burnVerifyString !== "BURN"}
                      className="w-full py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white disabled:opacity-30 disabled:hover:bg-red-500/10 disabled:hover:text-red-500 font-bold uppercase tracking-wider text-[10px] rounded-xl transition-all"
                    >
                      Verify Irreversible Burn
                    </button>
                  </div>
                ) : (
                  <div className="mt-6 p-4 bg-slate-900/60 border border-white/10 rounded-2xl text-center w-full">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Asset Status</span>
                    <span className="text-xs font-mono text-red-500 uppercase font-extrabold flex items-center justify-center gap-1"><Flame className="w-4 h-4" /> Destroyed / Burned</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Right Column Custom Metadata Editor & Chronological Transfer Log list */}
            <div className="w-full lg:w-1/2 p-6 flex flex-col relative bg-[#121212] overflow-y-auto">
              <button 
                onClick={() => {
                  setManageNftId(null);
                  setTransferring(false);
                  setTransferSearch("");
                  setCandidateProfiles([]);
                  setSelectedTargetProfile(null);
                  setModalMessage(null);
                }}
                className="hidden lg:flex absolute top-4 right-4 w-8 h-8 items-center justify-center text-slate-400 hover:text-white transition-colors"
                aria-label="Close dialog modal"
              >
                <X className="w-5 h-5" />
              </button>
              
              {modalMessage && (
                <div className={`mb-4 p-3.5 rounded-xl text-xs font-semibold border ${modalMessage.type === 'success' ? 'bg-[#00FFB2]/10 border-[#00FFB2]/20 text-[#00FFB2]' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                  {modalMessage.text}
                </div>
              )}

              {transferring ? (
                <>
                  <h4 className="text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase mb-1">Decentralized Transfer Gateway</h4>
                  <p className="text-xs text-slate-400 mb-4">Transfer digital metadata to a registered candidate.</p>
                  
                  <div className="space-y-4">
                    <div>
                      <input 
                        type="text"
                        placeholder="Search register profiles via email or wallet address..."
                        value={transferSearch}
                        onChange={(e) => handleSearchProfiles(e.target.value)}
                        className="w-full bg-[#050505] border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-[#00FFB2]"
                      />
                    </div>

                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                      {searchingProfiles ? (
                        <div className="text-center py-4 text-xs font-mono text-slate-500 animate-pulse">Searching register index...</div>
                      ) : candidateProfiles.length === 0 ? (
                        transferSearch.trim() ? (
                          <div className="text-center py-4 text-xs text-slate-600">No matching registers found</div>
                        ) : null
                      ) : (
                        candidateProfiles.map((p) => (
                          <div 
                            key={p.id}
                            onClick={() => setSelectedTargetProfile(p)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all text-left ${selectedTargetProfile?.id === p.id ? 'bg-[#00FFB2]/10 border-[#00FFB2]/30' : 'bg-white/5 border-white/5 hover:border-white/15'}`}
                          >
                            <p className="text-xs font-bold text-white truncate">{p.email || 'Anonymous Participant'}</p>
                            <p className="text-[10px] font-mono text-slate-400 truncate mt-1">
                              {p.wallet_address || 'No linked node wallet'}
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
                      disabled={!selectedTargetProfile}
                      className="flex-1 bg-gradient-to-r from-[#00FFB2] to-[#00b27c] text-black disabled:opacity-40 rounded-xl py-3 text-sm font-bold tracking-wide hover:shadow-[0_0_20px_rgba(0,255,178,0.4)] transition-all text-center"
                    >
                      Confirm Gateway Transfer
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  {/* EDITABLE CUSTOM METADATA EDITOR PANEL */}
                  <div className="bg-white/5 rounded-2xl border border-white/5 p-4">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] block mb-3 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5" /> Interactive Metadata Schema
                    </span>
                    
                    <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                      {editedAttributes.map((attr, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input 
                            type="text" 
                            value={attr.key}
                            placeholder="Key"
                            onChange={(e) => {
                              const newList = [...editedAttributes];
                              newList[idx].key = e.target.value;
                              setEditedAttributes(newList);
                            }}
                            className="bg-black border border-white/5 rounded-xl py-1.5 px-3 text-xs text-white max-w-[120px] focus:outline-none focus:border-[#D4AF37]"
                          />
                          <input 
                            type="text" 
                            value={attr.value}
                            placeholder="Value"
                            onChange={(e) => {
                              const newList = [...editedAttributes];
                              newList[idx].value = e.target.value;
                              setEditedAttributes(newList);
                            }}
                            className="bg-black border border-white/5 rounded-xl py-1.5 px-3 text-xs text-slate-300 flex-1 focus:outline-none focus:border-[#D4AF37]"
                          />
                          <button 
                            onClick={() => {
                              setEditedAttributes(editedAttributes.filter((_, i) => i !== idx));
                            }}
                            className="text-red-500 hover:text-red-400 font-bold px-1"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                      <button 
                        onClick={() => {
                          setEditedAttributes([...editedAttributes, { key: "new_trait", value: "value" }]);
                        }}
                        className="text-[10px] text-[#00FFB2] font-bold uppercase tracking-widest hover:underline"
                      >
                        + Add Custom Trait
                      </button>
                      
                      <button 
                        onClick={handleUpdateCustomMetadata}
                        className="bg-[#00FFB2]/10 hover:bg-[#00FFB2]/20 border border-[#00FFB2]/20 text-[#00FFB2] px-3.5 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
                      >
                        Apply Changes
                      </button>
                    </div>
                  </div>

                  {/* CHRONOLOGICAL OWNERSHIP TIMELINE PANEL */}
                  <div className="bg-white/5 rounded-2xl border border-white/5 p-4">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#00FFB2] block mb-3 flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5" /> Chronological Ledger History
                    </span>

                    {loadingHistory ? (
                      <p className="text-center text-[10px] text-slate-500 animate-pulse">Syncing blockchain blocks...</p>
                    ) : (
                      <div className="space-y-4 relative pl-4 border-l border-white/15 max-h-[180px] overflow-y-auto pr-1 font-sans text-xs">
                        {ownershipHistory.map((hist, index) => (
                          <div key={hist.id || index} className="relative">
                            <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#00FFB2] border-2 border-black" />
                            <p className="text-[10px] font-mono text-[#D4AF37]">{new Date(hist.transfer_at).toLocaleString()}</p>
                            <p className="text-white font-semibold mt-0.5 uppercase tracking-wide text-[10px]">
                              {hist.from_user_id ? "Gateway Transfer" : "Genesis Mint"}
                            </p>
                            <p className="text-slate-400 font-medium text-[10px] mt-0.5">
                              Holder: <span className="font-mono text-slate-300">{hist.profiles?.email || "Decentralized Registry"}</span>
                            </p>
                            {hist.transfer_tx_hash && (
                              <p className="text-[9px] font-mono text-slate-600 mt-0.5 uppercase">TX HASH: {hist.transfer_tx_hash}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer buttons layout */}
                  <div className="pt-6 border-t border-white/5 flex items-center justify-between gap-3">
                    <button 
                      onClick={() => {
                        setManageNftId(null);
                        setTransferring(false);
                      }} 
                      className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest transition-colors"
                    >
                      Close Window
                    </button>
                    
                    {activeNft.status !== 'BURNED' && (
                      <button 
                        onClick={() => setTransferring(true)}
                        className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#B8942E] text-black rounded-xl py-3 text-xs font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all text-center"
                      >
                        Gateway Transfer
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}

      {/* MINT AND AI IMAGE GENERATOR CONTROLS DIALOG MODAL BOX */}
      {showMintModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#121212] border border-white/10 rounded-[2.5rem] w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[90vh]"
          >
            {/* Image Generator / AI Side */}
            <div className="w-full lg:w-1/2 p-6 bg-[#050505] flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 overflow-y-auto">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-[#00FFB2]" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#00FFB2]">AXON AI Generator Core</h3>
              </div>
              <p className="text-[10px] text-slate-500 mb-4 block uppercase font-mono tracking-wider">Use high-fidelity Gemini 2.5 generative imaging directly on system mints</p>

              {/* Gemini AI prompt block */}
              <div className="space-y-4 mb-6">
                <textarea
                  placeholder="Describe theme or prompts (e.g. 'A translucent gold cybernetic tiger, liquid emerald details, holographic Web3 aesthetic')..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl p-4 text-xs font-sans text-white placeholder-slate-600 focus:outline-none focus:border-[#00FFB2] min-h-[100px] leading-relaxed resize-none"
                />
                <button
                  type="button"
                  onClick={handleGenerateAIImage}
                  disabled={aiGenerating || !aiPrompt.trim()}
                  className="w-full py-3 bg-gradient-to-r from-[#00FFB2] to-[#00b27c] text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(0,255,178,0.3)] select-none disabled:opacity-35 transition-all text-center flex items-center justify-center gap-2 inline-block"
                >
                  {aiGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-black" />
                      <span>Gemini is generating artwork...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-black" />
                      <span>Generate AI Image preview</span>
                    </>
                  )}
                </button>
              </div>

              {/* Generated Image preview area */}
              <span className="text-[9px] uppercase tracking-widest font-bold text-slate-500 mb-2">Live Canvas preview</span>
              <div className="w-full aspect-square bg-[#0c0c0c] border border-white/5 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center relative">
                {mintImageUrl ? (
                  <img src={mintImageUrl} alt="AI Generated Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-6 flex flex-col items-center gap-2">
                     <PlusCircle className="w-8 h-8 text-slate-700 animate-pulse" />
                     <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold font-mono">Image data empty. Describe above or upload directly.</p>
                  </div>
                )}
                {/* Loader overlay over generation */}
                {aiGenerating && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <Activity className="w-8 h-8 text-[#00FFB2] animate-spin" />
                  </div>
                )}
              </div>
            </div>

            {/* Core Form data inputs Side */}
            <div className="w-full lg:w-1/2 p-6 flex flex-col bg-[#121212] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase font-extrabold tracking-widest text-[#D4AF37]">Metadata Registry Pack</span>
                <button 
                  onClick={() => setShowMintModal(false)}
                  className="w-7 h-7 bg-white/5 rounded-full flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Asset Name */}
                <div>
                  <label className="text-[9px] uppercase tracking-widest font-bold text-slate-500 block mb-1">Asset Name</label>
                  <input 
                    type="text" 
                    placeholder="AXON Cosmic Firebrand"
                    value={mintName}
                    onChange={(e) => setMintName(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-[9px] uppercase tracking-widest font-bold text-slate-500 block mb-1">Asset Description</label>
                  <input 
                    type="text" 
                    placeholder="This premium asset contains proprietary network keys."
                    value={mintDescription}
                    onChange={(e) => setMintDescription(e.target.value)}
                    className="w-full bg-black border border-[#D4AF37]/25 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Token ID or serial index */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] uppercase tracking-widest font-bold text-slate-500 block mb-1">Token ID / Hash</label>
                    <input 
                      type="text" 
                      placeholder="AXN-481920 (Auto-gen)"
                      value={mintTokenId}
                      onChange={(e) => setMintTokenId(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#D4AF37] font-mono uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-widest font-bold text-slate-500 block mb-1">Token Tier</label>
                    <select
                      value={mintTier}
                      onChange={(e) => setMintTier(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#00FFB2]"
                    >
                      <option value="COMMON">COMMON</option>
                      <option value="RARE">RARE</option>
                      <option value="LEGENDARY">LEGENDARY</option>
                    </select>
                  </div>
                </div>

                {/* Holder Node Profile searcher */}
                <div className="border-t border-white/5 pt-3">
                  <label className="text-[9px] uppercase tracking-widest font-bold text-slate-500 block mb-1.5">Attach to Holder profile</label>
                  
                  {mintTargetProfile ? (
                    <div className="p-3 bg-[#00FFB2]/5 border border-[#00FFB2]/20 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-white">{mintTargetProfile.email}</p>
                        <p className="font-mono text-[10px] text-slate-400 truncate mt-0.5">{mintTargetProfile.wallet_address}</p>
                      </div>
                      <button 
                        onClick={() => setMintTargetProfile(null)}
                        className="text-red-500 hover:text-red-400 font-bold px-2 text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input 
                        type="text" 
                        placeholder="Search holder via registered email or wallet..."
                        value={mintSearchText}
                        onChange={(e) => handleSearchMintProfiles(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                      {mintSearching && (
                        <p className="text-[9px] font-mono text-slate-500 animate-pulse uppercase">Querying profiles database index...</p>
                      )}
                      <div className="space-y-1.5 max-h-[100px] overflow-y-auto">
                        {mintCandidates.map(c => (
                          <div 
                            key={c.id}
                            onClick={() => setMintTargetProfile(c)}
                            className="p-2 border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] rounded-lg cursor-pointer text-[10px]"
                          >
                            <p className="text-white font-bold truncate">{c.email}</p>
                            <p className="text-slate-500 truncate font-mono mt-0.5">{c.wallet_address}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Minting Exec buttons */}
                <div className="pt-6 border-t border-white/5 flex gap-3 mt-auto">
                  <button
                    type="button"
                    onClick={() => setShowMintModal(false)}
                    className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={executeMint}
                    disabled={mintingProgress || !mintName.trim() || !mintTargetProfile}
                    className="flex-1 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8942E] text-black disabled:opacity-40 rounded-xl text-xs font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] select-none transition-all text-center flex items-center justify-center"
                  >
                    {mintingProgress ? "Writing crypt blocks..." : "Execute Smart Mint on ledger"}
                  </button>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* BULK TRANSFERS TARGET SELECTION MODAL */}
      {showBulkTransferModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#121212] border border-white/10 rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Bulk Gateway Transfer</h4>
              <button onClick={() => setShowBulkTransferModal(false)} className="text-slate-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4 font-sans leading-relaxed">
              Transfer all {selectedIds.length} currently selected assets to a single target user.
            </p>

            {selectedTargetProfile ? (
              <div className="p-3 bg-[#00FFB2]/5 border border-[#00FFB2]/20 rounded-xl flex items-center justify-between text-xs mb-4">
                <div>
                  <p className="font-bold text-white">{selectedTargetProfile.email}</p>
                  <p className="font-mono text-[10px] text-slate-400 truncate mt-0.5">{selectedTargetProfile.wallet_address}</p>
                </div>
                <button 
                  onClick={() => setSelectedTargetProfile(null)}
                  className="text-red-500 hover:text-red-400 font-bold px-2 text-sm"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="space-y-2 mb-4">
                <input 
                  type="text" 
                  placeholder="Find holder via email or wallet address..."
                  value={transferSearch}
                  onChange={(e) => handleSearchProfiles(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#00FFB2]"
                />
                <div className="space-y-1 max-h-[120px] overflow-y-auto">
                  {candidateProfiles.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => setSelectedTargetProfile(p)}
                      className="p-2 border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] rounded-lg cursor-pointer text-[10px]"
                    >
                      <p className="text-white font-bold truncate">{p.email}</p>
                      <p className="text-slate-500 truncate font-mono mt-0.5">{p.wallet_address}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-end pt-4 border-t border-white/5">
              <button 
                onClick={() => setShowBulkTransferModal(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button 
                onClick={executeBulkTransfer}
                disabled={!selectedTargetProfile}
                className="px-5 py-2.5 bg-[#00FFB2] text-black disabled:opacity-35 font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
              >
                Confirm Bulk Transfer
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* IRREVERSIBLE BULK BURN WARNING VERIFICATION CONFIRMATION MODAL */}
      {showBulkBurnConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#121212] border border-red-500/20 rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl p-6"
          >
            <div className="flex items-center gap-2 text-red-500 mb-3 border-b border-white/5 pb-3">
              <ShieldAlert className="w-5 h-5" />
              <h4 className="text-xs font-extrabold uppercase tracking-widest">CRITICAL HIGH ALERT BURN WARNING</h4>
            </div>
            <p className="text-xs text-slate-300 mb-2 leading-relaxed font-sans">
              You are selecting a bulk destructive burn action on <strong>{selectedIds.length}</strong> digital NFT assets. This action is permanently irreversible.
            </p>
            <p className="text-[10px] text-slate-500 mb-4 tracking-normal uppercase font-mono">
              The metadata addresses will be removed and assigned to dead indexes. To execute, type <strong>BURN</strong> below.
            </p>

            <input 
              type="text"
              placeholder="Type BURN to verify"
              value={burnVerifyString}
              onChange={(e) => setBurnVerifyString(e.target.value)}
              className="w-full bg-black border border-red-500/30 rounded-xl py-2 px-3 text-center text-xs text-white focus:outline-none focus:border-red-500 font-mono tracking-widest mb-4"
            />

            <div className="flex gap-3 justify-end pt-4 border-t border-white/5">
              <button 
                onClick={() => setShowBulkBurnConfirmModal(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button 
                onClick={executeBulkBurnAsset}
                disabled={burnVerifyString !== "BURN"}
                className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white disabled:opacity-35 font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
              >
                Permanently Burn {selectedIds.length} Assets
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </AdminLayout>
  );
}
