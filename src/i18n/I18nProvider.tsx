// src/i18n/I18nProvider.tsx

"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  useState,
} from "react";
import type { Dict, Locale } from "./dictionaries";
import { dictionaries } from "./dictionaries";
import { LOCALE_COOKIE_NAME, LOCALE_STORAGE_KEY } from "./constants";

type FontLevel = -2 | -1 | 0 | 1 | 2;

type I18nContextValue = {
  locale: Locale;
  dict: Dict;
  setLocale: (next: Locale) => void;

  // Fonte global (2 abaixo, 2 acima)
  fontLevel: FontLevel; // -2..2
  fontScale: number; // 0.8..1.2
  setFontLevel: (next: FontLevel) => void;
  increaseFont: () => void;
  decreaseFont: () => void;
  resetFont: () => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const FONT_STORAGE_KEY = "fp_font_level";

const LOCALE_CHANGE_EVENT = "fp_locale_change";

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

function readLocaleFromStorage(): Locale | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (v === "en" || v === "pt") return v;
  } catch {
    // ignore
  }
  return null;
}

function subscribeLocale(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(LOCALE_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(LOCALE_CHANGE_EVENT, onStoreChange);
  };
}

type I18nProviderProps = {
  children: React.ReactNode;
  /** Locale inferido no servidor (cookie); precisa bater com o primeiro paint para evitar hydration mismatch */
  initialLocale?: Locale;
};

export function I18nProvider({ children, initialLocale = "pt" }: I18nProviderProps) {
  const getSnapshot = useCallback((): Locale => {
    return readLocaleFromStorage() ?? initialLocale;
  }, [initialLocale]);

  const getServerSnapshot = useCallback((): Locale => initialLocale, [initialLocale]);

  const locale = useSyncExternalStore(subscribeLocale, getSnapshot, getServerSnapshot);

  const [fontLevel, setFontLevelState] = useState<FontLevel>(0);

  const setLocale = useCallback((next: Locale) => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
      document.cookie = `${LOCALE_COOKIE_NAME}=${next}; path=/; max-age=31536000; SameSite=Lax`;
      window.dispatchEvent(new Event(LOCALE_CHANGE_EVENT));
    } catch {
      // ignore
    }
  }, []);

  // Carrega fontLevel (sem impacto nas strings i18n)
  useEffect(() => {
    try {
      const storedFont = localStorage.getItem(FONT_STORAGE_KEY);
      if (storedFont !== null) {
        const n = Number(storedFont);
        if (Number.isFinite(n)) setFontLevelState(clampFontLevel(n));
      }
    } catch {
      // ignore
    }
  }, []);

  // Mantém cookie alinhado ao locale efetivo (ex.: depois que localStorage diverge do SSR)
  useEffect(() => {
    try {
      document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // ignore
    }
  }, [locale]);

  // Aplica locale no <html>
  useEffect(() => {
    document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";
  }, [locale]);

  // Aplica font scale no <html> + persiste
  useEffect(() => {
    const scale = FONT_LEVEL_TO_SCALE[fontLevel];
    const html = document.documentElement;

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
      setLocale,

      fontLevel,
      fontScale,

      setFontLevel: (next) => setFontLevelState(next),

      increaseFont: () => setFontLevelState((prev) => clampFontLevel(prev + 1)),
      decreaseFont: () => setFontLevelState((prev) => clampFontLevel(prev - 1)),
      resetFont: () => setFontLevelState(0),
    };
  }, [locale, fontLevel, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
