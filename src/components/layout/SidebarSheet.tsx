// src/components/layout/SidebarSheet.tsx

"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

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

export default function SidebarSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
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
            <div className="text-sm font-semibold">Menu</div>

            <button
              onClick={onClose}
              className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-2)] px-2 py-1 hover:bg-[color:var(--surface-3)]"
              aria-label="Fechar menu"
            >
              ✕
            </button>
          </div>

          {/* Ações rápidas no topo (mobile) */}
          <div className="mb-4 flex items-center gap-2">
            <Button
              className="flex-1"
              variant="ghost"
              onClick={() => {
                setOpenLogin(true);
              }}
            >
              Entrar
            </Button>

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

          <nav className="space-y-1">
            <a
              className="block rounded-xl px-3 py-2 text-[color:var(--muted)] hover:bg-[color:var(--surface-2)] hover:text-[color:var(--foreground)]"
              href="#missao"
              onClick={onClose}
            >
              Missão
            </a>
            <a
              className="block rounded-xl px-3 py-2 text-[color:var(--muted)] hover:bg-[color:var(--surface-2)] hover:text-[color:var(--foreground)]"
              href="#programas"
              onClick={onClose}
            >
              Programas
            </a>
            <a
              className="block rounded-xl px-3 py-2 text-[color:var(--muted)] hover:bg-[color:var(--surface-2)] hover:text-[color:var(--foreground)]"
              href="#conteudos"
              onClick={onClose}
            >
              Conteúdos
            </a>
            <a
              className="block rounded-xl px-3 py-2 text-[color:var(--muted)] hover:bg-[color:var(--surface-2)] hover:text-[color:var(--foreground)]"
              href="#comunidade"
              onClick={onClose}
            >
              Comunidade
            </a>
          </nav>

          <div className="mt-6 space-y-2">
            <Button
              className="w-full"
              onClick={() => {
                alert("Depois liga no cadastro");
                onClose();
              }}
            >
              Fazer parte do Instituto
            </Button>

            <Button
              className="w-full"
              variant="ghost"
              onClick={() => {
                alert("Depois liga no modo visitante");
                onClose();
              }}
            >
              Usar sem logar
            </Button>
          </div>
        </aside>
      </div>

      {/* Login modal (mobile, acionado pelo menu) */}
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
          <Button
            className="w-full"
            onClick={() => {
              alert("Depois integra autenticação");
              setOpenLogin(false);
              onClose();
            }}
          >
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
