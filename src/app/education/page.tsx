// src/app/education/page.tsx

"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import { useI18n } from "@/i18n/I18nProvider";

export default function EducationPage() {
  const { dict } = useI18n();
  const s = dict.marketing.sections.community;

  return (
    <div className="mx-auto max-w-4xl px-4 py-24">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <h1 className="text-3xl font-semibold">{s.title}</h1>
        <p className="mt-4 max-w-3xl text-zinc-300">{s.subtitle}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => alert("Depois liga nas trilhas ENEM")}>{s.ctaPrimary}</Button>
          <Button variant="ghost" onClick={() => alert("Depois liga nos cursos de tecnologia")}>
            {s.ctaSecondary}
          </Button>
        </div>

        <div className="mt-8">
          <Link href="/">
            <Button variant="ghost">{dict.common.home}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
