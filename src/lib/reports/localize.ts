// src/lib/reports/localize.ts
import type { LocalizedText, Locale } from "@/lib/reports/types";

export function isLocalizedText(value: unknown): value is LocalizedText {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.pt === "string" && typeof candidate.en === "string";
}

export function resolveLocalizedText(
  value: string | LocalizedText,
  locale: Locale,
): string {
  if (typeof value === "string") return value;
  return locale === "en" ? value.en || value.pt : value.pt || value.en;
}

export function resolveNullableLocalizedText(
  value: string | LocalizedText | null | undefined,
  locale: Locale,
): string | null {
  if (value === null || value === undefined) return null;
  return resolveLocalizedText(value, locale);
}

export function getLocaleTag(locale: Locale): string {
  return locale === "en" ? "en-US" : "pt-BR";
}