"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Send, MapPin, Mail } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export function Contact() {
  const t = useTranslations("landing");
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      gsap.from(".contact-info > *", {
        scrollTrigger: { trigger: ".contact-info", start: "top 85%" },
        opacity: 0,
        x: -40,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".contact-form", {
        scrollTrigger: { trigger: ".contact-form", start: "top 85%" },
        opacity: 0,
        y: 40,
        duration: 1,
        delay: 0.2,
        ease: "power3.out",
      });
    });

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className={cn("py-16 sm:py-20 relative md:transition-colors md:duration-300", isDark ? "bg-black" : "bg-slate-50")} id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Info */}
          <div className="contact-info space-y-10">
            <div className="space-y-4">
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-[0.4em] text-[#5E84F2]">
                {t("contactSectionTitle")}
              </h2>
              <p className={cn("text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-none", isDark ? "text-white" : "text-slate-900")}>
                {t("contactSectionSubtitle")}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-5 group">
                <div className={cn(
                  "w-12 h-12 shrink-0 rounded-2xl border flex items-center justify-center md:transition-all md:duration-400",
                  isDark ? "bg-white/5 border-white/8 md:group-hover:border-[#5E84F2]/40" : "bg-white border-slate-200 md:group-hover:border-[#5E84F2]/30 shadow-sm"
                )}>
                  <Mail className="w-5 h-5 text-[#5E84F2]" />
                </div>
                <div>
                  <p className={cn("text-[10px] font-black uppercase tracking-widest mb-0.5", isDark ? "text-slate-500" : "text-slate-400")}>Protocol Email</p>
                  <p className={cn("font-bold", isDark ? "text-white" : "text-slate-900")}>elite@taktakbeauty.system</p>
                </div>
              </div>

              <div className="flex items-center gap-5 group">
                <div className={cn(
                  "w-12 h-12 shrink-0 rounded-2xl border flex items-center justify-center md:transition-all md:duration-400",
                  isDark ? "bg-white/5 border-white/8 md:group-hover:border-[#5E84F2]/40" : "bg-white border-slate-200 md:group-hover:border-[#5E84F2]/30 shadow-sm"
                )}>
                  <MapPin className="w-5 h-5 text-[#5E84F2]" />
                </div>
                <div>
                  <p className={cn("text-[10px] font-black uppercase tracking-widest mb-0.5", isDark ? "text-slate-500" : "text-slate-400")}>Corporate HQ</p>
                  <p className={cn("font-bold", isDark ? "text-white" : "text-slate-900")}>Silicon Valley, CA — Global</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="relative contact-form">
            <div className={cn("absolute -inset-4 blur-[120px] rounded-full pointer-events-none", isDark ? "bg-[#5E84F2]/5" : "bg-[#5E84F2]/4")} aria-hidden />
            <form className={cn(
              "relative space-y-5 border p-8 sm:p-12 rounded-[2.5rem] backdrop-blur-xl md:transition-all",
              isDark 
                ? "bg-white/3 border-white/5" 
                : "bg-white border-slate-200 shadow-xl shadow-black/5"
            )}>
              <input
                type="text"
                placeholder={t("contactPlaceholderName")}
                className={cn(
                  "w-full border rounded-2xl px-5 py-4 placeholder:text-slate-600 focus:outline-none focus:border-[#5E84F2]/50 md:transition-all font-semibold text-sm tracking-tight",
                  isDark ? "bg-white/5 border-white/8 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                )}
              />
              <input
                type="email"
                placeholder={t("contactPlaceholderEmail")}
                className={cn(
                  "w-full border rounded-2xl px-5 py-4 placeholder:text-slate-600 focus:outline-none focus:border-[#5E84F2]/50 md:transition-all font-semibold text-sm tracking-tight",
                  isDark ? "bg-white/5 border-white/8 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                )}
              />
              <textarea
                rows={4}
                placeholder={t("contactPlaceholderMessage")}
                className={cn(
                  "w-full border rounded-2xl px-5 py-4 placeholder:text-slate-600 focus:outline-none focus:border-[#5E84F2]/50 md:transition-all font-semibold text-sm tracking-tight resize-none",
                  isDark ? "bg-white/5 border-white/8 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                )}
              />
              <Button className="w-full py-5 rounded-2xl bg-[#5E84F2] hover:bg-[#4a6cd9] text-white font-black tracking-tight shadow-2xl shadow-[#5E84F2]/20 group text-sm sm:text-base">
                {t("contactSubmit")}
                <Send className="ml-2 w-4 h-4 md:group-hover:translate-x-1 md:group-hover:-translate-y-0.5 md:transition-transform" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
