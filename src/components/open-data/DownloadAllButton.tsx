"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";

interface DownloadAllButtonProps {
  urls: { url: string; name: string }[];
}

export function DownloadAllButton({ urls }: DownloadAllButtonProps) {
  const { dict } = useI18n();
  const dl = dict.openData.downloadAll;
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadAll = async () => {
    if (!urls.length) return;
    setIsDownloading(true);
    const text = urls.map(({ url }) => url).join("\n");

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      window.open(urls[0]?.url, "_blank", "noopener,noreferrer");
    }

    setIsDownloading(false);
  };

  return (
    <button
      onClick={handleDownloadAll}
      disabled={isDownloading || urls.length === 0}
      className={`
        inline-flex items-center gap-2 p-0 bg-transparent border-none text-sm font-bold transition-all active:scale-95
        /* Tema Claro: Texto Verde */
        text-[color:var(--primary)] hover:brightness-55 hover:underline
        /* Tema Escuro: Texto Branco/Acinzentado */
        dark:text-[color:var(--foreground)] dark:hover:text-white
        disabled:opacity-40 disabled:cursor-not-allowed disabled:no-underline
      `}
    >
      {isDownloading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {dl.loading}
        </span>
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          {dl.idle}
        </>
      )}
    </button>
  );
}
