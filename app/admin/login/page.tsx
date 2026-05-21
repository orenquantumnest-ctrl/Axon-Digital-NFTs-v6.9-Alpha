"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/admin/GlassCard";
import {
  Shield,
  Key,
  User,
  Lock,
  ArrowRight,
  ShieldCheck,
  Cpu,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { motion } from "motion/react";
import { useRole } from "@/components/admin/RoleContext";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Zod schemas for robust validation
const bep20Regex = /^0x[0-9a-fA-F]{40}$/;

const superAdminSchema = z.object({
  wallet: z.string().regex(bep20Regex, {
    message: "Must be a valid BEP20 (BNB Smart Chain) receiving wallet address starting with 0x followed by 40 hex characters."
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long."
  }),
  mfaCode: z.string().length(6, {
    message: "MFA Code must be exactly 6 digits."
  }).optional()
});

const subAdminSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters long."
  }),
  pin: z.string().min(4, {
    message: "Password/PIN must be at least 4 characters long."
  }),
  mfaCode: z.string().length(6, {
    message: "MFA Code must be exactly 6 digits."
  }).optional()
});

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setRole } = useRole();

  // Super Admin Fields & Feedback States
  const [superWallet, setSuperWallet] = useState("");
  const [superPassword, setSuperPassword] = useState("");
  const [showMfa, setShowMfa] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [superWalletError, setSuperWalletError] = useState("");
  const [superPasswordError, setSuperPasswordError] = useState("");
  const [superMfaError, setSuperMfaError] = useState("");

  const [isWalletValid, setIsWalletValid] = useState<boolean | null>(null);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean | null>(null);
  const [isMfaValid, setIsMfaValid] = useState<boolean | null>(null);

  // Sub Admin Fields & Feedback States
  const [subUser, setSubUser] = useState("");
  const [subPin, setSubPin] = useState("");
  const [subShowMfa, setSubShowMfa] = useState(false);
  const [subMfaCode, setSubMfaCode] = useState("");
  const [subUserError, setSubUserError] = useState("");
  const [subPinError, setSubPinError] = useState("");
  const [subMfaError, setSubMfaError] = useState("");

  const [isSubUserValid, setIsSubUserValid] = useState<boolean | null>(null);
  const [isSubPinValid, setIsSubPinValid] = useState<boolean | null>(null);
  const [isSubMfaValid, setIsSubMfaValid] = useState<boolean | null>(null);

  // Dynamic Border Class Helper Functions to Avoid Slashes in Template Literals AST
  const getSuperWalletClass = () => {
    if (isWalletValid === true) return "border-[#00FFB2] focus:border-[#00FFB2] focus:ring-[#00FFB2]/50";
    if (isWalletValid === false) return "border-red-500/85 focus:border-red-500 focus:ring-red-500/50";
    return "border-white/10 focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/50";
  };

  const getSuperPasswordClass = () => {
    if (isPasswordValid === true) return "border-[#00FFB2] focus:border-[#00FFB2] focus:ring-[#00FFB2]/50";
    if (isPasswordValid === false) return "border-red-500/85 focus:border-red-500 focus:ring-red-500/50";
    return "border-white/10 focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/50";
  };

  const getSuperMfaClass = () => {
    if (isMfaValid === true) return "border-[#00FFB2] focus:border-[#00FFB2] focus:ring-[#00FFB2]/50";
    if (isMfaValid === false) return "border-red-500 focus:border-red-500 focus:ring-red-500";
    return "border-white/15 focus:border-[#00FFB2]/50 focus:ring-[#00FFB2]/50";
  };

  const getSubUserClass = () => {
    if (isSubUserValid === true) return "border-blue-400 focus:border-blue-400 focus:ring-blue-400/50";
    if (isSubUserValid === false) return "border-red-500/85 focus:border-red-500 focus:ring-red-500/50";
    return "border-white/5 focus:border-white/20 focus:ring-white/20";
  };

  const getSubPinClass = () => {
    if (isSubPinValid === true) return "border-blue-400 focus:border-blue-400 focus:ring-blue-400/50";
    if (isSubPinValid === false) return "border-red-500/85 focus:border-red-500 focus:ring-red-500/50";
    return "border-white/5 focus:border-white/20 focus:ring-white/20";
  };

  const getSubMfaClass = () => {
    if (isSubMfaValid === true) return "border-blue-500 focus:border-blue-500 focus:ring-blue-500/50";
    if (isSubMfaValid === false) return "border-red-500 focus:border-red-500 focus:ring-red-500";
    return "border-white/15 focus:border-blue-500/50 focus:ring-blue-500/50";
  };

  // Real-time listener for Super Admin Wallet Address (BEP20)
  useEffect(() => {
    if (!superWallet) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsWalletValid(null);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuperWalletError("");
      return;
    }
    const result = bep20Regex.test(superWallet);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsWalletValid(result);
    if (!result) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuperWalletError("Not a valid BEP20 BNB Smart Chain receiving address format.");
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuperWalletError("");
    }
  }, [superWallet]);

  // Real-time listener for Super Admin Password
  useEffect(() => {
    if (!superPassword) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsPasswordValid(null);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuperPasswordError("");
      return;
    }
    const result = superPassword.length >= 6;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsPasswordValid(result);
    if (!result) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuperPasswordError("Password needs to be at least 6 characters.");
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuperPasswordError("");
    }
  }, [superPassword]);

  // Real-time listener for Super Admin MFA/Authenticator Code
  useEffect(() => {
    if (!mfaCode) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsMfaValid(null);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuperMfaError("");
      return;
    }
    const result = mfaCode === "198060";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMfaValid(result);
    if (mfaCode.length === 6 && !result) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuperMfaError("Invalid Authentication Code. The correct code is 198060.");
    } else if (result) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuperMfaError("");
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuperMfaError("Authentication code must be exactly 6 digits.");
    }
  }, [mfaCode]);

  // Real-time listener for Sub Admin Username
  useEffect(() => {
    if (!subUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSubUserValid(null);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSubUserError("");
      return;
    }
    const result = subUser.length >= 3;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsSubUserValid(result);
    if (!result) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSubUserError("Username must be at least 3 characters long.");
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSubUserError("");
    }
  }, [subUser]);

  // Real-time listener for Sub Admin Pin
  useEffect(() => {
    if (!subPin) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSubPinValid(null);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSubPinError("");
      return;
    }
    const result = subPin.length >= 4;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsSubPinValid(result);
    if (!result) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSubPinError("PIN/Password must be at least 4 characters long.");
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSubPinError("");
    }
  }, [subPin]);

  // Real-time listener for Sub Admin MFA Code
  useEffect(() => {
    if (!subMfaCode) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSubMfaValid(null);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSubMfaError("");
      return;
    }
    const result = subMfaCode.length === 6;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsSubMfaValid(result);
    if (!result) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSubMfaError("Authentication code must be 6 digits.");
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSubMfaError("");
    }
  }, [subMfaCode]);

  const handleSuperAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bep20Regex.test(superWallet) || superPassword.length < 6) {
      setError("Please resolve form validation errors before logging in.");
      return;
    }

    if (!showMfa) {
      setError("");
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setShowMfa(true);
      }, 600);
      return;
    }

    if (mfaCode !== "198060") {
      setError("MFA authentication failed. Incorrect super admin authentication key.");
      setSuperMfaError("MFA authentication failed.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      let adminRecord = null;
      const parsedWallet = superWallet.trim().toLowerCase();

      // Bypass live database query for default master admin to prevent Safari resource load / CORS blocks
      if (parsedWallet === "0x7bbc456c2c34972723cf03b9d44323d2539514de") {
        adminRecord = {
          wallet_address: "0x7bbc456c2c34972723cf03b9d44323d2539514de",
          pin_hash: "$2a$06$IXpzcsbdthOHLrt4/CseC.CuWKZ0qU/J6LxZG99SYWO7Qk3GUHJT."
        };
      } else {
        // 1. Query the live Supabase admin_accounts table
        try {
          const { data, error: dbError } = await supabase
            .from("admin_accounts")
            .select("*")
            .eq("wallet_address", parsedWallet)
            .maybeSingle();

          if (dbError) {
            console.error("Database querying error:", dbError);
          } else {
            adminRecord = data;
          }
        } catch (err) {
          console.error("Supabase connect failed:", err);
        }
      }

      // 2. Fallback check
      if (!adminRecord) {
        throw new Error("No admin account registered under this wallet address.");
      }

      // 3. Cryptographically verify the pin_hash of the admin account
      const matchesPassword = await bcrypt.compare(superPassword, adminRecord.pin_hash);
      if (!matchesPassword) {
        throw new Error("Invalid decryption key or password for Super Admin authentication.");
      }

      // 4. Successful Master Admin validation
      setRole("Super Admin");
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Authentication process caught an exception.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (subUser.length < 3 || subPin.length < 4) {
      setError("Form contains unresolved validation details.");
      return;
    }

    if (!subShowMfa) {
      setError("");
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSubShowMfa(true);
      }, 600);
      return;
    }

    if (subMfaCode.length !== 6) {
      setError("Authentication code must be exactly 6 digits.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Direct authenticating simulation using fallback sub role accounts
      if (subUser.toLowerCase().includes("finance")) {
        setRole("Finance Admin");
      } else if (subUser.toLowerCase().includes("support")) {
        setRole("Support Admin");
      } else if (subUser.toLowerCase().includes("analyst")) {
        setRole("Analyst Admin");
      } else {
        setRole("Support Admin"); // Default sub admin
      }
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Please enter valid sub-admin credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] relative flex items-center justify-center p-4 overflow-hidden font-sans text-slate-200">
      {/* Background Animated Gradient & Noise */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#00FFB2]/10 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[10000ms]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[150px] mix-blend-screen" style={{ animationDelay: "2s" }}></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-12 pb-12">
        {/* Left Side: Branding / Info */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="col-span-1 lg:col-span-5 flex flex-col justify-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-[#00FFB2] animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-[#00FFB2]">
              Private Operations Portal
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-white leading-[1.1]">
            AXON
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFB2] via-[#D4AF37] to-[#00b27c]">
              Ledger
            </span>{" "}
            Vault
          </h1>

          <p className="text-slate-400 text-base leading-relaxed max-w-sm">
            Unlock the administrative operations layer. Super Admins input an authenticated BNB Smart Chain BEP-20 receiving wallet address, passcode, and physical authenticator credential values.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all flex items-center gap-2 text-xs uppercase tracking-widest"
            >
              <Cpu className="w-4 h-4 text-[#00FFB2]" /> Return Home
            </button>
          </div>
        </motion.div>

        {/* Right Side: Login Forms Container */}
        <div className="col-span-1 lg:col-span-7 flex flex-col gap-6 w-full max-w-xl mx-auto lg:mx-0 lg:ml-auto">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider flex items-center gap-3 backdrop-blur-xl"
            >
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>{error}</span>
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
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Super-Admin Gateway
                </h2>
              </div>

              <form onSubmit={handleSuperAdminLogin} className="space-y-4">
                {/* Wallet Address Input */}
                <div className="space-y-1.5">
                  <label htmlFor="superWallet" className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">
                    BEP20 BSC Address (Smart Chain)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Shield className={`h-5 w-5 ${isWalletValid ? 'text-[#00FFB2]' : isWalletValid === false ? 'text-red-500' : 'text-slate-500'} transition-colors`} />
                    </div>
                    <input
                      id="superWallet"
                      type="text"
                      placeholder="0x7bbc456c2c34972723cf03b9d44323d2539514de"
                      required
                      value={superWallet}
                      onChange={(e) => setSuperWallet(e.target.value)}
                      disabled={showMfa}
                      className={`w-full bg-[#0A0A0A] border rounded-2xl py-3.5 pl-11 pr-10 text-white placeholder-slate-600 focus:outline-none focus:ring-1 transition-all font-mono text-sm disabled:opacity-50 ${getSuperWalletClass()}`}
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      {isWalletValid === true ? (
                        <CheckCircle2 className="w-4 h-4 text-[#00FFB2]" />
                      ) : isWalletValid === false ? (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      ) : null}
                    </div>
                  </div>
                  {superWalletError && (
                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider pl-1">{superWalletError}</p>
                  )}
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <label htmlFor="superPin" className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">
                    Decryption Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Key className={`h-5 w-5 ${isPasswordValid ? 'text-[#00FFB2]' : isPasswordValid === false ? 'text-red-500' : 'text-slate-500'} transition-colors`} />
                    </div>
                    <input
                      id="superPin"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={superPassword}
                      onChange={(e) => setSuperPassword(e.target.value)}
                      disabled={showMfa}
                      className={`w-full bg-[#0A0A0A] border rounded-2xl py-3.5 pl-11 pr-10 text-white placeholder-slate-600 focus:outline-none focus:ring-1 transition-all text-sm disabled:opacity-50 ${getSuperPasswordClass()}`}
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      {isPasswordValid === true ? (
                        <CheckCircle2 className="w-4 h-4 text-[#00FFB2]" />
                      ) : isPasswordValid === false ? (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      ) : null}
                    </div>
                  </div>
                  {superPasswordError && (
                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider pl-1">{superPasswordError}</p>
                  )}
                </div>

                {/* MFA Verification code input (Only shown when wallet and pass are keyed in) */}
                {showMfa && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-1.5 pt-2"
                  >
                    <label htmlFor="mfaCode" className="text-xs font-semibold text-[#00FFB2] uppercase tracking-widest pl-1 flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5" /> Authenticator MFA Code
                    </label>
                    <div className="relative">
                      <input
                        id="mfaCode"
                        type="text"
                        placeholder="198060"
                        required
                        maxLength={6}
                        value={mfaCode}
                        onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ""))}
                        className={`w-full bg-[#050505] border rounded-2xl py-3.5 px-4 text-center text-white placeholder-slate-600 focus:outline-none focus:ring-1 transition-all font-mono text-lg tracking-[0.5em] ${getSuperMfaClass()}`}
                      />
                    </div>
                    {superMfaError && (
                      <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider pl-1">{superMfaError}</p>
                    )}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8942E] text-black font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 group/btn disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Authenticating Node..."
                    : showMfa
                      ? "Verify MFA & Initialize"
                      : "Authorize Super-Admin Node"}
                  {!loading && (
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  )}
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
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Sub-Admin Operator
                </h2>
              </div>

              <form onSubmit={handleSubAdminLogin} className="space-y-4">
                {/* Operator Username */}
                <div className="space-y-1.5">
                  <label htmlFor="subUsername" className="text-xs font-semibold text-slate-500 uppercase tracking-widest pl-1">
                    Username / Access Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className={`h-5 w-5 ${isSubUserValid ? 'text-blue-400' : isSubUserValid === false ? 'text-red-500' : 'text-slate-600'} transition-colors`} />
                    </div>
                    <input
                      id="subUsername"
                      type="text"
                      placeholder="finance.analyst@axon.com"
                      required
                      value={subUser}
                      onChange={(e) => setSubUser(e.target.value)}
                      disabled={subShowMfa}
                      className={`w-full bg-[#050505] border rounded-2xl py-3 pl-11 pr-10 text-white placeholder-slate-700 focus:outline-none focus:ring-1 transition-all text-sm disabled:opacity-50 ${getSubUserClass()}`}
                    />
                  </div>
                  {subUserError && (
                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider pl-1">{subUserError}</p>
                  )}
                </div>

                {/* Operator Pass/PIN */}
                <div className="space-y-1.5">
                  <label htmlFor="subPin" className="text-xs font-semibold text-slate-500 uppercase tracking-widest pl-1">
                    Operator Passcode
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className={`h-5 w-5 ${isSubPinValid ? 'text-blue-400' : isSubPinValid === false ? 'text-red-500' : 'text-slate-600'} transition-colors`} />
                    </div>
                    <input
                      id="subPin"
                      type="password"
                      placeholder="••••••"
                      required
                      value={subPin}
                      onChange={(e) => setSubPin(e.target.value)}
                      disabled={subShowMfa}
                      className={`w-full bg-[#050505] border rounded-2xl py-3 pl-11 pr-10 text-white placeholder-slate-700 focus:outline-none focus:ring-1 transition-all text-sm disabled:opacity-50 ${getSubPinClass()}`}
                    />
                  </div>
                  {subPinError && (
                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider pl-1">{subPinError}</p>
                  )}
                </div>

                {/* Sub Admin MFA (Only shown when info keyed in) */}
                {subShowMfa && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-1.5 pt-2"
                  >
                    <label htmlFor="subMfaCode" className="text-xs font-semibold text-blue-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5" /> Physical Security Key
                    </label>
                    <div className="relative">
                      <input
                        id="subMfaCode"
                        type="text"
                        placeholder="000000"
                        required
                        maxLength={6}
                        value={subMfaCode}
                        onChange={(e) => setSubMfaCode(e.target.value.replace(/\D/g, ""))}
                        className={`w-full bg-[#050505] border rounded-2xl py-3 px-4 text-center text-white placeholder-slate-600 focus:outline-none focus:ring-1 transition-all font-mono text-lg tracking-[0.5em] ${getSubMfaClass()}`}
                      />
                    </div>
                    {subMfaError && (
                      <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider pl-1">{subMfaError}</p>
                    )}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 group/btn2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Authenticating Operator..." : (subShowMfa ? "Verify & Log in Operators" : "Request Operator Access")}
                  {!loading && (
                    <ArrowRight className="w-4 h-4 group-hover/btn2:translate-x-1 transition-transform" />
                  )}
                </button>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
