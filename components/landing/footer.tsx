"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Scissors, Twitter, Github, Linkedin, Instagram } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export function Footer() {
  const t = useTranslations("landing");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const socials = [
    { Icon: Twitter, href: "#", label: "Twitter" },
    { Icon: Github, href: "#", label: "GitHub" },
    { Icon: Linkedin, href: "#", label: "LinkedIn" },
    { Icon: Instagram, href: "#", label: "Instagram" },
  ];

  return (
    <footer className={cn(
      "py-12 sm:py-16 border-t relative z-10 transition-colors duration-300",
      isDark ? "bg-black border-white/5" : "bg-white border-slate-200"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12 sm:mb-16">
          {/* Brand */}
          <div className="space-y-5 max-w-xs">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#5E84F2] flex items-center justify-center shadow-xl shadow-[#5E84F2]/25 group-hover:rotate-6 transition-transform">
                <Scissors className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className={cn("text-xl sm:text-2xl font-black tracking-tighter uppercase italic", isDark ? "text-white" : "text-slate-900")}>
                BARBERPRO<span className={cn("not-italic text-[#5E84F2] text-xs tracking-widest pl-1.5", isDark ? "" : "text-[#5E84F2]")}>SYSTEM</span>
              </span>
            </Link>
            <p className={cn("font-medium leading-relaxed text-sm sm:text-base", isDark ? "text-slate-400" : "text-slate-500")}>
              {t("footerDescription")}
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 sm:gap-16">
            <div className="space-y-5">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#5E84F2]">
                {t("footerProtocol")}
              </h4>
              <ul className="space-y-3">
                {["manifesto", "infrastructure", "deployment", "laboratory"].map((key) => (
                  <li key={key}>
                    <Link
                      href="#"
                      className={cn("transition-colors font-semibold text-sm", isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900")}
                    >
                      {t(`footerLinks.${key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-5">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#5E84F2]">
                {t("footerNetwork")}
              </h4>
              <ul className="space-y-3">
                {["overview", "ecosystem", "access", "connect"].map((key) => (
                  <li key={key}>
                    <Link
                      href="#"
                      className={cn("transition-colors font-semibold text-sm", isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900")}
                    >
                      {t(`footerLinks.${key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className={cn("flex flex-col sm:flex-row justify-between items-center pt-8 border-t gap-5", isDark ? "border-white/5" : "border-slate-100")}>
          <p className={cn("text-xs font-black uppercase tracking-widest text-center sm:text-left", isDark ? "text-slate-600" : "text-slate-400")}>
            {t("footerCopyright")}
          </p>
          <div className="flex items-center gap-6">
            {socials.map(({ Icon, href, label }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className={cn("transition-all hover:scale-110 duration-300", isDark ? "text-slate-600 hover:text-[#5E84F2]" : "text-slate-400 hover:text-[#5E84F2]")}
              >
                <Icon className="w-4 h-4 sm:w-5 h-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
