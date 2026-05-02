import Image from "next/image";

export type AboutSpinningLogoProps = {
  src?: string;
  alt?: string;
  size?: number;
};

export function AboutSpinningLogo({
  src = "/images/logos/001-wlogo.png",
  alt = "Instituto Forest",
  size = 128,
}: AboutSpinningLogoProps) {
  return (
    <div
      className="mx-auto flex w-full max-w-4xl items-center justify-center px-4 py-10 sm:px-6 md:py-14"
      role="presentation"
    >
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="forest-marketing-logo h-24 w-24 object-contain md:h-32 md:w-32"
      />
    </div>
  );
}
