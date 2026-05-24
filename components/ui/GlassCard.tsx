"use client";
import React from 'react';

export function GlassCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`p-8 rounded-[2.5rem] bg-[#121215]/60 border border-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
