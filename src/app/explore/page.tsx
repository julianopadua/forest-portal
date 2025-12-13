// src/app/explore/page.tsx

import Link from "next/link";
import Button from "@/components/ui/Button";

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-24">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <h1 className="text-3xl font-semibold">Explorar como visitante</h1>

        <p className="mt-4 max-w-2xl text-zinc-300">
          Aqui você pode navegar por conteúdos públicos do Forest Institute
          sem criar uma conta. Algumas funcionalidades ficam restritas para
          membros.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/">
            <Button variant="ghost">Voltar para a home</Button>
          </Link>

          <Link href="/join">
            <Button>Fazer parte do Instituto</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
