"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { 
  Coins, Plus, Search, Sparkles, Filter, Info, Trash,
  Upload, Tag, Image as ImageIcon, Send, RefreshCcw, TrendingUp
} from "lucide-react";

interface NFTItem {
  id: string;
  name: string;
  tier: "Starter" | "Pro" | "Elite";
  minGas: string;
  valueEth: string;
  ownerWallet: string;
  imageSeed: string;
  mintedDate: string;
}

const INITIAL_NFTS: NFTItem[] = [
  { id: "#001", name: "Axon Genesis", tier: "Starter", minGas: "0.002", valueEth: "2.5 ETH", ownerWallet: "0x992...3a92", imageSeed: "genesis", mintedDate: "2026-05-01" },
  { id: "#042", name: "Axon Void", tier: "Starter", minGas: "0.001", valueEth: "1.8 ETH", ownerWallet: "0xf11...d3a0", imageSeed: "void", mintedDate: "2026-05-08" },
  { id: "#088", name: "Axon Lumina", tier: "Pro", minGas: "0.003", valueEth: "3.2 ETH", ownerWallet: "0xab1...8831", imageSeed: "lumina", mintedDate: "2026-05-12" },
  { id: "#102", name: "Axon Nebula", tier: "Elite", minGas: "0.005", valueEth: "5.0 ETH", ownerWallet: "0x44c...22bf", imageSeed: "nebula", mintedDate: "2026-05-18" },
  { id: "#210", name: "Axon Chronos", tier: "Elite", minGas: "0.006", valueEth: "7.2 ETH", ownerWallet: "0x98f...aa91", imageSeed: "chronos", mintedDate: "2026-05-20" },
];

