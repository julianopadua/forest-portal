// src/app/(marketing)/page.tsx

import Button from "@/components/ui/Button";

function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}) {
  return (
    <section id={id} className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-10 backdrop-blur-xl">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-semibold">{title}</h2>
            <p className="mt-2 text-zinc-300">{subtitle}</p>
          </div>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </section>
  );
}

export default function MarketingHome() {
  return (
    <div>
      {/* HERO */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-8 md:p-12 backdrop-blur-xl">
            <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
              Um portal para aprender, construir e aplicar.
            </h1>
            <p className="mt-4 max-w-2xl text-zinc-300">
              O Forest Institute organiza conhecimento em trilhas, ferramentas e comunidade.
              Você pode explorar como visitante ou entrar para salvar progresso, participar e acessar recursos avançados.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button onClick={() => alert("Depois liga no cadastro")}>Quero fazer parte</Button>
              <Button variant="ghost" onClick={() => alert("Depois liga no modo visitante")}>
                Usar sem logar
              </Button>
            </div>

            <div className="mt-10 grid gap-3 md:grid-cols-3">
              {[
                ["Trilhas", "Conteúdo estruturado por objetivos, não por acaso."],
                ["Ferramentas", "Calculadoras, templates e checklists práticos."],
                ["Comunidade", "Discussão, curadoria e projetos colaborativos."],
              ].map(([t, d]) => (
                <div key={t} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <div className="font-semibold">{t}</div>
                  <div className="mt-1 text-sm text-zinc-300">{d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4 SEÇÕES */}
      <Section
        id="missao"
        title="Missão"
        subtitle="Educação com foco em autonomia: aprender, testar, construir e aplicar no mundo real."
      >
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-zinc-300">
            Curadoria de temas-chave, com linguagem clara e referências. Sem conteúdo inchado.
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-zinc-300">
            Uma base viva: melhora contínua por feedback e revisão.
          </div>
        </div>
      </Section>

      <Section
        id="programas"
        title="Programas"
        subtitle="Trilhas por objetivo: fundamentos, prática guiada, e projetos para portfólio."
      >
        <div className="grid gap-3 md:grid-cols-3">
          {["Fundamentos", "Projetos", "Mentorias"].map((x) => (
            <div key={x} className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="font-semibold">{x}</div>
              <div className="mt-1 text-sm text-zinc-300">
                Estrutura e entregáveis claros (você sabe onde está e pra onde vai).
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="conteudos"
        title="Conteúdos"
        subtitle="Biblioteca prática: notas, guias, templates, e módulos curtos."
      >
        <div className="flex flex-wrap gap-2">
          {["Guias", "Cheatsheets", "Templates", "Artigos", "Sprints", "Checklists"].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </Section>

      <Section
        id="comunidade"
        title="Comunidade"
        subtitle="Um espaço para perguntas boas, projetos colaborativos e curadoria real."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => alert("Depois liga no cadastro")}>Criar conta</Button>
          <Button variant="ghost" onClick={() => alert("Depois liga no modo visitante")}>
            Explorar como visitante
          </Button>
        </div>
      </Section>
    </div>
  );
}
