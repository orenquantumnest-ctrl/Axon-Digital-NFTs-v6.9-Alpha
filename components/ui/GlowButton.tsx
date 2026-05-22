"use client";

import { motion, HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

export function GlowButton({ 
  children, 
  className,
  variant = "emerald",
  ...props 
}: Omit<HTMLMotionProps<"button">, "children"> & { variant?: "emerald" | "gold"; children?: React.ReactNode }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative px-8 py-3 rounded-full font-medium tracking-wide transition-all duration-300 overflow-hidden group",
        variant === "emerald" 
          ? "bg-[#00FFB2]/10 text-[#00FFB2] border border-[#00FFB2]/50 hover:shadow-[0_0_20px_rgba(0,255,178,0.4)]" 
          : "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/50 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]",
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        variant === "emerald" ? "bg-[#00FFB2]/20" : "bg-[#D4AF37]/20"
      )} />
    </motion.button>
  );
}
