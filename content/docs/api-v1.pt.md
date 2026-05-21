API HTTP pública e somente leitura para o catálogo de dados abertos do Instituto Forest.

## Visão geral

A API serve apenas metadados. Os arquivos dos datasets não são armazenados pelo Forest e não são servidos por esta API. Cada item de dataset expõe um `source_url` canônico que aponta para a fonte oficial. As pipelines do Forest podem baixar esses arquivos temporariamente durante uma execução local ou por cron para validar e perfilar os dados. Depois disso, publicam apenas o manifesto e os metadados de perfil.

URL base: `https://institutoforest.org/api/v1`

Todas as respostas são JSON em UTF-8, com o mesmo envelope: `schema_version`, `api_version`, `generated_at`, `generation_status`, `warnings[]`, mais uma chave de carga útil como `datasets`, `manifest`, `items`, `reports` ou `sources`.

## Autenticação

Nenhuma. O catálogo é público. As requisições não exigem credenciais. O CORS é permissivo (`Access-Control-Allow-Origin: *`).

## Versionamento

A versão da API fica no prefixo da URL (`/api/v1`). O manifesto de dataset tem seu próprio `schema_version`. Os manifestos de dataset deste contrato usam schema `2.0`.

Mudanças incompatíveis na API exigem um novo caminho de API. Mudanças incompatíveis no manifesto exigem incremento de schema.

## Modelo de armazenamento

O Forest armazena:

- Envelopes de catálogo.
- Manifestos de dataset.
- Manifestos de relatório e JSONs derivados de relatórios.
- Catálogos compactos de metadados, como ANP.
- Metadados de perfil gerados pelas pipelines.

O Forest não armazena arquivos brutos de datasets no Supabase. Consumidores da API e usuários do SDK baixam bytes pelos valores `source_url` dos itens.

## URLs de dataset

`source_dataset_url` é a página oficial do dataset ou pacote. Use esse campo para atribuição, documentação e inspeção manual.

O `source_url` do item é a URL oficial baixável do recurso. Use esse campo para download automatizado.

## Contrato de perfil

O perfil acontece durante a execução da pipeline. A pipeline baixa o arquivo fonte para armazenamento temporário local, inspeciona o arquivo, registra métricas e apaga o arquivo temporário, salvo quando uma flag de depuração preserva o arquivo localmente.

`profiled_at` é o timestamp UTC em ISO 8601 de quando o Forest terminou o perfil daquele item. Não é a data de release da fonte e não é o horário da resposta da API.

`profile_status` descreve o resultado do perfil por item:

| Valor | Significado | Orientação ao consumidor |
|------|-------------|--------------------------|
| `ok` | O download funcionou, a validação de formato passou e as métricas esperadas foram calculadas. | Adequado para uso automatizado. |
| `partial` | O download funcionou, mas algumas métricas estão incompletas por limites de parser, estrutura de arquivo, membros não suportados ou amostragem. | Use apenas se os campos necessários existirem. Inspecione `profile_warnings`. |
| `failed` | A URL foi descoberta, mas download, parse ou validação falhou. | Não automatize ingestão sem validação independente. |
| `skipped` | O perfil não foi tentado de forma intencional, geralmente por formato não suportado ou por não ser arquivo tabular. | Use como registro de link. Não presuma métricas de linhas ou colunas. |

`profile_warnings` é uma lista de objetos com `code` e `message`. As mensagens são seguras para público e não incluem stack traces, segredos ou caminhos locais.

Códigos comuns:

| Código | Significado |
|-------|-------------|
| `head_unavailable` | Metadados remotos não puderam ser lidos por HEAD. |
| `download_timeout` | O recurso não foi baixado dentro do timeout de perfil. |
| `unsupported_format` | Não existe parser para o formato do arquivo. |
| `row_count_sampled` | A contagem de linhas foi estimada ou amostrada. |
| `archive_member_skipped` | Alguns membros de um arquivo compactado não foram perfilados. |
| `empty_tabular_data` | O arquivo não tinha linhas de dados ou tinha apenas cabeçalho. |
| `checksum_unavailable` | Um checksum não foi calculado ou não está disponível para este item. |

## Campos de OpenDataItem

| Campo | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| `kind` | string | sim | Atualmente `data`. |
| `period` | string | sim | Partição temporal, como `2024`, `2024-03`, uma data ISO ou `Atual`. |
| `filename` | string | sim | Nome inferido da URL oficial ou dos metadados da fonte. |
| `source_url` | URL string | sim | URL oficial canônica para baixar o recurso. |
| `title` | string | não | Título legível do item. |
| `release_time` | string | não | Horário de publicação quando a fonte distingue janelas de release. |
| `size_bytes` | integer | não | Bytes lidos durante o perfil. |
| `sha256` | string | não | Hash calculado durante o perfil quando o arquivo foi baixado. |
| `row_count` | integer | não | Número de linhas de dados quando mensurável. |
| `column_count` | integer | não | Número de colunas quando mensurável. |
| `columns` | string array | não | Nomes de colunas quando disponíveis. |
| `content_type` | string ou null | não | Content-Type HTTP observado durante o perfil. |
| `format` | string | não | Formato inferido do nome do arquivo ou dos metadados da fonte. |
| `last_modified` | string ou null | não | Header Last-Modified observado durante o perfil. |
| `profiled_at` | ISO string | não | Horário em que o perfil terminou. |
| `profile_status` | string | não | `ok`, `partial`, `failed` ou `skipped`. |
| `profile_warnings` | array | não | Objetos de aviso seguros para público. |
| `archive_profile` | object | não | Resumo de membros para recursos ZIP ou semelhantes. |

