"use client";
import React from 'react';
import Image from 'next/image';
import { Star, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

const SHOWCASE_NFTS = [
  { id: 1, name: "AXON Cybernetic Core #108", price: "0.88 BNB", tier: "Archon", rarity: "Legendary", image: "https://picsum.photos/seed/cyber-core/1024/1024" },
  { id: 2, name: "Neon Sovereign Helm v2", price: "0.42 BNB", tier: "Sentinel", rarity: "Epic", image: "https://picsum.photos/seed/cyber-helm/1024/1024" },
  { id: 3, name: "Starlight Decryptor Block", price: "0.19 BNB", tier: "Starter", rarity: "Rare", image: "https://picsum.photos/seed/cyber-decryptor/1024/1024" },
  { id: 4, name: "Liquid Gold Matrix Cell", price: "1.50 BNB", tier: "Archon", rarity: "Mythic", image: "https://picsum.photos/seed/liquid-gold/1024/1024" }
];

export function NFTShowcase() {
  return (
    <section id="axon-showcase" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-16 gap-6 select-none">
          <div className="text-left">
            <span className="text-[10px] text-[#00FFB2] tracking-[0.3em] font-black uppercase block mb-3">LIMITED APEX COLLECTION</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">Sovereign NFT Artifacts</h2>
            <p className="text-sm text-zinc-400 mt-2 max-w-xl">
              Holding AXON collection assets guarantees high hardware co-mining allocations and immediate yield multipliers. Explore rare digital assets.
            </p>
          </div>
          
          <a
            href="#axon-execution"
            className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-extrabold text-xs uppercase tracking-widest border border-white/10 hover:border-[#00FFB2]/50 transition flex items-center gap-2"
          >
            Ecosystem Setup <Sparkles className="w-4 h-4 text-[#00FFB2]" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SHOWCASE_NFTS.map((nft) => (
            <div
              key={nft.id}
              className="rounded-[2.2rem] bg-[#121215] border border-white/5 p-4 hover:border-[#D4AF37]/40 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_15px_40px_rgba(212,175,55,0.08)] flex flex-col justify-between group/nft"
            >
              <div className="relative w-full aspect-square rounded-[1.8rem] overflow-hidden border border-white/5 mb-4">
                <Image
                  src={nft.image}
                  alt={nft.name}
                  fill
                  className="object-cover group-hover/nft:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex justify-between w-[calc(100%-24px)] pointer-events-none">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/70 text-white text-[8px] font-bold uppercase tracking-wider backdrop-blur-md">
                    {nft.rarity}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-[8px] font-black uppercase tracking-wider backdrop-blur-md border border-[#D4AF37]/30">
                    {nft.tier}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-extrabold text-zinc-100 uppercase truncate">{nft.name}</h3>
                <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
                  <div>
                    <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold block">Current Floor</span>
                    <span className="font-mono text-xs font-bold text-white">{nft.price}</span>
                  </div>
                  <button className="flex items-center justify-center p-2 rounded-lg bg-[#00FFB2]/10 hover:bg-[#00FFB2]/20 transition-colors">
                    <Star className="w-4 h-4 text-[#00FFB2]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
