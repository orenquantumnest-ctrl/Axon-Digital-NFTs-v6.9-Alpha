'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Users, ArrowDownToLine, ArrowUpFromLine, Package, 
  ListOrdered, Network, Bell, ShieldAlert, ShieldCheck, Settings, LogOut, Menu, X, Activity
} from 'lucide-react';

export function AdminLayout({ 
  children, 
  pageTitle, 
  pageDescription, 
  kicker 
}: { 
  children: React.ReactNode;
  pageTitle: string;
  pageDescription: string;
  kicker: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/deposits', label: 'Deposits', icon: ArrowDownToLine },
    { href: '/admin/withdrawals', label: 'Withdrawals', icon: ArrowUpFromLine },
    { href: '/admin/plans', label: 'Plans', icon: Package },
    { href: '/admin/transactions', label: 'Transactions', icon: ListOrdered },
    { href: '/admin/referrals', label: 'Referrals', icon: Network },
    { href: '/admin/fraud', label: 'Fraud Engine', icon: ShieldAlert },
    { href: '/admin/notifications', label: 'Signals', icon: Bell },
    { href: '/admin/audit', label: 'Audit Replay', icon: Activity },
    { href: '/admin/roles', label: 'RBAC Roles', icon: ShieldCheck },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

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
              <img src="https://axondigitalnfts.com/images/axon-logo-icon.png" alt="AXON" className="w-full h-full object-cover" />
            </div>
            <div>
              <strong className="block text-white tracking-widest text-sm">AXON ADMIN</strong>
               <span className="text-[10px] text-slate-500 uppercase tracking-widest">V6.9 Console</span>
            </div>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-1.5 mt-4 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
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
      </aside>
      <main className="flex-1 flex flex-col min-w-0 z-10">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
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
          <div className="relative z-10">{children}</div>
        </div>
      </main>
    </div>
  );
}
