"use client";

import { useState } from "react";

interface DownloadAllButtonProps {
  urls: { url: string; name: string }[];
}

export function DownloadAllButton({ urls }: DownloadAllButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadAll = async () => {
    if (!urls.length) return;
    setIsDownloading(true);

    for (let i = 0; i < urls.length; i++) {
      const { url, name } = urls[i];
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      await new Promise((resolve) => setTimeout(resolve, 450));
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
          Baixando...
        </span>
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Baixar Coleção Completa
        </>
      )}
    </button>
  );
}