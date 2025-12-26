// src/app/open-data/page.tsx
import OpenDataCatalog from "@/components/open-data/OpenDataCatalog";

export default function OpenDataPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-[color:var(--text)]">Dados abertos</h1>
        <p className="mt-2 text-[color:var(--muted)]">
          Downloads diretos do Storage público, organizados por dataset e período.
        </p>
      </header>

      <OpenDataCatalog />
    </main>
  );
}
