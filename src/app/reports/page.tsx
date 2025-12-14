// src/app/reports/page.tsx

"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import { useI18n } from "@/i18n/I18nProvider";

export default function ReportsPage() {
  const { dict } = useI18n();
  const s = dict.marketing.sections.contents;

  return (
    <div className="mx-auto max-w-4xl px-4 py-24">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <h1 className="text-3xl font-semibold">{s.title}</h1>
        <p className="mt-4 max-w-3xl text-zinc-300">{s.subtitle}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {s.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200"
            >
              {tag}
            </span>
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
