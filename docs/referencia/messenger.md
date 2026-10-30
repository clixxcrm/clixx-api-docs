# Messenger

Estado da conversa durante uma inscrição pelo Messenger.

## Criar ou atualizar estado

`POST https://app.clixx.com.br/api/messenger/state`

Cria ou atualiza o estado do lead pelo PSID.

### Corpo da requisição

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `psid` | string | Sim | ID do usuário no Messenger. |
| `step` | string | Sim | Valores: `nome`, `celular`, `confirmacao`. |
| `anuncio_hash` | string | Sim | - |
| `nome` | string | Não | Nome coletado na conversa. |
| `celular` | string | Não | Celular coletado na conversa. |

### Exemplo

```bash
curl -X POST "https://app.clixx.com.br/api/messenger/state" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "psid": "1234567890",
    "step": "nome",
    "anuncio_hash": "abc123"
  }'
```

### Resposta (200)

```json
{
  "success": true,
  "state": {
    "psid": "1234567890",
    "step": "celular",
    "anuncio_hash": "abc123",
    "nome": "João da Silva",
    "celular": null,
    "created_at": "2026-01-20 10:00:00",
    "updated_at": "2026-01-20 10:01:00"
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
| `422` | Requisição inválida. |

## Buscar estado

`GET https://app.clixx.com.br/api/messenger/state/{psid}`

### Parâmetros

| Nome | Onde | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- | --- |
| `psid` | URL | string | Sim | ID do usuário no Messenger. |

### Exemplo

```bash
curl -X GET "https://app.clixx.com.br/api/messenger/state/1234567890" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Resposta (200)

```json
{
  "success": true,
  "state": {
    "psid": "1234567890",
    "step": "celular",
    "anuncio_hash": "abc123",
    "nome": "João da Silva",
    "celular": null,
    "created_at": "2026-01-20 10:00:00",
    "updated_at": "2026-01-20 10:01:00"
  }
}
```

### Erros

| Código | Descrição |
| --- | --- |
| `401` | Token ausente ou inválido. |
| `403` | Assinatura bloqueada. Nos relatórios de metas e negócios, também indica Modo Negócios desativado, com `reason` igual a `modo_negocios_inativo`. |
| `404` | Estado não encontrado. |

## Remover estado

`DELETE https://app.clixx.com.br/api/messenger/state/{psid}`

Remove o estado do lead depois de concluir a inscrição.

### Parâmetros

| Nome | Onde | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- | --- |
| `psid` | URL | string | Sim | ID do usuário no Messenger. |

### Exemplo

```bash
curl -X DELETE "https://app.clixx.com.br/api/messenger/state/1234567890" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Resposta (200)

```json
{
  "success": true
}
```

### Erros

| Código | Descrição |
| --- | --- |
| `401` | Token ausente ou inválido. |
| `403` | Assinatura bloqueada. Nos relatórios de metas e negócios, também indica Modo Negócios desativado, com `reason` igual a `modo_negocios_inativo`. |
