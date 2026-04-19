import Image from "next/image";

export type AboutHeroProps = {
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
};

export function AboutHero({ title, subtitle, imageSrc, imageAlt }: AboutHeroProps) {
  return (
    <section className="relative isolate flex min-h-[min(78vh,920px)] w-full flex-col justify-end overflow-hidden">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-[color:var(--background)] via-[color:var(--background)]/55 to-[color:var(--background)]/25"
        aria-hidden
      />
      <div className="absolute inset-0 bg-[color:var(--primary)]/15 mix-blend-multiply dark:mix-blend-soft-light" aria-hidden />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-16 pt-32 sm:px-6 sm:pb-20 md:pb-28">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--muted)]">
          Instituto Forest
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-[color:var(--foreground)] sm:text-5xl md:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[color:var(--muted)] sm:text-xl md:text-[1.35rem] md:leading-[1.55]">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
