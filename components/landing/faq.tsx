"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useTheme } from "@/components/theme-provider";

gsap.registerPlugin(ScrollTrigger);

export function FAQ() {
  const t = useTranslations("landing");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useGSAP(() => {
    // Animate header badge + title
    gsap.fromTo(
      ".faq-header > *",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.12,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".faq-header",
          start: "top 90%",
        },
      }
    );

    // Animate each FAQ item individually
    gsap.utils.toArray<Element>(".faq-item").forEach((el, i) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
          },
          delay: i * 0.08,
        }
      );
    });
  }, { scope: containerRef });

  const faqs = [0, 1, 2].map((i) => ({
    q: t(`faqList.${i}.q`),
    a: t(`faqList.${i}.a`),
  }));

  return (
    <section
      ref={containerRef}
      className={cn(
        "py-16 sm:py-20 relative overflow-hidden transition-colors duration-300",
        isDark ? "bg-black" : "bg-white"
      )}
      id="faq"
    >
      {/* Soft radial glow */}
      <div
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-125 blur-[150px] rounded-full pointer-events-none",
          isDark ? "bg-[#5E84F2]/6" : "bg-[#5E84F2]/5"
        )}
        aria-hidden
      />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="faq-header text-center mb-12 sm:mb-16 space-y-5">
          <div className={cn(
            "inline-flex items-center gap-2.5 px-4 py-2 rounded-full border transition-colors",
            isDark ? "bg-[#5E84F2]/12 border-[#5E84F2]/25" : "bg-[#5E84F2]/10 border-[#5E84F2]/20"
          )}>
            <span className="w-2 h-2 rounded-full bg-[#5E84F2] animate-pulse shrink-0" />
            <span className="text-[#5E84F2] text-xs font-black uppercase tracking-[0.3em]">
              {t("faqSectionTitle")}
            </span>
          </div>
          <h2 className={cn("text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-[1.05]", isDark ? "text-white" : "text-slate-900")}>
            {t("faqSectionSubtitle")}
          </h2>
        </div>

        {/* FAQ Items */}
        <div className="flex flex-col gap-3 sm:gap-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={cn(
                  "faq-item rounded-2xl border transition-all duration-300",
                  isOpen
                    ? isDark 
                      ? "bg-[#5E84F2]/10 border-[#5E84F2]/35 shadow-lg shadow-[#5E84F2]/8" 
                      : "bg-[#5E84F2]/5 border-[#5E84F2]/30 shadow-md shadow-[#5E84F2]/5"
                    : isDark
                      ? "bg-white/4 border-white/10 hover:bg-white/6 hover:border-white/18"
                      : "bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300 shadow-sm"
                )}
              >
                {/* Question row */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full px-5 sm:px-7 py-5 sm:py-6 flex items-center justify-between gap-4 text-left group"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Index badge */}
                    <span
                      className={cn(
                        "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black tabular-nums transition-all duration-300",
                        isOpen
                          ? "bg-[#5E84F2] text-white shadow-md shadow-[#5E84F2]/40"
                          : isDark 
                            ? "bg-white/10 text-slate-400 group-hover:bg-white/15 group-hover:text-white"
                            : "bg-white border border-slate-200 text-slate-400 group-hover:text-slate-900 shadow-sm"
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {/* Question text */}
                    <span
                      className={cn(
                        "text-sm sm:text-base md:text-lg font-bold leading-snug transition-colors duration-300",
                        isOpen 
                          ? isDark ? "text-white" : "text-slate-900" 
                          : isDark ? "text-slate-200 group-hover:text-white" : "text-slate-700 group-hover:text-slate-900"
                      )}
                    >
                      {faq.q}
                    </span>
                  </div>

                  {/* Chevron */}
                  <span
                    className={cn(
                      "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
                      isOpen
                        ? "bg-[#5E84F2]/20 text-[#5E84F2] rotate-180"
                        : isDark
                          ? "bg-white/8 text-slate-500 group-hover:bg-white/12 group-hover:text-slate-300"
                          : "bg-white border border-slate-200 text-slate-400 group-hover:text-slate-600 shadow-sm"
                    )}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>

                {/* Answer (CSS grid-rows transition) */}
                <div
                  className={cn(
                    "grid transition-all duration-350 ease-in-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 sm:px-7 pb-5 sm:pb-6 pl-[calc(1.25rem+2rem+1rem)] sm:pl-[calc(1.75rem+2rem+1rem)]">
                      <div className="border-l-2 border-[#5E84F2]/40 pl-4">
                        <p className={cn("text-sm sm:text-base leading-relaxed font-medium transition-colors", isDark ? "text-slate-400" : "text-slate-600")}>
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
