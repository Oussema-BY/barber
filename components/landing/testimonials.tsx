"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Quote, Star } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export function Testimonials() {
  const t = useTranslations("landing");
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".testimonials-info > *", {
      scrollTrigger: { trigger: ".testimonials-info", start: "top 85%" },
      opacity: 0,
      x: -40,
      stagger: 0.15,
      duration: 1,
      ease: "power3.out",
    });

    const cards = gsap.utils.toArray<Element>(".testimonial-card");
    cards.forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none reverse" },
        opacity: 0,
        y: 50,
        duration: 0.9,
        delay: i * 0.15,
        ease: "power3.out",
      });
    });
  }, { scope: containerRef });

  const testimonials = [
    {
      name: t("testimonialList.0.name"),
      role: t("testimonialList.0.role"),
      content: t("testimonialList.0.content"),
      image: "https://i.pravatar.cc/150?u=marcus",
    },
    {
      name: t("testimonialList.1.name"),
      role: t("testimonialList.1.role"),
      content: t("testimonialList.1.content"),
      image: "https://i.pravatar.cc/150?u=elara",
    },
  ];

  return (
    <section
      ref={containerRef}
      className="py-24 sm:py-32 relative overflow-hidden bg-black"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Info */}
          <div className="testimonials-info space-y-6 text-center lg:text-left">
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-[0.4em] text-purple-400">
              {t("testimonialsSectionTitle")}
            </h2>
            <p className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white leading-tight">
              {t("testimonialsSectionSubtitle")}
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-1.5">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className="w-5 h-5 fill-[#5E84F2] text-[#5E84F2]" />
              ))}
              <span className="ml-3 text-white font-bold">{t("rating")}</span>
            </div>
          </div>

          {/* Cards */}
          <div className="flex flex-col gap-6">
            {testimonials.map((testi, i) => (
              <div
                key={i}
                className="testimonial-card group relative p-8 sm:p-10 rounded-[2.5rem] bg-white/3 border border-white/5 hover:border-[#5E84F2]/25 transition-all duration-500"
              >
                <Quote className="absolute top-6 right-8 w-12 h-12 text-white/4 group-hover:text-[#5E84F2]/8 transition-colors" />
                <div className="relative z-10 flex flex-col gap-6">
                  <p className="text-lg sm:text-xl font-medium text-slate-300 italic leading-relaxed">
                    &ldquo;{testi.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-4">
                    <img
                      src={testi.image}
                      alt={testi.name}
                      width={56}
                      height={56}
                      className="w-14 h-14 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                    <div>
                      <h4 className="font-bold text-white">{testi.name}</h4>
                      <p className="text-xs font-black uppercase tracking-widest text-[#5E84F2]">{testi.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
