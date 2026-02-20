"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Scissors, Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { cn } from "@/lib/utils";

const scrollToSection = (id: string) => {
  const el = document.querySelector(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 76;
  window.scrollTo({ top, behavior: "smooth" });
};

export function Navbar() {
  const t = useTranslations("landing");
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = ["#features", "#faq", "#contact"];
      for (const id of [...sections].reverse()) {
        const el = document.querySelector(id);
        if (el && el.getBoundingClientRect().top <= 110) {
          setActiveSection(id);
          return;
        }
      }
      setActiveSection("");
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#features", label: t("functionalitySectionTitle") },
    { href: "#faq", label: "FAQ" },
    { href: "#contact", label: t("contactSectionTitle") },
  ];

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setMenuOpen(false);
      setTimeout(() => scrollToSection(href), 100);
    },
    []
  );

  return (
    <>
      {/* ── Main navbar bar ── */}
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled || menuOpen
            ? "bg-black/95 backdrop-blur-2xl border-b border-white/8"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-17 sm:h-20">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group shrink-0"
              onClick={() => setMenuOpen(false)}
            >
              <div className="w-9 h-9 rounded-xl bg-[#5E84F2] flex items-center justify-center shadow-lg shadow-[#5E84F2]/25 group-hover:rotate-6 transition-transform duration-300">
                <Scissors className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter text-white">
                BARBERPRO<span className="text-[#5E84F2]">.</span>
              </span>
            </Link>

            {/* Desktop center links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  onClick={(e) => handleNavClick(e, href)}
                  className={cn(
                    "relative text-xs font-black uppercase tracking-[0.2em] py-1 transition-colors duration-200",
                    activeSection === href
                      ? "text-[#5E84F2]"
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  {label}
                  {activeSection === href && (
                    <span className="absolute -bottom-0.5 inset-x-0 h-px bg-[#5E84F2] rounded-full" />
                  )}
                </a>
              ))}
            </div>

            {/* Desktop right */}
            <div className="hidden md:flex items-center gap-3">
              <LanguageSwitcher currentLocale={locale} />
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-white hover:text-white hover:bg-white/8 font-bold"
                >
                  {t("signIn")}
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button
                  size="sm"
                  className="rounded-full px-5 bg-[#5E84F2] hover:bg-[#4a6cd9] text-white font-bold shadow-md shadow-[#5E84F2]/20 transition-all hover:scale-[1.03]"
                >
                  {t("getStarted")}
                </Button>
              </Link>
            </div>

            {/* Mobile: lang switcher + hamburger */}
            <div className="flex md:hidden items-center gap-2">
              <LanguageSwitcher currentLocale={locale} />
              <button
                onClick={() => setMenuOpen((o) => !o)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                className="w-10 h-10 rounded-xl bg-white/6 border border-white/8 flex items-center justify-center text-white hover:bg-white/12 transition-colors"
              >
                {menuOpen
                  ? <X className="w-5 h-5" />
                  : <Menu className="w-5 h-5" />
                }
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile fullscreen drawer ── */}
      {/* Backdrop */}
      <div
        onClick={() => setMenuOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300",
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        aria-hidden
      />

      {/* Drawer panel */}
      <div
        className={cn(
          "fixed top-17 inset-x-0 z-40 md:hidden transition-all duration-300 ease-in-out",
          menuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-3 pointer-events-none"
        )}
      >
        <div className="mx-4 mt-2 rounded-2xl bg-[#0a0a0a] border border-white/8 shadow-2xl shadow-black/60 overflow-hidden">

          {/* Nav links */}
          <div className="px-2 pt-3 pb-2 flex flex-col gap-1">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={(e) => handleNavClick(e, href)}
                className={cn(
                  "flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-200",
                  activeSection === href
                    ? "bg-[#5E84F2]/12 text-[#5E84F2]"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  {label}
                </div>
                <ArrowRight className={cn(
                  "w-3.5 h-3.5 transition-colors",
                  activeSection === href ? "text-[#5E84F2]" : "text-slate-700"
                )} />
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="mx-4 h-px bg-white/6" />

          {/* CTAs */}
          <div className="px-4 py-4 flex flex-col gap-3">
            <Link href="/sign-ip" onClick={() => setMenuOpen(false)}>
              <Button className="w-full h-12 rounded-xl bg-[#5E84F2] hover:bg-[#4a6cd9] text-white font-black text-sm shadow-lg shadow-[#5E84F2]/20">
                {t("signIn")}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
