"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import {
  Calendar,
  Scissors,
  Package,
  Users,
  Box,
  Wallet,
} from "lucide-react";
import { FeatureCard } from "./feature-card";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export function Features() {
  const t = useTranslations("landing");
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Title
    gsap.from(".features-label, .features-heading", {
      scrollTrigger: { trigger: ".features-label", start: "top 88%" },
      opacity: 0,
      y: 40,
      stagger: 0.15,
      duration: 1.2,
      ease: "expo.out",
    });

    // Cards — each animates individually
    const cards = gsap.utils.toArray<Element>(".feature-card");
    cards.forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 50,
        x: i % 2 === 0 ? -20 : 20,
        duration: 0.9,
        delay: (i % 3) * 0.1,
        ease: "power3.out",
      });
    });
  }, { scope: containerRef });

  const icons = [Calendar, Scissors, Package, Users, Box, Wallet];
  const features = [0, 1, 2, 3, 4, 5].map((i) => ({
    icon: icons[i],
    title: t(`functionalityList.${i}.title`),
    description: t(`functionalityList.${i}.desc`),
  }));

  return (
    <section
      ref={containerRef}
      className="py-24 sm:py-32 relative bg-black/50"
      id="features"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 sm:mb-24 space-y-4">
          <h2 className="features-label text-xs sm:text-sm font-black uppercase tracking-[0.4em] text-[#5E84F2]">
            {t("functionalitySectionTitle")}
          </h2>
          <p className="features-heading text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-white leading-none">
            {t("functionalitySectionSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, i) => (
            <FeatureCard
              key={i}
              index={i}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
