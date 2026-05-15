import type { DocsNavSection } from "./DocsSidebar";

export const API_DOCS_SECTIONS_BY_LOCALE: Record<"pt" | "en", readonly DocsNavSection[]> = {
  pt: [
    {
      title: "API de Dados Abertos v1",
      items: [
        { href: "#visao-geral", label: "Visão geral" },
        { href: "#autenticacao", label: "Autenticação" },
        { href: "#versionamento", label: "Versionamento" },
        { href: "#cache", label: "Cache" },
        { href: "#erros", label: "Erros" },
        { href: "#especificacao-openapi", label: "Especificação OpenAPI" },
      ],
    },
    {
      title: "Endpoints",
      items: [
        { href: "#get-health", label: "GET /health" },
        { href: "#get-catalog", label: "GET /catalog" },
        { href: "#get-catalogreports", label: "GET /catalog/reports" },
        { href: "#get-datasetsid", label: "GET /datasets/{id}" },
        { href: "#get-datasetsiditems", label: "GET /datasets/{id}/items" },
        { href: "#get-reportsid", label: "GET /reports/{id}" },
        { href: "#get-sources", label: "GET /sources" },
      ],
    },
    {
      title: "SDK",
      items: [{ href: "#sdk-python", label: "SDK Python" }],
    },
  ],
  en: [
    {
      title: "Open Data API v1",
      items: [
        { href: "#overview", label: "Overview" },
        { href: "#authentication", label: "Authentication" },
        { href: "#versioning", label: "Versioning" },
        { href: "#caching", label: "Caching" },
        { href: "#errors", label: "Errors" },
        { href: "#openapi-specification", label: "OpenAPI specification" },
      ],
    },
    {
      title: "Endpoints",
      items: [
        { href: "#get-health", label: "GET /health" },
        { href: "#get-catalog", label: "GET /catalog" },
        { href: "#get-catalogreports", label: "GET /catalog/reports" },
        { href: "#get-datasetsid", label: "GET /datasets/{id}" },
        { href: "#get-datasetsiditems", label: "GET /datasets/{id}/items" },
        { href: "#get-reportsid", label: "GET /reports/{id}" },
        { href: "#get-sources", label: "GET /sources" },
      ],
    },
    {
      title: "SDK",
      items: [{ href: "#python-sdk", label: "Python SDK" }],
    },
  ],
};
