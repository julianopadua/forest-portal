import Image from "next/image";
import type { ReactNode } from "react";

type AboutFigureProps = {
  src: string;
  alt: string;
  caption?: string;
  objectFit?: "cover" | "contain";
};

function AboutFigure({ src, alt, caption, objectFit = "cover" }: AboutFigureProps) {
  const fitClass =
    objectFit === "contain"
      ? "object-contain bg-[color:var(--surface-2)]"
      : "object-cover";

  return (
    <figure className="w-full">
      <div className="relative aspect-[4/3] w-full overflow-hidden md:aspect-[3/2]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 768px) 45vw, 100vw"
          className={fitClass}
        />
      </div>
      {caption ? (
        <figcaption className="mt-3 text-left text-[11px] leading-snug text-[color:var(--muted)] sm:text-xs">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export type AboutSectionProps = {
  title?: string;
  children: ReactNode;
  image?: string;
  imageAlt?: string;
  imageCaption?: string;
  /** Fotos adicionais na coluna lateral, mesma largura e proporção da primeira */
  image2?: string;
  image2Alt?: string;
  image2Caption?: string;
  image3?: string;
  image3Alt?: string;
  image3Caption?: string;
  /** `contain` evita recorte em previews de documento (ex.: capa do TCC) */
  image3Fit?: "cover" | "contain";
  imagePosition?: "left" | "right";
  /** Blocos só de texto: `wide` deixa a coluna mais larga (ex.: introdução e inspirações) */
  contentWidth?: "default" | "wide";
};

export function AboutSection({
  title,
  children,
  image,
  imageAlt,
  imageCaption,
  image2,
  image2Alt,
  image2Caption,
  image3,
  image3Alt,
  image3Caption,
  image3Fit = "cover",
  imagePosition = "right",
  contentWidth = "default",
}: AboutSectionProps) {
  const hasImage = Boolean(image && imageAlt);
  const hasSecondImage = Boolean(image2 && image2Alt);
  const hasThirdImage = Boolean(image3 && image3Alt);
  const hasStackedImages = hasSecondImage || hasThirdImage;
  const textOnlyMax =
    contentWidth === "wide" ? "max-w-5xl lg:max-w-6xl" : "max-w-3xl";

  if (!hasImage) {
    return (
      <section className={`mx-auto w-full ${textOnlyMax} px-4 py-14 sm:px-6 md:py-20`}>
        {title ? (
          <h2 className="text-center text-2xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-3xl md:text-[2rem]">
            {title}
          </h2>
        ) : null}
        <div className="mt-8 space-y-5 text-justify text-base leading-[1.75] text-[color:var(--muted)] sm:text-lg md:text-[1.125rem] md:leading-[1.8]">
          {children}
        </div>
      </section>
    );
  }

  const imageBlock = (
    <div className={`flex w-full flex-col ${hasStackedImages ? "gap-4" : ""}`}>
      <AboutFigure src={image!} alt={imageAlt!} caption={imageCaption} />
      {hasSecondImage ? (
        <AboutFigure src={image2!} alt={image2Alt!} caption={image2Caption} />
      ) : null}
      {hasThirdImage ? (
        <AboutFigure
          src={image3!}
          alt={image3Alt!}
          caption={image3Caption}
          objectFit={image3Fit}
        />
      ) : null}
    </div>
  );

  const textBlock = (
    <div className="flex flex-col md:justify-start">
      <div className="space-y-5 text-justify text-base leading-[1.75] text-[color:var(--muted)] sm:text-lg md:text-[1.0625rem] md:leading-[1.8]">
        {children}
      </div>
    </div>
  );

  const gridAlign = hasStackedImages ? "md:items-start" : "md:items-center";

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 md:py-20">
      {title ? (
        <h2 className="mb-8 text-2xl font-semibold tracking-tight text-[color:var(--foreground)] sm:mb-10 sm:text-3xl md:text-[2rem]">
          {title}
        </h2>
      ) : null}
      <div
        className={
          imagePosition === "left"
            ? `grid gap-10 md:grid-cols-2 ${gridAlign} md:gap-14 lg:gap-20`
            : `grid gap-10 md:grid-cols-2 ${gridAlign} md:gap-14 lg:gap-20`
        }
      >
        {imagePosition === "left" ? (
          <>
            {imageBlock}
            {textBlock}
          </>
        ) : (
          <>
            {textBlock}
            {imageBlock}
          </>
        )}
      </div>
    </section>
  );
}
