import Image from "next/image";
import type { ReactNode } from "react";

export type AboutSectionProps = {
  title?: string;
  children: ReactNode;
  image?: string;
  imageAlt?: string;
  imagePosition?: "left" | "right";
};

export function AboutSection({
  title,
  children,
  image,
  imageAlt,
  imagePosition = "right",
}: AboutSectionProps) {
  const hasImage = Boolean(image && imageAlt);

  if (!hasImage) {
    return (
      <section className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 md:py-20">
        {title ? (
          <h2 className="text-center text-2xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-3xl md:text-[2rem]">
            {title}
          </h2>
        ) : null}
        <div className="mt-8 space-y-5 text-left text-base leading-[1.75] text-[color:var(--muted)] sm:text-lg md:text-[1.125rem] md:leading-[1.8]">
          {children}
        </div>
      </section>
    );
  }

  const imageBlock = (
    <figure className="relative aspect-[4/3] w-full overflow-hidden md:aspect-[3/2]">
      <Image
        src={image!}
        alt={imageAlt!}
        fill
        sizes="(min-width: 768px) 45vw, 100vw"
        className="object-cover"
      />
    </figure>
  );

  const textBlock = (
    <div className="flex flex-col justify-center">
      {title ? (
        <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-3xl md:text-[2rem]">
          {title}
        </h2>
      ) : null}
      <div className="mt-6 space-y-5 text-base leading-[1.75] text-[color:var(--muted)] sm:text-lg md:text-[1.0625rem] md:leading-[1.8]">
        {children}
      </div>
    </div>
  );

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 md:py-20">
      <div
        className={
          imagePosition === "left"
            ? "grid gap-10 md:grid-cols-2 md:items-center md:gap-14 lg:gap-20"
            : "grid gap-10 md:grid-cols-2 md:items-center md:gap-14 lg:gap-20"
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
