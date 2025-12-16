// src/components/layout/SidebarSheet.tsx

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { useI18n } from "@/i18n/I18nProvider";
import { useRouter } from "next/navigation";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import AuthModal from "@/components/auth/AuthModal";

type ThemeMode = "light" | "dark";

function SunIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 14.2A8.1 8.1 0 0 1 9.8 3.6a7.3 7.3 0 1 0 11.2 10.6Z" />
    </svg>
  );
}

export default function SidebarSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { locale, setLocale, dict } = useI18n();
  const router = useRouter();
  const { user } = useSupabaseUser();

  const [openSettings, setOpenSettings] = useState(true);
  const [theme, setTheme] = useState<ThemeMode>("light");

  const [openAuth, setOpenAuth] = useState(false);

  const openDataId = dict.marketing.sections.mission.id;
  const commoditiesId = dict.marketing.sections.programs.id;
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

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60]">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <aside
          className="absolute left-0 top-0 h-full w-[320px] border-r border-[color:var(--border)] bg-[color:var(--surface)] p-4 backdrop-blur-xl"
          style={{ boxShadow: "var(--shadow-float)" }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-semibold">{dict.common.menuTitle}</div>
            <button onClick={onClose} className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-2)] px-2 py-1 hover:bg-[color:var(--surface-3)]">
              ✕
            </button>
          </div>

          <div className="mb-4 flex items-center gap-2">
            {user ? (
              <Link href="/settings" className="flex-1" onClick={onClose}>
                <Button className="w-full" variant="ghost">
                  Profile
                </Button>
              </Link>
            ) : (
              <Button className="flex-1" variant="ghost" onClick={() => setOpenAuth(true)}>
                {dict.common.signIn}
              </Button>
            )}

            <button onClick={toggleTheme} className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 hover:bg-[color:var(--surface-3)]">
              {theme === "dark" ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
            </button>
          </div>

          <nav className="space-y-1">
            <Link className="block rounded-xl px-3 py-2 text-[color:var(--muted)] hover:bg-[color:var(--surface-2)]" href="/" onClick={onClose}>
              {dict.common.home}
            </Link>
            <Link className="block rounded-xl px-3 py-2 text-[color:var(--muted)] hover:bg-[color:var(--surface-2)]" href={`/${openDataId}`} onClick={onClose}>
              {dict.marketing.sections.mission.title}
            </Link>
            <Link className="block rounded-xl px-3 py-2 text-[color:var(--muted)] hover:bg-[color:var(--surface-2)]" href={`/${commoditiesId}`} onClick={onClose}>
              {dict.marketing.sections.programs.title}
            </Link>
            <Link className="block rounded-xl px-3 py-2 text-[color:var(--muted)] hover:bg-[color:var(--surface-2)]" href={`/${reportsId}`} onClick={onClose}>
              {dict.marketing.sections.contents.title}
            </Link>
            <Link className="block rounded-xl px-3 py-2 text-[color:var(--muted)] hover:bg-[color:var(--surface-2)]" href={`/${educationId}`} onClick={onClose}>
              {dict.marketing.sections.community.title}
            </Link>
          </nav>

          <div className="mt-5">
            <button
              onClick={() => setOpenSettings((v) => !v)}
              className="flex w-full items-center justify-between rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-sm hover:bg-[color:var(--surface-3)]"
            >
              <span className="font-medium">{dict.common.settings}</span>
              <span className="text-[color:var(--muted)]">{openSettings ? "▾" : "▸"}</span>
            </button>

            {openSettings && (
              <div className="mt-3 space-y-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
                <div>
                  <div className="mb-2 text-xs font-semibold text-[color:var(--muted)]">{dict.common.language}</div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className={locale === "pt" ? "opacity-100" : "opacity-60"} onClick={() => setLocale("pt")}>
                      {dict.common.pt}
                    </Button>
                    <Button variant="ghost" size="sm" className={locale === "en" ? "opacity-100" : "opacity-60"} onClick={() => setLocale("en")}>
                      {dict.common.en}
                    </Button>
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
