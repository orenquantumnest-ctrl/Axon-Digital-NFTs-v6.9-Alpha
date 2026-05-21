'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Users, ArrowDownToLine, ArrowUpFromLine, Package, 
  ListOrdered, Network, Bell, ShieldAlert, ShieldCheck, Settings, LogOut, Menu, X, Activity, Lock, Search, Loader2, Database
} from 'lucide-react';
import { useRole } from '@/components/admin/RoleContext';
import { supabase } from '@/lib/supabase';

export function AdminLayout({ 
  children, 
  pageTitle, 
  pageDescription, 
  kicker = "Admin Module"
}: { 
  children: React.ReactNode;
  pageTitle: string;
  pageDescription: string;
  kicker?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { role, setRole, hasAccess } = useRole();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    users: any[];
    plans: any[];
    transactions: any[];
  }>({ users: [], plans: [], transactions: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        setShowSearchDropdown(true);

        try {
           // Searching using ilike queries against some assumed columns. 
           // Will fallback safely if table doesn't exist
           const [usersRes, plansRes, txsRes] = await Promise.all([
             supabase.from('users').select('id, wallet_address').ilike('wallet_address', `%${searchQuery}%`).limit(3),
             supabase.from('plans').select('id, name').ilike('name', `%${searchQuery}%`).limit(3),
             supabase.from('transactions').select('id, amount, status').ilike('id', `%${searchQuery}%`).limit(3),
           ]);

           setSearchResults({
             users: usersRes.data || [],
             plans: plansRes.data || [],
             transactions: txsRes.data || []
           });
        } catch (error) {
           console.error("Search failed:", error);
        } finally {
           setIsSearching(false);
        }
      } else {
        setSearchResults({ users: [], plans: [], transactions: [] });
        setShowSearchDropdown(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const stats = [
    { label: 'Total Users', value: '1,248' },
    { label: 'Active Plans', value: '412' },
    { label: 'Pending Deposits', value: '14' },
    { label: 'Pending Withdrawals', value: '7' },
    { label: 'Transactions', value: '8,924' },
    { label: 'Catalog Items', value: '12' },
    { label: 'Claim Accounts', value: '890' },
    { label: 'Free Miners', value: '2,104' },
  ];

  const navLinks = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
    { href: '/admin/database', label: 'Database', icon: Database },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/nfts', label: 'NFTs', icon: Package },
    { href: '/admin/referrals', label: 'Referrals', icon: Network },
    { href: '/admin/audit', label: 'Audit Logs', icon: Activity },
    { href: '/admin/security', label: 'Security', icon: ShieldAlert },
    { href: '/admin/transactions', label: 'Transactions', icon: ListOrdered },
    { href: '/admin/roles', label: 'RBAC Roles', icon: ShieldCheck },
  ];

  const authorized = hasAccess(pathname || '') || pathname === '/admin/login';
  const safePathname = pathname || '';

  return (
    <div className="flex h-screen w-full bg-[#050505] font-sans text-slate-200 overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#00FFB2]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[150px]"></div>
      </div>
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 border-r border-white/10 bg-[#0A0A0A]/95 backdrop-blur-2xl flex flex-col transition-transform duration-300
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex
      `}>
        <div className="p-6 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/axon-logo-icon.png" alt="AXON" className="w-full h-full object-cover" />
            </div>
            <div>
              <strong className="block text-white tracking-widest text-sm">AXON ADMIN</strong>
               <span className="text-[10px] text-slate-500 uppercase tracking-widest">V6.9 Console</span>
            </div>
          </Link>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
            <X className="w-5 h-5"/>
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-1.5 mt-4 overflow-y-auto custom-scrollbar">
          {navLinks.filter(l => hasAccess(l.href)).map((link) => {
            const isActive = link.exact ? safePathname === link.href : safePathname.startsWith(link.href);
            return (
              <Link 
                key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-[#00FFB2]/10 text-[#00FFB2] border border-[#00FFB2]/20' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'}`}
              >
                <link.icon className="w-4 h-4" />{link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/5 space-y-3">
          <div className="bg-[#121212] rounded-xl p-3 border border-white/5">
             <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2 flex items-center gap-2">
               <ShieldCheck className="w-3 h-3 text-[#D4AF37]"/> Active Role
             </div>
             <select 
               value={role} 
               onChange={(e) => setRole(e.target.value as any)}
               className="w-full bg-[#050505] border border-white/10 text-white rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#D4AF37] cursor-pointer"
             >
               <option value="Super Admin">Super Admin (All Access)</option>
               <option value="Finance Admin">Finance Admin</option>
               <option value="Support Admin">Support Admin</option>
               <option value="Analyst Admin">Analyst Admin</option>
             </select>
          </div>
        </div>
      </aside>
      
      <main className="flex-1 flex flex-col min-w-0 z-10 relative">
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-md">
          <Link href="/admin" className="flex items-center gap-2 text-white font-bold tracking-widest">
            <span className="text-[#00FFB2]">AXON</span> ADMIN
          </Link>
          <button className="text-slate-400 hover:text-white" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-6 h-6"/>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {authorized && (
            <div className="mb-8 flex items-center justify-between gap-4 max-w-4xl relative" ref={searchRef}>
               <div className="relative flex-1 max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     {isSearching ? <Loader2 className="h-4 w-4 text-[#D4AF37] animate-spin" /> : <Search className="h-5 w-5 text-slate-500" />}
                  </div>
                  <input 
                    type="text" 
                    placeholder="Global search users, plans, transactions..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#121212] border border-white/5 rounded-full py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-[#D4AF37]/50 focus:outline-none transition-colors" 
                  />
                  
                  {/* Search Dropdown */}
                  {showSearchDropdown && (searchQuery.length >= 2) && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-xl overflow-hidden z-50 flex flex-col max-h-[300px] overflow-y-auto custom-scrollbar">
                       {(!searchResults.users.length && !searchResults.plans.length && !searchResults.transactions.length && !isSearching) ? (
                         <div className="p-4 text-center text-sm text-slate-500">No results found for &quot;{searchQuery}&quot;</div>
                       ) : (
                         <>
                           {searchResults.users.length > 0 && (
                             <div className="p-2 border-b border-white/5 last:border-0">
                               <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-1">Users</div>
                               {searchResults.users.map(u => (
                                 <Link href={`/admin/users`} key={u.id} className="flex px-2 py-1.5 hover:bg-white/5 rounded-lg text-sm text-white items-center gap-2" onClick={() => setShowSearchDropdown(false)}>
                                   <Users className="w-3.5 h-3.5 text-slate-400" />
                                   {u.wallet_address || u.id}
                                 </Link>
                               ))}
                             </div>
                           )}
                           {searchResults.plans.length > 0 && (
                             <div className="p-2 border-b border-white/5 last:border-0">
                               <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-1">Plans</div>
                               {searchResults.plans.map(p => (
                                 <Link href={`/admin/plans`} key={p.id} className="flex px-2 py-1.5 hover:bg-white/5 rounded-lg text-sm text-white items-center gap-2" onClick={() => setShowSearchDropdown(false)}>
                                   <Package className="w-3.5 h-3.5 text-[#00FFB2]" />
                                   {p.name || p.id}
                                 </Link>
                               ))}
                             </div>
                           )}
                           {searchResults.transactions.length > 0 && (
                             <div className="p-2 border-b border-white/5 last:border-0">
                               <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-1">Transactions</div>
                               {searchResults.transactions.map(t => (
                                 <Link href={`/admin/transactions`} key={t.id} className="flex px-2 py-1.5 hover:bg-white/5 rounded-lg text-sm text-white items-center gap-2" onClick={() => setShowSearchDropdown(false)}>
                                   <ListOrdered className="w-3.5 h-3.5 text-[#D4AF37]" />
                                   {t.id} - {t.amount} {t.status}
                                 </Link>
                               ))}
                             </div>
                           )}
                         </>
                       )}
                    </div>
                  )}
               </div>
               
               <div className="flex items-center gap-3">
                 <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                    <Bell className="w-5 h-5"/>
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#050505]"></span>
                 </button>
               </div>
            </div>
          )}

          <section className="mb-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-2 py-1 rounded">
                  {kicker}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mt-3 mb-1">{pageTitle}</h1>
                <p className="text-slate-400 text-sm max-w-2xl">{pageDescription}</p>
              </div>
            </div>
          </section>
          
          <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
            {stats.map((stat, idx) => (
              <article key={idx} className="bg-[#121212]/60 border border-white/5 p-4 rounded-2xl">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">{stat.label}</span>
                <strong className="text-xl text-white font-mono block mt-1">{stat.value}</strong>
              </article>
            ))}
          </section>
          
          <div className="relative z-10">
            {authorized ? children : (
              <div className="bg-[#121212]/60 border border-red-500/20 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                 <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                   <Lock className="w-8 h-8 text-red-500" />
                 </div>
                 <h2 className="text-2xl font-bold text-white mb-3">Access Denied</h2>
                 <p className="text-slate-400 max-w-md mx-auto">
                   Your current role <strong className="text-white">({role})</strong> does not have the required permissions to view this system module.
                 </p>
                 <button onClick={() => router.push('/admin')} className="mt-8 px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white text-sm font-bold transition-colors border border-white/10">
                   Return to Dashboard
                 </button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Mobile nav overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)}></div>
      )}
    </div>
  );
}

