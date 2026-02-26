"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  Play,
  Users,
  Star,
  Zap,
  TrendingUp,
  CheckCircle2,
  ChevronDown,
  Calendar,
  Scissors,
  BarChart3,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

/* ─── tiny stat pill ─── */
function StatPill({
  icon: Icon,
  value,
  label,
  delay = 0,
  isDark,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
  delay?: number;
  isDark: boolean;
}) {
  return (
    <div
      className={cn(
        "stat-pill flex items-center gap-3 px-5 py-3 rounded-2xl border backdrop-blur-md",
        isDark
          ? "bg-white/5 border-white/10"
          : "bg-black/4 border-black/8 shadow-sm"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-9 h-9 rounded-xl bg-[#5E84F2]/20 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-[#5E84F2]" />
      </div>
      <div>
        <p className={cn("font-black text-lg leading-none", isDark ? "text-white" : "text-slate-900")}>{value}</p>
        <p className={cn("text-xs mt-0.5 leading-none", isDark ? "text-slate-400" : "text-slate-500")}>{label}</p>
      </div>
    </div>
  );
}

export function Hero() {
  const t = useTranslations("landing");
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useGSAP(
    () => {
      let mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        tl.from(".hero-badge", { y: 30, opacity: 0, duration: 0.9 }, "+=0.1");

        const chars = titleRef.current?.querySelectorAll(".char");
        if (chars?.length) {
          tl.from(
            chars,
            { y: 120, opacity: 0, rotateX: -90, stagger: 0.035, duration: 1 },
            "-=0.7"
          );
        }

        tl.from(".hero-sub", { y: 24, opacity: 0, duration: 0.8 }, "-=0.5");
        tl.from(".hero-ctas", { y: 24, opacity: 0, duration: 0.8 }, "-=0.55");
        tl.from(".stat-pill", { y: 24, opacity: 0, stagger: 0.1, duration: 0.7 }, "-=0.5");
        tl.from(".float-card", { scale: 0.85, opacity: 0, stagger: 0.15, duration: 0.8, ease: "back.out(1.4)" }, "-=0.6");
        tl.from(".scroll-indicator", { opacity: 0, y: -10, duration: 0.6 }, "-=0.3");

        gsap.to(".bg-blob", {
          x: "random(-80, 80)",
          y: "random(-80, 80)",
          duration: "random(14, 26)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: { each: 5, from: "random" },
        });

        gsap.to(".float-card", {
          y: "random(-10, 10)",
          duration: "random(3, 5)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: { each: 0.8, from: "random" },
        });
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  /* ── Theme-aware class groups ── */
  const sectionBg   = isDark ? "bg-black" : "bg-white";
  const titleColor  = isDark ? "text-white" : "text-slate-900";
  const subColor    = isDark ? "text-slate-400" : "text-slate-500";
  const dividerL    = isDark ? "bg-gradient-to-r from-transparent to-white/20" : "bg-gradient-to-r from-transparent to-black/10";
  const dividerR    = isDark ? "bg-gradient-to-l from-transparent to-white/20" : "bg-gradient-to-l from-transparent to-black/10";
  const badgeBg     = isDark ? "bg-white/5 border-white/10" : "bg-black/4 border-black/8";
  const floatCardBg = isDark ? "bg-white/5 border-white/10" : "bg-white border-black/8 shadow-lg";
  const blobBlue    = isDark ? "bg-[#5E84F2]/12" : "bg-[#5E84F2]/6";
  const blobPurple  = isDark ? "bg-purple-500/10" : "bg-purple-400/5";
  const trustColor  = isDark ? "text-slate-600" : "text-slate-400";

  return (
    <section
      ref={containerRef}
      className={cn(
        "relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden md:transition-colors md:duration-300",
        sectionBg
      )}
    >
      {/* ── Ambient blobs ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className={cn("bg-blob absolute top-1/4 -left-48 w-125 h-125 blur-[110px] rounded-full", blobBlue)} />
        <div className={cn("bg-blob absolute bottom-1/4 -right-48 w-125 h-125 blur-[130px] rounded-full", blobPurple)} />
        <div className={cn("bg-blob absolute top-3/4 left-1/3 w-64 h-64 blur-[90px] rounded-full", isDark ? "bg-indigo-400/8" : "bg-indigo-400/4")} />
        <div className={cn("bg-blob absolute -top-20 right-1/3 w-80 h-80 blur-[100px] rounded-full", isDark ? "bg-[#5E84F2]/6" : "bg-[#5E84F2]/4")} />
      </div>

      {/* ── Grid overlay ── */}
      <div
        className={cn("absolute inset-0 z-0 pointer-events-none", isDark ? "opacity-[0.035]" : "opacity-[0.025]")}
        style={{
          backgroundImage: isDark
            ? "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)"
            : "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden
      />

      {/* ── Diagonal decorative lines ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden>
        <div
          className="absolute top-0 left-0 w-full h-full opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #5E84F2 0px, #5E84F2 1px, transparent 1px, transparent 80px)",
          }}
        />
      </div>

      {/* ── Central radial glow ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: isDark
            ? "radial-gradient(ellipse 70% 55% at 50% 10%, rgba(94,132,242,0.13) 0%, transparent 70%)"
            : "radial-gradient(ellipse 70% 55% at 50% 10%, rgba(94,132,242,0.07) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      {/* ── Floating UI cards ── */}
      {/* Next Booking */}
      <div className={cn("float-card absolute hidden lg:block left-[5%] top-[28%] w-56 rounded-2xl border backdrop-blur-xl p-4 shadow-2xl z-20", floatCardBg)}>
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-[#5E84F2]" />
          <span className={cn("text-xs font-semibold uppercase tracking-wider", isDark ? "text-slate-400" : "text-slate-500")}>Next Booking</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#5E84F2]/20 flex items-center justify-center text-sm font-black text-[#5E84F2]">K</div>
          <div>
            <p className={cn("text-sm font-bold", isDark ? "text-white" : "text-slate-900")}>Karim B.</p>
            <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Haircut + Beard · 11:30</p>
          </div>
        </div>
        <div className={cn("mt-3 h-1.5 rounded-full overflow-hidden", isDark ? "bg-white/5" : "bg-black/5")}>
          <div className="h-full w-3/5 rounded-full bg-linear-to-r from-[#5E84F2] to-purple-500" />
        </div>
        <p className={cn("text-xs mt-1", isDark ? "text-slate-500" : "text-slate-400")}>60% of day filled</p>
      </div>

      {/* Revenue */}
      <div className={cn("float-card absolute hidden lg:block right-[5%] top-[24%] w-52 rounded-2xl border backdrop-blur-xl p-4 shadow-2xl z-20", floatCardBg)}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span className={cn("text-xs font-semibold uppercase tracking-wider", isDark ? "text-slate-400" : "text-slate-500")}>Revenue</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded-full">+24%</span>
        </div>
        <p className={cn("text-2xl font-black", isDark ? "text-white" : "text-slate-900")}>4,820</p>
        <p className={cn("text-xs mb-3", isDark ? "text-slate-500" : "text-slate-400")}>TND this month</p>
        <div className="flex items-end gap-1 h-10">
          {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
            <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: i === 5 ? "linear-gradient(to top,#5E84F2,#a78bfa)" : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }} />
          ))}
        </div>
      </div>

      {/* Top Service */}
      <div className={cn("float-card absolute hidden xl:block left-[6%] bottom-[22%] w-48 rounded-2xl border backdrop-blur-xl p-4 shadow-2xl z-20", floatCardBg)}>
        <div className="flex items-center gap-2 mb-3">
          <Scissors className="w-4 h-4 text-purple-400" />
          <span className={cn("text-xs font-semibold uppercase tracking-wider", isDark ? "text-slate-400" : "text-slate-500")}>Top Service</span>
        </div>
        <p className={cn("font-bold text-sm", isDark ? "text-white" : "text-slate-900")}>Haircut + Fade</p>
        <div className="flex items-center gap-1.5 mt-1">
          {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
        </div>
        <p className={cn("text-xs mt-1", isDark ? "text-slate-400" : "text-slate-500")}>142 sessions this month</p>
      </div>

      {/* Rating */}
      <div className={cn("float-card absolute hidden xl:block right-[6%] bottom-[26%] w-44 rounded-2xl border backdrop-blur-xl p-4 shadow-2xl z-20", floatCardBg)}>
        <div className="flex items-center justify-center flex-col gap-1">
          <div className="w-10 h-10 rounded-2xl bg-amber-400/15 flex items-center justify-center">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          </div>
          <p className={cn("text-3xl font-black mt-1", isDark ? "text-white" : "text-slate-900")}>5.0</p>
          <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Average Rating</p>
          <div className="flex gap-0.5 mt-1">
            {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
          </div>
          <p className={cn("text-xs mt-0.5", isDark ? "text-slate-500" : "text-slate-400")}>2,400+ reviews</p>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className={cn("hero-badge inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border text-[#5E84F2] text-xs sm:text-sm font-bold backdrop-blur-md", badgeBg)}>
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>{t("heroTag")}</span>
        </div>

        {/* Title */}
        <h1
          ref={titleRef}
          className={cn("text-[clamp(2.5rem,11vw,7rem)] font-black tracking-tighter leading-[0.88] mb-2", titleColor)}
          style={{ perspective: "800px" }}
        >
          {"TAKTAKBEAUTY".split("").map((char, i) => (
            <span key={i} className="char inline-block">{char}</span>
          ))}
          <span className="text-[#5E84F2]">.</span>
        </h1>

        {/* Gradient divider */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className={cn("h-px flex-1 max-w-24", dividerL)} />
          <span
            className="text-xs font-bold uppercase tracking-[0.3em] px-3"
            style={{ background: "linear-gradient(90deg,#5E84F2,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            Premium Barber Management
          </span>
          <div className={cn("h-px flex-1 max-w-24", dividerR)} />
        </div>

        {/* Subtitle */}
        <p className={cn("hero-sub max-w-2xl mx-auto text-base sm:text-xl md:text-2xl font-medium leading-relaxed mb-10 px-4", subColor)}>
          {t("heroTag-title")}
        </p>

        {/* CTAs */}
        <div className="hero-ctas flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <Link href="/#features">
            <Button
              size="lg"
              className="h-14 px-8 sm:px-10 text-base sm:text-lg rounded-2xl bg-[#5E84F2] hover:bg-[#4a6cd9] text-white border-0 shadow-2xl shadow-[#5E84F2]/30 group md:transition-all md:duration-300 md:hover:scale-[1.04] md:hover:shadow-[#5E84F2]/40"
            >
              {t("getStarted")}
              <ArrowRight className="ml-2 w-5 h-5 md:group-hover:translate-x-1 md:transition-transform" />
            </Button>
          </Link>
          <Link href="/#">
            <Button
              variant="outline"
              size="lg"
              className={cn(
                "h-14 px-8 sm:px-10 text-base sm:text-lg rounded-2xl backdrop-blur-md md:transition-all gap-2 group",
                isDark
                  ? "border-white/10 bg-white/5 text-white hover:text-white hover:bg-white/10"
                  : "border-black/10 bg-black/4 text-slate-800 hover:text-slate-900 hover:bg-black/8"
              )}
            >
              <Play className={cn("w-4 h-4 shrink-0 md:group-hover:scale-110 md:transition-transform", isDark ? "fill-white text-white" : "fill-slate-800 text-slate-800")} />
              {t("watchDemo")}
            </Button>
          </Link>
        </div>

        {/* Stats strip */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <StatPill icon={Users} value="2,400+" label="Active Shops" delay={0} isDark={isDark} />
          <StatPill icon={Star} value="5.0 / 5" label="Avg Rating" delay={100} isDark={isDark} />
          <StatPill icon={Zap} value="99.9%" label="Uptime" delay={200} isDark={isDark} />
          <StatPill icon={TrendingUp} value="+24%" label="Revenue Growth" delay={300} isDark={isDark} />
        </div>

        {/* Trust line */}
        <div className={cn("mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium", trustColor)}>
          {["No credit card required", "14-day free trial", "Cancel anytime"].map((item) => (
            <div key={item} className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#5E84F2]" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className={cn("scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10", isDark ? "text-slate-600" : "text-slate-400")}>
        <span className="text-[10px] uppercase tracking-[0.2em] font-semibold">Scroll</span>
        <ChevronDown className="w-4 h-4 md:animate-bounce" />
      </div>
    </section>
  );
}
