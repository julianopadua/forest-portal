// src/i18n/I18nProvider.tsx

"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Dict, Locale } from "./dictionaries";
import { dictionaries } from "./dictionaries";

type I18nContextValue = {
  locale: Locale;
  dict: Dict;
  setLocale: (next: Locale) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "fp_locale";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (stored === "pt" || stored === "en") setLocaleState(stored);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // ignore
    }

    const html = document.documentElement;
    html.lang = locale === "pt" ? "pt-BR" : "en";
  }, [locale]);

  const value = useMemo<I18nContextValue>(() => {
    return {
      locale,
      dict: dictionaries[locale],
      setLocale: (next) => setLocaleState(next),
    };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used inside I18nProvider");
  }
  return ctx;
}
