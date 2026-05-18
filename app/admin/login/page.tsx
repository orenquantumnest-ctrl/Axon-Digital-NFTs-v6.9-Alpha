'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from "@/components/admin/GlassCard";
import { Shield, Key, User, Lock, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [superWallet, setSuperWallet] = useState('');
  const [superPassword, setSuperPassword] = useState('');

  const [subUser, setSubUser] = useState('');
  const [subPin, setSubPin] = useState('');

  const handleSuperAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Simulate auth check
    setTimeout(() => {
      if (superWallet && superPassword) {
        router.push('/admin');
      } else {
        setError('Please enter valid super-admin credentials.');
        setLoading(false);
      }
    }, 1000);
  };

  const handleSubAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Simulate auth check
    setTimeout(() => {
      if (subUser && subPin) {
        router.push('/admin');
      } else {
        setError('Please enter valid sub-admin credentials.');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#050505] relative flex items-center justify-center p-4 overflow-hidden font-sans text-slate-200">
      
      {/* Background Animated Gradient & Noise */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#00FFB2]/10 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-10000"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[150px] mix-blend-screen" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-12 pb-12">
        
        {/* Left Side: Branding / Info */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="col-span-1 lg:col-span-5 flex flex-col justify-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-[#00FFB2] animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Private Operations</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white leading-[1.1]">
            AXON<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFB2] to-[#00b27c]">Admin</span> Access
          </h1>
          
          <p className="text-slate-400 text-lg leading-relaxed max-w-md">
            Login with the official admin wallet and password, or with a sub-admin username and PIN. No private admin key is used in the frontend.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button onClick={() => router.push('/')} className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all flex items-center gap-2">
              <Cpu className="w-4 h-4" /> Go to Home
            </button>
          </div>
        </motion.div>

        {/* Right Side: Login Forms container */}
        <div className="col-span-1 lg:col-span-7 flex flex-col gap-6 w-full max-w-xl mx-auto lg:mx-0 lg:ml-auto">
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center gap-3 backdrop-blur-xl"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
              {error}
            </motion.div>
          )}

          {/* Super Admin Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <GlassCard className="relative overflow-hidden group">
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
                  <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">Super-Admin Login</h2>
              </div>

              <form onSubmit={handleSuperAdminLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="superWallet" className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Wallet Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Shield className="h-5 w-5 text-slate-500" />
                    </div>
                    <input 
                      id="superWallet" type="text" placeholder="0x..." required
                      value={superWallet} onChange={(e) => setSuperWallet(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-all font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="superPin" className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Key className="h-5 w-5 text-slate-500" />
                    </div>
                    <input 
                      id="superPin" type="password" placeholder="Enter secure password" required
                      value={superPassword} onChange={(e) => setSuperPassword(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-all text-sm"
                    />
                  </div>
                </div>

                <button 
                  type="submit" disabled={loading}
                  className="w-full mt-2 py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8942E] text-black font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all flex items-center justify-center gap-2 group/btn disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? 'Authenticating...' : 'Login as Super-Admin'}
                  {!loading && <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />}
                </button>
              </form>
            </GlassCard>
          </motion.div>

          {/* Sub Admin Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <GlassCard className="relative overflow-hidden group/sub bg-[#121212]/40 backdrop-blur-xl border border-white/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover/sub:bg-white/10 transition-colors">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">Sub-Admin Login</h2>
              </div>

              <form onSubmit={handleSubAdminLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="subUsername" className="text-xs font-semibold text-slate-500 uppercase tracking-widest pl-1">Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-600" />
                    </div>
                    <input 
                      id="subUsername" type="text" placeholder="department.username" required
                      value={subUser} onChange={(e) => setSubUser(e.target.value)}
                      className="w-full bg-[#050505] border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-white placeholder-slate-700 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="subPin" className="text-xs font-semibold text-slate-500 uppercase tracking-widest pl-1">PIN</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-600" />
                    </div>
                    <input 
                      id="subPin" type="password" placeholder="Enter secure PIN" required
                      value={subPin} onChange={(e) => setSubPin(e.target.value)}
                      className="w-full bg-[#050505] border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-white placeholder-slate-700 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all text-sm"
                    />
                  </div>
                </div>

                <button 
                  type="submit" disabled={loading}
                  className="w-full mt-2 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 group/btn2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? 'Authenticating...' : 'Login as Sub-Admin'}
                  {!loading && <ArrowRight className="w-4 h-4 group-hover/btn2:translate-x-1 transition-transform" />}
                </button>
              </form>
            </GlassCard>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
