"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  ShieldCheck, 
  Wallet, 
  ChevronLeft, 
  ChevronRight, 
  Coins, 
  TrendingUp, 
  Compass, 
  Zap, 
  Award, 
  ArrowUpRight, 
  Check, 
  Globe, 
  Users, 
  Layers, 
  Lock, 
  Search, 
  MessageSquare, 
  Menu, 
  X, 
  Activity, 
  Cpu, 
  HelpCircle,
  Clock,
  ExternalLink
} from "lucide-react";
import confetti from "canvas-confetti";

// Dynamic Real-time Market Simulation Data
interface MarketSignal {
  id: string;
  asset: string;
  price: string;
  change: string;
  isPositive: boolean;
  timestamp: string;
}

const INITIAL_SIGNALS: MarketSignal[] = [
  { id: "s1", asset: "AXON Cybernetic Array #349", price: "2.47 ETH", change: "+14.3%", isPositive: true, timestamp: "Just now" },
  { id: "s2", asset: "Metasphere Sovereign Node #142", price: "7.80 ETH", change: "+25.1%", isPositive: true, timestamp: "2m ago" },
  { id: "s3", asset: "Pro Synapse Nexus #9", price: "12.5 ETH", change: "-2.4%", isPositive: false, timestamp: "5m ago" },
  { id: "s4", asset: "Quartz Quantum Relayer #880", price: "0.95 ETH", change: "+8.9%", isPositive: true, timestamp: "12m ago" },
  { id: "s5", asset: "AXON Chrono Core #012", price: "19.4 ETH", change: "+34.2%", isPositive: true, timestamp: "18m ago" },
];

interface PlanItem {
  id: number;
  name: string;
  tag: string;
  roi: string;
  price: string;
  entryLevel: string;
  color: "emerald" | "gold" | "cyber";
  imageSvg: React.ReactNode;
  features: string[];
  analyticsUrl: string;
}

