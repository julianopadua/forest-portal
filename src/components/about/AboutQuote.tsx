import type { ReactNode } from "react";

export type AboutQuoteProps = {
  children: ReactNode;
  attribution?: string;
};

export function AboutQuote({ children, attribution }: AboutQuoteProps) {
  return (
    <figure className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 md:py-16">
      <blockquote className="border-l-2 border-[color:var(--primary)]/45 pl-6 sm:pl-8 md:pl-10">
        <div className="text-justify text-xl font-medium leading-snug tracking-tight text-[color:var(--foreground)] sm:text-2xl md:text-[1.65rem] md:leading-[1.45]">
          {children}
        </div>
        {attribution ? (
          <figcaption className="mt-6 text-sm font-medium text-[color:var(--muted)]">{attribution}</figcaption>
        ) : null}
      </blockquote>
    </figure>
  );
}
