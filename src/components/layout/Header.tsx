// src/components/layout/Header.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SidebarSheet from "./SidebarSheet";
import { useI18n } from "@/i18n/I18nProvider";

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

export default function Header() {
  const { dict } = useI18n();

  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [openMenu, setOpenMenu] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    const q = sp.get("auth");
    if (q === "signin" || q === "signup") {
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

  const logoSrc = theme === "dark" ? "/images/logos/002-wbig-logo.png" : "/images/logos/002-big-logo.png";

  const openDataId = dict.marketing.sections.mission.id;
  const reportsId = dict.marketing.sections.contents.id;
  const educationId = dict.marketing.sections.community.id;

  const navLinkClass =
    "rounded-xl px-3 py-2.5 text-sm font-medium text-[color:var(--text)] hover:bg-[color:var(--surface-2)] lg:px-4 lg:text-[15px]";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl px-3 sm:px-4">
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
            <div className="hidden md:grid md:grid-cols-[auto_1fr] md:items-center md:px-6 md:py-4">
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

              <nav className="min-w-0 justify-self-end" aria-label="Navegação principal">
                <div className="flex items-center justify-end gap-2 lg:gap-3">
                  <Link className={`${navLinkClass} text-center`} href={`/${openDataId}`}>
                    {dict.marketing.sections.mission.title}
                  </Link>

                  <Link className={`${navLinkClass} text-center`} href={`/${reportsId}`}>
                    {dict.marketing.sections.contents.title}
                  </Link>

                  <Link className={`${navLinkClass} text-center`} href={`/${educationId}`}>
                    {dict.marketing.sections.community.title}
                  </Link>

                  <Link className={`${navLinkClass} text-center`} href="/blog">
                    {dict.common.blog}
                  </Link>

                  <Link className={`${navLinkClass} text-center`} href="/quem-somos">
                    {dict.common.aboutUs}
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <SidebarSheet open={openMenu} onClose={() => setOpenMenu(false)} />
    </>
  );
}