export default function AxonLandingPage() {
  // Navigation Mobile Menu State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Simulated Web3 Wallet State
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("0.00 ETH");
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  // Interactive Custom AI Story Generator State
  const [aiInput, setAiInput] = useState("");
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [aiGeneratedStory, setAiGeneratedStory] = useState<{
    name: string;
    rarityTier: string;
    details: string;
    lore: string;
    power: number;
    technology: string;
    multiplier: string;
  } | null>(null);

  // Real-time market state simulator
  const [marketSignals, setMarketSignals] = useState<MarketSignal[]>(INITIAL_SIGNALS);
  const [activeTab, setActiveTab] = useState<"all" | "mythic" | "legendary">("all");

  // Plans Carousel State
  const [currentPlanIndex, setCurrentPlanIndex] = useState(1); // Default is PRO DOCK (Index 1)

  // Triggering visual easter egg on mouse movement (liquid glass coordinate tracking)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Periodic signal updates (simulation)
  useEffect(() => {
    const interval = setInterval(() => {
      const positiveAssets = ["AXON Matrix Gen III", "Liquid Ether Synapse", "Platinum Core #909", "Hyperion Aura", "Sovereign Web3 Nodes"];
      const prices = ["1.12 ETH", "4.89 ETH", "9.75 ETH", "15.3 ETH", "0.62 ETH", "22.1 ETH"];
      const randomAsset = positiveAssets[Math.floor(Math.random() * positiveAssets.length)];
      const randomPrice = prices[Math.floor(Math.random() * prices.length)];
      const randomVal = (Math.random() * 15).toFixed(1);
      const randomIsPos = Math.random() > 0.3;

      const newSignal: MarketSignal = {
        id: "s-" + Date.now(),
        asset: `${randomAsset} #${Math.floor(Math.random() * 999)}`,
        price: randomPrice,
        change: `${randomIsPos ? "+" : "-"}${randomVal}%`,
        isPositive: randomIsPos,
        timestamp: "Just now",
      };

      setMarketSignals((prev) => [newSignal, ...prev.slice(0, 4)]);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Handler to Connect Fake Web3 Wallet
  const handleConnectWallet = (provider: string) => {
    setIsWalletModalOpen(false);
    setWalletConnected(true);
    // Generate a beautiful randomized Web3 address
    const randomHex = Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    setWalletAddress(`0xAxon${randomHex.toUpperCase()}...5b82`);
    setWalletBalance("45.127 ETH");

    // Success Confetti
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#00FFB2", "#D4AF37", "#10B981"],
    });
  };

  const handleDisconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress("");
    setWalletBalance("0.00 ETH");
  };

  // Custom AI Lore story call to backend API
  const handleGenerateLore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    setIsGeneratingStory(true);
    try {
      const response = await fetch("/api/gemini/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: aiInput }),
      });
      const data = await response.json();
      setAiGeneratedStory(data);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#00FFB2", "#D4AF37"],
      });
    } catch (error) {
      console.error("Lore API error", error);
    } finally {
      setIsGeneratingStory(false);
    }
  };

  // Action feedback trigger (Confetti + toast notification)
  const handlePurchasePlan = (planName: string) => {
    if (!walletConnected) {
      setIsWalletModalOpen(true);
      return;
    }
    
    confetti({
      particleCount: 200,
      spread: 120,
      origin: { y: 0.5 },
      colors: ["#D4AF37", "#00FFB2"],
    });

    alert(`🎉 Mint request initiated securely via AXON Smart Assembly! Plan: ${planName}. Confirm transaction inside your linked wallet.`);
  };

  // Pre-defined premium Plans Data
  const PLANS_DATA: PlanItem[] = [
    {
      id: 0,
      name: "STARTER MATRIX",
      tag: "Guaranteed APY Tier • Entry Level",
      roi: "142% Projected Cap",
      price: "0.25 ETH",
      entryLevel: "Silver Node Status",
      color: "emerald",
      imageSvg: (
        <svg viewBox="0 0 400 400" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="starterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0B1C17" />
              <stop offset="100%" stopColor="#023020" />
            </linearGradient>
            <linearGradient id="neonEmeraldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00FFB2" />
              <stop offset="100%" stopColor="#006644" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#starterGrad)" rx="24" />
          {/* Cyber grid lines */}
          <path d="M0,100 L400,100 M0,200 L400,200 M0,300 L400,300 M100,0 L100,400 M200,0 L200,400 M300,0 L300,400" stroke="rgba(0, 255, 178, 0.05)" strokeWidth="1" />
          {/* Concentric futuristic glowing circles */}
          <circle cx="200" cy="200" r="90" fill="none" stroke="rgba(0, 255, 178, 0.1)" strokeWidth="4" />
          <circle cx="200" cy="200" r="70" fill="none" stroke="url(#neonEmeraldGrad)" strokeWidth="2" strokeDasharray="15 5" />
          <circle cx="200" cy="200" r="50" fill="rgba(0, 255, 178, 0.1)" />
          {/* Cyber square nodes */}
          <rect x="180" y="180" width="40" height="40" rx="6" fill="url(#neonEmeraldGrad)" />
          {/* Glowing orbital dots */}
          <circle cx="200" cy="110" r="6" fill="#00FFB2" className="animate-pulse" />
          <circle cx="200" cy="290" r="6" fill="#00FFB2" className="animate-pulse" />
          <circle cx="110" cy="200" r="6" fill="#00FFB2" className="animate-pulse" />
          <circle cx="290" cy="200" r="6" fill="#00FFB2" className="animate-pulse" />
          {/* Metadata UI in SVG */}
          <text x="30" y="50" fill="#00FFB2" fontSize="12" fontFamily="monospace" letterSpacing="2">AXON PROTOCOL // STARTER</text>
          <text x="30" y="370" fill="rgba(255, 255, 255, 0.4)" fontSize="10" fontFamily="monospace">STABILITY INDEX: 94.2%</text>
        </svg>
      ),
      features: [
        "1 Free Generated Cybernetic Avatar NFT",
        "Direct APY Earning Pool Integration",
        "Weekly Liquid Reward Multiplier (1.2x)",
        "Premium Discord Whitelist Access",
        "Basic Gas Optimization Protocols"
      ],
      analyticsUrl: "starter-node"
    },
    {
      id: 1,
      name: "PRO DOCK SYSTEM",
      tag: "Elite Compounders • Best Selling",
      roi: "285% Projected APY",
      price: "1.20 ETH",
      entryLevel: "Gold Node Sovereign",
      color: "gold",
      imageSvg: (
        <svg viewBox="0 0 400 400" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="proGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#241B08" />
              <stop offset="100%" stopColor="#0F0C05" />
            </linearGradient>
            <linearGradient id="metallicGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="1" />
              <stop offset="100%" stopColor="#AA7C11" stopOpacity="1" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#proGrad)" rx="24" />
          <path d="M0,50 L400,50 M0,150 L400,150 M0,250 L400,250 M0,350 L400,350 M50,0 L50,400 M150,0 L150,400 M250,0 L250,400 M350,0 L350,400" stroke="rgba(212, 175, 55, 0.08)" strokeWidth="1" />
          {/* Golden pyramid / crystal matrix */}
          <polygon points="200,90 290,200 200,310 110,200" fill="none" stroke="url(#metallicGoldGrad)" strokeWidth="3" />
          <polygon points="200,120 260,200 200,280 140,200" fill="rgba(212, 175, 55, 0.12)" stroke="url(#metallicGoldGrad)" strokeWidth="1" />
          <line x1="200" y1="90" x2="200" y2="310" stroke="url(#metallicGoldGrad)" strokeWidth="1.5" />
          <line x1="110" y1="200" x2="290" y2="200" stroke="url(#metallicGoldGrad)" strokeWidth="1.5" />
          {/* Orbital glowing tech specs */}
          <rect x="185" y="185" width="30" height="30" rx="15" fill="#D4AF37" />
          <circle cx="200" cy="200" r="120" fill="none" stroke="rgba(212, 175, 55, 0.1)" strokeWidth="1" strokeDasharray="5 5" />
          {/* Metadata UI in SVG */}
          <text x="30" y="40" fill="#D4AF37" fontSize="14" fontFamily="monospace" fontWeight="bold" letterSpacing="3">SOVEREIGN PRO MATRIX</text>
          <text x="30" y="370" fill="#D4AF37" fontSize="11" fontFamily="monospace">MULTIPLIER CAP // 4.2X</text>
        </svg>
      ),
      features: [
        "Gold Guild Assembly Token Rights",
        "Weekly Passive ETH Auto-Claim Vaults",
        "Metaverse Sandbox Asset Blueprints",
        "Exclusive Access to Future NFT Drops",
        "Personalized Smart Contract Insurance",
        "Zero gas fees on secondary AXON trades"
      ],
      analyticsUrl: "pro-node"
    },
    {
      id: 2,
      name: "ELITE SYNAPSE CORE",
      tag: "Sovereign Web3 Wealth System",
      roi: "540% Premium Yield",
      price: "3.50 ETH",
      entryLevel: "Platinum Archon",
      color: "cyber",
      imageSvg: (
        <svg viewBox="0 0 400 400" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="eliteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#12061C" />
              <stop offset="100%" stopColor="#020005" />
            </linearGradient>
            <linearGradient id="cyberNeonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00FFB2" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#eliteGrad)" rx="24" />
          <path d="M0,0 L400,400 M400,0 L0,400" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="2" />
          {/* Glowing central cube representation */}
          <g transform="translate(140, 140)">
            <rect x="0" y="0" width="120" height="120" rx="16" fill="none" stroke="url(#cyberNeonGrad)" strokeWidth="4" />
            <rect x="20" y="20" width="80" height="80" rx="12" fill="none" stroke="url(#cyberNeonGrad)" strokeWidth="1.5" strokeDasharray="8 4" />
            <circle cx="60" cy="60" r="24" fill="rgba(139, 92, 246, 0.3)" />
            <circle cx="60" cy="60" r="10" fill="#00FFB2" />
          </g>
          {/* Corner geometric designs */}
          <path d="M40,40 L90,40 L40,90 Z" fill="rgba(0, 255, 178, 0.15)" stroke="#00FFB2" strokeWidth="1" />
          <path d="M360,360 L310,360 L360,310 Z" fill="rgba(212, 175, 55, 0.15)" stroke="#D4AF37" strokeWidth="1" />
          <text x="30" y="40" fill="#FFFFFF" fontSize="14" fontFamily="monospace" fontWeight="bold" letterSpacing="3">ELITE SYNAPSE LAYER</text>
          <text x="30" y="370" fill="#00FFB2" fontSize="11" fontFamily="monospace">BLOCK GENERATOR: ACTIVE</text>
        </svg>
      ),
      features: [
        "Full Governance Rights in AXON DAO",
        "Direct Sovereign Yield Staking (Maximum)",
        "Premium Live-Event Pass (Global)",
        "VIP Discord Lounge + Alpha Call Access",
        "Custom 3D-Interactive Liquid-Quartz NFT File",
        "Private 1-on-1 Web3 Developer Audit Consultation"
      ],
      analyticsUrl: "elite-node"
    }
  ];

  const nextPlan = () => {
    setCurrentPlanIndex((prev) => (prev + 1) % PLANS_DATA.length);
  };

  const prevPlan = () => {
    setCurrentPlanIndex((prev) => (prev - 1 + PLANS_DATA.length) % PLANS_DATA.length);
  };

  const activePlan = PLANS_DATA[currentPlanIndex];

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-[#0A0A0A] overflow-hidden">
      {/* BACKGROUND LAYER WITH ANIMATED GRADIENTS + NOISE */}
      <div className="noise-overlay" />
      
      {/* Shifting Gradient Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] orb-purple blur-[180px] pointer-events-none opacity-40 animate-pulse" />
      <div className="absolute top-[30%] right-[-10%] w-[50%] h-[50%] orb-emerald blur-[180px] pointer-events-none opacity-30 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-10%] left-[20%] w-[55%] h-[55%] orb-gold blur-[180px] pointer-events-none opacity-25 animate-pulse" style={{ animationDuration: '12s' }} />

      {/* CURSOR REACTIVE LIGHTING MATRIX (SUBTLE GLOW) */}
      <div 
        className="absolute pointer-events-none w-[450px] h-[450px] rounded-full blur-[140px] opacity-[0.25] transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 z-0 hidden lg:block"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          background: "radial-gradient(circle, rgba(0, 255, 178, 0.25) 0%, rgba(212, 175, 55, 0.15) 50%, rgba(0,0,0,0) 70%)"
        }}
      />

      {/* COMPREHENSIVE FLOATING NAVIGATION SYSTEM */}
      <nav id="nav-container" className="sticky top-0 w-full z-50 border-b border-white/[0.05] bg-[#0A0A0A]/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Elite Brand Symbol */}
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00FFB2] to-[#D4AF37] p-[1.5px] shadow-[0_0_15px_rgba(0,255,178,0.3)]">
              <div className="w-full h-full bg-[#0A0A0A] rounded-[10px] flex items-center justify-center">
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-[#00FFB2] to-[#D4AF37] text-lg select-none">AX</span>
              </div>
            </div>
            <div>
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 text-lg tracking-wider font-sans block leading-none">AXON</span>
              <span className="text-[9px] text-[#00FFB2] uppercase tracking-[0.3em] block mt-0.5">DIGITAL NFTs</span>
            </div>
          </div>

          {/* Nav Links Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#hero" className="text-sm font-medium text-gray-300 hover:text-[#00FFB2] transition">Core</a>
            <a href="#plans" className="text-sm font-medium text-gray-300 hover:text-[#00FFB2] transition">Sovereign Plans</a>
            <a href="#about" className="text-sm font-medium text-gray-300 hover:text-[#00FFB2] transition">What is Axon</a>
            <a href="#features" className="text-sm font-medium text-gray-300 hover:text-[#00FFB2] transition">Features</a>
            <a href="#showcase" className="text-sm font-medium text-gray-300 hover:text-[#00FFB2] transition">Showcase & Lore</a>
            <a href="#roadmap" className="text-sm font-medium text-gray-300 hover:text-[#00FFB2] transition">Roadmap</a>
          </div>

          {/* Web3 CTA & Mobile Actions */}
          <div className="flex items-center space-x-3">
            {walletConnected ? (
              <div className="flex items-center space-x-2">
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-[10px] text-[#D4AF37] font-semibold tracking-wider">BALANCE</span>
                  <span className="text-xs font-mono font-medium text-white">{walletBalance}</span>
                </div>
                <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-emerald-500/10 border border-[#00FFB2]/20 text-xs font-semibold text-[#00FFB2]">
                  <span className="inline-block w-2 fill-[#00FFB2] border-0 outline-none text-emerald-400">●</span>
                  <span className="font-mono">{walletAddress}</span>
                  <button 
                    onClick={handleDisconnectWallet}
                    className="ml-2 hover:text-white text-gray-400 transition underline cursor-pointer"
                    title="Disconnect Wallet"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ) : (
              <button 
                id="connect-wallet-btn"
                onClick={() => setIsWalletModalOpen(true)}
                className="relative px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-[#00FFB2] hover:bg-white hover:shadow-[0_0_20px_rgba(0,255,178,0.5)] transition duration-300"
              >
                Connect Wallet
              </button>
            )}

            {/* Mobile menu trigger */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden w-full border-t border-white/5 bg-[#0C0C0C] py-4 px-6 space-y-3"
            >
              <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-gray-300 hover:text-[#00FFB2]">Core</a>
              <a href="#plans" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-gray-300 hover:text-[#00FFB2]">Sovereign Plans</a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-gray-300 hover:text-[#00FFB2]">What is Axon</a>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-gray-300 hover:text-[#00FFB2]">Features</a>
              <a href="#showcase" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-gray-300 hover:text-[#00FFB2]">Showcase & Lore</a>
              <a href="#roadmap" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-gray-300 hover:text-[#00FFB2]">Roadmap</a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* SECTION 1: HERO SECTION */}
      <section id="hero" className="relative min-h-[92vh] flex items-center pt-8 pb-16 z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero text panel */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-[#00FFB2]/20">
              <Sparkles className="w-4 h-4 text-[#00FFB2] animate-spin" style={{ animationDuration: '6s' }} />
              <span className="text-xs font-semibold text-[#00FFB2] uppercase tracking-[0.2em]">Apple-Level Liquidity Framework</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none text-white font-sans">
              Own the Future of <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFB2] via-white to-[#D4AF37] glowing-text-emerald">
                Digital Assets
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-400 max-w-2xl font-normal leading-relaxed">
              Unlock the sovereign matrix of hyper-yielding digital artifacts. AXON DIGITAL merges elite aesthetic liquid glass with custom blockchain governance protocols to deliver continuous APY generation.
            </p>

            {/* Micro Wallet Status Alert */}
            {walletConnected && (
              <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 max-w-xl flex items-center space-x-3 text-xs text-gray-300">
                <ShieldCheck className="w-4 h-4 text-[#00FFB2] flex-shrink-0" />
                <span>Secure wallet connection verified. You are authorized to purchase sovereign pools at reduced gas.</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3.5 sm:space-y-0 sm:space-x-4 max-w-md pt-2">
              <a 
                href="#plans" 
                className="px-8 py-4 rounded-xl text-center text-sm font-bold uppercase tracking-wider text-black bg-gradient-to-r from-[#00FFB2] to-[#D4AF37] hover:from-white hover:to-white shadow-[0_0_30px_rgba(0,255,178,0.3)] hover:shadow-[0_0_30px_white] transition-all duration-300 transform hover:-translate-y-1"
              >
                Get Sovereign Plan
              </a>
              <a 
                href="#showcase" 
                className="px-8 py-4 rounded-xl text-center text-sm font-bold uppercase tracking-wider text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 transform hover:-translate-y-1"
              >
                Explore Collections
              </a>
            </div>

            {/* Micro Specs */}
            <div className="grid grid-cols-3 gap-6 pt-8 max-w-xl border-t border-white/10">
              <div>
                <span className="block text-2xl font-bold font-sans text-[#00FFB2] glowing-text-emerald">28.4%</span>
                <span className="text-xs text-gray-500 uppercase tracking-widest leading-none block mt-1">AVERAGE APY</span>
              </div>
              <div>
                <span className="block text-2xl font-bold font-sans text-white">40K+</span>
                <span className="text-xs text-gray-500 uppercase tracking-widest leading-none block mt-1">ELITE MINTERS</span>
              </div>
              <div>
                <span className="block text-2xl font-bold font-sans text-[#D4AF37] glowing-text-gold">1.8M ETH</span>
                <span className="text-xs text-gray-500 uppercase tracking-widest leading-none block mt-1">VOLUME TRADED</span>
              </div>
            </div>
          </div>

          {/* Hero 3D interactive floating card layout */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            
            {/* Background glowing rings */}
            <div className="absolute w-80 h-80 rounded-full border border-white/5 animate-pulse" />
            <div className="absolute w-64 h-64 rounded-full border-2 border-[#00FFB2]/10 animate-spin" style={{ animationDuration: '40s' }} />
            <div className="absolute w-48 h-48 rounded-full border border-[#D4AF37]/10 animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }} />

            {/* Floating primary preview card */}
            <motion.div 
              style={{ perspective: 1000 }}
              whileHover={{ scale: 1.05, rotateY: 10, rotateX: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative w-80 h-[420px] rounded-3xl group cursor-pointer border border-[#00FFB2]/20 bg-[#121212]/80 backdrop-blur-xl p-5 shadow-[0_20px_50px_rgba(0,255,178,0.15)] glow-emerald-sm transition"
            >
              {/* Image box */}
              <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-black/40 border border-white/5">
                {/* SVG customized animated dynamic card representation */}
                <svg viewBox="0 0 300 300" className="w-full h-full object-cover">
                  <defs>
                    <linearGradient id="cyberHero" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0B130E" />
                      <stop offset="50%" stopColor="#0A2C22" />
                      <stop offset="100%" stopColor="#1E1703" />
                    </linearGradient>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#cyberHero)" />
                  <path d="M0,75 H300 M0,150 H300 M0,225 H300 M75,0 V300 M150,0 V300 M225,0 V300" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  
                  {/* Rotating futuristic target symbol */}
                  <circle cx="150" cy="150" r="60" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="5, 10" className="origin-center animate-spin" style={{ animationDuration: '10s' }} />
                  <circle cx="150" cy="150" r="45" fill="none" stroke="#00FFB2" strokeWidth="2.5" />
                  {/* Digital star overlay */}
                  <polygon points="150,110 162,138 192,138 168,156 178,186 150,168 122,186 132,156 108,138 138,138" fill="rgba(0, 255, 178, 0.4)" stroke="#00FFB2" strokeWidth="1" />
                  <line x1="150" y1="50" x2="150" y2="250" stroke="rgba(0, 2FF, 178, 0.1)" strokeWidth="1" />
                </svg>
                {/* floating badge */}
                <span className="absolute top-3 right-3 px-2.5 py-1 text-[9px] font-bold tracking-widest text-[#0A0A0A] bg-[#00FFB2] rounded-full uppercase glow-emerald-sm">
                  GENESI #001
                </span>
              </div>

              {/* metadata */}
              <div className="mt-5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#00FFB2] font-semibold">SOVEREIGN CORE</span>
                  <span className="text-xs font-mono font-bold text-white bg-white/5 py-1 px-2.5 rounded border border-white/5">0.99 ETH Floor</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-[#00FFB2] transition">
                  AXON Chronosphere Ultra
                </h3>
                <div className="flex justify-between items-center pt-2.5 border-t border-white/5 text-xs text-gray-400">
                  <div>
                    <span className="block text-[8px] uppercase tracking-widest text-gray-500">MINT GUARANTEE</span>
                    <span className="font-semibold text-[#D4AF37] font-mono">+310% APY Potential</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[8px] uppercase tracking-widest text-gray-500">RARITY TIER</span>
                    <span className="font-semibold text-white">Mythic Platinum</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Small floating secondary card in z-20 background */}
            <div className="absolute -bottom-6 -right-6 lg:-right-12 w-64 h-36 rounded-2xl glass-panel-gold p-4.5 border border-[#D4AF37]/20 shadow-2xl hidden sm:block animate-float">
              <div className="flex justify-between items-start">
                <div className="bg-[#D4AF37]/10 p-2 rounded-xl border border-[#D4AF37]/20">
                  <Coins className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div className="text-right">
                  <span className="text-[9px] tracking-wider text-gray-400 uppercase block">LIVE ACCRUE</span>
                  <span className="text-sm font-bold font-mono text-white">+0.0458 ETH</span>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-[10px] text-gray-300">Compound Status:</span>
                <span className="px-2 py-0.5 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[9px] font-bold text-[#D4AF37] uppercase tracking-wider">
                  STAKED (12.4% BOOST)
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 2: PLANS / OFFERS SLIDER (CRITICAL COMPONENT UNDER HERO) */}
      <section id="plans" className="relative py-24 bg-black/40 z-20 border-t border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20">
              <span className="inline-block w-1.5 h-1.5 bg-[#D4AF37] rounded-full"></span>
              <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-[0.25em]">MINT CONTRACT SPACES</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Sovereign Yield Plans
            </h2>
            <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
              Choose your entry level into the AXON Ecosystem. Connect your wallet to mint your Plan NFT and unlock continuous block compounding rewards.
            </p>
          </div>

          {/* ACTIVE / CENTER AUTO-SLIDING CAROUSEL CONTAINER */}
          <div className="relative flex flex-col items-center">
            
            {/* Horizontal Slider Area */}
            <div className="relative w-full max-w-5xl overflow-hidden py-10 flex justify-center items-center">
              
              <div className="flex items-center justify-center space-x-2 sm:space-x-6 w-full lg:max-w-4xl">
                
                {/* PREVIOUS SIDE CARD (Show scaled down if current > 0) */}
                {PLANS_DATA.map((plan, idx) => {
                  const isCenter = idx === currentPlanIndex;
                  const isLeft = (idx === (currentPlanIndex - 1 + PLANS_DATA.length) % PLANS_DATA.length);
                  const isRight = (idx === (currentPlanIndex + 1) % PLANS_DATA.length);

                  let positionClass = "hidden";
                  if (isCenter) positionClass = "relative z-30 scale-100 sm:scale-105 opacity-100 w-full max-w-[340px] sm:max-w-[390px]";
                  if (isLeft) positionClass = "relative z-10 scale-85 opacity-50 sm:opacity-60 cursor-pointer hover:opacity-80 transition duration-300 w-full max-w-[280px] hidden md:block";
                  if (isRight) positionClass = "relative z-10 scale-85 opacity-50 sm:opacity-60 cursor-pointer hover:opacity-80 transition duration-300 w-full max-w-[280px] hidden md:block";

                  return (
                    <div 
                      key={plan.id}
                      onClick={() => { if (!isCenter) setCurrentPlanIndex(idx) }}
                      className={`${positionClass} transition-all duration-500 ease-in-out`}
                    >
                      {/* Plan Card Body */}
                      <div className={`p-6 rounded-[32px] border ${
                        isCenter 
                          ? plan.color === "emerald" 
                            ? "border-[#00FFB2] shadow-[0_15px_40px_rgba(0,255,178,0.2)] bg-[#121212] glow-emerald"
                            : plan.color === "gold"
                              ? "border-[#D4AF37] shadow-[0_15px_40px_rgba(212,175,55,0.2)] bg-[#121212] glow-gold"
                              : "border-purple-500 shadow-[0_15px_40px_rgba(139,92,246,0.2)] bg-[#121212]" 
                          : "border-white/10 bg-[#121212]/30 backdrop-blur-md"
                      } space-y-6 flex flex-col justify-between min-h-[560px]`}>
                        
                        <div>
                          {/* Image box nested on top */}
                          <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-black/40 border border-white/5 mb-6">
                            {plan.imageSvg}
                            <span className="absolute bottom-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-md text-[#00FFB2] text-[10px] uppercase font-mono tracking-widest rounded-lg border border-white/5">
                              {plan.entryLevel}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{plan.name}</h3>
                              {isCenter && (
                                <span className={`px-2.5 py-1 text-[9px] uppercase font-bold tracking-widest rounded-lg ${
                                  plan.color === "emerald" ? "bg-[#00FFB2]/20 text-[#00FFB2]" : plan.color === "gold" ? "bg-[#D4AF37]/20 text-[#D4AF37]" : "bg-purple-500/20 text-purple-400"
                                }`}>
                                  ACTIVE Focus
                                </span>
                              )}
                            </div>
                            <span className="block text-xs text-gray-400 font-medium">{plan.tag}</span>
                          </div>

                          <div className="my-5 py-4 border-t border-b border-white/5 flex justify-between items-center">
                            <div>
                              <span className="block text-[9px] text-gray-500 uppercase tracking-widest">EXPECTED RETURN</span>
                              <span className={`text-lg font-bold font-sans ${
                                plan.color === "emerald" ? "text-[#00FFB2]" : plan.color === "gold" ? "text-[#D4AF37]" : "text-white"
                              }`}>{plan.roi}</span>
                            </div>
                            <div className="text-right">
                              <span className="block text-[9px] text-gray-500 uppercase tracking-widest">MINT PRICE</span>
                              <span className="text-lg font-mono font-bold text-white tracking-tight">{plan.price}</span>
                            </div>
                          </div>

                          {/* Features of each plan */}
                          <ul className="space-y-2.5">
                            {plan.features.slice(0, 4).map((feat, i) => (
                              <li key={i} className="flex items-start text-xs text-gray-300">
                                <Check className={`w-3.5 h-3.5 mr-2.5 flex-shrink-0 mt-0.5 ${
                                  plan.color === "emerald" ? "text-[#00FFB2]" : plan.color === "gold" ? "text-[#D4AF37]" : "text-purple-400"
                                }`} />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* CTA button inside */}
                        <div>
                          <button 
                            onClick={() => handlePurchasePlan(plan.name)}
                            className={`w-full py-4 rounded-xl text-center text-xs font-bold uppercase tracking-widest transition duration-300 cursor-pointer ${
                              isCenter
                                ? plan.color === "emerald" 
                                  ? "bg-[#00FFB2] hover:bg-white text-black font-semibold shadow-[0_0_20px_rgba(0,255,178,0.3)]"
                                  : plan.color === "gold"
                                    ? "bg-[#D4AF37] hover:bg-white text-black font-semibold shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                                    : "bg-purple-500 hover:bg-white text-white"
                                : "bg-white/5 hover:bg-white/10 text-gray-300"
                            }`}
                          >
                            {walletConnected ? "Get Plan NFT" : "Connect & Purchase"}
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}

              </div>

            </div>

            {/* Slider Navigation Buttons */}
            <div className="flex items-center space-x-4 mt-4">
              <button 
                onClick={prevPlan}
                className="p-3.5 rounded-full bg-white/5 border border-white/10 hover:bg-[#00FFB2] hover:text-black hover:border-transparent transition text-gray-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex space-x-2">
                {PLANS_DATA.map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setCurrentPlanIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full transition duration-300 ${
                      i === currentPlanIndex ? "bg-[#00FFB2] w-6" : "bg-white/20"
                    }`}
                  />
                ))}
              </div>

              <button 
                onClick={nextPlan}
                className="p-3.5 rounded-full bg-white/5 border border-white/10 hover:bg-[#00FFB2] hover:text-black hover:border-transparent transition text-gray-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Micro warning about compounding */}
            <p className="text-[11px] text-gray-500 font-mono mt-6 tracking-wide">
              * Yield rates compiled securely from chain oracle pools. Contract insured up to 10K ETH.
            </p>

          </div>

        </div>
      </section>

      {/* SECTION 3: ABOUT / WHAT IS AXON */}
      <section id="about" className="relative py-24 z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-[#00FFB2]/20">
              <TrendingUp className="w-4 h-4 text-[#00FFB2]" />
              <span className="text-xs font-semibold text-[#00FFB2] uppercase tracking-[0.2em]">DECENTRALIZED ECOSYSTEM</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none">
              Web3 Wealth & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-white">
                Sovereign Security
              </span>
            </h2>

            <p className="text-sm sm:text-base text-gray-400 leading-relaxed font-normal">
              AXON achieves maximum yield by tokenizing high-throughput algorithmic computational space and routing sovereign smart contracts directly to vetted global validation pools.
            </p>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex items-start space-x-3.5">
                <div className="p-2 rounded bg-[#00FFB2]/10 border border-[#00FFB2]/20 mt-1">
                  <ShieldCheck className="w-4 h-4 text-[#00FFB2]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Triple Audit Guarantee</h4>
                  <p className="text-xs text-gray-400 mt-1">AXON code arrays are fully sandbox verified by ConsenSys and CertiK Security groups.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-2 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/20 mt-1">
                  <Coins className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Dynamic Liquidity Layer</h4>
                  <p className="text-xs text-gray-400 mt-1">Instant continuous compounding values allow immediate exit pools without lock penalty.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Grid layout bento design for utility features */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="glass-panel-neon p-6.5 rounded-2xl border border-[#00FFB2]/15 text-left space-y-4">
              <div className="p-3.5 rounded-xl bg-[#00FFB2]/15 border border-[#00FFB2]/20 inline-block">
                <Compass className="w-6 h-6 text-[#00FFB2]" />
              </div>
              <h3 className="text-lg font-bold text-white">Algorithmic Staking</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Tokens automatically route compounding fees from synthetic transactions across multiple high-volume chains, yielding native rewards.
              </p>
              <span className="text-[10px] font-mono font-semibold text-[#00FFB2] block uppercase tracking-wider">
                EFFICIENCY INDEX: 99.8%
              </span>
            </div>

            <div className="glass-panel-gold p-6.5 rounded-2xl border border-[#D4AF37]/15 text-left space-y-4">
              <div className="p-3.5 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/20 inline-block">
                <Award className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h3 className="text-lg font-bold text-white">DAO Governance Rights</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Receive AXON delegation points. Direct future pool creation rates, select brand partners, and voting parameters within our global Discord channel.
              </p>
              <span className="text-[10px] font-mono font-semibold text-[#D4AF37] block uppercase tracking-wider">
                VOTING POWER STATUS: OPEN
              </span>
            </div>

            <div className="glass-panel p-6.5 rounded-2xl border border-white/5 text-left space-y-4">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 inline-block">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">Instant Cross-bridge</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Connect and exchange your AXON yields immediately into standard stablecoins, ETH, or premium platform governance assets.
              </p>
              <span className="text-[10px] font-mono font-semibold text-gray-400 block uppercase tracking-wider">
                COMPATIBILITY: MULTI-CHAIN
              </span>
            </div>

            <div className="glass-panel p-6.5 rounded-2xl border border-white/5 text-left space-y-4 bg-gradient-to-br from-[#121212] via-[#121212] to-emerald-950/25">
              <div className="p-3.5 rounded-xl bg-[#00FFB2]/5 border border-white/15 inline-block">
                <Globe className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Apple precision UI</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Indulge in our responsive liquid glass layouts, designed rigorously on human guidelines with seamless 120fps motion design mechanics.
              </p>
              <span className="text-[10px] font-mono font-semibold text-[#00FFB2] block uppercase tracking-wider">
                PERFORMANCE SCORE: 100/100
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 4: FEATURES GRID */}
      <section id="features" className="relative py-24 bg-black/40 z-20 border-t border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-16">
          
          <div className="space-y-4">
            <span className="text-xs font-semibold text-[#00FFB2] uppercase tracking-[0.25em]">TECHNICAL MATRICES</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Ecosystem Architecture</h2>
            <p className="text-sm text-gray-400 max-w-2xl mx-auto">
              Our full-stack setup is configured securely for direct deployment, leveraging robust decentralized blockchain state-feeds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            
            <div className="p-8 rounded-3xl bg-[#121212]/50 border border-white/5 hover:border-[#00FFB2]/30 hover:shadow-[0_0_30px_rgba(0,255,178,0.1)] transition-all duration-300 transform hover:-translate-y-1.5 space-y-4">
              <span className="text-[#00FFB2] text-xs font-mono font-bold tracking-widest block">COMPONENT 01</span>
              <h3 className="text-xl font-bold text-white">GlassCard Engine</h3>
              <p className="text-sm text-gray-400">
                Highly responsive backdrop blend filters configured directly with micro glow borders and ambient hover lift states, providing unmatched elite tactile feel.
              </p>
              <div className="flex items-center space-x-2 text-xs font-mono text-[#00FFB2]">
                <span>Status: Fully Optimized</span>
                <span className="inline-block w-2 fill-[#00FFB2] font-semibold text-emerald-400">●</span>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-[#121212]/50 border border-white/5 hover:border-[#D4AF37]/30 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] transition-all duration-300 transform hover:-translate-y-1.5 space-y-4">
              <span className="text-[#D4AF37] text-xs font-mono font-bold tracking-widest block">COMPONENT 02</span>
              <h3 className="text-xl font-bold text-white">Dynamic Compounder</h3>
              <p className="text-sm text-gray-400">
                Automated staking algorithms running safely via custom contract pools. Compounding takes place every single block production with gasless auto-claims.
              </p>
              <div className="flex items-center space-x-2 text-xs font-mono text-[#D4AF37]">
                <span>Awaiting Wallet Connect</span>
                <span className="inline-block w-2 fill-[#D4AF37] text-[#D4AF37] animate-pulse">●</span>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-[#121212]/50 border border-white/5 hover:border-purple-400/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] transition-all duration-300 transform hover:-translate-y-1.5 space-y-4">
              <span className="text-purple-400 text-xs font-mono font-bold tracking-widest block">COMPONENT 03</span>
              <h3 className="text-xl font-bold text-white">AI Personalization Ready</h3>
              <p className="text-sm text-gray-400">
                Connected directly directly to custom server-side Gemini generation models to create personalized rarity traits, backgrounds, and lore descriptions.
              </p>
              <div className="flex items-center space-x-2 text-xs font-mono text-purple-400">
                <span>Gemini API: Live Connected</span>
                <span className="inline-block w-2 fill-purple-400 text-purple-400">●</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 5: NFT SHOWCASE & AI LORE GENERATOR (ADVANCED STYLED SECTION) */}
      <section id="showcase" className="relative py-24 z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left space-y-16">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/5">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-[#00FFB2]/20">
              <Activity className="w-4 h-4 text-[#00FFB2]" />
              <span className="text-xs font-semibold text-[#00FFB2] uppercase tracking-[0.2em]">INTEGRATED AI METADATA MINTING</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Interactive NFT Showcase
            </h2>
          </div>
          <div className="flex space-x-2 bg-white/5 p-1 rounded-xl border border-white/5">
            <button 
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg uppercase tracking-wider transition ${
                activeTab === "all" ? "bg-[#00FFB2] text-black" : "text-gray-400 hover:text-white"
              }`}
            >
              All Assets
            </button>
            <button 
              onClick={() => setActiveTab("mythic")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg uppercase tracking-wider transition ${
                activeTab === "mythic" ? "bg-[#00FFB2] text-black" : "text-gray-400 hover:text-white"
              }`}
            >
              Mythic (Boosted)
            </button>
            <button 
              onClick={() => setActiveTab("legendary")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg uppercase tracking-wider transition ${
                activeTab === "legendary" ? "bg-[#00FFB2] text-black" : "text-gray-400 hover:text-white"
              }`}
            >
              Legendary
            </button>
          </div>
        </div>

        {/* Dynamic NFT Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* NFT Card 1 */}
          {(activeTab === "all" || activeTab === "mythic") && (
            <motion.div 
              whileHover={{ y: -8 }}
              className="rounded-2xl border border-[#00FFB2]/10 bg-[#121212]/85 p-4 flex flex-col justify-between space-y-4 shadow-xl brightness-95 hover:brightness-100 transition duration-300"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden bg-black/50 border border-white/5">
                <svg viewBox="0 0 300 300" className="w-full h-full object-cover">
                  <rect width="100%" height="100%" fill="#051510" />
                  <circle cx="150" cy="150" r="80" fill="none" stroke="#00FFB2" strokeWidth="1" strokeDasharray="10 5" />
                  <polygon points="150,110 180,180 120,180" fill="rgba(0, 255, 178, 0.15)" stroke="#00FFB2" strokeWidth="2" />
                  <circle cx="150" cy="110" r="6" fill="#D4AF37" />
                </svg>
                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded border border-white/5 text-[9px] text-[#00FFB2] font-mono tracking-wider">
                  MYTHIC ELITE
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-gray-500 font-mono tracking-widest block font-bold">SECURE VAULT ARTIFACT</span>
                <h3 className="text-base font-bold text-white">Chrono Array Quantum</h3>
                <div className="pt-2 border-t border-white/5 flex justify-between items-center text-xs">
                  <span className="font-mono text-gray-400">Price: 0.88 ETH</span>
                  <span className="text-[#00FFB2] font-mono font-semibold">+220% ROI Boost</span>
                </div>
              </div>
              <button 
                onClick={() => handlePurchasePlan("Chrono Array Quantum")}
                className="w-full py-2.5 bg-white/5 hover:bg-[#00FFB2] hover:text-black rounded-xl text-xs font-bold uppercase tracking-wider border border-white/10 hover:border-transparent transition duration-300"
              >
                Mint Core
              </button>
            </motion.div>
          )}

          {/* NFT Card 2 */}
          {(activeTab === "all" || activeTab === "legendary") && (
            <motion.div 
              whileHover={{ y: -8 }}
              className="rounded-2xl border border-[#D4AF37]/10 bg-[#121212]/85 p-4 flex flex-col justify-between space-y-4 shadow-xl brightness-95 hover:brightness-100 transition duration-300"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden bg-black/50 border border-white/5">
                <svg viewBox="0 0 300 300" className="w-full h-full object-cover">
                  <rect width="100%" height="100%" fill="#1C180A" />
                  <path d="M50,150 L250,150 M150,50 L150,250" stroke="rgba(212, 175, 55, 0.15)" strokeWidth="2" />
                  <rect x="100" y="100" width="100" height="100" rx="20" fill="none" stroke="#D4AF37" strokeWidth="2" strokeDasharray="8 4" />
                  <circle cx="150" cy="150" r="15" fill="#D4AF37" className="animate-pulse" />
                </svg>
                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded border border-white/5 text-[9px] text-[#D4AF37] font-mono tracking-wider">
                  LEGENDARY VAULT
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-gray-500 font-mono tracking-widest block font-bold">GOVERNANCE MULTIPLIER</span>
                <h3 className="text-base font-bold text-white">Sovereign Auric Node</h3>
                <div className="pt-2 border-t border-white/5 flex justify-between items-center text-xs">
                  <span className="font-mono text-gray-400">Price: 1.50 ETH</span>
                  <span className="text-[#D4AF37] font-mono font-semibold">+410% APY Potential</span>
                </div>
              </div>
              <button 
                onClick={() => handlePurchasePlan("Sovereign Auric Node")}
                className="w-full py-2.5 bg-white/5 hover:bg-[#D4AF37] hover:text-black rounded-xl text-xs font-bold uppercase tracking-wider border border-white/10 hover:border-transparent transition duration-300"
              >
                Mint Core
              </button>
            </motion.div>
          )}

          {/* NFT Card 3 */}
          {(activeTab === "all" || activeTab === "mythic") && (
            <motion.div 
              whileHover={{ y: -8 }}
              className="rounded-2xl border border-[#00FFB2]/10 bg-[#121212]/85 p-4 flex flex-col justify-between space-y-4 shadow-xl brightness-95 hover:brightness-100 transition duration-300"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden bg-black/50 border border-white/5">
                <svg viewBox="0 0 300 300" className="w-full h-full object-cover">
                  <rect width="100%" height="100%" fill="#0A0E1A" />
                  <polygon points="150,70 230,150 150,230 70,150" fill="rgba(0, 255, 230, 0.1)" stroke="#00FFB2" strokeWidth="1.5" />
                  <rect x="120" y="120" width="60" height="60" rx="6" fill="rgba(0, 255, 178, 0.15)" stroke="#00FFB2" strokeWidth="1" />
                </svg>
                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded border border-white/5 text-[9px] text-[#00FFB2] font-mono tracking-wider">
                  MYTHIC TITAN
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-gray-500 font-mono tracking-widest block font-bold">AUTOMATED CLAIM MODULE</span>
                <h3 className="text-base font-bold text-white">Aqua Obsidian Synth</h3>
                <div className="pt-2 border-t border-white/5 flex justify-between items-center text-xs">
                  <span className="font-mono text-gray-400">Price: 2.10 ETH</span>
                  <span className="text-[#00FFB2] font-mono font-semibold">+185% APY compounding</span>
                </div>
              </div>
              <button 
                onClick={() => handlePurchasePlan("Aqua Obsidian Synth")}
                className="w-full py-2.5 bg-white/5 hover:bg-[#00FFB2] hover:text-black rounded-xl text-xs font-bold uppercase tracking-wider border border-white/10 hover:border-transparent transition duration-300"
              >
                Mint Core
              </button>
            </motion.div>
          )}

          {/* NFT Card 4 */}
          {(activeTab === "all" || activeTab === "legendary") && (
            <motion.div 
              whileHover={{ y: -8 }}
              className="rounded-2xl border border-purple-500/20 bg-[#121212]/85 p-4 flex flex-col justify-between space-y-4 shadow-xl brightness-95 hover:brightness-100 transition duration-300"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden bg-black/50 border border-white/5">
                <svg viewBox="0 0 300 300" className="w-full h-full object-cover">
                  <rect width="100%" height="100%" fill="#180A20" />
                  <circle cx="150" cy="150" r="90" fill="none" stroke="#8B5CF6" strokeWidth="1" />
                  <polygon points="150,90 220,200 80,200" fill="none" stroke="#D4AF37" strokeWidth="2" />
                  <rect x="135" y="135" width="30" height="30" rx="15" fill="#8B5CF6" />
                </svg>
                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded border border-white/5 text-[9px] text-purple-400 font-mono tracking-wider">
                  LEGENDARY PROTOCOLS
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-gray-500 font-mono tracking-widest block font-bold">QUANTUM CHANGER</span>
                <h3 className="text-base font-bold text-white">Infinity Lattice Node</h3>
                <div className="pt-2 border-t border-white/5 flex justify-between items-center text-xs">
                  <span className="font-mono text-gray-400">Price: 4.80 ETH</span>
                  <span className="text-purple-400 font-mono font-semibold">+550% APY VIP Rank</span>
                </div>
              </div>
              <button 
                onClick={() => handlePurchasePlan("Infinity Lattice Node")}
                className="w-full py-2.5 bg-white/5 hover:bg-purple-500 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider border border-white/10 hover:border-transparent transition duration-300"
              >
                Mint Core
              </button>
            </motion.div>
          )}

        </div>

        {/* FEATURE: INTEGRATIVE GOOGLE GEMINI AI ARTIFACT GENERATOR */}
        <div id="ai-generator-panel" className="mt-16 glass-panel-neon p-6 sm:p-10 rounded-3xl border border-[#00FFB2]/20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#00FFB2]/10 rounded border border-[#00FFB2]/20 text-[#00FFB2] text-xs font-mono uppercase">
                <Cpu className="w-4 h-4 text-[#00FFB2] animate-bounce" />
                <span>INTEGRATED GEMINI 3.5 AI ENGINE</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Generative NFT Lore Creator
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Unlock the background lore, calculated rarity traits, and yield multipliers of any concept your mind desires. AXON combines Gemini server-side AI model schemas to generate cryptographic metadata immediately.
              </p>

              <form onSubmit={handleGenerateLore} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                    INPUT NFT ARTIFACT CODENAME
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      placeholder="e.g. Cosmic Obsidian, Emerald Dragon, Quartz"
                      className="flex-grow bg-black/60 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#00FFB2] transition placeholder-gray-600"
                    />
                    <button 
                      type="submit"
                      disabled={isGeneratingStory}
                      className="px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest text-[#0a0a0a] bg-[#00FFB2] hover:bg-white transition flex items-center justify-center space-x-2"
                    >
                      {isGeneratingStory ? (
                        <span>Configuring...</span>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Generate Lore</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-black/40 rounded-2xl border border-white/5 p-6 min-h-[290px] flex flex-col justify-between space-y-4">
                {aiGeneratedStory ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] text-[#00FFB2] font-mono tracking-wider uppercase">GENERATED METADATA ASSET</span>
                        <h4 className="text-xl font-black text-white">{aiGeneratedStory.name}</h4>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[9px] text-[#D4AF37] tracking-widest font-mono font-bold uppercase">
                        {aiGeneratedStory.rarityTier}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-[#00FFB2] font-mono leading-relaxed">{aiGeneratedStory.details}</p>
                      <p className="text-xs text-gray-300 leading-relaxed italic">&quot;{aiGeneratedStory.lore}&quot;</p>
                    </div>

                    <div className="pt-4 border-t border-white/5 grid grid-cols-3 gap-4 text-left">
                      <div>
                        <span className="block text-[8px] text-gray-500 uppercase tracking-wider">CALCULATED POWER</span>
                        <span className="text-sm font-bold text-white font-mono">{aiGeneratedStory.power}/100</span>
                      </div>
                      <div>
                        <span className="block text-[8px] text-gray-500 uppercase tracking-wider">CRYPTOLOGY</span>
                        <span className="text-sm font-bold text-gray-300 font-mono text-ellipsis overflow-hidden block whitespace-nowrap">{aiGeneratedStory.technology}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] text-gray-500 uppercase tracking-wider">BLOCK MULTIPLIER</span>
                        <span className="text-sm font-bold text-[#D4AF37] font-mono">{aiGeneratedStory.multiplier}</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-8">
                    <Sparkles className="w-8 h-8 text-[#00FFB2]/30 animate-pulse" />
                    <div>
                      <p className="text-sm font-semibold text-white">Create Cryptographic Lore</p>
                      <p className="text-xs text-gray-500 max-w-sm mt-1">Input a custom codename above. The Gemini API server will design fully customized metadata attributes and rarity parameters on demand.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* SECTION 6: HOW IT WORKS TIMELINE */}
      <section className="relative py-24 bg-black/40 z-20 border-t border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-16">
          
          <div className="space-y-4">
            <span className="text-xs font-semibold text-[#00FFB2] uppercase tracking-[0.25em]">STEP BY STEP MATRIX</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">How It Works</h2>
            <p className="text-sm text-gray-400 max-w-2xl mx-auto">
              Follow these secure steps to connect your portfolio, mint your chosen sovereign staking pools, and accrue multi-chain yields safely.
            </p>
          </div>

          {/* Timeline - Horizontal on Desktop, Vertical on Mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
            
            {/* Desktop Connective line */}
            <div className="hidden lg:block absolute top-1/2 left-4 right-4 h-[1px] bg-gradient-to-r from-[#00FFB2]/20 via-[#D4AF37]/20 to-transparent z-0 transform -translate-y-6" />

            {/* Step 1 */}
            <div className="glass-panel p-6.5 rounded-2xl relative z-10 text-left space-y-4 hover:border-[#00FFB2]/30 transition duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#00FFB2]/10 border border-[#00FFB2]/20 flex items-center justify-center text-lg font-bold text-[#00FFB2] font-mono shadow-[0_0_15px_rgba(0,255,178,0.1)]">
                01
              </div>
              <h3 className="text-base font-bold text-white">Link Portfolio</h3>
              <p className="text-xs text-gray-400">
                Click &quot;Connect Wallet&quot; on the navigation bar to link your Metamask, Coinbase, or WalletConnect accounts securely.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-panel p-6.5 rounded-2xl relative z-10 text-left space-y-4 hover:border-[#D4AF37]/30 transition duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-lg font-bold text-[#D4AF37] font-mono shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                02
              </div>
              <h3 className="text-base font-bold text-white">Select Sovereign Pool</h3>
              <p className="text-xs text-gray-400">
                Contrast our compounding plans and focus-carousel sliders to choose your desired matrix of return yields and whitelist APY tiers.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-panel p-6.5 rounded-2xl relative z-10 text-left space-y-4 hover:border-purple-400/30 transition duration-300">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-lg font-bold text-purple-400 font-mono">
                03
              </div>
              <h3 className="text-base font-bold text-white">Mint Plan NFT</h3>
              <p className="text-xs text-gray-400">
                Authorize your secure minting transaction safely. Your certified AXON sovereign plan token is produced instantly.
              </p>
            </div>

            {/* Step 4 */}
            <div className="glass-panel p-6.5 rounded-2xl relative z-10 text-left space-y-4 hover:border-[#00FFB2]/30 transition duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#00FFB2]/10 border border-[#00FFB2]/20 flex items-center justify-center text-lg font-bold text-[#00FFB2] font-mono shadow-[0_0_15px_rgba(0,255,178,0.1)]">
                04
              </div>
              <h3 className="text-base font-bold text-white">Earn yields</h3>
              <p className="text-xs text-gray-400">
                Compounding blocks accumulate automated ETH directly to your linked wallet address. Withdraw or bridge multi-chain assets at any time.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 7: LIVE SIMULATION STATS & SIGNAL FEED */}
      <section className="relative py-24 z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-4 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#D4AF37]/10 rounded border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-mono uppercase">
              <Coins className="w-4 h-4 text-[#D4AF37]" />
              <span>DYNAMIC PROTOCOL YIELD FEEDS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
              Live Network Metrics
            </h2>
            <p className="text-sm text-gray-400">
              Contract interactions, auto-compounded pools, and verified secondary blockchain allocations streaming continuously across the AXON mainnet.
            </p>
            
            <div className="p-4.5 rounded-2xl bg-[#121212]/50 border border-white/5 space-y-3.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Contract Address:</span>
                <span className="font-mono text-[#00FFB2]">0x7b82f8a5...001F</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Global Registry status:</span>
                <span className="text-white font-mono font-semibold uppercase tracking-wider">Sync Active</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Blockchain Oracles:</span>
                <span className="text-[#D4AF37] font-mono">Chainlink Verified</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <span className="text-[10px] font-mono tracking-widest text-[#00FFB2] uppercase block font-bold text-left">
              🔴 REAL-TIME BLOCK INTERACTOR FEED (SIMULATED SECURE CHANNELS)
            </span>
            <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
              <div className="divide-y divide-white/5">
                {marketSignals.map((sig) => (
                  <div key={sig.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:bg-white/[0.02] transition">
                    <div className="flex items-center space-x-3 text-left">
                      <div className={`p-1.5 rounded-lg ${sig.isPositive ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-red-500/10 border border-red-500/20"}`}>
                        <Activity className={`w-4 h-4 ${sig.isPositive ? "text-[#00FFB2]" : "text-red-400"}`} />
                      </div>
                      <div>
                        <span className="block text-sm font-semibold text-white">{sig.asset}</span>
                        <span className="text-[10px] text-gray-500 tracking-wide font-mono block mt-0.5">{sig.timestamp}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 justify-between sm:justify-end">
                      <div className="text-right">
                        <span className="block text-xs font-mono font-bold text-white">{sig.price}</span>
                        <span className={`block text-[10px] font-mono font-semibold ${sig.isPositive ? "text-[#00FFB2]" : "text-red-400"}`}>
                          {sig.change}
                        </span>
                      </div>
                      <span className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded uppercase tracking-wider ${
                        sig.isPositive ? "bg-[#00FFB2]/10 text-[#00FFB2] border border-[#00FFB2]/20" : "bg-red-400/10 text-red-300 border border-red-400/20"
                      }`}>
                        {sig.isPositive ? "ACCRUING" : "CORRECTING"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* SECTION 8: ECOSYSTEM ROADMAP */}
      <section id="roadmap" className="relative py-24 bg-black/40 z-20 border-t border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-16">
          
          <div className="space-y-4">
            <span className="text-xs font-semibold text-[#00FFB2] uppercase tracking-[0.25em]">CHRONOLOGY SYSTEM</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Active Phase Roadmap</h2>
            <p className="text-sm text-gray-400 max-w-2xl mx-auto">
              Our structured path towards establishing global liquid glass asset pools and modular cross-chain token yield distributions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
            
            {/* Phase 1 */}
            <div className="glass-panel p-6.5 rounded-2xl border-l-4 border-l-[#00FFB2] space-y-4">
              <span className="text-[10px] font-mono text-[#00FFB2] font-bold block uppercase tracking-wider">PHASE 01 // COMPLETED</span>
              <h3 className="text-lg font-bold text-white">Smart Assembly Deploy</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Primary audit contract deployment, launch of the premium Liquid Glass dashboard layouts, and initial whitelisting.
              </p>
              <div className="px-2 py-0.5 rounded bg-[#00FFB2]/20 text-[#00FFB2] text-[9px] font-bold tracking-wider inline-block uppercase font-mono">
                99% Complete
              </div>
            </div>

            {/* Phase 2 */}
            <div className="glass-panel p-6.5 rounded-2xl border-l-4 border-l-[#D4AF37] space-y-4">
              <span className="text-[10px] font-mono text-[#D4AF37] font-bold block uppercase tracking-wider">PHASE 02 // IN PROGRESS</span>
              <h3 className="text-lg font-bold text-white">Compound Oracles Sync</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Integration of multiple high-volume algorithmic validation feeds, multi-chain gas optimization, and first active staking payouts.
              </p>
              <div className="px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] text-[9px] font-bold tracking-wider inline-block uppercase font-mono">
                Active Sync
              </div>
            </div>

            {/* Phase 3 */}
            <div className="glass-panel p-6.5 rounded-2xl border-l-4 border-l-purple-500 space-y-4">
              <span className="text-[10px] font-mono text-purple-400 font-bold block uppercase tracking-wider">PHASE 03 // UPCOMING</span>
              <h3 className="text-lg font-bold text-white">DAO Governance Expansion</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Distribution of AXON DAO delegation files, voting systems initialization via decentralized smart portals on Snapshot.
              </p>
              <div className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[9px] font-bold tracking-wider inline-block uppercase font-mono">
                Configuring
              </div>
            </div>

            {/* Phase 4 */}
            <div className="glass-panel p-6.5 rounded-2xl border-l-4 border-l-gray-600 space-y-4">
              <span className="text-[10px] font-mono text-gray-500 font-bold block uppercase tracking-wider">PHASE 04 // PROTOCOLS Q4</span>
              <h3 className="text-lg font-bold text-white">Metaverse Sandbox Integration</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Translation of 2D generative liquid assets directly into optimized 3D avatar objects for high-throughput sandbox environments.
              </p>
              <div className="px-2 py-0.5 rounded bg-gray-600/20 text-gray-400 text-[9px] font-bold tracking-wider inline-block uppercase font-mono">
                Pending
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 9: CTA FORM SECTION */}
      <section className="relative py-28 z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="glass-panel p-8 sm:p-20 rounded-[40px] text-center space-y-8 relative overflow-hidden bg-gradient-to-br from-[#121212] via-[#121212] to-[#0A201A]">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00FFB2]/5 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/5 blur-3xl rounded-full" />

          <div className="space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-semibold text-[#00FFB2] uppercase tracking-[0.3em]">SOVEREIGN ACCESS LIMIT</span>
            <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none">
              Join the AXON Digital <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFB2] to-[#D4AF37] glowing-text-gold">
                Revolution
              </span>
            </h2>
            <p className="text-sm sm:text-base text-gray-400">
              Apply now to whitelist your wallet address for exclusive future governance drops and immediate gas discounts on standard secondary marketplace purchases.
            </p>
          </div>

          <div className="max-w-md mx-auto pt-6">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                confetti({
                  particleCount: 150,
                  spread: 80,
                  colors: ["#00FFB2", "#D4AF37"]
                });
                alert("🚀 Whitelist Registration request processed. Check your verification dashboard or linked wallet.");
              }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input 
                required
                type="email" 
                placeholder="Enter elite email coordinate..." 
                className="flex-grow bg-black/60 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-[#00FFB2] transition placeholder-gray-600 text-white"
              />
              <button 
                type="submit"
                className="px-8 py-4 bg-[#00FFB2] hover:bg-white text-black font-bold uppercase tracking-wider text-xs rounded-2xl shadow-[0_5px_20px_rgba(0,255,178,0.3)] hover:shadow-white transition duration-300"
              >
                Join Whitelist
              </button>
            </form>
            <span className="block text-[10px] text-gray-500 font-mono tracking-wide mt-3">* Safe execution space. Zero spam guarantee. Address never shared.</span>
          </div>

        </div>
      </section>

      {/* SECTION 10: PREMIUM FOOTER */}
      <footer className="relative py-12 border-t border-white/5 bg-[#080808] z-20 px-4 sm:px-6 lg:px-8 text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#00FFB2] to-[#D4AF37] p-[1.5px]">
                <div className="w-full h-full bg-[#0A0A0A] rounded-[7px] flex items-center justify-center font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#00FFB2] to-[#D4AF37] text-sm">
                  AX
                </div>
              </div>
              <span className="font-extrabold text-white tracking-widest text-base">AXON DIGITAL</span>
            </div>
            <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
              Decentralized ecosystem for compounding premium digital quartz artifacts. Built with Apple HIG principles.
            </p>
            <div className="text-xs text-[#00FFB2] font-mono flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#00FFB2]" />
              <span>Smart Contract Verified Audit CertiK Verified</span>
            </div>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">RESOURCES</h4>
            <ul className="space-y-2 text-xs text-gray-400 font-medium">
              <li><a href="#hero" className="hover:text-[#00FFB2] transition">Core Matrix</a></li>
              <li><a href="#plans" className="hover:text-[#00FFB2] transition">Sovereign Plans</a></li>
              <li><a href="#about" className="hover:text-[#00FFB2] transition">What is AXON</a></li>
              <li><a href="#showcase" className="hover:text-[#00FFB2] transition">AI Lore Creator</a></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">ECOSYSTEM</h4>
            <ul className="space-y-2 text-xs text-gray-400 font-medium">
              <li><a href="https://etherscan.io" target="_blank" className="hover:text-[#00FFB2] transition flex items-center">Etherscan <ExternalLink className="w-3 h-3 ml-1" /></a></li>
              <li><a href="https://opensea.io" target="_blank" className="hover:text-[#00FFB2] transition flex items-center">OpenSea <ExternalLink className="w-3 h-3 ml-1" /></a></li>
              <li><a href="https://discord.gg" target="_blank" className="hover:text-[#00FFB2] transition flex items-center">Discord Access <ExternalLink className="w-3 h-3 ml-1" /></a></li>
              <li><a href="https://github.com" target="_blank" className="hover:text-[#00FFB2] transition flex items-center">GitHub Repos <ExternalLink className="w-3 h-3 ml-1" /></a></li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">LEGAL & COMPLIANCE</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Decentralized tokens represent software licensing yield multipliers. Zero guaranteed value representation is implicit. Verify native gas bounds on your sovereign chain before minting.
            </p>
            <p className="text-[10px] text-gray-600 font-mono">
              © {new Date().getFullYear()} AXON DIGITAL Inc. All rights reserved.
            </p>
          </div>

        </div>
      </footer>


      {/* INTERACTIVE COMPOSABLE: CONNECT WALLET SIMULATION DIALOG MODAL */}
      <AnimatePresence>
        {isWalletModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* outer backdrop glassmorphic blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWalletModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* main modal body */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-md rounded-3xl glass-panel-neon border border-[#00FFB2]/20 p-6 sm:p-8 z-10 space-y-6 text-left shadow-2xl"
            >
              
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono tracking-widest text-[#00FFB2] uppercase font-bold block">SECURE METAMASK / COINBASE SYNC</span>
                  <h3 className="text-2xl font-black text-white tracking-tight">Connect Web3 Wallet</h3>
                </div>
                <button 
                  onClick={() => setIsWalletModalOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-gray-400">
                Select your preferred decentralized wallet software to authorize cryptographic interaction arrays on the AXON network.
              </p>

              <div className="space-y-3">
                
                {/* Metamask */}
                <button 
                  onClick={() => handleConnectWallet("Metamask")}
                  className="w-full p-4 rounded-xl bg-black/40 border border-white/5 hover:border-[#00FFB2]/30 flex items-center justify-between text-left hover:bg-white/[0.02] transition"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-[#00FFB2]">
                      🦊
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-white">MetaMask Wallet</span>
                      <span className="text-[10px] text-gray-500">Connect using browser extension securely</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>

                {/* Coinbase */}
                <button 
                  onClick={() => handleConnectWallet("Coinbase")}
                  className="w-full p-4 rounded-xl bg-black/40 border border-white/5 hover:border-[#D4AF37]/30 flex items-center justify-between text-left hover:bg-white/[0.02] transition"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[#D4AF37]">
                      🛡️
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-white">Coinbase Wallet</span>
                      <span className="text-[10px] text-gray-500">Sign in with mobile CoinBase App</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>

                {/* WalletConnect */}
                <button 
                  onClick={() => handleConnectWallet("WalletConnect")}
                  className="w-full p-4 rounded-xl bg-black/40 border border-white/5 hover:border-purple-500/30 flex items-center justify-between text-left hover:bg-white/[0.02] transition"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                      🔗
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-white">WalletConnect Portal</span>
                      <span className="text-[10px] text-gray-500">Scan QR Code from standard ledger or mobile app</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>

              </div>

              <div className="text-[10px] text-gray-500 font-mono text-center border-t border-white/5 pt-4">
                🔒 Protected by End-to-End Cryptographic SSL Arrays
              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
