'use client';

import { useState } from 'react';
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Bell, Megaphone, CheckCircle, Clock, AlertCircle, Share2 } from 'lucide-react';

const NOTIFICATIONS = [
  { id: '1', title: 'System Upgrade Scheduled', message: 'V7 Sovereign Core deployment commencing at 03:00 UTC.', type: 'system', status: 'scheduled', time: 'In 2 hours' },
  { id: '2', title: 'High Deposit Volume', message: 'USDT deposits are currently 300% above daily average.', type: 'alert', status: 'active', time: '10 mins ago' },
  { id: '3', title: 'Global Broadcast Sent', message: '"New Elite Staking Pack Available" broadcast sent to 1,240 users.', type: 'broadcast', status: 'completed', time: '1 day ago' },
];

export default function AdminNotificationsPage() {
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');

  return (
    <AdminLayout 
      pageTitle="Live Push System" 
      pageDescription="Manage real-time notifications, system alerts, and global user broadcasts."
      kicker="Signals & Alerts"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Compose Broadcast */}
        <div className="lg:col-span-5 bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex flex-col h-fit">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
             <div className="w-10 h-10 bg-[#00FFB2]/10 border border-[#00FFB2]/20 rounded-xl flex items-center justify-center">
               <Megaphone className="w-5 h-5 text-[#00FFB2]" />
             </div>
             <div>
               <h3 className="text-lg font-bold text-white">Broadcast Message</h3>
               <p className="text-xs text-slate-400">Push to all active sessions immediately.</p>
             </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 mb-1.5 block">Title</label>
              <input 
                type="text" 
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="Important Update" 
                className="w-full bg-[#050505] border border-white/10 rounded-xl py-3 px-4 text-white placeholder-slate-600 focus:outline-none focus:border-[#00FFB2]/50 transition-colors text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 mb-1.5 block">Message</label>
              <textarea 
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Enter alert details..." 
                rows={4}
                className="w-full bg-[#050505] border border-white/10 rounded-xl py-3 px-4 text-white placeholder-slate-600 focus:outline-none focus:border-[#00FFB2]/50 transition-colors text-sm resize-none"
              ></textarea>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                <input type="checkbox" className="accent-[#00FFB2] w-4 h-4 cursor-pointer" /> Mobile Push
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-[#00FFB2] w-4 h-4 cursor-pointer" /> In-App Banner
              </label>
            </div>
          </div>
          
          <button className="w-full mt-8 bg-gradient-to-r from-[#00FFB2] to-[#00b27c] text-black font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(0,255,178,0.2)] hover:shadow-[0_0_30px_rgba(0,255,178,0.4)] transition-all flex items-center justify-center gap-2">
            <Share2 className="w-5 h-5" /> Execute Broadcast
          </button>
        </div>

        {/* Signals Log */}
        <div className="lg:col-span-7 bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
             <div>
               <h3 className="text-lg font-bold text-white">System Signal History</h3>
               <p className="text-xs text-slate-400">Recent broadcasts and automatic system alerts.</p>
             </div>
             <button className="text-xs text-slate-400 hover:text-white uppercase font-bold tracking-widest">Mark All Read</button>
          </div>

          <div className="space-y-4">
             {NOTIFICATIONS.map(notification => (
               <div key={notification.id} className="p-4 rounded-2xl bg-[#0A0A0A] border border-white/5 flex gap-4">
                  <div className="mt-1">
                    {notification.type === 'system' && <Clock className="w-5 h-5 text-sky-400" />}
                    {notification.type === 'alert' && <AlertCircle className="w-5 h-5 text-red-500" />}
                    {notification.type === 'broadcast' && <CheckCircle className="w-5 h-5 text-[#00FFB2]" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-sm font-bold text-white">{notification.title}</h4>
                      <span className="text-[10px] text-slate-500 font-mono">{notification.time}</span>
                    </div>
                    <p className="text-sm text-slate-400 mb-3">{notification.message}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md border
                        ${notification.status === 'scheduled' ? 'text-sky-400 bg-sky-400/10 border-sky-400/20' : ''}
                        ${notification.status === 'active' ? 'text-red-500 bg-red-500/10 border-red-500/20' : ''}
                        ${notification.status === 'completed' ? 'text-[#00FFB2] bg-[#00FFB2]/10 border-[#00FFB2]/20' : ''}
                      `}>
                        {notification.status}
                      </span>
                      <span className="text-xs text-slate-500 font-mono uppercase">Type: {notification.type}</span>
                    </div>
                  </div>
               </div>
             ))}
          </div>
          
          <button className="w-full mt-4 py-3 bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs uppercase tracking-widest rounded-xl transition-colors border border-white/10">
            View All Signals
          </button>
        </div>

      </div>
    </AdminLayout>
  );
}
