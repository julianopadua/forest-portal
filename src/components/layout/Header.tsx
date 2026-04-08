// src/components/layout/Header.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SidebarSheet from "./SidebarSheet";
import Button from "@/components/ui/Button";
import { useI18n } from "@/i18n/I18nProvider";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import AuthModal from "@/components/auth/AuthModal";
import type { AuthMode } from "@/components/auth/AuthForm";

type ThemeMode = "light" | "dark";

function IconMenu({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 14.2A8.1 8.1 0 0 1 9.8 3.6a7.3 7.3 0 1 0 11.2 10.6Z" />
    </svg>
  );
}

export default function Header() {
  const { dict } = useI18n();
  const { user } = useSupabaseUser();

  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [openMenu, setOpenMenu] = useState(false);
  const [openAuth, setOpenAuth] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    const q = sp.get("auth");
    if (q === "signin" || q === "signup") {
      setAuthMode(q);
      setOpenAuth(true);

      const next = new URLSearchParams(sp.toString());
      next.delete("auth");
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp]);

  useEffect(() => {
    const getThemeFromHtml = (): ThemeMode => {
      const html = document.documentElement;
      if (html.classList.contains("theme-dark")) return "dark";
      if (html.classList.contains("theme-light")) return "light";
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    };

    const applyFromStorageOrSystem = () => {
      const stored = localStorage.getItem("fp_theme") as ThemeMode | null;
      const next = stored ?? getThemeFromHtml();
      const html = document.documentElement;
      html.classList.remove("theme-dark", "theme-light");
      html.classList.add(next === "dark" ? "theme-dark" : "theme-light");
      setTheme(next);
    };

    applyFromStorageOrSystem();

    const obs = new MutationObserver(() => setTheme(getThemeFromHtml()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const toggleTheme = () => {
    const next: ThemeMode = theme === "dark" ? "light" : "dark";
    const html = document.documentElement;
    html.classList.remove("theme-dark", "theme-light");
    html.classList.add(next === "dark" ? "theme-dark" : "theme-light");
    localStorage.setItem("fp_theme", next);
    setTheme(next);
  };

  const logoSrc = theme === "dark" ? "/images/logos/002-wbig-logo.png" : "/images/logos/002-big-logo.png";

  const openDataId = dict.marketing.sections.mission.id;
  const reportsId = dict.marketing.sections.contents.id;
  const educationId = dict.marketing.sections.community.id;

  const modalKey = useMemo(() => `auth-${authMode}`, [authMode]);

  const navLinkClass =
    "rounded-xl px-4 py-2.5 text-sm font-medium text-[color:var(--text)] hover:bg-[color:var(--surface-2)] lg:px-5 lg:text-base";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-6xl px-3 sm:px-4">
          <div
            className="mt-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] backdrop-blur-xl"
            style={{ boxShadow: "var(--shadow-float)" }}
          >
            {/* MOBILE */}
            <div className="flex items-center justify-between px-3 py-3 sm:px-4 md:hidden">
              <button
                onClick={() => setOpenMenu(true)}
                className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 hover:bg-[color:var(--surface-3)]"
                aria-label={dict.common.openMenu}
                title={dict.common.openMenu}
              >
                <IconMenu className="h-4 w-4" />
              </button>

              <Link href="/" aria-label={dict.common.home} className="ml-3">
                <Image src={logoSrc} alt="Logo" width={420} height={140} className="h-11 w-auto max-w-[210px] object-contain" priority />
              </Link>
            </div>

            {/* DESKTOP */}
            <div className="hidden md:grid md:grid-cols-[auto_1fr_auto] md:items-center md:px-5 md:py-3">
              <div className="flex shrink-0 items-center gap-5">
                <button
                  onClick={() => setOpenMenu(true)}
                  className="inline-flex rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 hover:bg-[color:var(--surface-3)]"
                  aria-label={dict.common.openMenu}
                  title={dict.common.openMenu}
                >
                  <IconMenu className="h-4 w-4" />
                </button>

                <Link href="/" aria-label={dict.common.home}>
                  <Image src={logoSrc} alt="Logo" width={420} height={140} className="h-12 w-auto max-w-[240px] object-contain lg:h-14 lg:max-w-[300px]" priority />
                </Link>
              </div>

              <nav className="min-w-0 justify-self-center" aria-label="Navegação principal">
                <div className="flex items-center justify-center gap-4 lg:gap-6">
                  <Link className={`${navLinkClass} min-w-[132px] text-center lg:min-w-[160px]`} href={`/${openDataId}`}>
                    {dict.marketing.sections.mission.title}
                  </Link>

                  <Link className={`${navLinkClass} min-w-[132px] text-center lg:min-w-[160px]`} href={`/${reportsId}`}>
                    {dict.marketing.sections.contents.title}
                  </Link>

                  <Link className={`${navLinkClass} min-w-[132px] text-center lg:min-w-[160px]`} href={`/${educationId}`}>
                    {dict.marketing.sections.community.title}
                  </Link>

                  <Link className={`${navLinkClass} min-w-[110px] text-center lg:min-w-[130px]`} href="/blog">
                    {dict.common.blog}
                  </Link>

                  <Link className={`${navLinkClass} min-w-[110px] text-center lg:min-w-[130px]`} href="/quem-somos">
                    {dict.common.aboutUs}
                  </Link>
                </div>
              </nav>

              <div className="flex shrink-0 items-center justify-end gap-3">
                {user ? (
                  <Link href="/settings">
                    <Button variant="ghost" size="sm">
                      {dict.common.settings}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setAuthMode("signin");
                      setOpenAuth(true);
                    }}
                  >
                    {dict.common.signIn}
                  </Button>
                )}

                <button
                  onClick={toggleTheme}
                  className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 hover:bg-[color:var(--surface-3)]"
                  aria-label={theme === "dark" ? dict.common.themeToLight : dict.common.themeToDark}
                  title={theme === "dark" ? dict.common.themeToLight : dict.common.themeToDark}
                >
                  {theme === "dark" ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <SidebarSheet open={openMenu} onClose={() => setOpenMenu(false)} />

      <AuthModal
        key={modalKey}
        open={openAuth}
        onClose={() => setOpenAuth(false)}
        initialMode={authMode}
        onSuccess={() => {
          setOpenAuth(false);
          router.refresh();
        }}
      />
    </>
  );
}