## Exemplo de manifesto

```json
{
  "schema_version": "2.0",
  "dataset_id": "inpe_bdqueimadas_focos",
  "title": "INPE - BDQueimadas - Focos Brasil",
  "source_dataset_url": "https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/anual/Brasil_sat_ref/",
  "generated_at": "2026-05-17T12:00:00Z",
  "generation_status": "success_partial_fallback",
  "warnings": [],
  "bucket_prefix": "inpe/bdqueimadas/focos_br_ref",
  "items": [
    {
      "kind": "data",
      "period": "2025",
      "filename": "focos_br_ref_2025.zip",
      "source_url": "https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/anual/Brasil_sat_ref/focos_br_ref_2025.zip",
      "size_bytes": 1200000,
      "sha256": "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
      "row_count": 400000,
      "format": "zip",
      "profiled_at": "2026-05-17T11:59:10Z",
      "profile_status": "ok",
      "profile_warnings": [],
      "archive_profile": {
        "member_count": 1,
        "members": ["focos_br_ref_2025.csv"],
        "tabular_members": [
          {
            "filename": "focos_br_ref_2025.csv",
            "row_count": 400000,
            "column_count": 12,
            "columns": ["data", "hora", "satelite", "pais"]
          }
        ]
      }
    },
    {
      "kind": "data",
      "period": "2024",
      "filename": "large_archive.zip",
      "source_url": "https://example.org/large_archive.zip",
      "profiled_at": "2026-05-17T11:59:20Z",
      "profile_status": "partial",
      "profile_warnings": [
        {
          "code": "archive_member_skipped",
          "message": "Some archive members were not profiled because of the configured limit."
        }
      ]
    },
    {
      "kind": "data",
      "period": "2023",
      "filename": "missing.csv",
      "source_url": "https://example.org/missing.csv",
      "profiled_at": "2026-05-17T11:59:30Z",
      "profile_status": "failed",
      "profile_warnings": [
        {
          "code": "download_timeout",
          "message": "Profiling failed: Timeout."
        }
      ]
    }
  ],
  "meta": {
    "source_agency": "INPE - Programa Queimadas",
    "custom_tags": { "total_years": 25 }
  }
}
```

## Escolha de itens para uso automatizado

Para ingestão automatizada:

1. Prefira itens com `profile_status` igual a `ok`.
2. Exija `source_url`.
3. Use verificação por `sha256` quando o campo existir.
4. Trate `row_count`, `column_count` e `columns` como metadados de perfil, não como garantias legais da agência fonte.
5. Inspecione `profile_warnings` antes de usar itens `partial`, `failed` ou `skipped`.
6. Não assuma que `source_dataset_url` é baixável. Em geral, esse campo é uma página de entrada.

## Endpoints

### `GET /health`

Retorna status do serviço e schema de manifesto compreendido por esta implantação.

```bash
curl https://institutoforest.org/api/v1/health
```

### `GET /catalog`

Retorna resumos compactos de datasets. Use `/datasets/{id}` para manifesto completo.

```bash
curl https://institutoforest.org/api/v1/catalog
```

### `GET /datasets/{id}`

Retorna o manifesto completo do dataset. O caminho aceita id ou slug.

```bash
curl https://institutoforest.org/api/v1/datasets/inpe_bdqueimadas_focos
```

### `GET /datasets/{id}/items`

Retorna apenas `items[]`. Use quando o cliente precisa de URLs oficiais e metadados de perfil sem o manifesto completo.

```bash
curl https://institutoforest.org/api/v1/datasets/inpe_bdqueimadas_focos/items
```

### `GET /catalog/reports`

Retorna resumos compactos de relatórios.

### `GET /reports/{id}`

Retorna um manifesto de relatório. Relatórios ainda podem apontar para JSONs derivados armazenados pelo Forest.

### `GET /sources`

Retorna agências fonte e contagem de datasets.

### `GET /openapi.json`

Retorna o documento OpenAPI 3.1 gerado a partir dos schemas Zod do runtime.

## SDK Python

```bash
pip install forest-data
```

```python
import forest_data

client = forest_data.Client()
manifest = client.get_dataset("inpe_bdqueimadas_focos")

for item in manifest.items:
    print(item.period, item.source_url, item.profile_status, item.row_count)

paths = client.download("inpe_bdqueimadas_focos", path="./data")
```

O SDK segue `source_url`. Se `sha256` existir, o SDK verifica os bytes baixados por padrão.

## Erros

Respostas de erro seguem RFC 7807 com `Content-Type: application/problem+json`.

```json
{
  "type": "https://institutoforest.org/api/errors/not-found",
  "title": "Resource not found",
  "status": 404,
  "detail": "No dataset with id or slug \"inpe_unknown\"."
}
```
