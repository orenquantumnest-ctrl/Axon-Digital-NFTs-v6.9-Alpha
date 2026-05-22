"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an unhandled exception:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
          {/* Background Ambient Glow */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00FFB2]/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-[120px] pointer-events-none" />

          <GlassCard className="p-8 max-w-md w-full text-center border-white/5 relative z-10" hoverEffect={false}>
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-[#D4AF37]" />
            </div>

            <span className="p-1 px-3 text-[10px] bg-red-500/10 border border-red-500/40 text-red-400 rounded-full font-mono uppercase tracking-widest font-bold">
              SYSTEM LEVEL BREACH
            </span>

            <h2 className="text-xl md:text-2xl font-display font-bold mt-4 mb-2">
              Ecosystem Link Stalled
            </h2>
            
            <p className="text-xs text-gray-400 font-mono mb-6 leading-relaxed">
              The workspace encountered a chunk connection anomaly or stale script hydration state. Clear browser cache or click below to restabilize.
            </p>

            <GlowButton onClick={this.handleReset} className="w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-2">
              <RotateCcw className="w-4 h-4" /> RE-ESTABLISH HANDSHAKE
            </GlowButton>
          </GlassCard>
        </div>
      );
    }

    return this.props.children;
  }
}
