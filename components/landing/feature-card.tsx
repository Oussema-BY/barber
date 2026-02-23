"use client";

import { LucideIcon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
  className?: string;
}

export function FeatureCard({ icon: Icon, title, description, className = "", index }: FeatureCardProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div
      className={cn(
        "feature-card group relative p-8 sm:p-10 rounded-4xl border transition-all duration-500",
        isDark
          ? "bg-white/2 border-white/5 hover:border-[#5E84F2]/30 hover:bg-white/4"
          : "bg-slate-50 border-slate-200/80 hover:border-[#5E84F2]/30 hover:bg-white shadow-sm hover:shadow-md",
        className
      )}
    >
      <div className="relative z-10 space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-[#5E84F2]/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
          <Icon className="w-7 h-7 text-[#5E84F2]" />
        </div>

        <div className="space-y-3">
          <h3 className={cn(
            "text-lg sm:text-xl font-black tracking-tight uppercase italic leading-tight",
            isDark ? "text-white" : "text-slate-900"
          )}>
            {title}
          </h3>
          <p className={cn(
            "font-medium leading-relaxed text-sm sm:text-base",
            isDark ? "text-slate-400" : "text-slate-500"
          )}>
            {description}
          </p>
        </div>
      </div>

      {/* Ghost index number */}
      <div
        className={cn(
          "absolute bottom-4 right-6 text-[5rem] font-black italic leading-none select-none pointer-events-none transition-colors duration-500",
          isDark
            ? "text-white/2.5 group-hover:text-[#5E84F2]/5"
            : "text-black/4 group-hover:text-[#5E84F2]/6"
        )}
        aria-hidden
      >
        {String(index + 1).padStart(2, "0")}
      </div>
    </div>
  );
}
