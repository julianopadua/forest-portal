"use client";

import HomeEn from "../../../content/home/en-US.mdx";
import HomePt from "../../../content/home/pt-BR.mdx";
import { useI18n } from "@/i18n/I18nProvider";

export default function MarketingHome() {
  const { locale } = useI18n();
  const Content = locale === "en" ? HomeEn : HomePt;

  return (
    <main className="min-h-screen w-full bg-[color:var(--background)] pb-16">
      <Content />
    </main>
  );
}
