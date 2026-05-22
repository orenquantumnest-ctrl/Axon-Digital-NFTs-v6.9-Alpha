"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { 
  Bell, Send, Trash, Sparkles, Megaphone, CheckCircle, 
  Settings, Clock, Radio, Info
} from "lucide-react";

interface EcosystemAlert {
  id: string;
  title: string;
  body: string;
  targetGroup: "All Users" | "Pro Holders" | "Elite Only";
  sentAt: string;
  clicksCount: number;
}

const INITIAL_ALERTS: EcosystemAlert[] = [
  { id: "ALT-901", title: "Protocol Upgrade Complete", body: "L2 optimization complete. Staking gas outputs decreased 41%.", targetGroup: "All Users", sentAt: "Today, 10:14", clicksCount: 1204 },
  { id: "ALT-812", title: "Exclusive Pro Staking Pool Open", body: "Re-distribution of unclaimed APR pools starting midnight UTC.", targetGroup: "Pro Holders", sentAt: "Yesterday, 14:00", clicksCount: 421 },
  { id: "ALT-002", title: "Private Oracle Meeting Release", body: "Secret metadata reveal event invitation signature required.", targetGroup: "Elite Only", sentAt: "May 19, 11:32", clicksCount: 34 }
];

export default function GlobalBroadcasts() {
  const [alerts, setAlerts] = useState<EcosystemAlert[]>(INITIAL_ALERTS);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newGroup, setNewGroup] = useState<"All Users" | "Pro Holders" | "Elite Only">("All Users");
  const [alert, setAlert] = useState("");

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newBody) return;

    const fresh: EcosystemAlert = {
      id: `ALT-${Math.floor(100 + Math.random() * 900)}`,
      title: newTitle,
      body: newBody,
      targetGroup: newGroup,
      sentAt: "Just Now",
      clicksCount: 0
    };

    setAlerts([fresh, ...alerts]);
    setAlert(`Ecosystem Notification "${newTitle}" dispatched cleanly to the smart-signers list!`);
    setNewTitle("");
    setNewBody("");
  };

  const handleDelete = (id: string) => {
    setAlerts(prev => prev.filter(item => item.id !== id));
    setAlert("Notification removed from archive.");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <span className="p-1 px-3 text-[10px] bg-[#00FFB2]/10 border border-[#00FFB2]/40 text-[#00FFB2] rounded-full font-mono uppercase tracking-widest font-bold">
            BROADCAST DESK
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FFB2] animate-pulse" />
        </div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white mt-1">
          Global Broadcasts & <span className="text-gradient-emerald">Announcements</span>
        </h1>
        <p className="text-xs text-gray-500 font-mono mt-0.5">
          Send ecosystem messages, trigger webhooks, and push wallet events alerts.
        </p>
      </div>

      {alert && (
        <div className="p-3.5 bg-[#00FFB2]/10 border border-[#00FFB2]/30 text-[#00FFB2] rounded-xl text-xs font-mono flex items-center justify-between">
          <span>{alert}</span>
          <button onClick={() => setAlert("")} className="text-gray-400 hover:text-white uppercase text-[10px]">Close</button>
        </div>
      )}

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Dispatches */}
        <div className="lg:col-span-5">
          <GlassCard className="p-6 border-white/5 bg-white/[0.01]/10" hoverEffect={false}>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-[#D4AF37]" /> Create Broadcast
            </h3>
            
            <form onSubmit={handleBroadcast} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono tracking-wider text-gray-400 uppercase mb-1">Alert Title Heading</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Mandatory contract migrations release"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00FFB2]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono tracking-wider text-gray-400 uppercase mb-1">Target Audience Segment</label>
                <select 
                  value={newGroup}
                  onChange={(e) => setNewGroup(e.target.value as any)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-400 focus:outline-none"
                >
                  <option value="All Users">All Users</option>
                  <option value="Pro Holders">Pro Holders</option>
                  <option value="Elite Only">Elite Only</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono tracking-wider text-gray-400 uppercase mb-1">Alert content core (Markdown ready)</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Insert broadcast message details..."
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00FFB2] font-sans resize-none"
                />
              </div>

              <GlowButton type="submit" className="w-full py-2 text-xs font-semibold">
                Dispatch Broadcast Msg
              </GlowButton>
            </form>
          </GlassCard>
        </div>

        {/* Previous logs */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-display font-semibold text-white text-sm">Dispatched announcements library</h3>
          
          <div className="space-y-4">
            {alerts.map((item) => (
              <GlassCard key={item.id} className="p-6 border-white/5 bg-white/[0.01]" hoverEffect={false}>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white font-display text-xs">{item.title}</span>
                      <span className="text-[10px] font-mono text-gray-500">{item.id}</span>
                    </div>
                    <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-wider block mt-1">Recipient: {item.targetGroup}</span>
                    <p className="text-xs text-gray-400 mt-2 font-light leading-relaxed">{item.body}</p>
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-1 text-gray-500 hover:text-red-400 rounded hover:bg-white/5 transition-all"
                      title="Expire broadcast"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                    <span className="text-[9px] font-mono text-gray-500 mt-4">{item.sentAt} | Status: Sent</span>
                    <span className="text-[10px] font-mono text-[#00FFB2] mt-1">{item.clicksCount} clicks tracked</span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
