"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Send, MapPin, Mail } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export function Contact() {
  const t = useTranslations("landing");
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
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
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 sm:py-32 relative bg-black" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Info */}
          <div className="contact-info space-y-10">
            <div className="space-y-4">
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-[0.4em] text-[#5E84F2]">
                {t("contactSectionTitle")}
              </h2>
              <p className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-white leading-none">
                {t("contactSectionSubtitle")}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center group-hover:border-[#5E84F2]/40 transition-all duration-400">
                  <Mail className="w-5 h-5 text-[#5E84F2]" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Protocol Email</p>
                  <p className="font-bold text-white">elite@barberpro.system</p>
                </div>
              </div>

              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center group-hover:border-[#5E84F2]/40 transition-all duration-400">
                  <MapPin className="w-5 h-5 text-[#5E84F2]" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Corporate HQ</p>
                  <p className="font-bold text-white">Silicon Valley, CA — Global</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="relative contact-form">
            <div className="absolute -inset-4 bg-[#5E84F2]/5 blur-[120px] rounded-full pointer-events-none" aria-hidden />
            <form className="relative space-y-5 bg-white/[0.03] border border-white/5 p-8 sm:p-12 rounded-[2.5rem] backdrop-blur-xl">
              <input
                type="text"
                placeholder={t("contactPlaceholderName")}
                className="w-full bg-white/5 border border-white/8 rounded-2xl px-5 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#5E84F2]/50 transition-all font-semibold text-sm tracking-tight"
              />
              <input
                type="email"
                placeholder={t("contactPlaceholderEmail")}
                className="w-full bg-white/5 border border-white/8 rounded-2xl px-5 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#5E84F2]/50 transition-all font-semibold text-sm tracking-tight"
              />
              <textarea
                rows={4}
                placeholder={t("contactPlaceholderMessage")}
                className="w-full bg-white/5 border border-white/8 rounded-2xl px-5 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#5E84F2]/50 transition-all font-semibold text-sm tracking-tight resize-none"
              />
              <Button className="w-full py-5 rounded-2xl bg-[#5E84F2] hover:bg-[#4a6cd9] text-white font-black tracking-tight shadow-2xl shadow-[#5E84F2]/20 group text-sm sm:text-base">
                {t("contactSubmit")}
                <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
