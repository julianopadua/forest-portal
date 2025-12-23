// src/app/(marketing)/page.tsx

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";

type ThemeMode = "light" | "dark";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function getThemeFromHtml(): ThemeMode {
  const html = document.documentElement;

  if (html.classList.contains("theme-dark")) return "dark";
  if (html.classList.contains("theme-light")) return "light";

  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function useThemeMode() {
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    setTheme(getThemeFromHtml());

    const obs = new MutationObserver(() => setTheme(getThemeFromHtml()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  return theme;
}

function useScrollGreenBackdrop(active: boolean) {
  useEffect(() => {
    const docEl = document.documentElement;

    const keys = ["--bg-0", "--bg-1", "--bg-2", "--bg-3", "--bg-4", "--glow-0", "--glow-1"];

    if (!active) {
      for (const k of keys) docEl.style.removeProperty(k);
      return;
    }

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    let raf = 0;

    const set = (name: string, value: string) => {
      docEl.style.setProperty(name, value);
    };

    const update = () => {
      raf = 0;

      const max = docEl.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      const t = clamp01(p);

      const hueA = lerp(142, 128, t);
      const hueB = lerp(152, 136, t);
      const hueC = lerp(138, 122, t);

      const l0 = lerp(10, 6, t);
      const l1 = lerp(12, 7, t);
      const l2 = lerp(9, 5, t);
      const l3 = lerp(7, 4, t);
      const l4 = lerp(6, 3, t);

      const s0 = lerp(44, 52, t);
      const s1 = lerp(42, 50, t);
      const s2 = lerp(46, 54, t);

      set("--bg-0", `${hueA.toFixed(1)} ${s0.toFixed(1)}% ${l0.toFixed(1)}%`);
      set("--bg-1", `${hueB.toFixed(1)} ${s1.toFixed(1)}% ${l1.toFixed(1)}%`);
      set("--bg-2", `${hueC.toFixed(1)} ${s2.toFixed(1)}% ${l2.toFixed(1)}%`);
      set("--bg-3", `${hueA.toFixed(1)} 40% ${l3.toFixed(1)}%`);
      set("--bg-4", `${hueB.toFixed(1)} 38% ${l4.toFixed(1)}%`);

      const glow = lerp(0.55, 0.38, t);
      const glow2 = lerp(0.42, 0.30, t);
      set("--glow-0", glow.toFixed(3));
      set("--glow-1", glow2.toFixed(3));
    };

    const onScroll = () => {
      if (reduceMotion) return;
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [active]);
}

function ThemedBackdrop() {
  const theme = useThemeMode();
  const isDark = theme === "dark";

  useScrollGreenBackdrop(isDark);

  const darkStyle: React.CSSProperties = {
    backgroundImage: [
      "radial-gradient(900px circle at 18% 0%, hsl(var(--bg-0) / var(--glow-0)), transparent 58%)",
      "radial-gradient(860px circle at 82% 10%, hsl(var(--bg-1) / var(--glow-1)), transparent 60%)",
      "radial-gradient(700px circle at 50% 22%, hsl(var(--bg-2) / 0.22), transparent 72%)",
      "linear-gradient(180deg, hsl(var(--bg-2)), hsl(var(--bg-3)) 55%, hsl(var(--bg-4)))",
    ].join(", "),
  };

  const lightStyle: React.CSSProperties = {
    backgroundImage: [
      "radial-gradient(880px circle at 16% 0%, rgba(16,185,129,0.12), transparent 62%)",
      "radial-gradient(820px circle at 84% 8%, rgba(52,211,153,0.10), transparent 64%)",
      "linear-gradient(180deg, #ffffff 0%, #f4fbf7 55%, #def6e8 100%)",
    ].join(", "),
  };

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      {/* DARK */}
      <div className={["absolute inset-0 transition-opacity duration-500", isDark ? "opacity-100" : "opacity-0"].join(" ")}>
        <div className="absolute inset-0" style={darkStyle} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),rgba(0,0,0,0))]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/70 to-black" />
      </div>

      {/* LIGHT */}
      <div className={["absolute inset-0 transition-opacity duration-500", isDark ? "opacity-0" : "opacity-100"].join(" ")}>
        <div className="absolute inset-0" style={lightStyle} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.92),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/55 via-transparent to-white/20" />
      </div>
    </div>
  );
}

function Reveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e?.isIntersecting) setVisible(true);
      },
      { threshold: 0.12 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={[
        "transition duration-700 ease-out motion-reduce:transition-none",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id?: string;
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}) {
  return (
    <section id={id} className="py-7 md:py-9 scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 md:p-9 backdrop-blur-xl">
            <div className="max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-semibold">{title}</h2>
              <p className="mt-2 text-[color:var(--muted)]">{subtitle}</p>
            </div>
            <div className="mt-6">{children}</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function LinkCard({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-5 transition hover:bg-[color:var(--surface-3)] focus:outline-none focus:ring-2 focus:ring-[color:var(--border)]"
      aria-label={title}
    >
      <div className="font-semibold">{title}</div>
      <div className="mt-1 text-sm text-[color:var(--muted)]">{desc}</div>
    </Link>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-5">
      <div className="font-semibold">{title}</div>
      <div className="mt-2 text-sm text-[color:var(--muted)]">{children}</div>
    </div>
  );
}

export default function MarketingHome() {
  const { dict } = useI18n();

  const openData = dict.marketing.sections.mission;
  const reports = dict.marketing.sections.contents;
  const education = dict.marketing.sections.community;

  const portfolioUrl = process.env.NEXT_PUBLIC_PORTFOLIO_URL;

  const primaryCards = [
    {
      href: `/${openData.id}`,
      title: "Dados abertos",
      desc: "Clima, queimadas e decisão no mundo real.",
    },
    {
      href: `/${reports.id}`,
      title: "Relatórios",
      desc: "Relatórios automatizados, customizáveis e reprodutíveis localmente.",
    },
    {
      href: `/${education.id}`,
      title: "Educação",
      desc: "Espaço aberto que visa o aprendizado e a colaboração.",
    },
    {
      href: "#sobre-o-instituto",
      title: "Sobre o Instituto",
      desc: "Missão pública, princípios e compromisso open source.",
    },
  ];

  return (
    <div className="relative">
      <ThemedBackdrop />

      <div className="relative z-10">
        {/* HERO */}
        <section className="py-10 md:py-12">
          <div className="mx-auto max-w-6xl px-4">
            <Reveal>
              <div className="rounded-3xl border border-[color:var(--border)] bg-gradient-to-b from-[color:var(--surface-2)] to-[color:var(--surface)] p-8 md:p-11 backdrop-blur-xl">
                <h1 className="text-3xl md:text-5xl font-semibold leading-tight">{dict.marketing.hero.title}</h1>

                <p className="mt-4 max-w-3xl text-[color:var(--muted)]">{dict.marketing.hero.subtitle}</p>

                <div className="mt-9 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                  {primaryCards.map((c) => (
                    <LinkCard key={c.href} href={c.href} title={c.title} desc={c.desc} />
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* SOBRE O INSTITUTO */}
        <Section
          id="sobre-o-instituto"
          title="Instituto Forest"
          subtitle="Organização sem fins lucrativos, open source e orientada à utilidade pública."
        >
          <div className="grid gap-3 md:grid-cols-2">
            <InfoCard title="Propósito institucional">
              <p>
                Fornecer dados abertos, estruturados e auditáveis a partir de fontes relevantes para economia, logística,
                agricultura, saúde e segurança social, com foco em aplicações práticas e decisões no mundo real.
              </p>
              <p className="mt-3">
                O Instituto prioriza transparência metodológica: o dado final deve ser acompanhado do processo que o
                produz, incluindo coleta, validação e transformação.
              </p>
            </InfoCard>

            <InfoCard title="Entrega e método">
              <ul className="list-disc pl-5 space-y-1">
                <li>Catálogo de dados abertos e séries históricas padronizadas.</li>
                <li>
                  Códigos completos de scraping, processamento e geração de relatórios, disponibilizados gratuitamente.
                </li>
                <li>Reprodutibilidade por versionamento, documentação e trilhas de auditoria.</li>
                <li>Contribuição comunitária por práticas open source.</li>
              </ul>
            </InfoCard>

            <InfoCard title="Compromissos">
              <ul className="list-disc pl-5 space-y-1">
                <li>Uso responsável e orientação a impacto socioambiental.</li>
                <li>Documentação pública como requisito, não como etapa opcional.</li>
                <li>Escalabilidade por automação, modularidade e padrões de dados.</li>
              </ul>
            </InfoCard>

            <InfoCard title="Resultados esperados">
              <p>
                Reduzir assimetrias de informação e custo de acesso a dados, fortalecendo decisões técnicas em políticas
                públicas, cadeias produtivas, logística e proteção socioambiental.
              </p>
            </InfoCard>
          </div>
        </Section>

        {/* DEDICATÓRIA */}
        <Section
          id="dedicatoria"
          title="Dedicatória"
          subtitle="Este projeto reconhece um legado de serviço público, conservação e responsabilidade intergeracional."
        >
          <div className="grid gap-3 md:grid-cols-2">
            <InfoCard title="Mariceia Barbosa Silva Pádua">
              <p>
                Engenheira florestal formada pela Universidade Federal de Lavras, com atuação técnica no serviço público
                ambiental. Seu trabalho se associa à gestão e proteção de unidades de conservação, com ênfase em manejo,
                monitoramento e respostas operacionais a riscos ambientais.
              </p>
              <p className="mt-3">
                Ao assumir responsabilidades de gestão em unidade de conservação estadual, sua trajetória materializa o
                componente menos visível e mais essencial da conservação: execução contínua, presença em campo e
                disciplina institucional.
              </p>
              <p className="mt-3">
                Esta dedicatória registra a dimensão pública desse compromisso e o exemplo de rigor técnico aplicado a um
                bem coletivo.
              </p>
            </InfoCard>

            <InfoCard title="Maria Tereza Jorge Pádua">
              <p>
                Engenheira agrônoma, ambientalista e conservacionista reconhecida pela contribuição decisiva na criação e
                consolidação de áreas protegidas no Brasil, com atuação institucional e técnica em políticas de
                conservação.
              </p>
              <p className="mt-3">
                Sua trajetória se relaciona à estruturação de instrumentos e redes de conservação, articulando ciência,
                gestão pública e proteção territorial.
              </p>
              <p className="mt-3">
                Esta dedicatória sustenta que acesso aberto ao conhecimento, à evidência e ao método é parte do mesmo
                projeto público que sustenta a conservação: ampliar capacidades e proteger a vida em escala.
              </p>
            </InfoCard>
          </div>

          <div className="mt-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-5 text-sm text-[color:var(--muted)]">
            <div className="font-semibold">Nota de reconhecimento</div>
            <p className="mt-2">
              O Instituto Forest opera sob uma premissa simples e exigente: confiança pública depende de método público.
              A abertura do processo é parte do produto.
            </p>
          </div>
        </Section>

        {/* CRIADOR */}
        <Section id="criador" title="Quem eu sou" subtitle="Autoria, responsabilidade e canal de contato.">
          <div className="grid gap-3 md:grid-cols-2">
            <InfoCard title="Juliano Pádua">
              <p>
                Criador do Instituto Forest. Esta seção será refinada a partir do currículo, com foco em trajetória
                técnica, pesquisa aplicada, engenharia de dados e compromisso com transparência reprodutível.
              </p>
            </InfoCard>

            <InfoCard title="Contato e portfólio">
              <p>
                {portfolioUrl
                  ? "Canal de contato e referências profissionais via portfólio."
                  : "Defina NEXT_PUBLIC_PORTFOLIO_URL para habilitar o redirecionamento ao portfólio."}
              </p>

              {portfolioUrl ? (
                <a
                  href={portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-2 text-sm transition hover:bg-[color:var(--surface-3)] focus:outline-none focus:ring-2 focus:ring-[color:var(--border)]"
                >
                  Abrir portfólio
                </a>
              ) : null}
            </InfoCard>
          </div>
        </Section>
      </div>
    </div>
  );
}
