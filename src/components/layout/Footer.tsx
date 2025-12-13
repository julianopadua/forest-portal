// src/components/layout/Footer.tsx

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/20">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-zinc-300">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-semibold text-white">Forest Institute</div>
            <div className="text-xs">Conhecimento aplicado, comunidade e ferramentas.</div>
          </div>
          <div className="flex gap-4 text-xs">
            <a className="hover:text-white" href="#missao">Missão</a>
            <a className="hover:text-white" href="#conteudos">Conteúdos</a>
            <a className="hover:text-white" href="#comunidade">Comunidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
