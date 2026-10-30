# Negócios

Oportunidades de cada lead. Um lead pode ter vários negócios.

## Listar negócios do lead

`GET https://app.clixx.com.br/api/v1/leads/{id}/negocios`

### Parâmetros

| Nome | Onde | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- | --- |
| `id` | URL | integer | Sim | - |
| `page` | Query | integer | Não | Padrão: `1`. |
| `per_page` | Query | integer | Não | Padrão: `5`. |
| `all` | Query | integer | Não | Use `1` para retornar todos sem paginação. Valores: `1`. |

### Exemplo

```bash
curl -X GET "https://app.clixx.com.br/api/v1/leads/123/negocios" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Resposta (200)

```json
{
  "success": true,
  "negocios": [
    {
      "id": 42,
      "lead_id": 123,
      "titulo": "Plano Premium 12 meses",
      "pipeline_id": 1,
      "etapa_id": 3,
      "status": "aberto",
      "valor": "1500.00",
      "responsavel_id": 5,
      "temperatura": "quente",
      "prioridade": "alta",
      "origem": null,
      "motivo_perda": null,
      "data_inicio": "2026-04-01",
      "data_fechamento_prevista": "2026-05-15",
      "data_fechamento_real": null,
      "etapa_changed_at": "2026-04-10 14:30:00",
      "created_at": "2026-04-01 09:00:00",
      "updated_at": "2026-04-10 14:30:00",
      "etapa_nome": "Negociação"
    }
  ],
  "total": 1,
  "page": 1,
  "per_page": 5,
  "has_more": false
}
```

### Erros

| Código | Descrição |
| --- | --- |
| `401` | Token ausente ou inválido. |
| `403` | Assinatura bloqueada. Nos relatórios de metas e negócios, também indica Modo Negócios desativado, com `reason` igual a `modo_negocios_inativo`. |
| `404` | Registro não encontrado. |

## Criar negócio

`POST https://app.clixx.com.br/api/v1/leads/{id}/negocios`

Cria um negócio para o lead. Sem `etapa_id`, usa a primeira etapa do pipeline padrão.

### Parâmetros

| Nome | Onde | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- | --- |
| `id` | URL | integer | Sim | - |

### Corpo da requisição

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `titulo` | string | Sim | - |
| `valor` | number | Não | - |
| `pipeline_id` | integer | Não | Padrão é o pipeline da empresa. |
| `etapa_id` | integer | Não | - |
| `status` | string | Não | Valores: `aberto`, `ganho`, `perdido`. Padrão: `aberto`. |
| `responsavel_id` | integer | Não | - |
| `temperatura` | string | Não | Valores: `frio`, `morno`, `quente`. |
| `prioridade` | string | Não | Valores: `baixa`, `normal`, `alta`, `urgente`. Padrão: `normal`. |
| `origem` | string | Não | - |
| `data_inicio` | date | Não | - |
| `data_fechamento_prevista` | date | Não | - |
| `motivo_perda` | string | Não | Usado quando o status é `perdido`. |
| `produtos` | integer[] | Não | IDs dos produtos. |

### Exemplo

```bash
curl -X POST "https://app.clixx.com.br/api/v1/leads/123/negocios" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "titulo": "Plano Premium 12 meses",
    "valor": 1500
  }'
```

### Resposta (200)

```json
{
  "success": true,
  "id": 42,
  "message": "Negócio criado com sucesso."
}
```

### Erros

| Código | Descrição |
| --- | --- |
| `401` | Token ausente ou inválido. |
| `403` | Assinatura bloqueada. Nos relatórios de metas e negócios, também indica Modo Negócios desativado, com `reason` igual a `modo_negocios_inativo`. |
| `404` | Registro não encontrado. |
| `422` | Um ou mais campos são inválidos. |

## Listar negócios

`GET https://app.clixx.com.br/api/v1/negocios`

Lista os negócios da empresa, do mais recente para o mais antigo. Use este endpoint para descobrir o `id` de um negócio e o `lead_id` do lead vinculado.

### Parâmetros

| Nome | Onde | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- | --- |
| `lead_id` | Query | integer | Não | Filtra por lead. |
| `pipeline_id` | Query | integer | Não | Filtra por pipeline. |
| `etapa_id` | Query | integer | Não | Filtra por etapa. |
| `status` | Query | string | Não | Valores: `aberto`, `ganho`, `perdido`. |
| `responsavel_id` | Query | integer | Não | Filtra por usuário responsável. |
| `page` | Query | integer | Não | Padrão: `1`. |
| `per_page` | Query | integer | Não | Padrão: `20`. De 1 a 100. |

### Exemplo

```bash
curl -X GET "https://app.clixx.com.br/api/v1/negocios" \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Negócios abertos de um pipeline**

```bash
curl -X GET "https://app.clixx.com.br/api/v1/negocios?pipeline_id=3&status=aberto" \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Negócios de um lead**

