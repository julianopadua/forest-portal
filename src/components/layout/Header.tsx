// src/components/layout/Header.tsx

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import SidebarSheet from "./SidebarSheet";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

type ThemeMode = "light" | "dark";

export default function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    const getThemeFromHtml = (): ThemeMode => {
      const html = document.documentElement;

      if (html.classList.contains("theme-dark")) return "dark";
      if (html.classList.contains("theme-light")) return "light";

      // fallback: usa o sistema
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    };

    const apply = () => setTheme(getThemeFromHtml());
    apply();

    // observa mudanças de classe no <html> (caso você implemente um toggle depois)
    const obs = new MutationObserver(apply);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // observa mudanças no tema do sistema (fallback)
    const mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
    const onMq = () => apply();
    mq?.addEventListener?.("change", onMq);

    return () => {
      obs.disconnect();
      mq?.removeEventListener?.("change", onMq);
    };
  }, []);

  const logoSrc =
    theme === "dark"
      ? "/images/logos/002-wbig-logo.png" // logo para fundo escuro
      : "/images/logos/002-big-logo.png"; // logo para fundo claro

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-6xl px-4">
          <div
            className="mt-3 flex items-center justify-between rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] backdrop-blur-xl"
            style={{ boxShadow: "var(--shadow-float)" }}
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <button
                onClick={() => setOpenMenu(true)}
                className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 hover:bg-[color:var(--surface-3)]"
                aria-label="Abrir menu"
              >
                ☰
              </button>

              <Image
                src={logoSrc}
                alt="Logo"
                width={420}
                height={140}
                className="h-10 w-auto max-w-[180px] md:h-12 md:max-w-[220px] object-contain"
                priority
              />
            </div>

            <nav className="hidden items-center gap-2 px-3 py-3 md:flex">
              <a
                className="px-3 py-2 text-sm text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
                href="#missao"
              >
                Missão
              </a>
              <a
                className="px-3 py-2 text-sm text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
                href="#programas"
              >
                Programas
              </a>
              <a
                className="px-3 py-2 text-sm text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
                href="#conteudos"
              >
                Conteúdos
              </a>
              <a
                className="px-3 py-2 text-sm text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
                href="#comunidade"
              >
                Comunidade
              </a>
            </nav>

            <div className="flex items-center gap-2 px-4 py-3">
              <Button variant="ghost" onClick={() => setOpenLogin(true)}>
                Entrar
              </Button>
              <Button onClick={() => alert("Depois liga no fluxo de cadastro")}>Fazer parte</Button>
            </div>
          </div>
        </div>
      </header>

      <SidebarSheet open={openMenu} onClose={() => setOpenMenu(false)} />

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
