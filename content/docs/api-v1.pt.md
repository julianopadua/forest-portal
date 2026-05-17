API HTTP publica e somente leitura para o catalogo de dados abertos do Instituto Forest.

## Visao geral

A API serve apenas metadados. Os arquivos dos datasets nao sao armazenados pelo Forest e nao sao servidos por esta API. Cada item de dataset expoe um `source_url` canonico que aponta para a fonte oficial. As pipelines do Forest podem baixar esses arquivos temporariamente durante uma execucao local ou por cron para validar e perfilar os dados. Depois disso, publicam apenas o manifesto e os metadados de perfil.

URL base: `https://institutoforest.org/api/v1`

Todas as respostas sao JSON em UTF-8, com o mesmo envelope: `schema_version`, `api_version`, `generated_at`, `generation_status`, `warnings[]`, mais uma chave de carga util como `datasets`, `manifest`, `items`, `reports` ou `sources`.

## Autenticacao

Nenhuma. O catalogo e publico. As requisicoes nao exigem credenciais. O CORS e permissivo (`Access-Control-Allow-Origin: *`).

## Versionamento

A versao da API fica no prefixo da URL (`/api/v1`). O manifesto de dataset tem seu proprio `schema_version`. Os manifestos de dataset deste contrato usam schema `2.0`.

Mudancas incompatíveis na API exigem um novo caminho de API. Mudancas incompatíveis no manifesto exigem incremento de schema.

## Modelo de armazenamento

O Forest armazena:

- Envelopes de catalogo.
- Manifestos de dataset.
- Manifestos de relatorio e JSONs derivados de relatorios.
- Catalogos compactos de metadados, como ANP.
- Metadados de perfil gerados pelas pipelines.

O Forest nao armazena arquivos brutos de datasets no Supabase. Consumidores da API e usuarios do SDK baixam bytes pelos valores `source_url` dos itens.

## URLs de dataset

`source_dataset_url` e a pagina oficial do dataset ou pacote. Use esse campo para atribuicao, documentacao e inspecao manual.

O `source_url` do item e a URL oficial baixavel do recurso. Use esse campo para download automatizado.

## Contrato de perfil

O perfil acontece durante a execucao da pipeline. A pipeline baixa o arquivo fonte para armazenamento temporario local, inspeciona o arquivo, registra metricas e apaga o arquivo temporario, salvo quando uma flag de depuracao preserva o arquivo localmente.

`profiled_at` e o timestamp UTC em ISO 8601 de quando o Forest terminou o perfil daquele item. Nao e a data de release da fonte e nao e o horario da resposta da API.

`profile_status` descreve o resultado do perfil por item:

| Valor | Significado | Orientacao ao consumidor |
|------|-------------|--------------------------|
| `ok` | O download funcionou, a validacao de formato passou e as metricas esperadas foram calculadas. | Adequado para uso automatizado. |
| `partial` | O download funcionou, mas algumas metricas estao incompletas por limites de parser, estrutura de arquivo, membros nao suportados ou amostragem. | Use apenas se os campos necessarios existirem. Inspecione `profile_warnings`. |
| `failed` | A URL foi descoberta, mas download, parse ou validacao falhou. | Nao automatize ingestao sem validacao independente. |
| `skipped` | O perfil nao foi tentado de forma intencional, geralmente por formato nao suportado ou por nao ser arquivo tabular. | Use como registro de link. Nao presuma metricas de linhas ou colunas. |

`profile_warnings` e uma lista de objetos com `code` e `message`. As mensagens sao seguras para publico e nao incluem stack traces, segredos ou caminhos locais.

Codigos comuns:

| Codigo | Significado |
|-------|-------------|
| `head_unavailable` | Metadados remotos nao puderam ser lidos por HEAD. |
| `download_timeout` | O recurso nao foi baixado dentro do timeout de perfil. |
| `unsupported_format` | Nao existe parser para o formato do arquivo. |
| `row_count_sampled` | A contagem de linhas foi estimada ou amostrada. |
| `archive_member_skipped` | Alguns membros de um arquivo compactado nao foram perfilados. |
| `empty_tabular_data` | O arquivo nao tinha linhas de dados ou tinha apenas cabecalho. |
| `checksum_unavailable` | Um checksum nao foi calculado ou nao esta disponivel para este item. |

## Campos de OpenDataItem

| Campo | Tipo | Obrigatorio | Descricao |
|------|------|-------------|-----------|
| `kind` | string | sim | Atualmente `data`. |
| `period` | string | sim | Particao temporal, como `2024`, `2024-03`, uma data ISO ou `Atual`. |
| `filename` | string | sim | Nome inferido da URL oficial ou dos metadados da fonte. |
| `source_url` | URL string | sim | URL oficial canonica para baixar o recurso. |
| `title` | string | nao | Titulo legivel do item. |
| `release_time` | string | nao | Horario de publicacao quando a fonte distingue janelas de release. |
| `size_bytes` | integer | nao | Bytes lidos durante o perfil. |
| `sha256` | string | nao | Hash calculado durante o perfil quando o arquivo foi baixado. |
| `row_count` | integer | nao | Numero de linhas de dados quando mensuravel. |
| `column_count` | integer | nao | Numero de colunas quando mensuravel. |
| `columns` | string array | nao | Nomes de colunas quando disponiveis. |
| `content_type` | string ou null | nao | Content-Type HTTP observado durante o perfil. |
| `format` | string | nao | Formato inferido do nome do arquivo ou dos metadados da fonte. |
| `last_modified` | string ou null | nao | Header Last-Modified observado durante o perfil. |
| `profiled_at` | ISO string | nao | Horario em que o perfil terminou. |
| `profile_status` | string | nao | `ok`, `partial`, `failed` ou `skipped`. |
| `profile_warnings` | array | nao | Objetos de aviso seguros para publico. |
| `archive_profile` | object | nao | Resumo de membros para recursos ZIP ou semelhantes. |

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

Para ingestao automatizada:

1. Prefira itens com `profile_status` igual a `ok`.
2. Exija `source_url`.
3. Use verificacao por `sha256` quando o campo existir.
4. Trate `row_count`, `column_count` e `columns` como metadados de perfil, nao como garantias legais da agencia fonte.
5. Inspecione `profile_warnings` antes de usar itens `partial`, `failed` ou `skipped`.
6. Nao assuma que `source_dataset_url` e baixavel. Em geral, esse campo e uma pagina de entrada.

## Endpoints

### `GET /health`

Retorna status do servico e schema de manifesto compreendido por esta implantacao.

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

Retorna resumos compactos de relatorios.

### `GET /reports/{id}`

Retorna um manifesto de relatorio. Relatorios ainda podem apontar para JSONs derivados armazenados pelo Forest.

### `GET /sources`

Retorna agencias fonte e contagem de datasets.

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

O SDK segue `source_url`. Se `sha256` existir, o SDK verifica os bytes baixados por padrao.

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
