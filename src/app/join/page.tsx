// src/app/join/page.tsx

"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import { useI18n } from "@/i18n/I18nProvider";

export default function JoinPage() {
  const { dict } = useI18n();

  return (
    <div className="mx-auto max-w-4xl px-4 py-24">

      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <h1 className="text-3xl font-semibold">{dict.join.title}</h1>

        <p className="mt-4 max-w-2xl text-zinc-300">{dict.join.body}</p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button>{dict.join.continue}</Button>

          <Link href="/">
            <Button variant="ghost">{dict.join.backHome}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
