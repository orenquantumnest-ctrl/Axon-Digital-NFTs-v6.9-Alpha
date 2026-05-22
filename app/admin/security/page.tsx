"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { 
  Lock, Shield, Key, AlertTriangle, CheckCircle, 
  Terminal, Server, Radio, RefreshCcw
} from "lucide-react";

interface SecurityLog {
  id: string;
  sourceIp: string;
  event: string;
  category: "Access Granted" | "System Update" | "Intrusion Attempt" | "Lockout Triggered";
  timestamp: string;
  gravity: "Low" | "Medium" | "Critical";
}

const INITIAL_LOGS: SecurityLog[] = [
  { id: "SEC-102", sourceIp: "5.192.112.42", event: "Super Admin authorized via MFA decryption key", category: "Access Granted", timestamp: "Today, 14:32:01", gravity: "Low" },
  { id: "SEC-099", sourceIp: "182.112.33.201", event: "Whitelisted hot wallet limits updated", category: "System Update", timestamp: "Today, 12:40:15", gravity: "Low" },
  { id: "SEC-091", sourceIp: "102.14.88.9", event: "Duplicate cryptographic request signature rejected", category: "Intrusion Attempt", timestamp: "Yesterday, 18:15:10", gravity: "Medium" },
  { id: "SEC-088", sourceIp: "41.9.112.102", event: "Brute force admin passwords attempt from unauthorized geo IP", category: "Lockout Triggered", timestamp: "May 20, 09:12:05", gravity: "Critical" },
];

export default function SecurityLocks() {
  const [logs, setLogs] = useState<SecurityLog[]>(INITIAL_LOGS);
  const [mfaStatus, setMfaStatus] = useState("SECURE WITH WEBAUTHN KEYS");
  const [alert, setAlert] = useState("");

  const handleFlushBreaches = () => {
    setLogs(prev => prev.filter(log => log.gravity !== "Critical"));
    setAlert("Logged emergency anomalies flushed. Clear security status reinstated.");
  };

  const handleToggleMfa = () => {
    const nextText = mfaStatus.includes("SECURE") ? "BYPASS MODE ACTIVE (UNSAFE)" : "SECURE WITH WEBAUTHN KEYS";
    setMfaStatus(nextText);
    setAlert(`Authorized MFA profile modified: ${nextText}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <span className="p-1 px-3 text-[10px] bg-red-500/10 border border-red-500/40 text-red-400 rounded-full font-mono uppercase tracking-widest font-bold">
            GATEWAY LOCKERS
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        </div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white mt-1">
          Gateway <span className="text-gradient-gold">MFA & Security</span> Logs
        </h1>
        <p className="text-xs text-gray-500 font-mono mt-0.5">
          Revise whitelisted nodes keys, monitor brute force attempts, and lock direct interface access.
        </p>
      </div>

      {alert && (
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl text-xs font-mono flex items-center justify-between">
          <span>{alert}</span>
          <button onClick={() => setAlert("")} className="text-gray-400 hover:text-white uppercase text-[10px]">Close</button>
        </div>
      )}

      {/* Grid of cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 border-white/5 bg-white/[0.01]/10" hoverEffect={false}>
          <div className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-3">AUTHORIZED ACCESS ENVELOPE</div>
          <div className="font-mono text-xs text-gray-300 space-y-2">
            <div className="flex justify-between">
              <span>MFA Encryption:</span>
              <span className="text-[#00FFB2] font-semibold">{mfaStatus}</span>
            </div>
            <div className="flex justify-between">
              <span>Webauthn Passkeys:</span>
              <span className="text-white">Active (Hardware Keys)</span>
            </div>
          </div>
          <button 
            onClick={handleToggleMfa}
            className="w-full mt-4 py-2 text-center text-xs font-mono border border-white/10 hover:border-[#00FFB2]/30 text-gray-400 hover:text-[#00FFB2] rounded-lg transition-all"
          >
            Switch MFA Mode
          </button>
        </GlassCard>

        <GlassCard className="p-6 border-white/5 bg-white/[0.01]/10" hoverEffect={false}>
          <div className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-3">IP ORIGIN WHITELIST LIMITS</div>
          <div className="font-mono text-xs text-gray-300 space-y-2">
            <div className="flex justify-between">
              <span>Allowed Admins:</span>
              <span className="text-white font-bold">Any authorized PKI signature</span>
            </div>
            <div className="flex justify-between">
              <span>Max retry limit:</span>
              <span className="text-red-400 font-bold">3 attempts (Lock IP permanently)</span>
            </div>
          </div>
          <button 
            onClick={handleFlushBreaches}
            className="w-full mt-4 py-2 text-center text-xs font-mono border border-red-500/20 hover:bg-red-500/10 text-red-400 rounded-lg transition-all"
          >
            Clear Critical Locks
          </button>
        </GlassCard>

        <GlassCard className="p-6 border-white/5 bg-white/[0.01]/10 font-mono text-xs flex flex-col justify-between" hoverEffect={false}>
          <div>
            <span className="text-gray-400 font-bold uppercase block mb-2">VALIDATOR SIGNING SYSTEM STATUS</span>
            <div className="text-white font-bold text-lg flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#00FFB2] rounded-full animate-ping" />
              INTEGRITY VERIFIED
            </div>
          </div>
          <div className="text-gray-500 text-[10px] mt-2">
            Audit checksum matches live releases commit hashes.
          </div>
        </GlassCard>
      </div>

      {/* Main logs list */}
      <GlassCard className="p-6 border-white/5" hoverEffect={false}>
        <h3 className="font-display font-semibold text-white text-sm mb-4">Interception Security & Whitelisting Registers</h3>
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all">
              <div className="flex items-start sm:items-center gap-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                  log.gravity === "Critical" ? "bg-red-500/10 border-red-500/30 text-red-400" :
                  log.gravity === "Medium" ? "bg-amber-500/10 border-amber-500/30 text-amber-500" :
                  "bg-[#00FFB2]/10 border-[#00FFB2]/20 text-[#00FFB2]"
                }`}>
                  <Terminal className="w-4 h-4" />
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-white">{log.event}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                      log.gravity === "Critical" ? "bg-red-500/10 text-red-400" :
                      log.gravity === "Medium" ? "bg-amber-500/10 text-amber-500" :
                      "bg-[#00FFB2]/10 text-[#00FFB2]"
                    }`}>
                      {log.gravity} Gravity
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono mt-1">
                    Origin IP: <span className="text-gray-300 font-bold select-all">{log.sourceIp}</span> | Event Ref: <span className="text-gray-400">{log.id}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-gray-500 font-mono">{log.timestamp}</div>
                <div className="text-xs font-mono text-gray-300 font-semibold">{log.category}</div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
