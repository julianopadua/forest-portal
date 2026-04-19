import Image from "next/image";
import type { ReactNode } from "react";

export type AboutPersonInlineProps = {
  name: string;
  description: ReactNode;
  photoSrc?: string;
  photoAlt?: string;
};

export function AboutPersonInline({ name, description, photoSrc, photoAlt }: AboutPersonInlineProps) {
  return (
    <div className="flex flex-col gap-5 border-t border-[color:var(--border)]/80 py-10 first:border-t-0 first:pt-0 sm:flex-row sm:gap-10 md:py-12">
      {photoSrc ? (
        <div className="relative h-24 w-24 shrink-0 overflow-hidden sm:h-28 sm:w-28">
          <Image
            src={photoSrc}
            alt={photoAlt ?? name}
            width={112}
            height={112}
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <h3 className="text-lg font-semibold tracking-tight text-[color:var(--foreground)] sm:text-xl">{name}</h3>
        <div className="mt-3 space-y-3 text-base leading-relaxed text-[color:var(--muted)]">{description}</div>
      </div>
    </div>
  );
}
