"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function GlassCard({ 
  children, 
  className,
  hoverEffect = true
}: { 
  children: React.ReactNode; 
  className?: string;
  hoverEffect?: boolean;
}) {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -5, scale: 1.02 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "glass-panel rounded-3xl p-6 relative overflow-hidden",
        hoverEffect && "hover:border-[#00FFB2]/30 hover:shadow-[0_0_30px_rgba(0,255,178,0.1)] transition-all duration-300",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
