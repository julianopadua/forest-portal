// src/components/layout/SidebarSheet.tsx

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { useRouter } from "next/navigation";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import AuthModal from "@/components/auth/AuthModal";

type ThemeMode = "light" | "dark";

function IconX({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

function IconMenu({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

/**
 * Componente de ícone solar para representação de tema claro.
 */
function SunIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

/**
 * Componente de ícone lunar para representação de tema escuro.
 */
function MoonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 14.2A8.1 8.1 0 0 1 9.8 3.6a7.3 7.3 0 1 0 11.2 10.6Z" />
    </svg>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export default function SidebarSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { locale, setLocale, dict } = useI18n();
  const router = useRouter();
  const { user } = useSupabaseUser();

  const [openSettings, setOpenSettings] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [openAuth, setOpenAuth] = useState(false);

  const openDataId = dict.marketing.sections.mission.id;
  const reportsId = dict.marketing.sections.contents.id;
  const educationId = dict.marketing.sections.community.id;

  useEffect(() => {
    const getThemeFromHtml = (): ThemeMode => {
      const html = document.documentElement;
      if (html.classList.contains("theme-dark")) return "dark";
      if (html.classList.contains("theme-light")) return "light";
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    };
    setTheme(getThemeFromHtml());
  }, [open]);

  const toggleTheme = () => {
    const next: ThemeMode = theme === "dark" ? "light" : "dark";
    const html = document.documentElement;
    html.classList.remove("theme-dark", "theme-light");
    html.classList.add(next === "dark" ? "theme-dark" : "theme-light");
    localStorage.setItem("fp_theme", next);
    setTheme(next);
  };

  const isLight = theme === "light";
  const panelClass = isLight
    ? "border-white/15 bg-black/38 text-white backdrop-blur-2xl"
    : "border-[color:var(--border)] bg-[color:var(--surface)]/80 text-[color:var(--text)] backdrop-blur-xl";
  const mutedTextClass = isLight ? "text-white/90" : "text-[color:var(--muted)]";
  const softButtonClass = isLight
    ? "border-white/20 bg-black/25 text-white hover:bg-black/40"
    : "border-[color:var(--border)] bg-[color:var(--surface-2)] text-[color:var(--foreground)] hover:bg-[color:var(--surface-3)]";
  const navItemClass = isLight
    ? "block rounded-xl px-3 py-2 text-white/95 hover:bg-black/35"
    : "block rounded-xl px-3 py-2 text-[color:var(--muted)] hover:bg-[color:var(--surface-2)]";
  const actionButtonClass = `rounded-xl border px-4 py-2 text-sm font-medium transition focus:outline-none ${softButtonClass}`;

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60]">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

        <aside
          className={`absolute left-0 top-0 h-full w-[320px] md:w-[400px] border-r p-4 ${panelClass}`}
          style={{ boxShadow: "var(--shadow-float)" }}
          aria-label={dict.common.menuTitle}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconMenu className={`h-4 w-4 ${mutedTextClass}`} />
              <div className="text-sm font-semibold">{dict.common.menuTitle}</div>
            </div>

            <button
              onClick={onClose}
              className={`rounded-lg border px-2 py-2 ${softButtonClass}`}
              aria-label={dict.common.closeMenu}
              title={dict.common.closeMenu}
            >
              <IconX className="h-4 w-4" />
            </button>
          </div>

          <div className="mb-4 flex items-center gap-2">
            {user ? (
              <Link href="/settings" className="flex-1" onClick={onClose}>
                <button className={`w-full ${actionButtonClass}`}>
                  {dict.common.settings}
                </button>
              </Link>
            ) : (
              <button className={`flex-1 ${actionButtonClass}`} onClick={() => setOpenAuth(true)}>
                {dict.common.signIn}
              </button>
            )}

            <button
              onClick={toggleTheme}
              className={`rounded-xl border px-3 py-2 focus:outline-none ${softButtonClass}`}
              aria-label={theme === "dark" ? dict.common.themeToLight : dict.common.themeToDark}
              title={theme === "dark" ? dict.common.themeToLight : dict.common.themeToDark}
            >
              {theme === "dark" ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
            </button>
          </div>

          <nav className="space-y-1" aria-label="Navegação">
            <Link
              className={navItemClass}
              href="/"
              onClick={onClose}
            >
              {dict.common.home}
            </Link>

            <Link
              className={navItemClass}
              href={`/${openDataId}`}
              onClick={onClose}
            >
              {dict.marketing.sections.mission.title}
            </Link>

            <Link
              className={navItemClass}
              href={`/${reportsId}`}
              onClick={onClose}
            >
              {dict.marketing.sections.contents.title}
            </Link>

            <Link
              className={navItemClass}
              href={`/${educationId}`}
              onClick={onClose}
            >
              {dict.marketing.sections.community.title}
            </Link>

            <Link
              className={navItemClass}
              href="/blog"
              onClick={onClose}
            >
              {dict.common.blog}
            </Link>

            <Link
              className={navItemClass}
              href="/quem-somos"
              onClick={onClose}
            >
              {dict.common.aboutUs}
            </Link>
          </nav>

          <div className="mt-5">
            <button
              onClick={() => setOpenSettings((v) => !v)}
              className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm focus:outline-none ${softButtonClass}`}
            >
              <span className="font-medium">{dict.common.settings}</span>
              {openSettings ? <ChevronDown className={`h-4 w-4 ${mutedTextClass}`} /> : <ChevronRight className={`h-4 w-4 ${mutedTextClass}`} />}
            </button>

            {openSettings && (
              <div className={`mt-3 space-y-3 rounded-xl border p-3 ${isLight ? "border-white/15 bg-black/25" : "border-[color:var(--border)] bg-[color:var(--surface)]"}`}>
                <div>
                  <div className={`mb-2 text-xs font-semibold ${mutedTextClass}`}>{dict.common.language}</div>
                  <div className="flex items-center gap-2">
                    <button className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition focus:outline-none ${softButtonClass} ${locale === "pt" ? "opacity-100" : "opacity-60"}`} onClick={() => setLocale("pt")}>
                      {dict.common.pt}
                    </button>
                    <button className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition focus:outline-none ${softButtonClass} ${locale === "en" ? "opacity-100" : "opacity-60"}`} onClick={() => setLocale("en")}>
                      {dict.common.en}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      <AuthModal
        open={openAuth}
        onClose={() => setOpenAuth(false)}
        initialMode="signin"
        onSuccess={() => {
          setOpenAuth(false);
          onClose();
          router.refresh();
        }}
      />
    </>
  );
}
