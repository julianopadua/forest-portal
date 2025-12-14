// src/components/layout/Header.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import SidebarSheet from "./SidebarSheet";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useI18n } from "@/i18n/I18nProvider";

type ThemeMode = "light" | "dark";

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 14.2A8.1 8.1 0 0 1 9.8 3.6a7.3 7.3 0 1 0 11.2 10.6Z" />
    </svg>
  );
}

export default function Header() {
  const { dict } = useI18n();

  const [openMenu, setOpenMenu] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    const getThemeFromHtml = (): ThemeMode => {
      const html = document.documentElement;

      if (html.classList.contains("theme-dark")) return "dark";
      if (html.classList.contains("theme-light")) return "light";

      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
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

    const mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
    const onMq = () => {
      const stored = localStorage.getItem("fp_theme");
      if (!stored) applyFromStorageOrSystem();
    };
    mq?.addEventListener?.("change", onMq);

    return () => {
      obs.disconnect();
      mq?.removeEventListener?.("change", onMq);
    };
  }, []);

  const toggleTheme = () => {
    const next: ThemeMode = theme === "dark" ? "light" : "dark";
    const html = document.documentElement;

    html.classList.remove("theme-dark", "theme-light");
    html.classList.add(next === "dark" ? "theme-dark" : "theme-light");

    localStorage.setItem("fp_theme", next);
    setTheme(next);
  };

  const logoSrc =
    theme === "dark" ? "/images/logos/002-wbig-logo.png" : "/images/logos/002-big-logo.png";

  const openDataId = dict.marketing.sections.mission.id;
  const commoditiesId = dict.marketing.sections.programs.id;
  const reportsId = dict.marketing.sections.contents.id;
  const educationId = dict.marketing.sections.community.id;

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
                ☰
              </button>

              <Link href="/" aria-label={dict.common.home} title={dict.common.home}>
                <Image
                  src={logoSrc}
                  alt="Logo"
                  width={420}
                  height={140}
                  className="h-11 w-auto max-w-[210px] object-contain"
                  priority
                />
              </Link>
            </div>

            {/* DESKTOP */}
            <div className="hidden md:flex md:items-center md:gap-3 md:px-3 md:py-3 sm:px-4">
              {/* left */}
              <div className="flex shrink-0 items-center gap-3">
                <button
                  onClick={() => setOpenMenu(true)}
                  className="inline-flex rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 hover:bg-[color:var(--surface-3)]"
                  aria-label={dict.common.openMenu}
                  title={dict.common.openMenu}
                >
                  ☰
                </button>

                <Link href="/" aria-label={dict.common.home} title={dict.common.home}>
                  <Image
                    src={logoSrc}
                    alt="Logo"
                    width={420}
                    height={140}
                    className="h-12 w-auto max-w-[220px] object-contain lg:h-14 lg:max-w-[280px]"
                    priority
                  />
                </Link>
              </div>

              {/* middle */}
              <nav className="hidden md:flex flex-1 min-w-0 items-center justify-center gap-1">
                <Link
                  className="whitespace-nowrap rounded-xl px-2 py-2 text-xs text-[color:var(--muted)] hover:bg-[color:var(--surface-2)] hover:text-[color:var(--foreground)] lg:px-3 lg:text-sm"
                  href={`/${openDataId}`}
                >
                  {dict.marketing.sections.mission.title}
                </Link>
                <Link
                  className="whitespace-nowrap rounded-xl px-2 py-2 text-xs text-[color:var(--muted)] hover:bg-[color:var(--surface-2)] hover:text-[color:var(--foreground)] lg:px-3 lg:text-sm"
                  href={`/${commoditiesId}`}
                >
                  {dict.marketing.sections.programs.title}
                </Link>
                <Link
                  className="whitespace-nowrap rounded-xl px-2 py-2 text-xs text-[color:var(--muted)] hover:bg-[color:var(--surface-2)] hover:text-[color:var(--foreground)] lg:px-3 lg:text-sm"
                  href={`/${reportsId}`}
                >
                  {dict.marketing.sections.contents.title}
                </Link>
                <Link
                  className="whitespace-nowrap rounded-xl px-2 py-2 text-xs text-[color:var(--muted)] hover:bg-[color:var(--surface-2)] hover:text-[color:var(--foreground)] lg:px-3 lg:text-sm"
                  href={`/${educationId}`}
                >
                  {dict.marketing.sections.community.title}
                </Link>
              </nav>

              {/* right */}
              <div className="flex shrink-0 items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setOpenLogin(true)}>
                  {dict.common.signIn}
                </Button>

                <button
                  onClick={toggleTheme}
                  className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 hover:bg-[color:var(--surface-3)]"
                  aria-label={theme === "dark" ? dict.common.themeToLight : dict.common.themeToDark}
                  title={theme === "dark" ? dict.common.themeToLight : dict.common.themeToDark}
                >
                  {theme === "dark" ? (
                    <SunIcon className="h-4 w-4 text-[color:var(--foreground)]" />
                  ) : (
                    <MoonIcon className="h-4 w-4 text-[color:var(--foreground)]" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <SidebarSheet open={openMenu} onClose={() => setOpenMenu(false)} />

      <Modal open={openLogin} onClose={() => setOpenLogin(false)} title={dict.common.signIn}>
        <div className="space-y-3">
          <input
            className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 outline-none focus:border-[color:var(--ring)]"
            placeholder={dict.common.email}
          />
          <input
            className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 outline-none focus:border-[color:var(--ring)]"
            placeholder={dict.common.password}
            type="password"
          />
          <Button className="w-full" onClick={() => alert("Depois integra autenticação")}>
            {dict.common.submit}
          </Button>
          <button
            className="w-full text-sm text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
            onClick={() => alert("Depois integra cadastro")}
          >
            {dict.common.createAccount}
          </button>
        </div>
      </Modal>
    </>
  );
}
