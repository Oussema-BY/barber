import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
  className?: string;
}

export function FeatureCard({ icon: Icon, title, description, className = "", index }: FeatureCardProps) {
  return (
    <div
      className={`feature-card group relative p-8 sm:p-10 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-[#5E84F2]/30 transition-all duration-600 hover:bg-white/[0.04] ${className}`}
    >
      <div className="relative z-10 space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-[#5E84F2]/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
          <Icon className="w-7 h-7 text-[#5E84F2]" />
        </div>

        <div className="space-y-3">
          <h3 className="text-lg sm:text-xl font-black tracking-tight text-white uppercase italic leading-tight">
            {title}
          </h3>
          <p className="text-slate-400 font-medium leading-relaxed text-sm sm:text-base">
            {description}
          </p>
        </div>
      </div>

      {/* Ghost index number */}
      <div
        className="absolute bottom-4 right-6 text-[5rem] font-black text-white/[0.025] italic leading-none select-none pointer-events-none group-hover:text-[#5E84F2]/5 transition-colors duration-600"
        aria-hidden
      >
        {String(index + 1).padStart(2, "0")}
      </div>
    </div>
  );
}
