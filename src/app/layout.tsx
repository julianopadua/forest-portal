// src/app/layout.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { LOCALE_COOKIE_NAME } from "@/i18n/constants";
import type { Locale } from "@/i18n/dictionaries";
import { I18nProvider } from "@/i18n/I18nProvider";
import { getSiteUrl } from "@/lib/siteUrl";

const SITE_NAME = "Instituto Forest";
const SITE_DESCRIPTION =
  "Dados abertos por meio de código aberto. Portal do Instituto Forest: catálogo público, relatórios analíticos e API de metadados.";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    alternateLocale: ["en_US"],
    url: "/",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon_logo/favicon-32x32.png",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const rawLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  const initialLocale: Locale = rawLocale === "en" ? "en" : "pt";

  return (
    <html lang={initialLocale === "pt" ? "pt-BR" : "en"}>
      <body className={`min-h-dvh flex flex-col antialiased ${montserrat.variable}`}>
        <I18nProvider initialLocale={initialLocale}>
          <Suspense
            fallback={
              <header
                className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-[color:var(--border)] bg-[color:var(--background)]/90 backdrop-blur-sm"
                aria-hidden
              />
            }
          >
            <Header />
          </Suspense>

          {/* wrapper do conteúdo com flex-1 para empurrar o footer ao fim */}
          <div className="flex-1 pt-24 md:pt-28">{children}</div>

          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
