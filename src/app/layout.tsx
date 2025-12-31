// src/app/layout.tsx
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { I18nProvider } from "@/i18n/I18nProvider";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Forest Portal",
  description: "Instituto - portal e plataforma",
  icons: {
    icon: "/favicon_logo/favicon-32x32.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`min-h-dvh flex flex-col antialiased ${montserrat.variable}`}>
        <I18nProvider>
          <Header />

          {/* wrapper do conteúdo com flex-1 para empurrar o footer ao fim */}
          <div className="flex-1 pt-20">{children}</div>

          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
