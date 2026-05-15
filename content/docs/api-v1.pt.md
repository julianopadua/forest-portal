# API de Dados Abertos Forest

API HTTP pública e somente-leitura sobre o catálogo de dados abertos do Instituto Forest. Expõe os manifestos de datasets e relatórios já publicados pelas pipelines da plataforma e direciona o consumidor para os artefatos de arquivo hospedados no Supabase Storage.

## Visão geral

A API serve apenas metadados. Os manifestos retornados carregam campos `public_url` que apontam diretamente para objetos hospedados no Supabase Storage; os clientes baixam os bytes desses arquivos do CDN do Storage, não desta API. Isso mantém a API enxuta, rápida e barata de cachear.

URL base: `https://institutoforest.org/api/v1`

Todas as respostas são JSON em UTF-8, com o mesmo envelope: `schema_version`, `api_version`, `generated_at`, `generation_status`, `warnings[]`, mais uma chave de carga útil (`datasets`, `manifest`, `items`, `reports`, `sources`).

## Autenticação

Nenhuma. O catálogo é de dados abertos públicos. As requisições não exigem credenciais. O CORS é permissivo (`Access-Control-Allow-Origin: *`); clientes em navegador podem chamar a API diretamente.

## Versionamento

A versão da API fica no prefixo da URL (`/api/v1`). Adições compatíveis são publicadas sob a versão atual; mudanças incompatíveis saem em uma nova versão (`/api/v2`), com a versão anterior mantida disponível e um cabeçalho `Deprecation` retornado nas rotas antigas.

O próprio manifesto carrega um campo `schema_version` independente (atualmente `1.0`). As versões da API e do manifesto evoluem de forma independente.

## Cache

As respostas incluem `Cache-Control: public, max-age=3600, stale-while-revalidate=86400`. Um `ETag` fraco é calculado a partir de `generated_at` e da quantidade de itens; clientes podem revalidar com `If-None-Match` e receber `304 Not Modified`. O catálogo upstream é regerado pelas pipelines a cada publicação; uma defasagem de até uma hora na camada da API é aceitável para os dados servidos.

## Erros

