"use client";
import React from 'react';

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function GlowButton({ children, className = "", ...props }: GlowButtonProps) {
  return (
    <button 
      className={`px-8 py-4 rounded-full bg-gradient-to-r from-[#00FFB2] to-[#04D194] text-black font-extrabold text-sm uppercase tracking-wider hover:scale-[1.04] active:scale-[0.98] transition-all duration-300 shadow-[0_0_20px_rgba(0,255,178,0.35)] flex items-center justify-center gap-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
