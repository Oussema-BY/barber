"use client";

import { useEffect, useRef } from "react";
import { Hero } from "./hero";
import { Features } from "./features";
import { Prive } from "./price";
import { Testimonials } from "./testimonials";
import { FAQ } from "./faq";
import { Contact } from "./contact";
import { Footer } from "./footer";
import { Navbar } from "./navbar";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export function LandingPage() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    let lenis: any;

    const initLenis = async () => {
      const Lenis = (await import("lenis")).default;
      lenis = new Lenis({
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      const raf = (time: number) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    };

    initLenis();

    return () => {
      lenis?.destroy();
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "relative min-h-screen selection:bg-[#5E84F2]/30 transition-colors duration-300",
        isDark
          ? "bg-black text-white"
          : "bg-white text-slate-900"
      )}
    >
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      <main>
        <Hero />
        <Features />
        <Prive />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
