"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Check, Zap, Crown, Star } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

// ─── Types ────────────────────────────────────────────────────────────────────

interface RawPlan {
  id: string;
  icon: React.ElementType;
  highlighted: boolean;
  badge?: true;
}

// ─── Static plan metadata (icon + highlighted flag only) ──────────────────────

const PLAN_META: RawPlan[] = [
  { id: "mensuelle",    icon: Star,  highlighted: false },
  { id: "annuelle",     icon: Crown, highlighted: true, badge: true },
  { id: "semestrielle", icon: Zap,   highlighted: false },
];

// ─── Section ──────────────────────────────────────────────────────────────────

export function Prive() {
  const t = useTranslations("landing.prive");
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useGSAP(
    () => {
      let mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        // Header fade-up
        gsap.from(".prive-header > *", {
          scrollTrigger: {
            trigger: ".prive-header",
            start: "top 90%",
            toggleActions: "play none none none",
          },
          immediateRender: false,
          opacity: 0,
          y: 50,
          stagger: 0.18,
          duration: 1.1,
          ease: "expo.out",
        });

        // Cards stagger entrance
        const cards = gsap.utils.toArray<Element>(".pricing-card");
        gsap.from(cards, {
          scrollTrigger: {
            trigger: ".pricing-grid",
            start: "top 90%",
            toggleActions: "play none none none",
          },
          immediateRender: false,
          opacity: 0,
          y: 60,
          stagger: 0.2,
          duration: 1,
          ease: "power4.out",
        });
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="pricing"
      className={cn(
        "relative py-16 sm:py-20 overflow-hidden md:transition-colors md:duration-300",
        isDark ? "bg-black" : "bg-white"
      )}
    >
      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="prive-header text-center mb-12 sm:mb-16 space-y-5">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5E84F2]/10 border border-[#5E84F2]/20 text-[#5E84F2] text-xs font-black uppercase tracking-[0.35em]">
            <Crown className="w-3.5 h-3.5" />
            {t("label")}
          </span>

          <h2 className={cn("text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-none", isDark ? "text-white" : "text-slate-900")}>
            {t("title")}{" "}
            <span className="bg-linear-to-r from-[#5E84F2] to-purple-400 bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>
          </h2>

          <p className={cn("max-w-xl mx-auto text-base sm:text-lg leading-relaxed", isDark ? "text-slate-400" : "text-slate-500")}>
            {t("subtitle")}
          </p>
        </div>

        {/* Grid */}
        <div className="pricing-grid grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-center">
          {PLAN_META.map((meta) => (
            <PricingCard
              key={meta.id}
              meta={meta}
              title={t(`plans.${meta.id}.title`)}
              price={t(`plans.${meta.id}.price`)}
              currency={t("currency")}
              period={t(`plans.${meta.id}.period`)}
              description={t(`plans.${meta.id}.description`)}
              features={[
                t(`plans.${meta.id}.features.0`),
                t(`plans.${meta.id}.features.1`),
                t(`plans.${meta.id}.features.2`),
                t(`plans.${meta.id}.features.3`),
                t(`plans.${meta.id}.features.4`),
              ]}
              cta={t(`plans.${meta.id}.cta`)}
              badgeLabel={meta.badge ? t("badge") : undefined}
              isDark={isDark}
            />
          ))}
        </div>

        {/* Footer note */}
        <p className={cn("text-center mt-12 text-sm", isDark ? "text-slate-500" : "text-slate-400")}>
          {t("footerNote")}
        </p>
      </div>
    </section>
  );
}

// ─── PricingCard ──────────────────────────────────────────────────────────────

interface CardProps {
  meta: RawPlan;
  title: string;
  price: string;
  currency: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  badgeLabel?: string;
  isDark: boolean;
}

function PricingCard({
  meta,
  title,
  price,
  currency,
  period,
  description,
  features,
  cta,
  badgeLabel,
  isDark,
}: CardProps) {
  const Icon = meta.icon;

  if (meta.highlighted) {
    return (
      <div className="pricing-card relative md:-my-4 md:scale-[1.04]">
        {/* Glow layer */}
        <div
          className="absolute inset-0 rounded-3xl blur-2xl opacity-30 bg-linear-to-b from-[#5E84F2] to-purple-500 -z-10 scale-105"
          aria-hidden
        />

        {/* Card surface */}
        <div className={cn(
          "relative rounded-3xl border overflow-hidden md:transition-transform md:duration-300 md:ease-out md:hover:scale-[1.02]",
          isDark 
            ? "border-[#5E84F2]/40 bg-linear-to-b from-[#0f1629] to-[#080d1a] shadow-2xl shadow-[#5E84F2]/20" 
            : "border-[#5E84F2]/30 bg-white shadow-xl shadow-[#5E84F2]/10"
        )}>
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-[#5E84F2] via-purple-400 to-[#5E84F2]" />

          {/* Badge */}
          {badgeLabel && (
            <div className="absolute top-5 right-5">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5E84F2] text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#5E84F2]/40">
                <Zap className="w-3 h-3 fill-white" />
                {badgeLabel}
              </span>
            </div>
          )}

          <div className="p-8 sm:p-10">
            {/* Icon + Title */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#5E84F2]/15 border border-[#5E84F2]/25 flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#5E84F2]" />
              </div>
              <h3 className={cn("text-lg font-black tracking-tight", isDark ? "text-white" : "text-slate-900")}>{title}</h3>
            </div>

            {/* Price */}
            <div className="flex items-end gap-1 mb-3">
              <span className={cn("text-5xl font-black tracking-tighter", isDark ? "text-white" : "text-slate-900")}>{price}</span>
              <span className="text-[#5E84F2] font-black text-lg pb-1">{currency}</span>
              <span className={cn("text-sm pb-1.5 ml-1", isDark ? "text-slate-400" : "text-slate-500")}>{period}</span>
            </div>

            <p className={cn("text-sm leading-relaxed mb-8", isDark ? "text-slate-400" : "text-slate-500")}>{description}</p>

            {/* CTA */}
            <button className="w-full h-12 rounded-xl bg-[#5E84F2] hover:bg-[#4a6cd9] text-white font-bold text-sm shadow-lg shadow-[#5E84F2]/30 md:transition-all md:duration-300 md:hover:scale-[1.02] md:hover:shadow-xl md:hover:shadow-[#5E84F2]/40 md:active:scale-[0.98]">
              {cta}
            </button>

            {/* Divider */}
            <div className={cn("my-8 h-px", isDark ? "bg-white/8" : "bg-black/8")} />

            {/* Features */}
            <ul className="space-y-3.5">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-[#5E84F2]/15 border border-[#5E84F2]/30 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[#5E84F2]" />
                  </span>
                  <span className={isDark ? "text-slate-300" : "text-slate-700"}>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // ── Standard card ────────────────────────────────────────────────────────────
  return (
    <div className={cn(
      "pricing-card relative rounded-3xl border md:transition-all md:duration-300 md:ease-out md:hover:scale-[1.02] overflow-hidden",
      isDark 
        ? "border-white/10 bg-[#0d0d14] hover:border-white/20 hover:bg-[#111120] shadow-xl shadow-black/40" 
        : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white shadow-sm"
    )}>
      <div className="p-8 sm:p-10">
        {/* Icon + Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isDark ? "bg-white/5 border border-white/10" : "bg-white border border-slate-200 shadow-sm")}>
            <Icon className="w-5 h-5 text-[#5E84F2]" />
          </div>
          <h3 className={cn("text-lg font-black tracking-tight", isDark ? "text-white" : "text-slate-900")}>{title}</h3>
        </div>

        {/* Price */}
        <div className="flex items-end gap-1 mb-3">
          <span className={cn("text-5xl font-black tracking-tighter", isDark ? "text-white" : "text-slate-900")}>{price}</span>
          <span className="text-[#5E84F2] font-black text-lg pb-1">{currency}</span>
          <span className={cn("text-sm pb-1.5 ml-1", isDark ? "text-slate-500" : "text-slate-400")}>{period}</span>
        </div>

        <p className={cn("text-sm leading-relaxed mb-8", isDark ? "text-slate-500" : "text-slate-400")}>{description}</p>

        {/* CTA */}
        <button className={cn(
          "w-full h-12 rounded-xl border text-bold text-sm md:transition-all md:duration-300 md:hover:scale-[1.02] md:active:scale-[0.98]",
          isDark 
            ? "border-white/10 bg-white/5 text-white md:hover:bg-white/10 md:hover:border-white/20" 
            : "border-slate-300 bg-white text-slate-800 md:hover:bg-slate-50 md:hover:border-slate-400"
        )}>
          {cta}
        </button>

        {/* Divider */}
        <div className={cn("my-8 h-px", isDark ? "bg-white/6" : "bg-black/6")} />

        {/* Features */}
        <ul className="space-y-3.5">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className={cn("mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0", isDark ? "bg-white/5 border border-white/10" : "bg-white border border-slate-200")}>
                <Check className="w-3 h-3 text-[#5E84F2]" />
              </span>
              <span className={isDark ? "text-slate-400" : "text-slate-600"}>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
