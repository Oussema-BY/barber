"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

const scrollToSection = (id: string) => {
  const el = document.querySelector(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 76;
  window.scrollTo({ top, behavior: "smooth" });
};

export function Navbar() {
  const t = useTranslations("landing");
  const locale = useLocale();
  const { resolvedTheme, setTheme, mounted } = useTheme();
  const isDark = resolvedTheme === "dark";

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
      const sections = ["#features", "#pricing", "#faq", "#contact"];
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
    { href: "#pricing",  label: t("prive.label") },
    { href: "#faq",      label: "FAQ" },
    { href: "#contact",  label: t("contactSectionTitle") },
  ];

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setMenuOpen(false);
      setTimeout(() => scrollToSection(href), 100);
    },
    []
  );

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  /* ── Theme-aware nav background ── */
  const navBg = scrolled || menuOpen
    ? isDark
      ? "bg-black/95 backdrop-blur-2xl border-b border-white/8"
      : "bg-white/95 backdrop-blur-2xl border-b border-black/10 shadow-sm"
    : "bg-transparent";

  /* ── Theme-aware text colours ── */
  const logoText  = isDark ? "text-white" : "text-slate-900";
  const linkInactive = isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900";
  const signInCls = isDark
    ? "text-white hover:text-white hover:bg-white/8"
    : "text-slate-700 hover:text-slate-900 hover:bg-black/5";
  const hamburgerCls = isDark
    ? "bg-white/6 border-white/8 text-white hover:bg-white/12"
    : "bg-black/5 border-black/10 text-slate-700 hover:bg-black/10";
  const drawerBg = isDark ? "bg-[#0a0a0a] border-white/8 shadow-black/60" : "bg-white border-black/8 shadow-black/10";
  const mobileLinkActive = isDark ? "bg-[#5E84F2]/12 text-[#5E84F2]" : "bg-[#5E84F2]/8 text-[#5E84F2]";
  const mobileLinkInactive = isDark ? "text-slate-300 hover:bg-white/5 hover:text-white" : "text-slate-700 hover:bg-black/4 hover:text-slate-900";

  return (
    <>
      {/* ── Main navbar bar ── */}
      <nav className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300", navBg)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-17 sm:h-20">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-0 group shrink-0"
              onClick={() => setMenuOpen(false)}
            >
              <div className="w-16 h-16 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                <Image
                  src="/logo.png"
                  alt="TaktakBeauty Logo"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className={cn("text-xl font-black tracking-tighter transition-colors", logoText)}>
                TAKTAKBEAUTY<span className="text-[#5E84F2]">.</span>
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
                    activeSection === href ? "text-[#5E84F2]" : linkInactive
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

              {/* ── Theme toggle ── */}
              {mounted && (
                <button
                  id="theme-toggle-btn"
                  onClick={toggleTheme}
                  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300",
                    isDark
                      ? "bg-white/8 text-slate-300 hover:bg-white/15 hover:text-white"
                      : "bg-black/6 text-slate-600 hover:bg-black/12 hover:text-slate-900"
                  )}
                >
                  {isDark
                    ? <Sun  className="w-4 h-4" />
                    : <Moon className="w-4 h-4" />
                  }
                </button>
              )}

              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("rounded-full font-bold transition-colors", signInCls)}
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

            {/* Mobile: lang + theme + hamburger */}
            <div className="flex md:hidden items-center gap-2">
              <LanguageSwitcher currentLocale={locale} />

              {/* Mobile theme toggle */}
              {mounted && (
                <button
                  id="theme-toggle-mobile"
                  onClick={toggleTheme}
                  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors border",
                    hamburgerCls
                  )}
                >
                  {isDark
                    ? <Sun  className="w-4 h-4" />
                    : <Moon className="w-4 h-4" />
                  }
                </button>
              )}

              <button
                onClick={() => setMenuOpen((o) => !o)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-colors border",
                  hamburgerCls
                )}
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile backdrop ── */}
      <div
        onClick={() => setMenuOpen(false)}
        className={cn(
          "fixed inset-0 z-40 backdrop-blur-sm md:hidden transition-opacity duration-300",
          isDark ? "bg-black/60" : "bg-black/30",
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        aria-hidden
      />

      {/* ── Mobile drawer ── */}
      <div
        className={cn(
          "fixed top-17 inset-x-0 z-40 md:hidden transition-all duration-300 ease-in-out",
          menuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-3 pointer-events-none"
        )}
      >
        <div className={cn(
          "mx-4 mt-2 rounded-2xl border shadow-2xl overflow-hidden",
          drawerBg
        )}>
          {/* Nav links */}
          <div className="px-2 pt-3 pb-2 flex flex-col gap-1">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={(e) => handleNavClick(e, href)}
                className={cn(
                  "flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-200",
                  activeSection === href ? mobileLinkActive : mobileLinkInactive
                )}
              >
                <div className="flex items-center gap-3">{label}</div>
                <ArrowRight className={cn(
                  "w-3.5 h-3.5 transition-colors",
                  activeSection === href ? "text-[#5E84F2]" : isDark ? "text-slate-700" : "text-slate-300"
                )} />
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className={cn("mx-4 h-px", isDark ? "bg-white/6" : "bg-black/6")} />

          {/* CTA */}
          <div className="px-4 py-4 flex flex-col gap-3">
            <Link href="/sign-in" onClick={() => setMenuOpen(false)}>
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
