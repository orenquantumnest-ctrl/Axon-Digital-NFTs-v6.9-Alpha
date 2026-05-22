"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  Server, Shield, Users, Coins, TrendingUp, HelpCircle,
  Database, AlertTriangle, LogOut, Menu, X, Bell,
  FileSpreadsheet, Lock, Activity, Layers, Radio
} from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";

interface NavItem {
  name: string;
  href: string;
  icon: any;
  desc: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: "Ledger Explorer", href: "/admin", icon: Database, desc: "Database schemas & live entries" },
  { name: "Users Registry", href: "/admin/users", icon: Users, desc: "Connected address profiling" },
  { name: "NFT Collection", href: "/admin/nfts", icon: Coins, desc: "Mint control & floor setups" },
  { name: "Staking Plans", href: "/admin/plans", icon: TrendingUp, desc: "Pool rates & APY settings" },
  { name: "Ecosystem Ledger", href: "/admin/transactions", icon: FileSpreadsheet, desc: "All system transaction receipts" },
  { name: "Financial Flows", href: "/admin/flows", icon: Activity, desc: "Deposit approvals & withdrawals" },
  { name: "Syndicate Program", href: "/admin/referrals", icon: Layers, desc: "Referral trees & multipliers" },
  { name: "MFA & Security Keys", href: "/admin/security", icon: Lock, desc: "Breach indicators & shell keys" },
  { name: "System Audits", href: "/admin/audit", icon: Shield, desc: "Anti-fraud limits & blacklists" },
  { name: "Global Broadcasts", href: "/admin/notifications", icon: Bell, desc: "Custom webhooks & user alerts" },
  { name: "Core Admin Roles", href: "/admin/roles", icon: Radio, desc: "Super admin & operator keys" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const currentPath = usePathname();
  const [mounted, setMounted] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [adminWallet, setAdminWallet] = useState("");
  const [adminRole, setAdminRole] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const role = localStorage.getItem("axon_admin_role");
    const wallet = localStorage.getItem("axon_admin_wallet");
    
    // Allow access to login page without redirection loop
    if (currentPath === "/admin/login") {
      setAuthorized(true);
      return;
    }

    if (role !== "Super Admin" || !wallet) {
      router.push("/admin/login");
    } else {
      setAuthorized(true);
      setAdminWallet(wallet);
      setAdminRole(role);
    }
  }, [router, currentPath]);

  const handleLogout = () => {
    localStorage.removeItem("axon_admin_role");
    localStorage.removeItem("axon_admin_wallet");
    
    // Clear cookie states securely on client
    document.cookie = "axon_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "axon_admin_wallet=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    router.push("/admin/login");
  };

  if (!mounted || !authorized) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="absolute inset-0 bg-radial from-purple-950/20 via-black to-black pointer-events-none" />
        <RefreshCcw className="w-8 h-8 text-[#00FFB2] animate-spin mb-4" />
        <h3 className="text-sm font-mono tracking-wider text-gray-400">CONNECTING TO SECURE AXON CLOUD CORE...</h3>
      </div>
    );
  }

  // If path is login, don't overlay the administrative sidebar
  if (currentPath === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex relative overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-[#00FFB2]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-[#D4AF37]/5 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20" />
      </div>

      {/* 1. Sidebar - Desktop size */}
      <aside className="hidden lg:flex flex-col w-80 shrink-0 border-r border-white/5 bg-black/40 backdrop-blur-3xl z-30 sticky top-0 h-screen select-none">
        {/* Brand Banner */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="relative w-7 h-7 flex items-center justify-center rounded-lg bg-gradient-to-br from-[#00FFB2] to-[#D4AF37] p-[1.5px] transition-transform duration-300 group-hover:scale-105">
              <span className="w-full h-full bg-[#0A0A0A] rounded-[6px] flex items-center justify-center text-xs font-mono font-bold text-[#00FFB2]">
                AEX
              </span>
            </div>
            <div>
              <span className="font-bold tracking-tight text-white group-hover:text-[#00FFB2] transition-colors leading-none block">
                AXON DIGITAL
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] block mt-0.5 uppercase">
                ADMIN CONSOLE
              </span>
            </div>
          </Link>
          <span className="w-2 h-2 rounded-full bg-[#00FFB2] animate-pulse" />
        </div>

        {/* Current Admin Session User */}
        <div className="p-4 mx-4 my-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#00FFB2]/10 border border-[#00FFB2]/30 flex items-center justify-center">
              <Shield className="w-4 h-4 text-[#00FFB2]" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold truncate text-white">Super Administrator</div>
              <div className="text-[10px] font-mono text-[#D4AF37] truncate">{adminWallet}</div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full mt-2 py-1.5 text-center text-[11px] text-red-400 hover:text-white hover:bg-red-500/15 border border-red-500/20 hover:border-red-500/50 rounded-lg transition-all font-mono flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Disconnect Console
          </button>
        </div>

        {/* Live Nav Items */}
        <nav className="flex-1 overflow-y-auto px-4 pb-6 space-y-1 scrollbar-thin">
          <div className="text-[10px] text-gray-500 font-bold tracking-wider font-mono px-3 mb-2 uppercase">Core Registers</div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
                  isActive 
                    ? "bg-[#00FFB2]/10 border border-[#00FFB2]/20 text-[#00FFB2]" 
                    : "border border-transparent hover:bg-white/[0.02] text-gray-400 hover:text-white"
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-colors ${
                  isActive ? "bg-[#00FFB2]/10 text-[#00FFB2]" : "bg-white/5 text-gray-400 group-hover:text-white"
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-semibold">{item.name}</div>
                  <div className="text-[9px] text-gray-500 truncate">{item.desc}</div>
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* 2. Page viewport section container */}
      <main className="flex-1 min-h-screen flex flex-col relative z-10 overflow-hidden">
        
        {/* Mobile Navbar Header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-white/5 bg-black/80 backdrop-blur-md sticky top-0 z-30 select-none">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">AXON DIGITAL</div>
              <div className="text-[9px] font-mono text-[#D4AF37]">SYSTEM CONTROL</div>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-[#00FFB2] animate-pulse" />
        </header>

        {/* Mobile Dropdown Nav Menu Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[60px] bg-black/95 backdrop-blur-lg z-40 flex flex-col p-6 overflow-y-auto">
            <div className="text-[10px] text-gray-500 font-bold tracking-widest font-mono mb-4 uppercase">Registers Navigation</div>
            <div className="space-y-2 mb-8">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.href;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      isActive 
                        ? "bg-[#00FFB2]/10 border border-[#00FFB2]/20 text-[#00FFB2]" 
                        : "border border-white/5 bg-white/[0.01] text-gray-400"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div>
                      <div className="text-xs font-semibold">{item.name}</div>
                      <div className="text-[10px] text-gray-500">{item.desc}</div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col gap-2 mt-auto">
              <div className="text-xs font-bold text-white">Super Admin Session</div>
              <div className="text-[9px] font-mono text-[#D4AF37] truncate">{adminWallet}</div>
              <button 
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="w-full mt-2 py-2 text-center text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg"
              >
                Disconnect
              </button>
            </div>
          </div>
        )}

        {/* Dynamic page contents widget space */}
        <div className="flex-1 p-6 max-w-7xl w-full mx-auto md:p-8 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}

// Support fallback loader
function RefreshCcw(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}
