"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { PlanSlider } from "@/components/sections/PlanSlider";
import { NFTShowcase } from "@/components/sections/NFTShowcase";
import { StatsSection } from "@/components/sections/StatsSection";
import {
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Fingerprint,
  Users,
  Award,
  TrendingUp,
  Layers,
  Cpu,
  History,
  Sparkles,
  Check,
  Globe,
  Activity,
  Wallet,
  Coins,
  ArrowRight,
  Database,
  Lock,
  ExternalLink,
  Info,
  Play,
  X,
  RefreshCw,
  Clock,
  Zap,
  Star
} from "lucide-react";



// Tech stack / Features
const TECH_FEATURES = [
  {
    icon: ShieldCheck,
    title: "Sovereign Proof Protection",
    desc: "Every asset is cryptographically ring-fenced beneath multi-layer validation layers securing immediate payouts securely."
  },
  {
    icon: Cpu,
    title: "100% GPU-Optimized Yields",
    desc: "Automated distributed hardware mining pools channel passive coin rewards directly back to your secure vaults."
  },
  {
    icon: Coins,
    title: "Instant Liquidity Peg",
    desc: "No locked periods. Trade, withdraw, or transition tiers inside seconds with zero liquid stress."
  },
  {
    icon: Database,
    title: "Supabase Hardened Storage",
    desc: "Isolated real-time ledger channels protect system records and audit integrity flawlessly."
  },
  {
    icon: Star,
    title: "Exclusive Alpha Perks",
    desc: "Holding Axon NFTs guarantees premium invitations, hardware pre-releases, and VIP community access."
  },
  {
    icon: Lock,
    title: "Multi-Signature Relays",
    desc: "Protected through distributed consensus key gates. No single point of breach exists."
  }
];