export default function NftAdmin() {
  const [nfts, setNfts] = useState<NFTItem[]>(INITIAL_NFTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTier, setFilterTier] = useState<string>("ALL");
  const [alertMsg, setAlertMsg] = useState("");

  // Mint Form State
  const [newNftName, setNewNftName] = useState("");
  const [newNftTier, setNewNftTier] = useState<"Starter" | "Pro" | "Elite">("Starter");
  const [newNftVal, setNewNftVal] = useState("1.5");
  const [newNftGas, setNewNftGas] = useState("0.002");
  const [newNftOwner, setNewNftOwner] = useState("0x7bbc...db9a");

  const handleMintNft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNftName) return;

    const newId = `#${Math.floor(100 + Math.random() * 900)}`;
    const freshItem: NFTItem = {
      id: newId,
      name: newNftName,
      tier: newNftTier,
      minGas: newNftGas,
      valueEth: `${newNftVal} ETH`,
      ownerWallet: newNftOwner,
      imageSeed: newNftName.toLowerCase().replace(/\s/g, ""),
      mintedDate: new Date().toISOString().slice(0, 10)
    };

    setNfts([freshItem, ...nfts]);
    setAlertMsg(`Cryptographic contract deployed! Minted "${newNftName}" with Token ID ${newId}.`);
    setNewNftName("");
  };

  const handleBurnNft = (id: string) => {
    setNfts(prev => prev.filter(item => item.id !== id));
    setAlertMsg(`Triggered contract BURN command. Token ${id} destroyed from ledger indexes.`);
  };

  const filteredNfts = nfts.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.includes(searchTerm);
    const matchesTier = filterTier === "ALL" || item.tier === filterTier;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <span className="p-1 px-3 text-[10px] bg-[#00FFB2]/10 border border-[#00FFB2]/40 text-[#00FFB2] rounded-full font-mono uppercase tracking-widest font-bold">
            NFT SYSTEM CONTROLLER
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FFB2] animate-pulse" />
        </div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white mt-1">
          Smart Contract & <span className="text-gradient-emerald">NFT</span> Minters
        </h1>
        <p className="text-xs text-gray-500 font-mono mt-0.5">
          Release new collections, view floor limits, and burn unauthorized iterations.
        </p>
      </div>

      {alertMsg && (
        <div className="p-3.5 bg-[#00FFB2]/10 border border-[#00FFB2]/30 text-[#00FFB2] rounded-xl text-xs font-mono flex items-center justify-between">
          <span>{alertMsg}</span>
          <button onClick={() => setAlertMsg("")} className="text-gray-400 hover:text-white uppercase text-[10px]">Dismiss</button>
        </div>
      )}

      {/* Grid structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form: Deploy / Mint */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard className="p-6 border-white/5 bg-white/[0.01]/10" hoverEffect={false}>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Core contract Minter
            </h3>
            
            <form onSubmit={handleMintNft} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono tracking-wider text-gray-400 uppercase mb-1">Asset Token Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Axon Overlord"
                  value={newNftName}
                  onChange={(e) => setNewNftName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00FFB2]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono tracking-wider text-gray-400 uppercase mb-1">Staking Tier</label>
                  <select
                    value={newNftTier}
                    onChange={(e) => setNewNftTier(e.target.value as any)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-400 focus:outline-none focus:border-[#00FFB2]"
                  >
                    <option value="Starter">Starter</option>
                    <option value="Pro">Pro</option>
                    <option value="Elite">Elite</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-wider text-gray-400 uppercase mb-1">Price Value (ETH)</label>
                  <input 
                    type="number"
                    step="0.01"
                    required
                    value={newNftVal}
                    onChange={(e) => setNewNftVal(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00FFB2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono tracking-wider text-gray-400 uppercase mb-1">Gas Threshold (ETH)</label>
                  <input 
                    type="text"
                    required
                    value={newNftGas}
                    onChange={(e) => setNewNftGas(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-wider text-gray-400 uppercase mb-1">Target Holder Wallet</label>
                  <input 
                    type="text"
                    required
                    value={newNftOwner}
                    onChange={(e) => setNewNftOwner(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <GlowButton type="submit" className="w-full py-2.5 text-xs font-semibold">
                Mint Token Bundle
              </GlowButton>
            </form>
          </GlassCard>

          {/* Quick Metrics */}
          <GlassCard className="p-6 border-white/5" hoverEffect={false}>
            <h4 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-3">DEPLOYED CONTRACT METRICS</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-gray-500">Contract Class:</span>
                <span className="text-white">ERC-721A (Gas Efficient)</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-gray-500">Floor Index:</span>
                <span className="text-[#00FFB2]">1.8 ETH</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-gray-500">Total volume traded:</span>
                <span className="text-[#D4AF37]">4,103.25 ETH</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Tab: NFTs List */}
        <div className="lg:col-span-7 space-y-6">
          <GlassCard className="p-6 border-white/5" hoverEffect={false}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                <input 
                  type="text"
                  placeholder="Search token metadata..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#00FFB2]"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filterTier}
                  onChange={(e) => setFilterTier(e.target.value)}
                  className="bg-black/60 border border-white/10 rounded-full px-3 py-1.5 text-xs text-gray-400 focus:outline-none"
                >
                  <option value="ALL">All Tiers</option>
                  <option value="Starter">Starter</option>
                  <option value="Pro">Pro</option>
                  <option value="Elite">Elite</option>
                </select>
              </div>
            </div>

            {/* List */}
            <div className="space-y-4">
              {filteredNfts.map((item) => (
                <div key={item.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:border-[#00FFB2]/20 hover:bg-white/[0.02] flex items-center justify-between gap-4 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00FFB2]/20 to-[#D4AF37]/20 flex items-center justify-center border border-white/10 text-[#00FFB2]">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white font-display">{item.name}</span>
                        <span className="text-[10px] font-mono text-gray-500">{item.id}</span>
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono mt-1">
                        Holder: <span className="text-gray-300 font-bold select-all">{item.ownerWallet}</span> | Gas: <span className="text-[#00FFB2]">{item.minGas} ETH</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-xs font-bold text-[#D4AF37] font-mono">{item.valueEth}</div>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                        item.tier === "Elite" ? "bg-purple-500/10 text-purple-400" :
                        item.tier === "Pro" ? "bg-[#D4AF37]/10 text-[#D4AF37]" :
                        "bg-blue-500/10 text-blue-400"
                      }`}>
                        {item.tier}
                      </span>
                    </div>

                    <button 
                      onClick={() => handleBurnNft(item.id)}
                      className="p-2 border border-red-500/20 hover:border-red-500 text-red-400 hover:bg-red-500/10 hover:text-white rounded-lg transition-colors cursor-pointer"
                      title="Destroy Token"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
}
