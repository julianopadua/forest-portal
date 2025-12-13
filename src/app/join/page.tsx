// src/app/join/page.tsx

import Link from "next/link";
import Button from "@/components/ui/Button";

export default function JoinPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-24">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <h1 className="text-3xl font-semibold">Fazer parte do Instituto</h1>

        <p className="mt-4 max-w-2xl text-zinc-300">
          Criar uma conta permite salvar progresso, participar da comunidade e
          acessar conteúdos e ferramentas exclusivas. Nesta versão inicial,
          o fluxo de cadastro ainda será conectado.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button>Continuar para cadastro</Button>

          <Link href="/">
            <Button variant="ghost">Voltar para a home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
