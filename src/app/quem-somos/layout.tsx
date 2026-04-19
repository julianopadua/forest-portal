import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quem somos",
  description:
    "Instituto Forest: propósito, trajetória e visão sistêmica — tecnologia, dados e conservação ambiental.",
};

export default function QuemSomosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
