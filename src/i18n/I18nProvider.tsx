// src/i18n/I18nProvider.tsx

"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Dict, Locale } from "./dictionaries";
import { dictionaries } from "./dictionaries";

type FontLevel = -2 | -1 | 0 | 1 | 2;

type I18nContextValue = {
  locale: Locale;
  dict: Dict;
  setLocale: (next: Locale) => void;

  // Fonte global (2 abaixo, 2 acima)
  fontLevel: FontLevel;      // -2..2
  fontScale: number;         // 0.8..1.2
  setFontLevel: (next: FontLevel) => void;
  increaseFont: () => void;
  decreaseFont: () => void;
  resetFont: () => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const LOCALE_STORAGE_KEY = "fp_locale";
const FONT_STORAGE_KEY = "fp_font_level";

// 2 pra baixo e 2 pra cima (base = 1.0)
const FONT_LEVEL_TO_SCALE: Record<FontLevel, number> = {
  "-2": 0.8,
  "-1": 0.9,
  "0": 1.0,
  "1": 1.1,
  "2": 1.2,
};

function clampFontLevel(n: number): FontLevel {
  if (n <= -2) return -2;
  if (n === -1) return -1;
  if (n === 0) return 0;
  if (n === 1) return 1;
  return 2;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt");
  const [fontLevel, setFontLevelState] = useState<FontLevel>(0);

  // Carrega locale + fontLevel
  useEffect(() => {
    try {
      const storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
      if (storedLocale === "pt" || storedLocale === "en") setLocaleState(storedLocale);

      const storedFont = localStorage.getItem(FONT_STORAGE_KEY);
      if (storedFont !== null) {
        const n = Number(storedFont);
        if (Number.isFinite(n)) setFontLevelState(clampFontLevel(n));
      }
    } catch {
      // ignore
    }
  }, []);

  // Aplica locale no <html> + persiste
  useEffect(() => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // ignore
    }

    const html = document.documentElement;
    html.lang = locale === "pt" ? "pt-BR" : "en";
  }, [locale]);

  // Aplica font scale no <html> + persiste
  useEffect(() => {
    const scale = FONT_LEVEL_TO_SCALE[fontLevel];
    const html = document.documentElement;

    // token global (usado no CSS)
    html.style.setProperty("--fp-font-scale", String(scale));

    try {
      localStorage.setItem(FONT_STORAGE_KEY, String(fontLevel));
    } catch {
      // ignore
    }
  }, [fontLevel]);

  const value = useMemo<I18nContextValue>(() => {
    const fontScale = FONT_LEVEL_TO_SCALE[fontLevel];

    return {
      locale,
      dict: dictionaries[locale],
      setLocale: (next) => setLocaleState(next),

      fontLevel,
      fontScale,

      setFontLevel: (next) => setFontLevelState(next),

      increaseFont: () => setFontLevelState((prev) => clampFontLevel(prev + 1)),
      decreaseFont: () => setFontLevelState((prev) => clampFontLevel(prev - 1)),
      resetFont: () => setFontLevelState(0),
    };
  }, [locale, fontLevel]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
