import Image from "next/image";
import type { ReactNode } from "react";

export type AboutSectionProps = {
  title?: string;
  children: ReactNode;
  image?: string;
  imageAlt?: string;
  imageCaption?: string;
  /** Segunda foto (ex.: logo institucional), mesma largura e proporção da primeira */
  image2?: string;
  image2Alt?: string;
  image2Caption?: string;
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
  imagePosition = "right",
  contentWidth = "default",
}: AboutSectionProps) {
  const hasImage = Boolean(image && imageAlt);
  const hasSecondImage = Boolean(image2 && image2Alt);
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
    <div className={`flex w-full flex-col ${hasSecondImage ? "gap-4" : ""}`}>
      <figure className="w-full">
        <div className="relative aspect-[4/3] w-full overflow-hidden md:aspect-[3/2]">
          <Image
            src={image!}
            alt={imageAlt!}
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
        {imageCaption ? (
          <figcaption className="mt-3 text-left text-[11px] leading-snug text-[color:var(--muted)] sm:text-xs">
            {imageCaption}
          </figcaption>
        ) : null}
      </figure>
      {hasSecondImage ? (
        <figure className="w-full">
          <div className="relative aspect-[4/3] w-full overflow-hidden md:aspect-[3/2]">
            <Image
              src={image2!}
              alt={image2Alt!}
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          {image2Caption ? (
            <figcaption className="mt-3 text-left text-[11px] leading-snug text-[color:var(--muted)] sm:text-xs">
              {image2Caption}
            </figcaption>
          ) : null}
        </figure>
      ) : null}
    </div>
  );

  const textBlock = (
    <div className="flex flex-col justify-center">
      {title ? (
        <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-3xl md:text-[2rem]">
          {title}
        </h2>
      ) : null}
      <div className="mt-6 space-y-5 text-justify text-base leading-[1.75] text-[color:var(--muted)] sm:text-lg md:text-[1.0625rem] md:leading-[1.8]">
        {children}
      </div>
    </div>
  );

  const gridAlign = hasSecondImage
    ? "md:items-start"
    : "md:items-center";

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 md:py-20">
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
