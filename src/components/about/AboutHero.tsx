import Image from "next/image";

export type AboutHeroProps = {
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
  /** Legenda discreta sobre a foto (ex.: crédito) */
  imageCaption?: string;
};

export function AboutHero({ title, subtitle, imageSrc, imageAlt, imageCaption }: AboutHeroProps) {
  return (
    <section className="relative isolate flex min-h-[min(78vh,920px)] w-full flex-col justify-end overflow-hidden">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        fetchPriority="high"
        quality={85}
        sizes="100vw"
        className="object-cover"
      />
      {/* Opção B: suaviza o encontro com a faixa do layout (fundo sólido) acima do hero - não altera o Header global */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-28 bg-gradient-to-b from-[color:var(--background)] via-[color:var(--background)]/45 to-transparent"
        aria-hidden
      />
      <div className="absolute inset-0 bg-[color:var(--primary)]/15 mix-blend-multiply dark:mix-blend-soft-light" aria-hidden />

      <div className="forest-about-hero-text relative z-10 mx-auto w-full max-w-5xl px-4 pb-16 pt-32 sm:px-6 sm:pb-20 md:pb-28">
        <p className="forest-about-hero-eyebrow inline-block rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/90 backdrop-blur-[3px]">
          Instituto Forest
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-justify text-lg leading-relaxed text-white/80 sm:text-xl md:text-[1.35rem] md:leading-[1.55]">
          {subtitle}
        </p>
        {imageCaption ? (
          <p
            className="mt-8 max-w-2xl text-justify text-[10px] leading-snug tracking-wide text-white/60 sm:text-[15px]"
            role="note"
          >
            {imageCaption}
          </p>
        ) : null}
      </div>
    </section>
  );
}
