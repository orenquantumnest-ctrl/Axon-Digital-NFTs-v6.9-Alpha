import { cn } from "@/lib/utils";

export function GlassCard({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <div 
      className={cn(
        "bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  );
}
