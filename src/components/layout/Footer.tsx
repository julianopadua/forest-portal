// src/components/layout/Footer.tsx

export default function Footer() {
  return (
    <footer className="border-t border-[color:var(--border)] bg-[color:var(--surface)]">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-[color:var(--muted)]">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-semibold text-[color:var(--text)]">Forest Institute</div>
            <div className="text-xs">Conhecimento aplicado, comunidade e ferramentas.</div>
          </div>
          <div className="flex gap-4 text-xs">
            <a className="hover:text-[color:var(--text)]" href="#missao">Missão</a>
            <a className="hover:text-[color:var(--text)]" href="#conteudos">Conteúdos</a>
            <a className="hover:text-[color:var(--text)]" href="#comunidade">Comunidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