// Roadmap phases
const ROADMAP = [
  {
    phase: "Phase 1: Foundations",
    title: "Genesis Sovereign Mint",
    status: "Completed",
    date: "Q1 2026",
    desc: "Deploy core protocol structures, launch standard free claim genesis tier, and secure first wave audits across multi-node chains.",
    checkmarks: ["Smart contract security audits complete", "Genesis Plan deployment live", "Launch of Community Whitelist portal"]
  },
  {
    phase: "Phase 2: Acceleration",
    title: "Sliding Smart Catalogs",
    status: "Active Block",
    date: "Q2 2026 (Current)",
    desc: "Execute Pro Sentinels expansion, rollout physical luxury items mapping, and implement decentralized staking multipliers with 120fps client nodes.",
    checkmarks: ["Apple WidgetKit sliding catalogs system", "Hardware cold storage vaults mapped", "First 3,000 active stakers registered"]
  },
  {
    phase: "Phase 3: Integration",
    title: "Cross-Chain Quantum Bridge",
    status: "Next Stage",
    date: "Q3 2026",
    desc: "Bridge gas efficiencies from BNB Chain towards Base and Ethereum mainnets. Enable cross-tier pooling nodes with micro gas fee optimization.",
    checkmarks: ["Deploy cross-protocol asset bridge", "AXON liquidity allocation index start", "Automated Telegram command gateway live"]
  },
  {
    phase: "Phase 4: Sovereign DAO",
    title: "Absolute Autonomous Estate",
    status: "Scheduled",
    date: "Q4 2026",
    desc: "Full decentralization shift. Stakers gain algorithmic co-creator parameters to vote rewards weights and platform treasury allocations directly.",
    checkmarks: ["Passcode-governed voting structures live", "Fully community-owned treasury delegation", "Launch of exclusive high-yield physical cards"]
  }
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [activePlanIdx, setActivePlanIdx] = useState(1); // Default center (Neon Sentinel)
  const [autoplay, setAutoplay] = useState(true);
  
  // Live Counter state variables
  const [mintedCount, setMintedCount] = useState(12480);
  const [activeUsers, setActiveUsers] = useState(4821);
  const [totalYieldUSD, setTotalYieldUSD] = useState(32481050.25);

  // Whitelist email validator state
  const [emailInput, setEmailInput] = useState("");
  const [whitelistSuccess, setWhitelistSuccess] = useState(false);
  const [whitelistLoading, setWhitelistLoading] = useState(false);
  const [whitelistError, setWhitelistError] = useState("");

  // Roadmap active expander index
  const [expandedRoadmapIdx, setExpandedRoadmapIdx] = useState<number | null>(1); // Phase 2 open by default

  // References for drag/swipe calculations
  const sliderRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const isDragging = useRef(false);

  // Prevent Next.js hydration anomalies
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => {
      if (typeof window !== "undefined") {
        cancelAnimationFrame(handle);
      }
    };
  }, []);

  // Sync cursor coordinates for real-time backdrop hover tracking
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mounted) return;
    const { clientX, clientY } = e;
    setCursorPos({ x: clientX, y: clientY });
  };

  // Autoplay loop timer for Plans Slider
  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(() => {
      setActivePlanIdx((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(interval);
  }, [autoplay]);

  // Live transaction mining counter increments ticking up statefully
  useEffect(() => {
    const counterInterval = setInterval(() => {
      // Tick total yield slightly to simulate active mining transactions
      setTotalYieldUSD((prev) => prev + Number((Math.random() * 1.5).toFixed(2)));
      // Occasional new user increase
      if (Math.random() > 0.85) {
        setActiveUsers((prev) => prev + 1);
      }
      // Occasional new mint
      if (Math.random() > 0.95) {
        setMintedCount((prev) => (prev < 15000 ? prev + 1 : 12480));
      }
    }, 2800);
    return () => clearInterval(counterInterval);
  }, []);

  // Whitelist Submission Sequence
  const handleSubmitWhitelist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.includes("@")) {
      setWhitelistError("Please specify a valid operational endpoint.");
      return;
    }
    setWhitelistError("");
    setWhitelistLoading(true);
    setTimeout(() => {
      setWhitelistLoading(false);
      setWhitelistSuccess(true);
      setEmailInput("");
    }, 1500);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center font-mono text-xs uppercase tracking-[0.2em] text-[#00FFB2]">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-5 h-5 animate-spin duration-3000" />
          <span>Hydrating Sovereign Core Assets...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-[#050505] text-[#F3F4F6] font-sans selection:bg-[#00FFB2] selection:text-black overflow-x-hidden relative"
      id="axon-master-wrapper"
    >
      {/* 3-LAYER VISUAL DEPTH SYSTEM */}

      {/* BACKGROUND LAYER: Animated Radial Glow Backdrops + Texture overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Cursor tracking halo lighting backing card surfaces */}
        <div
          className="absolute w-[500px] h-[500px] rounded-full mix-blend-screen opacity-[0.12] blur-[120px] transition-transform duration-200 pointer-events-none hidden md:block"
          style={{
            background: "radial-gradient(circle, #00FFB2 0%, transparent 70%)",
            left: cursorPos.x - 250,
            top: cursorPos.y - 250,
            transform: "translate3d(0, 0, 0)"
          }}
        />

        {/* Global Ambient Plasma shifting blooms */}
        <div className="absolute top-[-10%] right-[-10%] w-[900px] h-[900px] bg-[#D4AF37]/5 rounded-full blur-[200px] animate-pulse duration-[12000ms] mix-blend-screen" />
        <div className="absolute bottom-[10%] left-[-15%] w-[800px] h-[800px] bg-[#00FFB2]/5 rounded-full blur-[180px] animate-pulse duration-[9000ms] mix-blend-screen" />
        <div className="absolute top-[40%] right-[15%] w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px] mix-blend-screen" />

        {/* Apple-level noise texture mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(#111111_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
      </div>

      {/* MID LAYER CONTAINER with Parallax scroll grids and flow paths */}

      {/* FOREGROUND LAYER containing Glass UI components (Everything interactive) */}

      {/* ELEGANT NAVIGATION BAR */}
      <nav id="axon-nav" className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-[#050505]/70 backdrop-blur-2xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Brand Logo & Tag */}
          <div className="flex items-center gap-3 select-none">
            <div className="w-10 h-10 bg-gradient-to-br from-[#121212] to-[#1a1a1a] rounded-xl overflow-hidden border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,178,0.15)] relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00FFB2]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-[#00FFB2] font-mono text-xl font-black italic tracking-tighter">A</div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-white leading-none">
                AXON
              </span>
              <span className="text-[9px] text-[#00FFB2] tracking-[0.3em] font-bold uppercase leading-none mt-1">
                DIGITAL NFTs
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <div className="hidden lg:flex items-center space-x-8 text-xs font-semibold tracking-widest uppercase text-slate-400">
            <a href="#axon-features" className="hover:text-white hover:shadow-[0_2px_0_#00FFB2] py-2 transition-all">About Ecosystem</a>
            <a href="#axon-plans" className="hover:text-white hover:shadow-[0_2px_0_#00FFB2] py-2 transition-all">Smart Catalogs</a>
            <a href="#axon-showcase" className="hover:text-white hover:shadow-[0_2px_0_#00FFB2] py-2 transition-all">NFT Collection</a>
            <a href="#axon-roadmap" className="hover:text-white hover:shadow-[0_2px_0_#00FFB2] py-2 transition-all">Launch Roadmap</a>
          </div>

          {/* Web3 Trigger Nodes & Admin Portal Gate */}
          <div className="flex items-center gap-4 relative">
            <a
              href="/admin/login"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] uppercase tracking-widest font-bold text-slate-500 hover:text-white transition-colors flex items-center gap-1.5 py-2"
              title="Enter Administrator Dashboard Pipeline"
            >
              <Fingerprint className="w-3.5 h-3.5 text-slate-500 hover:text-[#00FFB2] transition-colors" />
              <span className="hidden sm:inline">Portal Control</span>
            </a>

            <a
              href="#axon-plans"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8942E] text-black font-extrabold text-xs uppercase tracking-wider hover:scale-[1.03] active:scale-[0.98] transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] flex items-center gap-1.5"
            >
              <Wallet className="w-3.5 h-3.5 text-black" /> Explore Catalogs
            </a>
          </div>
        </div>
      </nav>

      {/* 1. HERO SECTION (Full Viewport Height with Multi-Layer Glow and Interactive Floating Assets) */}
      <section id="axon-hero" className="relative min-h-screen flex items-center pt-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10 w-full">
          
          {/* Call to action & Elite Headers */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Live Indicator Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 hover:border-[#00FFB2]/30 transition">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#00FFB2] animate-pulse shadow-[0_0_10px_#00FFB2]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#00FFB2]">
                V6.9 SOVEREIGN BLOCKCHAIN CORE LIVE
              </span>
            </div>

            {/* Premium Typography Heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-white">
              Own the Future <br /> of{" "}
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-yellow-200 to-[#00FFB2] pr-4">
                Digital Wealth
                <span className="absolute left-0 bottom-1 w-full h-[6px] bg-gradient-to-r from-[#D4AF37] to-[#00FFB2] blur-[4px] opacity-30" />
              </span>
            </h1>

            {/* Explanatory description */}
            <p className="text-base sm:text-lg text-slate-400 mt-6 max-w-xl leading-relaxed">
              Unlock peerless Web3 collectibles engineered with integrated automatic yields. Channel decentralized gold standard pipelines with institutional grade sovereign protection, liquid escrow, and 120fps client nodes.
            </p>

            {/* CTA action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto">
              <a
                href="#axon-plans"
                className="px-8 py-4 rounded-full bg-white text-black font-extrabold text-sm uppercase tracking-wider hover:scale-[1.04] transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(255,255,255,0.15)] group"
              >
                Access Smart Catalogs 
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#axon-execution"
                className="px-8 py-4 rounded-full bg-[#101014] border border-white/10 text-white font-extrabold text-sm uppercase tracking-wider hover:bg-white/5 hover:border-white/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                Protocol Steps <Sparkles className="w-4 h-4 text-[#00FFB2]" />
              </a>
            </div>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 border-t border-white/10 pt-10 mt-12 w-full max-w-2xl select-none">
              <div className="space-y-1">
                <span className="text-[10px] tracking-widest uppercase text-zinc-500 font-bold block">Consensus Audit</span>
                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#00FFB2]" /> 100% Certified
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] tracking-widest uppercase text-zinc-500 font-bold block">Network Security</span>
                <span className="text-sm font-bold text-white">Multi-Sig Relays</span>
              </div>
              <div className="hidden md:block space-y-1">
                <span className="text-[10px] tracking-widest uppercase text-zinc-500 font-bold block">Daily Liquidity</span>
                <span className="text-sm font-bold text-[#D4AF37]">Unrestricted</span>
              </div>
            </div>
          </div>

          {/* Floating interactive 3D NFT showcase card right-side */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Visual Backlight */}
            <div className="absolute w-[350px] h-[350px] bg-[#00FFB2]/15 blur-[80px] rounded-full z-0 top-1/4"></div>
            <div className="absolute w-[300px] h-[300px] bg-[#D4AF37]/10 blur-[80px] rounded-full z-0 bottom-1/4"></div>

            {/* Multi-layered Glass Card with subtle up-down float */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative w-full max-w-[380px] aspect-[4/5] rounded-[2.5rem] bg-[#121215]/80 backdrop-blur-xl border border-white/15 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.8)] z-10 overflow-hidden group/card hover:border-[#00FFB2]/30 transition-all duration-500"
            >
              {/* Glass reflection sheen */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#00FFB2]/5 via-transparent to-[#D4AF37]/5 pointer-events-none" />

              <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden border border-white/10 mb-5">
                <Image
                  src="https://picsum.photos/seed/cyber-apex/800/800"
                  alt="AXON Overload Genesis Apex"
                  fill
                  className="object-cover group-hover/card:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                {/* Custom glowing floating badge */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/15 backdrop-blur-md">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00FFB2] animate-ping" />
                  <span className="text-[9px] font-black uppercase tracking-wider text-[#00FFB2]">LIVE STAKING YIELD</span>
                </div>
              </div>

              {/* Text metadata stack */}
              <div className="space-y-2 select-none">
                <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                  <span>Serial: #0001 APEX</span>
                  <span className="text-[#D4AF37] flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-[#D4AF37]" /> Core Rarity
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white leading-tight">AXON Sovereign Archon Core</h3>
                <div className="flex justify-between items-center bg-[#09090C]/90 p-3 rounded-2xl border border-white/5 mt-4">
                  <div>
                    <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold block">Sovereign Floor Price</span>
                    <span className="font-mono text-sm font-bold text-white">4.85 BNB (Staked)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] text-[#00FFB2] uppercase tracking-widest font-bold block">Multiplier</span>
                    <span className="font-mono text-sm font-black text-[#00FFB2]">+12.4% APR</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      <PlanSlider />

      {/* 3. ABOUT / WHAT IS AXON DIGITAL NETWORKS */}
      <section id="axon-about" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual left stats card metrics stack */}
            <div className="lg:col-span-5 space-y-6 relative">
              <div className="absolute w-[300px] h-[300px] bg-sky-500/10 blur-[90px] rounded-full z-0 top-1/4 -left-12" />

              <div className="p-8 rounded-[2.5rem] bg-[#121215]/60 border border-white/5 backdrop-blur-xl relative z-10 space-y-6 select-none shadow-2xl">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#00FFB2] block">LEDGER INTEGRITY</span>
                <h3 className="text-xl font-bold text-white">Consensus Staking Yield Matrix</h3>
                
                <p className="text-xs text-zinc-400 leading-relaxed">
                  AXON utilizes liquid proof consensus protocols designed to map validator yields directly onto custom non-fungible contract assets automatically.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                    <span className="text-zinc-500">Yield Compounding Status</span>
                    <span className="text-[#00FFB2] font-mono font-bold flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5" /> SECURE BLOCK
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                    <span className="text-zinc-500">Staking Release Escrow</span>
                    <span className="text-white font-mono font-bold">Uncapped Liquid</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">BNB Chain Contract Address</span>
                    <span className="text-zinc-400 font-mono text-[9px] bg-black/60 px-2 py-1 rounded border border-white/5">0xAxon...6969</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Explanation descriptive stack right */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="text-[10px] text-[#00FFB2] tracking-[0.3em] font-black uppercase block">THE NEW GOLD STANDARD</span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none mb-4">
                Redefining Yield Mechanics <br />
                With Liquid Luxury Assets.
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
                Axon bridges high-octane decentralized mining yields with collectible premium rarity. You aren&apos;t just buying static visual NFTs; you are securing fractional hardware lease nodes driving active daily crypto revenues straight into your linked wallet continuously.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition">
                  <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                    <History className="w-5 h-5 text-[#D4AF37]" /> Historical Floor ROI
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Sustained 4-year standard track record capturing yield flows during variable market waves stably.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition">
                  <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-[#00FFB2]" /> Institutional Custody
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Distributed ledger nodes maintain multi-signature smart safeguards ensuring zero single nodes compromise.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. FEATURES BENTO GRID SYSTEM */}
      <section id="axon-features" className="py-24 bg-[#09090C] border-t border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Bento header */}
          <div className="text-center max-w-2xl mx-auto mb-16 select-none">
            <span className="text-[10px] text-[#D4AF37] tracking-[0.3em] font-black uppercase block mb-3">STATE-GRADE INFRASTRUCTURE</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              Sovereign Ledger Mechanics
            </h2>
            <p className="text-sm text-zinc-400 mt-2">
              Our advanced node technology matches high-speed crypto operations with stunning visual interfaces.
            </p>
          </div>

          {/* Grid implementation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TECH_FEATURES.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <div
                  key={index}
                  className="p-8 rounded-[2rem] bg-gradient-to-b from-[#121215] to-[#0A0A0C] border border-white/5 hover:border-[#00FFB2]/30 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_10px_30px_rgba(0,0FFB2,0.05)] relative overflow-hidden group/feat"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#00FFB2]/5 blur-3xl rounded-full group-hover/feat:bg-[#00FFB2]/10 transition-colors" />
                  
                  {/* Styled Icon */}
                  <div className="w-12 h-12 bg-[#00FFB2]/5 border border-[#00FFB2]/20 rounded-2xl flex items-center justify-center mb-6 shadow-[#00FFB2]/5 shadow-inner transition-colors group-hover/feat:border-[#00FFB2]/50 group-hover/feat:bg-[#00FFB2]/10">
                    <Icon className="w-6 h-6 text-[#00FFB2]" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3">{feat.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      <NFTShowcase />

      {/* 6. HOW IT WORKS SYSTEM */}
      <section id="axon-execution" className="py-24 bg-[#09090C] border-t border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16 select-none">
            <span className="text-[10px] text-[#00FFB2] tracking-[0.3em] font-black uppercase block mb-3">CONCURRENT SEQUENCE</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">Sovereign Acquisition Pathway</h2>
            <p className="text-sm text-zinc-400 mt-2">
              Follow these simple steps to integrate your decentralized validator matrix node.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
            
            {/* Visual connector lines on desktop */}
            <div className="absolute top-1/2 left-[12%] right-[12%] h-[1px] bg-gradient-to-r from-[#00FFB2]/20 via-[#D4AF37]/20 to-[#00FFB2]/20 hidden lg:block z-0" />

            {[
              {
                step: "01",
                label: "Secure Whitelist",
                desc: "Submit your operational email below to qualify your node for sovereign genesis drops."
              },
              {
                step: "02",
                label: "Choose Smart Catalog",
                desc: "Identify suitable yield multipliers based on scale parameters (Genesis, Neon Sentinel, Sovereign Archon)."
              },
              {
                step: "03",
                label: "Deploy Asset Vault",
                desc: "Mint secure non-fungible cryptographic keyframes, authorizing active hardware stake multipliers."
              },
              {
                step: "04",
                label: "Collect Daily Payouts",
                desc: "Validator fees compile ledger rewards statefully, streamable back to offline stashes instantly."
              }
            ].map((nodeObj, idx) => (
              <div
                key={idx}
                className="p-6 rounded-[2rem] bg-[#121215] border border-white/5 relative z-10 hover:border-[#00FFB2]/20 transition group"
              >
                <div className="absolute top-4 right-4 text-3xl font-mono font-black italic text-zinc-700/50 group-hover:text-[#00FFB2]/20 transition-colors">
                  {nodeObj.step}
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#00FFB2]/10 text-[#00FFB2] font-black text-sm flex items-center justify-center mb-6">
                  {idx + 1}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{nodeObj.label}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{nodeObj.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      <StatsSection />

      {/* 8. ROADMAP SECTION WITH EXPANDABLE PHASES */}
      <section id="axon-roadmap" className="py-24 relative overflow-hidden bg-[#09090C] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16 select-none">
            <span className="text-[10px] text-[#D4AF37] tracking-[0.3em] font-black uppercase block mb-3">SOVEREIGN EXPANSION SCHEDULER</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">Platform Strategic Timeline</h2>
            <p className="text-sm text-zinc-400 mt-2">
              Track AXON platform milestones, physical card integrations, and decentralized governance schedules. Click phases to inspect nodes.
            </p>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {ROADMAP.map((item, idx) => {
              const isExpanded = expandedRoadmapIdx === idx;
              return (
                <div
                  key={idx}
                  className={`border rounded-[2rem] overflow-hidden transition-all duration-300 ${
                    isExpanded
                      ? "border-[#00FFB2]/40 bg-[#121217] shadow-[0_10px_30px_rgba(0,255,178,0.05)]"
                      : "border-white/5 bg-[#121215]/30 hover:border-white/10"
                  }`}
                >
                  {/* Phase header trigger */}
                  <button
                    onClick={() => setExpandedRoadmapIdx(isExpanded ? null : idx)}
                    className="w-full text-left p-6 md:p-8 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1 min-w-0">
                      <span className="text-xs font-mono font-bold text-zinc-500 shrink-0">{item.date}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-zinc-400 shrink-0">{item.phase}</span>
                        <h3 className="text-base sm:text-lg font-bold text-white truncate">{item.title}</h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shrink-0 ${
                        item.status === "Completed"
                          ? "bg-[#00FFB2]/20 text-[#00FFB2]"
                          : item.status === "Active Block"
                          ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30"
                          : "bg-white/5 text-zinc-400"
                      }`}>
                        {item.status}
                      </span>
                      {isExpanded ? (
                        <div className="w-6 h-6 rounded-full bg-white/5 text-zinc-400 flex items-center justify-center">-</div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-white/5 text-zinc-400 flex items-center justify-center">+</div>
                      )}
                    </div>
                  </button>

                  {/* Expansion content */}
                  {isExpanded && (
                    <div className="p-6 md:p-8 pt-0 border-t border-white/5 text-left space-y-4">
                      <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">{item.desc}</p>
                      
                      <div className="space-y-2">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block">CHECKLIST TASKS</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {item.checkmarks.map((chk, cIdx) => (
                            <div key={cIdx} className="flex items-center gap-2 text-xs">
                              <Check className="w-4 h-4 text-[#00FFB2] shrink-0" />
                              <span className="text-zinc-300">{chk}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 9. Whitelist/CTA INTERACTIVE REGISTRATION CARD */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          
          <div className="absolute w-[300px] h-[300px] bg-[#00FFB2]/10 blur-[90px] rounded-full z-0 top-1/4 left-1/4" />

          {/* Luxury Opt-In Vault Card */}
          <div className="p-8 md:p-12 rounded-[3.5rem] bg-[#121215]/80 border border-white/10 backdrop-blur-3xl relative z-10 space-y-8 shadow-[0_30px_100px_rgba(0,0,0,0.6)]">
            
            <div className="space-y-3 max-w-xl mx-auto">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#00FFB2]/20 text-[#00FFB2] text-[9px] font-black uppercase tracking-wider border border-[#00FFB2]/30">
                EARLY PRIVILEGE ACCESS
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                Secure Your Whitelist Node
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Be notified first regarding localized Base node allocations, automatic yield drops, and high priority alpha allocations. Register your operational endpoint.
              </p>
            </div>

            {/* Input fields */}
            {!whitelistSuccess ? (
              <form onSubmit={handleSubmitWhitelist} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@destination.com"
                  className="flex-1 px-5 py-4 bg-black/60 border border-white/10 rounded-full text-white text-xs placeholder-zinc-500 outline-none focus:border-[#00FFB2] hover:border-white/20 transition-all font-semibold"
                  disabled={whitelistLoading}
                  required
                />
                <button
                  type="submit"
                  disabled={whitelistLoading}
                  className="px-6 py-4 bg-[#00FFB2] hover:bg-[#04D194] text-black font-extrabold text-xs uppercase tracking-widest rounded-full hover:scale-[1.03] active:scale-[0.97] transition-all shrink-0 flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,255,178,0.3)]"
                >
                  {whitelistLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <span>Deploy Whitelist</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md mx-auto p-5 rounded-2xl bg-[#00FFB2]/10 border border-[#00FFB2]/30 text-center"
              >
                <Check className="w-8 h-8 text-[#00FFB2] mx-auto mb-3" />
                <h4 className="text-base font-bold text-white mb-1">Authorization Successfully Seeded!</h4>
                <p className="text-xs text-zinc-400 leading-snug">
                  Your email has been flagged on AXON V6.9 core protocols. We will reach out when Base layer networks commence!
                </p>
              </motion.div>
            )}

            {whitelistError && (
              <p className="text-xs text-red-400 font-semibold">{whitelistError}</p>
            )}

          </div>
        </div>
      </section>

      {/* 10. PREMIUM ROADMAP & LEGAL BRANDED FOOTER */}
      <footer className="border-t border-white/5 py-16 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
          
          {/* Brand tag column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-neutral-900 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center shadow-md">
                <span className="text-[#00FFB2] font-mono text-base font-black italic">A</span>
              </div>
              <span className="text-base font-black tracking-tight text-white leading-none">
                AXON DIGITAL
              </span>
            </div>
            <p className="text-xs text-zinc-500 leading-normal">
              Premium non-fungible digital wealth mechanics powering high-yield automatic staking collections globally.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-[10px] text-[#00FFB2] tracking-widest font-black uppercase mb-4">Protocols</h4>
            <ul className="space-y-2 text-xs text-zinc-400 font-medium">
              <li><a href="#axon-features" className="hover:text-white transition-colors">Sovereign Proof Protection</a></li>
              <li><a href="#axon-plans" className="hover:text-white transition-colors">Yield Smart Catalogs</a></li>
              <li><a href="#axon-showcase" className="hover:text-white transition-colors">Alpha Allocations</a></li>
              <li><a href="/admin/login" target="_blank" className="hover:text-white transition-colors text-[#D4AF37]">Admin Gateway Node</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[10px] text-zinc-400 tracking-widest font-black uppercase mb-4">Integrations</h4>
            <ul className="space-y-2 text-xs text-zinc-400 font-medium">
              <li><a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">Supabase DB <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">Next.js Framework <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="https://react.dev" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">React 19 Core <ExternalLink className="w-3 h-3" /></a></li>
            </ul>
          </div>

          {/* License & Disclaimers */}
          <div className="space-y-3">
            <h4 className="text-[10px] text-zinc-400 tracking-widest font-black uppercase mb-4">Ledger Disclaimer</h4>
            <p className="text-[10px] text-zinc-600 leading-relaxed font-mono">
              The acquisition of digital collectibles carries risk. Ledger yields are mathematical calculations derived from distributed staking networks and do not guarantee flat values. All systems subject to BNB / Base consensus fees.
            </p>
          </div>

        </div>

        {/* Minimal baseline copyrights */}
        <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-10 mt-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-zinc-600">
          <p>© 2026 AXON DIGITAL NFTs. ALL CORE PROTOCOL INTEGRITY REGISTERED.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-400">Terms of Consensus</a>
            <a href="#" className="hover:text-slate-400">Sovereign Rules</a>
          </div>
        </div>
      </footer>

      {/* FLOATING QUICK DOCK TICKER AND CLAIM PANEL AT FOOTER (STICKY) */}
      <div className="fixed bottom-6 inset-x-0 z-40 px-6 pointer-events-none hidden md:block select-none">
        <div className="max-w-3xl mx-auto bg-black/80 backdrop-blur-3xl border border-white/10 rounded-full py-2.5 px-6 flex items-center justify-between pointer-events-auto shadow-2xl">
          
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-zinc-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#00FFB2] animate-pulse" />
              Gas:{" "}
              <strong className="text-white font-mono font-bold">12 Gwei</strong>
            </span>
            <span className="text-zinc-500">|</span>
            <span className="text-zinc-400 font-semibold">
              Active Users:{" "}
              <strong className="text-white font-mono font-bold">{activeUsers}</strong>
            </span>
            <span className="text-zinc-500">|</span>
            <span className="text-[#00FFB2] font-black uppercase tracking-wider text-[10px]">
              V6.9 SOVEREIGN
            </span>
          </div>

          <button
            onClick={() => {
              alert("Registering your secure endpoint in the Whitelist below qualifies your node for standard free-tier drops.");
              const elem = document.getElementById("axon-about");
              if (elem) elem.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-4 py-1.5 rounded-full bg-[#00FFB2] hover:bg-[#04D194] text-black font-extrabold text-[10px] uppercase tracking-wider transition hover:scale-105"
          >
            Claim Genesis Free NFT
          </button>

        </div>
      </div>

    </div>
  );
}
