"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { 
  ShieldCheck, Shield, Users, Radio, CheckCircle, 
  Trash, Plus, RefreshCcw, UserPlus, Key
} from "lucide-react";

interface AdminRoleAccount {
  id: string;
  associatedWallet: string;
  assignedRole: "Super Admin" | "Operator Node" | "Auditor Desk";
  addedAt: string;
  accessCount: number;
}

const INITIAL_ROLES: AdminRoleAccount[] = [
  { id: "ADM-99", associatedWallet: "0x7bbc21dbff39db9a1cb1db9a1cb1db9a1cb1db9a", assignedRole: "Super Admin", addedAt: "2026-05-01 12:00", accessCount: 541 },
  { id: "ADM-42", associatedWallet: "0x1234567890123456789012345678901234567890", assignedRole: "Auditor Desk", addedAt: "2026-05-10 14:30", accessCount: 122 },
  { id: "ADM-12", associatedWallet: "0x3bc789a1bc1db9a1cb1db9a1cb1db9a1cb1db9aa", assignedRole: "Operator Node", addedAt: "2026-05-15 09:15", accessCount: 9 }
];

export default function CoreRoles() {
  const [admins, setAdmins] = useState<AdminRoleAccount[]>(INITIAL_ROLES);
  const [newWallet, setNewWallet] = useState("");
  const [newRole, setNewRole] = useState<"Super Admin" | "Operator Node" | "Auditor Desk">("Operator Node");
  const [alert, setAlert] = useState("");

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWallet) return;

    const fresh: AdminRoleAccount = {
      id: `ADM-${Math.floor(10 + Math.random() * 89)}`,
      associatedWallet: newWallet,
      assignedRole: newRole,
      addedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      accessCount: 0
    };

    setAdmins([...admins, fresh]);
    setAlert(`Authorized operator key connected! Wallet ${newWallet.substring(0, 10)}... recognized as ${newRole}.`);
    setNewWallet("");
  };

  const handleDeleteRole = (id: string, wallet: string) => {
    const activeWallet = localStorage.getItem("axon_admin_wallet");
    if (wallet === activeWallet) {
      setAlert("Access Blocked: You cannot revoke authorization keys from your active session wallet!");
      return;
    }

    setAdmins(prev => prev.filter(item => item.id !== id));
    setAlert(`Revoked authentication clearance for ID ${id}. Key flagged and locked.`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <span className="p-1 px-3 text-[10px] bg-purple-500/10 border border-purple-500/40 text-purple-400 rounded-full font-mono uppercase tracking-widest font-bold">
            ROLES MANAGER
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
        </div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white mt-1">
          Core Administrators & <span className="text-gradient-emerald">Operators</span> Registry
        </h1>
        <p className="text-xs text-gray-500 font-mono mt-0.5">
          Attach multi-sig authorization keys, designate Node Operators or Audit Desks.
        </p>
      </div>

      {alert && (
        <div className="p-3.5 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-xl text-xs font-mono flex items-center justify-between">
          <span>{alert}</span>
          <button onClick={() => setAlert("")} className="text-gray-400 hover:text-white uppercase text-[10px]">Close</button>
        </div>
      )}

      {/* Grid view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Right Tab: Add Admin wallet key */}
        <div className="lg:col-span-5">
          <GlassCard className="p-6 border-white/5 bg-white/[0.01]/10" hoverEffect={false}>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-[#D4AF37]" /> Register Operator Key
            </h3>

            <form onSubmit={handleCreateRole} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono tracking-wider text-gray-400 uppercase mb-1">Cryptographic Web3 Wallet</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. 0x1234567890123456789012345678901234567890"
                  value={newWallet}
                  onChange={(e) => setNewWallet(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00FFB2] font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono tracking-wider text-gray-400 uppercase mb-1">Access Authorization Level</label>
                <select 
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full bg-black/40 border border-[#00FFB2]/20 rounded-lg px-3 py-2 text-xs text-gray-400 focus:outline-none focus:border-[#00FFB2]"
                >
                  <option value="Super Admin">Super Admin (Consensus Authority)</option>
                  <option value="Operator Node">Operator Node (Validator Controls)</option>
                  <option value="Auditor Desk">Auditor Desk (Read/Flag Limits)</option>
                </select>
              </div>

              <GlowButton type="submit" className="w-full py-2.5 text-xs font-semibold">
                Authorize Operator Key
              </GlowButton>
            </form>
          </GlassCard>
        </div>

        {/* Left list: Admin List */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-display font-semibold text-white text-sm">Active Authorized Administrations</h3>
          
          <div className="space-y-4">
            {admins.map((adm) => (
              <GlassCard key={adm.id} className="p-5 border-white/5 bg-white/[0.01]" hoverEffect={false}>
                <div className="flex justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                      <Key className="w-4 h-4 text-[#00FFB2]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white select-all">{adm.associatedWallet}</span>
                        <span className="text-[9px] font-mono text-gray-500">{adm.id}</span>
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1">
                        Active clearance: <span className="text-[#00FFB2] font-bold font-mono">{adm.assignedRole}</span> | Total locks signed: <span className="text-white font-bold">{adm.accessCount} sessions</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 text-right shrink-0">
                    <button 
                      onClick={() => handleDeleteRole(adm.id, adm.associatedWallet)}
                      className="p-1 px-3 border border-red-500/20 hover:border-red-500 text-[10px] font-mono font-bold text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                      title="Revoke and Flag key"
                    >
                      Revoke Clearance
                    </button>
                    <span className="text-[9px] font-mono text-gray-500">Recognized: {adm.addedAt}</span>
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
