import Image from "next/image";

export type AboutImageBlockProps = {
  src: string;
  alt: string;
  caption?: string;
};

export function AboutImageBlock({ src, alt, caption }: AboutImageBlockProps) {
  return (
    <figure className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 md:py-14">
      <div className="relative aspect-[21/9] w-full min-h-[200px] overflow-hidden sm:aspect-[2.2/1] md:min-h-[280px]">
        <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 72rem, 100vw" className="object-cover" />
      </div>
      {caption ? (
        <figcaption className="mt-4 text-sm text-[color:var(--muted)]">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
