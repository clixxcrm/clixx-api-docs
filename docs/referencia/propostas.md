# Propostas

Propostas vinculadas a um lead.

## Listar propostas do lead

`GET https://app.clixx.com.br/api/v1/leads/{id}/propostas`

### Parâmetros

| Nome | Onde | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- | --- |
| `id` | URL | integer | Sim | - |
| `page` | Query | integer | Não | Padrão: `1`. |
| `per_page` | Query | integer | Não | Padrão: `5`. |

### Exemplo

```bash
curl -X GET "https://app.clixx.com.br/api/v1/leads/123/propostas" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Resposta (200)

```json
{
  "success": true,
  "propostas": [
    {
      "id": 18,
      "lead_id": 123,
      "oportunidade_id": 42,
      "numero": 18,
      "titulo": "Proposta - Plano Premium",
      "status": "enviada",
      "subtotal": "1500.00",
      "desconto_valor": "0.00",
      "total": "1500.00",
      "data_inicial": "2026-04-15",
      "data_final": "2026-05-30",
      "created_at": "2026-04-15 11:00:00"
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
