"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function Hero() {
  const t = useTranslations("landing");
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    const chars = titleRef.current?.querySelectorAll(".char");
    if (chars && chars.length) {
      tl.from(chars, {
        y: 120,
        opacity: 0,
        rotateX: -90,
        stagger: 0.04,
        duration: 1,
      }, "+=0.2");
    }

    tl.from(".hero-badge", {
      y: 20,
      opacity: 0,
      duration: 0.8,
    }, "-=1.1");

    tl.from(".hero-sub", {
      y: 20,
      opacity: 0,
      duration: 0.8,
    }, "-=0.6");

    tl.from(".hero-ctas", {
      y: 20,
      opacity: 0,
      duration: 0.8,
    }, "-=0.5");

    // Ambient blobs
    gsap.to(".bg-blob", {
      x: "random(-60, 60)",
      y: "random(-60, 60)",
      duration: "random(12, 22)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: { each: 4, from: "random" },
    });
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-black"
    >
      {/* Ambient blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="bg-blob absolute top-1/4 -left-40 w-100 md:w-150 h-100 md:h-150 bg-[#5E84F2]/10 blur-[100px] rounded-full" />
        <div className="bg-blob absolute bottom-1/4 -right-40 w-100 md:w-150 h-100 md:h-150 bg-purple-500/8 blur-[120px] rounded-full" />
        <div className="bg-blob absolute top-3/4 left-1/3 w-50 h-50 bg-indigo-500/5 blur-[80px] rounded-full" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/5 border border-white/10 text-[#5E84F2] text-xs sm:text-sm font-bold backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>{t("heroTag")}</span>
        </div>

        {/* Title */}
        <h1
          ref={titleRef}
          className="text-[clamp(3.5rem,14vw,10rem)] font-black tracking-tighter leading-[0.88] text-white mb-6"
          style={{ perspective: "800px" }}
        >
          {"BARBERPRO".split("").map((char, i) => (
            <span key={i} className="char inline-block">{char}</span>
          ))}
          <span className="text-[#5E84F2]">.</span>
        </h1>
        

        {/* Subtitle */}
        <p className="hero-sub max-w-2xl mx-auto text-base sm:text-xl md:text-2xl text-slate-400 font-medium leading-relaxed mb-10 px-4">
          {t("heroTag-title")}
        </p>

        {/* CTAs */}
        <div className="hero-ctas flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/#features">
            <Button
              size="lg"
              className="h-14 px-8 sm:px-10 text-base sm:text-lg rounded-2xl bg-[#5E84F2] hover:bg-[#4a6cd9] text-white border-0 shadow-2xl shadow-[#5E84F2]/25 group transition-all duration-300 hover:scale-[1.03]"
            >
              {t("getStarted")}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/#">
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-8 sm:px-10 text-base sm:text-lg rounded-2xl border-white/10 bg-white/5 text-white hover:text-white hover:bg-white/10 backdrop-blur-md transition-all gap-2"
            >
              <Play className="w-4 h-4 fill-white text-white shrink-0" />
              {t("watchDemo")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
