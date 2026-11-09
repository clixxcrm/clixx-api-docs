# Templates

Templates aprovados na Meta. Só funcionam em APIs ligadas a um canal da API Oficial. As outras respondem `400`.

## Enviar template

`POST https://app.clixx.com.br/api-service/external/{apiId}/template`

Envia um template aprovado na Meta. Funciona fora da janela de 24 horas, então é a forma de iniciar uma conversa ou retomar um contato parado. Use [Listar templates](#listar-templates) para ver os nomes, os idiomas e quantas variáveis cada um tem.

### Corpo da requisição

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `number` | string | Sim | Número do destinatário com DDD. Sem código de país, vale o Brasil (55); para outro país, comece com `+`. |
| `template` | string | Sim | Nome exato do template aprovado. |
| `language` | string | Não | Código de idioma do template. Padrão: `pt_BR`. |
| `params` | string[] | Não | Variáveis do corpo, na ordem `{{1}}`, `{{2}}`... |
| `headerImageUrl` | string | Não | URL https pública da imagem, para template com cabeçalho de imagem. |
| `headerDocumentUrl` | string | Não | URL https pública do PDF, para template com cabeçalho de documento. Não use junto com `headerImageUrl`. |
| `headerDocumentFilename` | string | Não | Nome do arquivo exibido no documento. |
| `couponCode` | string | Não | Código PIX copia e cola, para template com botão de copiar código. Obrigatório nesse tipo de template. |
| `buttons` | object[] | Não | Parte variável de botão de URL dinâmica, no formato `[{"index": 0, "value": "..."}]`. `index` é a posição do botão, começando em 0. |
| `flowId` | integer | Não | ID de um fluxo do FlowBuilder. Quando o contato clicar num botão deste template, o fluxo começa. O fluxo precisa estar ativo e ter um gatilho de template com os mesmos botões. O ID aparece no card do fluxo. |
| `canalId` | integer | Não | ID de outro número da API Oficial da empresa. Vazio = número da própria API. |
| `externalKey` | string | Não | Chave sua, única por mensagem. Se a mesma chave chegar de novo, nada é reenviado e a resposta é `409`. Sem chave, toda chamada envia. |
| `isClosed` | boolean | Não | Aba em que o ticket fica em Atendimentos: `false` = Abertos, `"pending"` = Pendentes, `true` = Fechados. Padrão: `false`. |
| `filaId` | integer | Não | ID da fila de atendimento. Fila inexistente ou inativa é ignorada. |
| `userId` | integer | Não | ID do usuário responsável pelo ticket. Usuário inexistente, inativo ou de outra empresa é ignorado. |

### Exemplo

```bash
curl -X POST "https://app.clixx.com.br/api-service/external/SEU_API_ID/template" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "number": "5511999999999",
    "template": "confirmacao_pedido",
    "params": [
      "João",
      "1234"
    ]
  }'
```

**Template com cabeçalho de documento (PDF)**

```bash
curl -X POST "https://app.clixx.com.br/api-service/external/SEU_API_ID/template" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "number": "5511999999999",
    "template": "envio_boleto",
    "params": [
      "João",
      "R$ 150,00"
    ],
    "headerDocumentUrl": "https://exemplo.com/boleto-1234.pdf",
    "headerDocumentFilename": "boleto-1234.pdf"
  }'
```

**Template que começa um fluxo do FlowBuilder quando o contato clica num botão**

```bash
curl -X POST "https://app.clixx.com.br/api-service/external/SEU_API_ID/template" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "number": "5511999999999",
    "template": "pesquisa_satisfacao",
    "flowId": 42
  }'
```

### Resposta (200)

```json
{
  "success": true,
  "messageId": "wamid.HBgNNTUxMTk5OTk5OTk5ORUCABEYEjQ1Q0E4",
  "conversaId": 1520
}
```

### Erros

| Código | Descrição |
| --- | --- |
| `400` | Campo obrigatório faltando, número inválido, API fora do canal API Oficial, template inexistente ou não aprovado, variáveis em número diferente do template, `couponCode` faltando, `flowId` inválido ou inativo, ou recusa da Meta. O motivo vem em `error`. |
| `401` | Token ausente ou inválido. |
| `403` | Assinatura da empresa inativa. A integração volta a funcionar sozinha quando a assinatura é reativada. |
| `404` | API não encontrada ou desativada no painel. |
| `409` | A `externalKey` já foi usada nesta API. A mensagem não foi reenviada. |

## Listar templates

`GET https://app.clixx.com.br/api-service/external/{apiId}/templates`

Lista os templates da conta do WhatsApp na Meta, com status, categoria e os textos de cada parte.

### Parâmetros

| Nome | Onde | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- | --- |
| `canalId` | Query | integer | Não | ID de outro número da API Oficial da empresa. Vazio = número da própria API. |

### Exemplo

```bash
curl -X GET "https://app.clixx.com.br/api-service/external/SEU_API_ID/templates" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Resposta (200)

```json
{
  "success": true,
  "templates": [
    {
      "name": "confirmacao_pedido",
      "language": "pt_BR",
      "status": "APPROVED",
      "category": "UTILITY",
      "bodyVariables": 2,
      "hasDocumentHeader": false,
      "hasCopyCodeButton": false,
      "header": "",
      "body": "Olá {{1}}, seu pedido {{2}} foi confirmado.",
      "footer": "",
      "buttons": [
        "Acompanhar pedido"
      ]
    }
  ]
}
```

### Erros

| Código | Descrição |
| --- | --- |
| `400` | A API não é do canal API Oficial, ou o número não tem o ID da conta do WhatsApp (WABA) configurado. |
| `401` | Token ausente ou inválido. |
| `403` | Assinatura da empresa inativa. A integração volta a funcionar sozinha quando a assinatura é reativada. |
| `404` | API não encontrada ou desativada no painel. |
| `502` | A Meta não respondeu à listagem de templates. |
