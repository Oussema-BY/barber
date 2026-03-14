"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import {
  Calendar,
  Scissors,
  Package,
  Box,
  Wallet,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { FeatureSimulations } from "./feature-simulations";

gsap.registerPlugin(ScrollTrigger);

export function Features() {
  const t = useTranslations("landing");
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useGSAP(
    () => {
      let mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        // Section heading
        gsap.from(".features-label, .features-heading", {
          scrollTrigger: { trigger: ".features-label", start: "top 88%" },
          opacity: 0,
          y: 40,
          stagger: 0.15,
          duration: 1.2,
          ease: "expo.out",
        });

        // Left column — stat chips
        gsap.from(".features-stat-chip", {
          scrollTrigger: { trigger: ".features-stat-chip", start: "top 88%" },
          opacity: 0,
          y: 20,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
        });

        // Feature list items
        const items = gsap.utils.toArray<Element>(".feat-item");
        items.forEach((el, i) => {
          gsap.from(el, {
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" },
            opacity: 0,
            x: -24,
            duration: 0.7,
            delay: i * 0.07,
            ease: "power3.out",
          });
        });

        // Simulation panel
        gsap.from(".features-sim-panel", {
          scrollTrigger: { trigger: ".features-sim-panel", start: "top 84%" },
          opacity: 0,
          y: 40,
          scale: 0.97,
          duration: 1,
          ease: "expo.out",
        });
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  const featureList = [
    { icon: Calendar,  key: 0, color: "text-blue-500",   bg: isDark ? "bg-blue-500/10"   : "bg-blue-50"   },
    { icon: Scissors,  key: 1, color: "text-emerald-500", bg: isDark ? "bg-emerald-500/10": "bg-emerald-50" },
    { icon: Package,   key: 2, color: "text-purple-500",  bg: isDark ? "bg-purple-500/10" : "bg-purple-50"  },
    { icon: Box,       key: 3, color: "text-rose-500",    bg: isDark ? "bg-rose-500/10"   : "bg-rose-50"    },
    { icon: Wallet,    key: 4, color: "text-cyan-500",    bg: isDark ? "bg-cyan-500/10"   : "bg-cyan-50"    },
  ];

  const stats = [
    { value: "5", label: "Core modules", icon: TrendingUp },
    { value: "100%", label: "Real-time sync", icon: DollarSign },
    { value: "3-lang", label: "Multi-language", icon: Calendar },
  ];

  return (
    <section
      ref={containerRef}
      className={cn(
        "py-20 sm:py-28 relative md:transition-colors md:duration-300",
        isDark ? "bg-black/50" : "bg-white"
      )}
      id="features"
    >
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(var(--grid-color, #5E84F2) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color, #5E84F2) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
        aria-hidden
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section heading */}
        <div className="text-center mb-16 sm:mb-20 space-y-4">
          <h2 className="features-label text-xs sm:text-sm font-black uppercase tracking-[0.4em] text-[#5E84F2]">
            {t("functionalitySectionTitle")}
          </h2>
          <p
            className={cn(
              "features-heading text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-none",
              isDark ? "text-white" : "text-slate-900"
            )}
          >
            {t("functionalitySectionSubtitle")}
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* ── Left: feature list + stats ── */}
          <div className="space-y-10">
            {/* Stats row */}
            <div className="flex flex-wrap gap-3">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className={cn(
                    "features-stat-chip flex items-center gap-2 px-4 py-2 rounded-2xl border",
                    isDark
                      ? "bg-white/3 border-white/6"
                      : "bg-slate-50 border-slate-200 shadow-sm"
                  )}
                >
                  <span className="text-xl sm:text-2xl font-black text-[#5E84F2]">{s.value}</span>
                  <span className={cn("text-xs font-semibold", isDark ? "text-slate-400" : "text-slate-500")}>{s.label}</span>
                </div>
              ))}
            </div>

            {/* Feature list */}
            <div className="space-y-3">
              {featureList.map(({ icon: Icon, key, color, bg }) => (
                <div
                  key={key}
                  className={cn(
                    "feat-item group flex items-start gap-4 p-4 rounded-2xl border md:transition-all md:duration-300",
                    isDark
                      ? "bg-white/2 border-white/5 md:hover:bg-white/4 md:hover:border-[#5E84F2]/20"
                      : "bg-slate-50/80 border-slate-100 md:hover:bg-white md:hover:border-[#5E84F2]/20 md:hover:shadow-md"
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 md:transition-transform md:duration-300 md:group-hover:scale-110",
                      bg
                    )}
                  >
                    <Icon className={cn("w-5 h-5", color)} />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <h3
                      className={cn(
                        "text-sm sm:text-base font-black tracking-tight uppercase italic leading-tight mb-1",
                        isDark ? "text-white" : "text-slate-900"
                      )}
                    >
                      {t(`functionalityList.${key}.title`)}
                    </h3>
                    <p
                      className={cn(
                        "text-xs sm:text-sm font-medium leading-relaxed",
                        isDark ? "text-slate-400" : "text-slate-500"
                      )}
                    >
                      {t(`functionalityList.${key}.desc`)}
                    </p>
                  </div>
                  {/* Ghost number */}
                  <span
                    className={cn(
                      "text-3xl font-black italic leading-none select-none shrink-0 md:transition-colors md:duration-300",
                      isDark
                        ? "text-white/5 md:group-hover:text-[#5E84F2]/10"
                        : "text-black/5 md:group-hover:text-[#5E84F2]/8"
                    )}
                    aria-hidden
                  >
                    {String(key + 1).padStart(2, "0")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: interactive simulation ── */}
          <div className="features-sim-panel lg:sticky lg:top-28">
            {/* Label above sim */}
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#5E84F2] animate-pulse" />
              <span
                className={cn(
                  "text-xs font-black uppercase tracking-widest",
                  isDark ? "text-slate-400" : "text-slate-500"
                )}
              >
                Live Interactive Preview
              </span>
            </div>

            <FeatureSimulations />

            {/* Subtle glow beneath */}
            <div
              className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-24 rounded-full blur-3xl pointer-events-none"
              style={{ background: "rgba(94,132,242,0.12)" }}
              aria-hidden
            />
          </div>
        </div>
      </div>
    </section>
  );
}