```bash
curl -X GET "https://app.clixx.com.br/api/v1/negocios?lead_id=123" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Resposta (200)

```json
{
  "success": true,
  "negocios": [
    {
      "id": 42,
      "lead_id": 123,
      "lead_nome": "João da Silva",
      "lead_celular": "11999999999",
      "titulo": "Plano Premium 12 meses",
      "pipeline_id": 1,
      "etapa_id": 3,
      "etapa_nome": "Negociação",
      "status": "aberto",
      "valor": "1500.00",
      "responsavel_id": 5,
      "temperatura": "quente",
      "prioridade": "alta",
      "data_fechamento_prevista": "2026-05-15",
      "data_fechamento_real": null,
      "created_at": "2026-04-01 09:00:00",
      "updated_at": "2026-04-10 14:30:00"
    }
  ],
  "total": 1,
  "page": 1,
  "per_page": 5,
  "has_more": false
}
```

### Erros

| Código | Descrição |
| --- | --- |
| `401` | Token ausente ou inválido. |
| `403` | Assinatura bloqueada. Nos relatórios de metas e negócios, também indica Modo Negócios desativado, com `reason` igual a `modo_negocios_inativo`. |
| `422` | Requisição inválida. |

## Detalhar negócio

`GET https://app.clixx.com.br/api/v1/negocios/{id}`

Retorna um negócio e os IDs dos produtos vinculados. O `id` aparece em Listar negócios.

### Parâmetros

| Nome | Onde | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- | --- |
| `id` | URL | integer | Sim | - |

### Exemplo

```bash
curl -X GET "https://app.clixx.com.br/api/v1/negocios/123" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Resposta (200)

```json
{
  "success": true,
  "negocio": {
    "id": 42,
    "lead_id": 123,
    "titulo": "Plano Premium 12 meses",
    "pipeline_id": 1,
    "etapa_id": 3,
    "status": "aberto",
    "valor": "1500.00",
    "responsavel_id": 5,
    "temperatura": "quente",
    "prioridade": "alta",
    "origem": null,
    "motivo_perda": null,
    "data_inicio": "2026-04-01",
    "data_fechamento_prevista": "2026-05-15",
    "data_fechamento_real": null,
    "etapa_changed_at": "2026-04-10 14:30:00",
    "created_at": "2026-04-01 09:00:00",
    "updated_at": "2026-04-10 14:30:00",
    "produtos_ids": [
      3,
      7
    ]
  }
}
```

### Erros

| Código | Descrição |
| --- | --- |
| `401` | Token ausente ou inválido. |
| `403` | Assinatura bloqueada. Nos relatórios de metas e negócios, também indica Modo Negócios desativado, com `reason` igual a `modo_negocios_inativo`. |
| `404` | Registro não encontrado. |

## Atualizar negócio

`PUT https://app.clixx.com.br/api/v1/negocios/{id}`

Atualiza um negócio. `POST` na mesma URL também é aceito.

Ao trocar para uma etapa do tipo ganho ou perdido, o status é forçado para corresponder. Ao mudar apenas o `status`, sem trocar a etapa, sua escolha é respeitada, o que serve para reabrir um negócio.

### Parâmetros

| Nome | Onde | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- | --- |
| `id` | URL | integer | Sim | - |

### Corpo da requisição

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `titulo` | string | Sim | - |
| `valor` | number | Não | - |
| `pipeline_id` | integer | Não | Padrão é o pipeline da empresa. |
| `etapa_id` | integer | Não | - |
| `status` | string | Não | Valores: `aberto`, `ganho`, `perdido`. Padrão: `aberto`. |
| `responsavel_id` | integer | Não | - |
| `temperatura` | string | Não | Valores: `frio`, `morno`, `quente`. |
| `prioridade` | string | Não | Valores: `baixa`, `normal`, `alta`, `urgente`. Padrão: `normal`. |
| `origem` | string | Não | - |
| `data_inicio` | date | Não | - |
| `data_fechamento_prevista` | date | Não | - |
| `motivo_perda` | string | Não | Usado quando o status é `perdido`. |
| `produtos` | integer[] | Não | IDs dos produtos. |

### Exemplo

```bash
curl -X PUT "https://app.clixx.com.br/api/v1/negocios/123" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "titulo": "Plano Premium 12 meses",
    "valor": 1500
  }'
```

### Resposta (200)

```json
{
  "success": true,
  "message": "Negócio atualizado."
}
```

### Erros

| Código | Descrição |
| --- | --- |
| `401` | Token ausente ou inválido. |
| `403` | Assinatura bloqueada. Nos relatórios de metas e negócios, também indica Modo Negócios desativado, com `reason` igual a `modo_negocios_inativo`. |
| `404` | Registro não encontrado. |
| `422` | Um ou mais campos são inválidos. |
