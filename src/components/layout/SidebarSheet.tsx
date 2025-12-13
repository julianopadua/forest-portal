// src/components/layout/SidebarSheet.tsx

"use client";

import Button from "@/components/ui/Button";

export default function SidebarSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
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

        <nav className="space-y-1">
          <a className="block rounded-xl px-3 py-2 text-[color:var(--muted)] hover:bg-[color:var(--surface-2)] hover:text-[color:var(--text)]" href="#missao" onClick={onClose}>
            Missão
          </a>
          <a className="block rounded-xl px-3 py-2 text-[color:var(--muted)] hover:bg-[color:var(--surface-2)] hover:text-[color:var(--text)]" href="#programas" onClick={onClose}>
            Programas
          </a>
          <a className="block rounded-xl px-3 py-2 text-[color:var(--muted)] hover:bg-[color:var(--surface-2)] hover:text-[color:var(--text)]" href="#conteudos" onClick={onClose}>
            Conteúdos
          </a>
          <a className="block rounded-xl px-3 py-2 text-[color:var(--muted)] hover:bg-[color:var(--surface-2)] hover:text-[color:var(--text)]" href="#comunidade" onClick={onClose}>
            Comunidade
          </a>
        </nav>

        <div className="mt-6 space-y-2">
          <Button className="w-full" onClick={() => alert("Depois liga no cadastro")}>
            Fazer parte do Instituto
          </Button>
          <Button className="w-full" variant="ghost" onClick={() => alert("Depois liga no modo visitante")}>
            Usar sem logar
          </Button>
        </div>
      </aside>
    </div>
  );
}
