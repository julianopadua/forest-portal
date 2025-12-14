// src/app/open-data/page.tsx

"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import { useI18n } from "@/i18n/I18nProvider";

export default function OpenDataPage() {
  const { dict } = useI18n();
  const s = dict.marketing.sections.mission;

  return (
    <div className="mx-auto max-w-4xl px-4 py-24">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <h1 className="text-3xl font-semibold">{s.title}</h1>
        <p className="mt-4 max-w-3xl text-zinc-300">{s.subtitle}</p>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {s.bullets.map((b) => (
            <div key={b} className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-zinc-300">
              {b}
            </div>
          ))}
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
