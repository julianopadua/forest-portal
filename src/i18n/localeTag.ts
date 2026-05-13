// src/i18n/localeTag.ts

import type { Locale } from "./dictionaries";

export function localeToBcp47(locale: Locale): "pt-BR" | "en-US" {
  return locale === "pt" ? "pt-BR" : "en-US";
}
