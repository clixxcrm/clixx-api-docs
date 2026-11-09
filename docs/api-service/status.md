# Status da mensagem

Status de entrega das mensagens enviadas pela API.

## Consultar status da mensagem

`GET https://app.clixx.com.br/api-service/external/{apiId}/getMessageByMessageId`

Busca uma mensagem pelo `messageId` devolvido no envio. A Meta pode aceitar a mensagem e recusar a entrega depois; por isso, confira o `status` alguns segundos após enviar. Em falha, o motivo vem em `error`.

### Parâmetros

| Nome | Onde | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- | --- |
| `messageId` | Query | string | Sim | ID devolvido no envio (`messageId`). |

### Exemplo

```bash
curl -X GET "https://app.clixx.com.br/api-service/external/SEU_API_ID/getMessageByMessageId?messageId=wamid.HBgNNTUxMTk5OTk5OTk5ORUCABEYEjQ1Q0E4" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Resposta (200)

```json
{
  "success": true,
  "message": {
    "id": "wamid.HBgNNTUxMTk5OTk5OTk5ORUCABEYEjQ1Q0E4",
    "conversaId": 1520,
    "direction": "outgoing",
    "type": "text",
    "body": "Seu pedido saiu para entrega.",
    "status": "delivered",
    "error": null,
    "createdAt": "2026-11-09 10:15:00"
  }
}
```

### Erros

| Código | Descrição |
| --- | --- |
| `400` | `messageId` não informado. |
| `401` | Token ausente ou inválido. |
| `403` | Assinatura da empresa inativa. A integração volta a funcionar sozinha quando a assinatura é reativada. |
| `404` | API não encontrada ou desativada, ou mensagem não encontrada. |
