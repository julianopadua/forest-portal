"use client";

import AboutEn from "../../../content/about/en-US.mdx";
import AboutPt from "../../../content/about/pt-BR.mdx";
import { useI18n } from "@/i18n/I18nProvider";

export default function QuemSomosPage() {
  const { locale } = useI18n();
  const Content = locale === "en" ? AboutEn : AboutPt;

  return (
    <main className="min-h-screen w-full bg-[color:var(--background)] pb-16">
      <Content />
    </main>
  );
}
