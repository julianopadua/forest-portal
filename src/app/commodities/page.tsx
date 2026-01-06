// src/app/commodities/page.tsx

"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import { useI18n } from "@/i18n/I18nProvider";

export default function CommoditiesPage() {
  const { dict } = useI18n();
  const s = dict.marketing.sections.programs;

  return (
    <div className="mx-auto max-w-4xl px-4 py-24">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <h1 className="text-3xl font-semibold">{s.title}</h1>
        <p className="mt-4 max-w-3xl text-zinc-300">{s.subtitle}</p>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {s.cards.map((c) => (
            <div key={c} className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="font-semibold">{c}</div>
              <div className="mt-1 text-sm text-zinc-300">{s.cardDesc}</div>
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
