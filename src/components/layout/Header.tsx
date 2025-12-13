// src/components/layout/Header.tsx

"use client";

import Image from "next/image";
import { useState } from "react";
import SidebarSheet from "./SidebarSheet";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

export default function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mt-3 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_10px_30px_-15px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-3 px-4 py-3">
              <button
                onClick={() => setOpenMenu(true)}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10"
                aria-label="Abrir menu"
              >
                ☰
              </button>

              <div className="flex items-center gap-2">
                <Image
                  src="/images/logos/logo-primary.png"
                  alt="Logo do Instituto"
                  width={34}
                  height={34}
                  className="rounded-md"
                  priority
                />
                <div className="leading-tight">
                  <div className="text-sm font-semibold">Forest Institute</div>
                  <div className="text-xs text-zinc-300">portal</div>
                </div>
              </div>
            </div>

            <nav className="hidden items-center gap-2 px-3 py-3 md:flex">
              <a className="px-3 py-2 text-sm text-zinc-200 hover:text-white" href="#missao">Missão</a>
              <a className="px-3 py-2 text-sm text-zinc-200 hover:text-white" href="#programas">Programas</a>
              <a className="px-3 py-2 text-sm text-zinc-200 hover:text-white" href="#conteudos">Conteúdos</a>
              <a className="px-3 py-2 text-sm text-zinc-200 hover:text-white" href="#comunidade">Comunidade</a>
            </nav>

            <div className="flex items-center gap-2 px-4 py-3">
              <Button variant="ghost" onClick={() => setOpenLogin(true)}>
                Entrar
              </Button>
              <Button onClick={() => alert("Depois liga no fluxo de cadastro")}>
                Fazer parte
              </Button>
            </div>
          </div>
        </div>
      </header>

      <SidebarSheet open={openMenu} onClose={() => setOpenMenu(false)} />

      <Modal open={openLogin} onClose={() => setOpenLogin(false)} title="Entrar">
        <div className="space-y-3">
          <input
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-white/20"
            placeholder="Email"
          />
          <input
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-white/20"
            placeholder="Senha"
            type="password"
          />
          <Button className="w-full" onClick={() => alert("Depois integra autenticação")}>
            Entrar
          </Button>
          <button
            className="w-full text-sm text-zinc-300 hover:text-white"
            onClick={() => alert("Depois integra cadastro")}
          >
            Não tenho conta - criar agora
          </button>
        </div>
      </Modal>
    </>
  );
}
