"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export type AboutSpinningLogoProps = {
  src?: string;
  alt?: string;
  size?: number;
  staticWord?: string;
  cyclingWords?: string[];
};

const TYPE_MS = 90;
const DELETE_MS = 50;
const HOLD_AFTER_TYPE_MS = 1200;
const HOLD_AFTER_DELETE_MS = 250;

type Phase = "typing" | "holding" | "deleting" | "pausing";

export function AboutSpinningLogo({
  src = "/images/logos/001-wlogo.png",
  alt = "Instituto Forest",
  size = 160,
  staticWord = "INSTITUTO",
  cyclingWords = ["FOREST", "FINANCE", "FIRE"],
}: AboutSpinningLogoProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");

  useEffect(() => {
    const target = cyclingWords[wordIndex] ?? "";
    let timer: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (text.length < target.length) {
        timer = setTimeout(() => setText(target.slice(0, text.length + 1)), TYPE_MS);
      } else {
        timer = setTimeout(() => setPhase("holding"), 0);
      }
    } else if (phase === "holding") {
      timer = setTimeout(() => setPhase("deleting"), HOLD_AFTER_TYPE_MS);
    } else if (phase === "deleting") {
      if (text.length > 0) {
        timer = setTimeout(() => setText(text.slice(0, -1)), DELETE_MS);
      } else {
        timer = setTimeout(() => setPhase("pausing"), 0);
      }
    } else {
      timer = setTimeout(() => {
        setWordIndex((i) => (i + 1) % cyclingWords.length);
        setPhase("typing");
      }, HOLD_AFTER_DELETE_MS);
    }

    return () => clearTimeout(timer);
  }, [text, phase, wordIndex, cyclingWords]);

  const longest = cyclingWords.reduce((a, b) => (a.length >= b.length ? a : b), "");

  return (
    <div className="mx-auto flex w-full max-w-4xl items-center justify-center px-4 py-12 sm:px-6 md:py-16">
      <div className="flex items-center gap-6 sm:gap-8 md:gap-10">
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          className="forest-marketing-logo h-24 w-24 shrink-0 object-contain sm:h-28 sm:w-28 md:h-36 md:w-36"
        />

        <div className="flex flex-col leading-none">
          <span className="text-2xl font-light tracking-[0.18em] text-[color:var(--foreground)] sm:text-3xl md:text-4xl">
            {staticWord}
          </span>

          <span className="relative mt-2 inline-block text-3xl font-semibold tracking-[0.06em] text-[color:var(--primary)] sm:text-4xl md:text-5xl">
            <span aria-hidden className="invisible">
              {longest}
            </span>
            <span className="absolute inset-0 whitespace-nowrap" aria-live="polite">
              {text}
              <span className="forest-spinning-logo-caret ml-0.5 inline-block w-[0.06em] -translate-y-[0.04em]">
                |
              </span>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
