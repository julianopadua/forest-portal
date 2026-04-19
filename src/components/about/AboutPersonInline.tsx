import Image from "next/image";
import type { ReactNode } from "react";

export type AboutPersonInlineProps = {
  name: string;
  description: ReactNode;
  photoSrc?: string;
  photoAlt?: string;
  /** Legenda sob a foto (crédito, fonte) */
  photoCaption?: string;
};

export function AboutPersonInline({ name, description, photoSrc, photoAlt, photoCaption }: AboutPersonInlineProps) {
  return (
    <div className="flex flex-col gap-5 border-t border-[color:var(--border)]/80 py-10 first:border-t-0 first:pt-0 sm:flex-row sm:gap-10 md:py-12">
      {photoSrc ? (
        <div className="flex w-full shrink-0 flex-col sm:w-auto sm:max-w-[12rem] md:max-w-[13rem]">
          <div className="relative mx-auto h-40 w-40 overflow-hidden sm:mx-0 sm:h-44 sm:w-44 md:h-48 md:w-48">
            <Image
              src={photoSrc}
              alt={photoAlt ?? name}
              width={192}
              height={192}
              className="h-full w-full object-cover"
            />
          </div>
          {photoCaption ? (
            <p className="mx-auto mt-2 max-w-[10rem] text-left text-[10px] leading-snug text-[color:var(--muted)] sm:mx-0 sm:max-w-[11rem] sm:text-[11px]">
              {photoCaption}
            </p>
          ) : null}
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <h3 className="text-lg font-semibold tracking-tight text-[color:var(--foreground)] sm:text-xl">{name}</h3>
        <div className="mt-3 space-y-3 text-justify text-base leading-relaxed text-[color:var(--muted)]">{description}</div>
      </div>
    </div>
  );
}
