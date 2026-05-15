// src/components/ui/LanguageSwitcher.tsx

"use client";

import Button from "@/components/ui/Button";
import { useI18n } from "@/i18n/I18nProvider";

export default function LanguageSwitcher() {
  const { locale, setLocale, dict } = useI18n();

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-zinc-300">{dict.common.language}</span>

      <Button
        variant="ghost"
        onClick={() => setLocale("pt")}
        className={locale === "pt" ? "opacity-100" : "opacity-60"}
      >
        {dict.common.pt}
      </Button>

      <Button
        variant="ghost"
        onClick={() => setLocale("en")}
        className={locale === "en" ? "opacity-100" : "opacity-60"}
      >
        {dict.common.en}
      </Button>
    </div>
  );
}
