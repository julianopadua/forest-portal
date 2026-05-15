import type { ReactNode } from "react";

type Param = {
  name: string;
  in: "path" | "query";
  type: string;
  description: string;
  required?: boolean;
};

type Field = {
  name: string;
  type: string;
  description: string;
};

export default function EndpointBlock({
  id,
  method,
  path,
  summary,
  description,
  params,
  responseFields,
  curlExample,
  responseExample,
}: {
  id: string;
  method: "GET" | "POST";
  path: string;
  summary: string;
  description: ReactNode;
  params?: Param[];
  responseFields?: Field[];
  curlExample?: string;
  responseExample?: string;
}) {
  return (
    <section id={id} className="not-prose mt-16 border-t border-[color:var(--border)] pt-10">
      <header>
        <div className="mb-2 flex items-center gap-3 font-mono text-sm">
          <span className="rounded border border-[color:var(--border)] bg-[color:var(--surface-2)] px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--foreground)]">
            {method}
          </span>
          <span className="text-[color:var(--foreground)]">{path}</span>
        </div>
        <h2 className="text-xl font-semibold text-[color:var(--foreground)]">{summary}</h2>
        <div className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">{description}</div>
      </header>

      {params && params.length > 0 ? (
        <div className="mt-6">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">
            Parameters
          </h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[color:var(--border)] text-left text-[color:var(--muted)]">
                <th className="py-2 pr-4 font-medium">Name</th>
                <th className="py-2 pr-4 font-medium">In</th>
                <th className="py-2 pr-4 font-medium">Type</th>
                <th className="py-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              {params.map((p) => (
                <tr key={`${p.in}.${p.name}`} className="border-b border-[color:var(--border)]/60 align-top">
                  <td className="py-2 pr-4 font-mono text-[color:var(--foreground)]">
                    {p.name}
                    {p.required ? <span className="ml-1 text-red-500">*</span> : null}
                  </td>
                  <td className="py-2 pr-4 text-[color:var(--muted)]">{p.in}</td>
                  <td className="py-2 pr-4 font-mono text-[color:var(--muted)]">{p.type}</td>
                  <td className="py-2 text-[color:var(--foreground)]">{p.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {responseFields && responseFields.length > 0 ? (
        <div className="mt-6">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">
            Response fields
          </h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[color:var(--border)] text-left text-[color:var(--muted)]">
                <th className="py-2 pr-4 font-medium">Field</th>
                <th className="py-2 pr-4 font-medium">Type</th>
                <th className="py-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              {responseFields.map((f) => (
                <tr key={f.name} className="border-b border-[color:var(--border)]/60 align-top">
                  <td className="py-2 pr-4 font-mono text-[color:var(--foreground)]">{f.name}</td>
                  <td className="py-2 pr-4 font-mono text-[color:var(--muted)]">{f.type}</td>
                  <td className="py-2 text-[color:var(--foreground)]">{f.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {curlExample ? (
        <div className="mt-6">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">
            Request
          </h3>
          <pre className="overflow-x-auto rounded-md border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4 text-xs leading-relaxed text-[color:var(--foreground)]">
            <code>{curlExample}</code>
          </pre>
        </div>
      ) : null}

      {responseExample ? (
        <div className="mt-6">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">
            Response (200)
          </h3>
          <pre className="overflow-x-auto rounded-md border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4 text-xs leading-relaxed text-[color:var(--foreground)]">
            <code>{responseExample}</code>
          </pre>
        </div>
      ) : null}
    </section>
  );
}
