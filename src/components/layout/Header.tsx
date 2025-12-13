// src/components/layout/Header.tsx

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import SidebarSheet from "./SidebarSheet";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

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
    theme === "dark"
      ? "/images/logos/002-wbig-logo.png"
      : "/images/logos/002-big-logo.png";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-6xl px-3 sm:px-4">
          <div
            className="mt-3 flex items-center justify-between gap-2 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] backdrop-blur-xl"
            style={{ boxShadow: "var(--shadow-float)" }}
          >
            {/* LEFT (mobile: menu+logo, desktop: logo) */}
            <div className="flex min-w-0 items-center gap-2 px-3 py-3 sm:gap-3 sm:px-4">
              <button
                onClick={() => setOpenMenu(true)}
                className="inline-flex rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 hover:bg-[color:var(--surface-3)] md:hidden"
                aria-label="Abrir menu"
              >
                ☰
              </button>

              <Image
                src={logoSrc}
                alt="Logo"
                width={420}
                height={140}
                className="h-9 w-auto max-w-[140px] object-contain sm:h-10 sm:max-w-[170px] md:h-12 md:max-w-[220px]"
                priority
              />
            </div>

            {/* NAV (desktop only) */}
            <nav className="hidden items-center gap-1 px-3 py-3 md:flex">
              <a className="rounded-xl px-3 py-2 text-sm text-[color:var(--muted)] hover:bg-[color:var(--surface-2)] hover:text-[color:var(--foreground)]" href="#missao">
                Missão
              </a>
              <a className="rounded-xl px-3 py-2 text-sm text-[color:var(--muted)] hover:bg-[color:var(--surface-2)] hover:text-[color:var(--foreground)]" href="#programas">
                Programas
              </a>
              <a className="rounded-xl px-3 py-2 text-sm text-[color:var(--muted)] hover:bg-[color:var(--surface-2)] hover:text-[color:var(--foreground)]" href="#conteudos">
                Conteúdos
              </a>
              <a className="rounded-xl px-3 py-2 text-sm text-[color:var(--muted)] hover:bg-[color:var(--surface-2)] hover:text-[color:var(--foreground)]" href="#comunidade">
                Comunidade
              </a>
            </nav>

            {/* RIGHT (desktop only) */}
            <div className="hidden items-center gap-2 px-3 py-3 sm:px-4 md:flex">
              <Button variant="ghost" onClick={() => setOpenLogin(true)}>
                Entrar
              </Button>

              <Button onClick={() => alert("Depois liga no fluxo de cadastro")}>Fazer parte</Button>

              <button
                onClick={toggleTheme}
                className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 hover:bg-[color:var(--surface-3)]"
                aria-label="Alternar tema"
                title={theme === "dark" ? "Trocar para light" : "Trocar para dark"}
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
      </header>

      {/* Mobile menu modal */}
      <SidebarSheet open={openMenu} onClose={() => setOpenMenu(false)} />

      {/* Login modal (desktop trigger por enquanto) */}
      <Modal open={openLogin} onClose={() => setOpenLogin(false)} title="Entrar">
        <div className="space-y-3">
          <input
            className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 outline-none focus:border-[color:var(--ring)]"
            placeholder="Email"
          />
          <input
            className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 outline-none focus:border-[color:var(--ring)]"
            placeholder="Senha"
            type="password"
          />
          <Button className="w-full" onClick={() => alert("Depois integra autenticação")}>
            Entrar
          </Button>
          <button
            className="w-full text-sm text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
            onClick={() => alert("Depois integra cadastro")}
          >
            Não tenho conta - criar agora
          </button>
        </div>
      </Modal>
    </>
  );
}