As respostas de erro seguem a [RFC 7807](https://datatracker.ietf.org/doc/html/rfc7807), com `Content-Type: application/problem+json` e os campos `type`, `title`, `status` e `detail`. Tipos de erro definidos: `not_found` (404), `bad_request` (400), `upstream_unavailable` (503), `internal_error` (500).

```json
{
  "type": "https://institutoforest.org/api/errors/not-found",
  "title": "Resource not found",
  "status": 404,
  "detail": "No dataset with id or slug \"inpe_unknown\"."
}
```

## Especificação OpenAPI

A especificação OpenAPI 3.1 legível por máquina é publicada em [`/api/v1/openapi.json`](/api/v1/openapi.json). Ela é regerada a partir dos mesmos schemas Zod que validam as respostas das rotas; a especificação e o runtime não podem divergir.

## Endpoints

### `GET /health`

Endpoint de sondagem. Retorna o status do serviço e a versão do schema de manifesto que esta implantação compreende.

```bash
curl https://institutoforest.org/api/v1/health
```

```json
{
  "schema_version": "1.0",
  "api_version": "v1",
  "generated_at": "2026-05-14T22:00:00Z",
  "generation_status": "success",
  "warnings": [],
  "status": "ok"
}
```

### `GET /catalog`

Lista compacta de todos os datasets de dados abertos. Adequada para descoberta; para a lista completa de arquivos de um dataset específico, siga o `manifest_path` via `/datasets/{id}`.

| Campo | Tipo | Descrição |
|------|------|-----------|
| `datasets[]` | `DatasetSummary[]` | Todos os datasets atualmente no catálogo. |
| `datasets[].id` | `string` | Identificador estável do dataset (snake_case). |
| `datasets[].slug` | `string` | Slug seguro para URL (kebab-case). |
| `datasets[].source_id` | `string` | Identificador da agência fonte. |
| `datasets[].manifest_path` | `string` | Caminho do manifesto no Storage. |

```bash
curl https://institutoforest.org/api/v1/catalog
```

```json
{
  "schema_version": "1.0",
  "api_version": "v1",
  "generated_at": "2026-04-23T12:00:00Z",
  "generation_status": "success",
  "warnings": [],
  "datasets": [
    {
      "id": "inpe_bdqueimadas_focos",
      "slug": "focos-bdqueimadas",
      "title": "INPE - BDQueimadas - Focos Brasil",
      "source_id": "inpe",
      "source_title": "Instituto Nacional de Pesquisas Espaciais",
      "category_title": "Meio ambiente",
      "subcategory_title": "Queimadas",
      "manifest_path": "inpe/bdqueimadas/focos_br_ref/manifest.json",
      "source_url": "https://terrabrasilis.dpi.inpe.br/queimadas/portal/"
    }
  ]
}
```

### `GET /catalog/reports`

Lista compacta de todos os relatórios analíticos publicados.

```bash
curl https://institutoforest.org/api/v1/catalog/reports
```

### `GET /datasets/{id}`

Envelope completo do manifesto do dataset. O parâmetro de caminho aceita o `id` do dataset (ex.: `inpe_bdqueimadas_focos`) ou o `slug`.

| Parâmetro | Em | Tipo | Descrição |
|----------|----|------|-----------|
| `id` | path | string (obrigatório) | Id ou slug do dataset. |

```bash
curl https://institutoforest.org/api/v1/datasets/inpe_bdqueimadas_focos
```

```json
{
  "schema_version": "1.0",
  "api_version": "v1",
  "generated_at": "2026-04-22T03:11:09Z",
  "generation_status": "success",
  "warnings": [],
  "manifest": {
    "schema_version": "1.0",
    "dataset_id": "inpe_bdqueimadas_focos",
    "title": "INPE - BDQueimadas - Focos Brasil",
    "source_dataset_url": "https://terrabrasilis.dpi.inpe.br/queimadas/portal/",
    "generated_at": "2026-04-22T03:11:09Z",
    "generation_status": "success",
    "warnings": [],
    "bucket_prefix": "inpe/bdqueimadas/focos_br_ref",
    "items": [
      {
        "kind": "data",
        "period": "2024",
        "filename": "focos_2024.zip",
        "sha256": "...",
        "size_bytes": 1234567,
        "public_url": "https://<projeto>.supabase.co/storage/v1/object/public/open-data/inpe/bdqueimadas/focos_br_ref/focos_2024.zip",
        "source_url": "https://..."
      }
    ],
    "meta": {
      "source_agency": "INPE - Programa Queimadas",
      "release": { "last_release_iso": "2026-04-22T00:00:00Z" },
      "custom_tags": { "total_years": 25 }
    }
  }
}
```

### `GET /datasets/{id}/items`

Retorna apenas o array `items[]` do manifesto. Útil para clientes que precisam apenas das URLs de download, sem os metadados completos.

```bash
curl https://institutoforest.org/api/v1/datasets/inpe_bdqueimadas_focos/items
```

### `GET /reports/{id}`

Envelope completo do manifesto do relatório.

```bash
curl https://institutoforest.org/api/v1/reports/bdqueimadas_overview
```

### `GET /sources`

Agências fonte distintas derivadas do catálogo, com a contagem de datasets por fonte. Útil para navegação facetada em aplicações cliente.

```bash
curl https://institutoforest.org/api/v1/sources
```

## SDK Python

Um cliente Python de referência embrulha a API e adiciona download local com verificação de sha256. O código-fonte do pacote vive em `forest-open-data-pipelines/sdk/forest_data/`; o nome público é `forest-data` no PyPI.

```python
pip install forest-data

import forest_data

client = forest_data.Client()
print([d.id for d in client.list_datasets()])

# baixa todos os arquivos de um dataset, verifica sha256 e salva sob ./dados
paths = client.download("inpe_bdqueimadas_focos", path="./dados")
```

O SDK não faz cache próprio; ele conversa com `https://institutoforest.org/api/v1` e segue as URLs retornadas no manifesto.
