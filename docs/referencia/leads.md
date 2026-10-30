# Leads

Consulta de leads e movimentação no pipeline. Atualizar um lead dispara as regras de automação configuradas.

## Buscar lead

`GET https://app.clixx.com.br/api/webhook/leads/{id}`

Retorna o lead com pipeline, etapa e formulário. Para buscar pelo telefone, use `id` igual a `0` e informe `celular`. O `lead_id` também aparece em Listar negócios e em Listar inscrições.

### Parâmetros

| Nome | Onde | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- | --- |
| `id` | URL | integer | Sim | ID do lead. Use `0` para localizar o lead pelo celular. |
| `celular` | Query | string | Não | Celular do lead. |

### Exemplo

```bash
curl -X GET "https://app.clixx.com.br/api/webhook/leads/123" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Resposta (200)

```json
{
  "success": true,
  "lead": {
    "id": 123,
    "nome": "João da Silva",
    "celular": "11999999999",
    "email": "joao@email.com",
    "cidade": "São Paulo",
    "estado": "SP",
    "status": "ativo",
    "origem": "formulario",
    "prioridade": "normal",
    "created_at": "2026-01-20 10:00:00"
  },
  "pipeline": {
    "id": 1,
    "nome": "Vendas"
  },
  "etapa": {
    "id": 3,
    "nome": "Negociação",
    "cor": "#fd7e14",
    "ordem": 3,
    "is_final": false
  },
  "anuncio": {
    "id": 5,
    "titulo": "Curso de Marketing",
    "hash": "abc123"
  }
}
```

### Erros

| Código | Descrição |
| --- | --- |
| `401` | Token ausente ou inválido. |
| `403` | Assinatura bloqueada. Nos relatórios de metas e negócios, também indica Modo Negócios desativado, com `reason` igual a `modo_negocios_inativo`. |
| `404` | Registro não encontrado. |

## Atualizar lead

`PUT https://app.clixx.com.br/api/webhook/leads/{id}`

Atualiza pipeline, etapa, status ou valor de um lead e dispara as regras de automação (`lead.stage_changed` e `lead.status_changed`).

Ao informar `pipeline_id` sem `etapa_id`, o lead vai para a primeira etapa do pipeline. Pipeline e etapa precisam ser da sua empresa. `POST` na mesma URL também é aceito.

### Parâmetros

| Nome | Onde | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- | --- |
| `id` | URL | integer | Sim | ID do lead. Use `0` para localizar o lead pelo celular. |

### Corpo da requisição

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `pipeline_id` | integer | Não | Pipeline de destino. |
| `etapa_id` | integer | Não | Etapa de destino. |
| `status` | string | Não | Valores: `ativo`, `qualificado`, `proposta_enviada`, `convertido`, `perdido`, `inativo`, `aguardando`, `em_negociacao`. |
| `valor_estimado` | number | Não | Envie `null` para limpar. |
| `celular` | string | Não | Localiza o lead quando a URL usa `id` igual a `0`. |

### Exemplo

```bash
curl -X PUT "https://app.clixx.com.br/api/webhook/leads/123" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "valor_estimado": 1500
  }'
```

**Mover para uma etapa**

```bash
curl -X PUT "https://app.clixx.com.br/api/webhook/leads/123" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "pipeline_id": 1,
    "etapa_id": 5,
    "status": "qualificado"
  }'
```

**Mudar só o status**

```bash
curl -X PUT "https://app.clixx.com.br/api/webhook/leads/123" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "status": "convertido"
  }'
```

**Atualizar o valor estimado**

```bash
curl -X PUT "https://app.clixx.com.br/api/webhook/leads/123" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "valor_estimado": 1500
  }'
```

**Localizar o lead pelo celular**

```bash
curl -X PUT "https://app.clixx.com.br/api/webhook/leads/0" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "celular": "11999999999",
    "status": "qualificado"
  }'
```

### Resposta (200)

```json
{
  "success": true,
  "message": "Lead atualizado com sucesso",
  "data": {
    "lead_id": 123,
    "changes": [
      "etapa_id",
      "status"
    ],
    "eventos_disparados": [
      "lead.stage_changed",
      "lead.status_changed"
    ]
  }
}
```

### Erros

| Código | Descrição |
| --- | --- |
| `400` | Requisição inválida. |
| `401` | Token ausente ou inválido. |
| `403` | Assinatura bloqueada. Nos relatórios de metas e negócios, também indica Modo Negócios desativado, com `reason` igual a `modo_negocios_inativo`. |
| `404` | Registro não encontrado. |
