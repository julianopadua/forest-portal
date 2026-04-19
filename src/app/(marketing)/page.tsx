// src/app/(marketing)/page.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useI18n } from "@/i18n/I18nProvider";

const BLOG_TGS_HREF = "/blog/teoria-geral-dos-sistemas";
const BLOG_OPEN_SOURCE_HREF = "/blog/comunidade-open-source";

const blogInlineLinkClass =
  "font-medium text-[color:var(--primary)] underline decoration-[color:var(--primary)]/35 underline-offset-[3px] transition hover:decoration-[color:var(--primary)]";

function TextWithInlineLink({
  text,
  linkText,
  href,
}: {
  text: string;
  linkText: string;
  href: string;
}) {
  const idx = linkText ? text.indexOf(linkText) : -1;
  if (idx < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <Link href={href} className={blogInlineLinkClass}>
        {linkText}
      </Link>
      {text.slice(idx + linkText.length)}
    </>
  );
}

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

  const darkStyle: CSSProperties = {
    backgroundImage: [
      "radial-gradient(900px circle at 18% 0%, hsl(var(--bg-0) / var(--glow-0)), transparent 58%)",
      "radial-gradient(860px circle at 82% 10%, hsl(var(--bg-1) / var(--glow-1)), transparent 60%)",
      "radial-gradient(700px circle at 50% 22%, hsl(var(--bg-2) / 0.22), transparent 72%)",
      "linear-gradient(180deg, hsl(var(--bg-2)), hsl(var(--bg-3)) 55%, hsl(var(--bg-4)))",
    ].join(", "),
  };

  const lightStyle: CSSProperties = {
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

function Reveal({ children }: { children: ReactNode }) {
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
  children?: ReactNode;
}) {
  return (
    <section id={id} className="py-7 md:py-9 scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 md:p-9 backdrop-blur-xl">
            <div className="max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-semibold">{title}</h2>
              {subtitle ? <p className="mt-2 text-[color:var(--muted)]">{subtitle}</p> : null}
            </div>
            <div className="mt-6">{children}</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function MarketingHome() {
  const { dict } = useI18n();

  const m = dict.marketing;

  return (
    <div className="relative">
      <ThemedBackdrop />

      <div className="relative z-10">
        {/* HERO */}
        <section className="py-10 md:py-12">
          <div className="mx-auto max-w-6xl px-4">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl border border-[color:var(--border)] backdrop-blur-xl">
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  src="/video/cerrado_chamas.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20" />

                <div className="relative grid min-h-[24rem] gap-7 p-8 md:min-h-[28rem] md:p-11 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-end">
                  <div className="max-w-3xl">
                    <h1 className="text-[2rem] md:text-[2.35rem] font-semibold leading-tight text-white">{m.hero.title}</h1>
                  </div>
                  <div />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* SOBRE O INSTITUTO */}
        <Section id={m.aboutInstitute.id} title={m.aboutInstitute.title} subtitle="">
          <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_4.5rem_minmax(0,1fr)] md:items-start">
            <article>
              <h3 className="text-xl font-semibold">{m.aboutInstitute.cards.purpose.title}</h3>
              <div className="mt-3 space-y-3 text-justify text-sm text-[color:var(--muted)]">
                {m.aboutInstitute.cards.purpose.paragraphs.map((text, i) => (
                  <p key={`purpose-${i}`}>
                    {i === 1 ? (
                      <TextWithInlineLink
                        text={text}
                        linkText={m.aboutInstitute.cards.purpose.tgsLinkText}
                        href={BLOG_TGS_HREF}
                      />
                    ) : (
                      text
                    )}
                  </p>
                ))}
              </div>
            </article>

            <div className="relative hidden h-full items-stretch justify-center md:flex">
              <div className="h-full w-px bg-[color:var(--border)]" />
              <div className="absolute top-1/2 flex -translate-y-1/2 items-center justify-center">
                <Image
                  src="/images/logos/001-wlogo.png"
                  alt="Instituto Forest"
                  width={112}
                  height={112}
                  className="forest-marketing-logo h-24 w-24 object-contain md:h-28 md:w-28"
                />
              </div>
            </div>

            <article>
              <h3 className="text-xl font-semibold">{m.aboutInstitute.cards.commitments.title}</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-justify text-sm text-[color:var(--muted)]">
                {m.aboutInstitute.cards.commitments.bullets.map((item, i) => (
                  <li key={item}>
                    {i === 0 ? (
                      <TextWithInlineLink
                        text={item}
                        linkText={m.aboutInstitute.cards.commitments.openSourceLinkText}
                        href={BLOG_OPEN_SOURCE_HREF}
                      />
                    ) : (
                      item
                    )}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </Section>

      </div>
    </div>
  );
}
