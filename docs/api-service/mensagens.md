# Mensagens

Envio de texto, arquivo, áudio e localização pelo canal da API. Cada envio abre o ticket do contato em Atendimentos, ou reutiliza o que já existe, e a mensagem aparece no chat como enviada.

## Enviar texto

`POST https://app.clixx.com.br/api-service/external/{apiId}`

Envia uma mensagem de texto. Na API Oficial, só funciona com a janela de 24 horas do contato aberta; fora dela, use [Enviar template](templates.md). A mesma rota também envia arquivos, veja abaixo.

### Corpo da requisição

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `body` | string | Sim | Texto da mensagem. |
| `number` | string | Sim | Número do destinatário com DDD. Sem código de país, vale o Brasil (55); para outro país, comece com `+`. |
| `externalKey` | string | Não | Chave sua, única por mensagem. Se a mesma chave chegar de novo, nada é reenviado e a resposta é `409`. Sem chave, toda chamada envia. |
| `isClosed` | boolean | Não | Aba em que o ticket fica em Atendimentos: `false` = Abertos, `"pending"` = Pendentes, `true` = Fechados. Padrão: `false`. |
| `filaId` | integer | Não | ID da fila de atendimento. Fila inexistente ou inativa é ignorada. |
| `userId` | integer | Não | ID do usuário responsável pelo ticket. Usuário inexistente, inativo ou de outra empresa é ignorado. |

### Exemplo

```bash
curl -X POST "https://app.clixx.com.br/api-service/external/SEU_API_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "body": "Seu pedido saiu para entrega.",
    "number": "5511999999999"
  }'
```

**Com chave contra envio duplicado, ticket na aba Pendentes e na fila 3**

```bash
curl -X POST "https://app.clixx.com.br/api-service/external/SEU_API_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "body": "Seu pedido saiu para entrega.",
    "number": "5511999999999",
    "externalKey": "pedido-1234-saiu",
    "isClosed": "pending",
    "filaId": 3
  }'
```

### Enviar arquivo nesta mesma rota (form-data)

Se a requisição vier em `multipart/form-data` com um arquivo no campo `media`, a rota envia o arquivo em vez de texto. O tipo (imagem, vídeo, áudio ou documento) é definido pelo tipo do arquivo.

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `media` | file | Sim | Arquivo a enviar. |
| `number` | string | Sim | Número do destinatário com DDD. Sem código de país, vale o Brasil (55); para outro país, comece com `+`. |
| `body` | string | Não | Legenda do arquivo. |
| `externalKey` | string | Não | Chave sua, única por mensagem. Se a mesma chave chegar de novo, nada é reenviado e a resposta é `409`. Sem chave, toda chamada envia. |
| `isClosed` | boolean | Não | Aba em que o ticket fica em Atendimentos: `false` = Abertos, `"pending"` = Pendentes, `true` = Fechados. Padrão: `false`. |
| `filaId` | integer | Não | ID da fila de atendimento. Fila inexistente ou inativa é ignorada. |
| `userId` | integer | Não | ID do usuário responsável pelo ticket. Usuário inexistente, inativo ou de outra empresa é ignorado. |

```bash
curl -X POST "https://app.clixx.com.br/api-service/external/SEU_API_ID" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -F "media=@/caminho/comprovante.pdf" \
  -F "number=5511999999999" \
  -F "body=Segue o comprovante."
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
| `400` | Campo obrigatório faltando, número inválido, tipo de mensagem que o canal da API não aceita, janela de 24 horas fechada (API Oficial) ou falha no envio. O motivo vem em `error`. |
| `401` | Token ausente ou inválido. |
| `403` | Assinatura da empresa inativa. A integração volta a funcionar sozinha quando a assinatura é reativada. |
| `404` | API não encontrada ou desativada no painel. |
| `409` | A `externalKey` já foi usada nesta API. A mensagem não foi reenviada. |

## Enviar texto pela URL

`GET https://app.clixx.com.br/api-service/external/{apiId}/params`

Mesmo envio de [Enviar texto](#enviar-texto), com tudo na URL. Serve para ferramentas que só fazem chamadas GET. Aqui o token também pode ir no parâmetro `token`, no lugar do header. Lembre de codificar o texto na URL (espaço vira `%20`).

### Parâmetros

| Nome | Onde | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- | --- |
| `body` | Query | string | Sim | Texto da mensagem. |
| `number` | Query | string | Sim | Número do destinatário com DDD. |
| `externalKey` | Query | string | Não | Chave única da mensagem. Veja `externalKey` em [Enviar texto](#enviar-texto). |
| `isClosed` | Query | string | Não | Aba do ticket: `false` = Abertos, `pending` = Pendentes, `true` = Fechados. |
| `filaId` | Query | integer | Não | ID da fila de atendimento. |
| `userId` | Query | integer | Não | ID do usuário responsável. |
| `token` | Query | string | Não | Token da API. Substitui o header `Authorization`. |

### Exemplo

```bash
curl -X GET "https://app.clixx.com.br/api-service/external/SEU_API_ID/params?body=Seu%20pedido%20saiu%20para%20entrega.&number=5511999999999" \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Com o token na URL, sem header**

```bash
curl -X GET "https://app.clixx.com.br/api-service/external/SEU_API_ID/params?number=5511999999999&body=Seu%20pedido%20saiu%20para%20entrega.&token=SEU_TOKEN"
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
| `400` | Campo obrigatório faltando, número inválido, tipo de mensagem que o canal da API não aceita, janela de 24 horas fechada (API Oficial) ou falha no envio. O motivo vem em `error`. |
| `401` | Token ausente ou inválido. |
| `403` | Assinatura da empresa inativa. A integração volta a funcionar sozinha quando a assinatura é reativada. |
| `404` | API não encontrada ou desativada no painel. |
| `409` | A `externalKey` já foi usada nesta API. A mensagem não foi reenviada. |

## Enviar arquivo por URL

`POST https://app.clixx.com.br/api-service/external/{apiId}/url`

Baixa o arquivo de uma URL pública e envia. O tipo vem do `Content-Type` que o servidor do arquivo informa: `image/*` vira imagem, `video/*` vira vídeo, `audio/*` vira áudio e o resto vai como documento. Limite de 64 MB.

### Corpo da requisição

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `mediaUrl` | string | Sim | URL pública do arquivo (http ou https). |
| `number` | string | Sim | Número do destinatário com DDD. Sem código de país, vale o Brasil (55); para outro país, comece com `+`. |
| `body` | string | Não | Legenda do arquivo. |
| `externalKey` | string | Não | Chave sua, única por mensagem. Se a mesma chave chegar de novo, nada é reenviado e a resposta é `409`. Sem chave, toda chamada envia. |
| `isClosed` | boolean | Não | Aba em que o ticket fica em Atendimentos: `false` = Abertos, `"pending"` = Pendentes, `true` = Fechados. Padrão: `false`. |
| `filaId` | integer | Não | ID da fila de atendimento. Fila inexistente ou inativa é ignorada. |
| `userId` | integer | Não | ID do usuário responsável pelo ticket. Usuário inexistente, inativo ou de outra empresa é ignorado. |

### Exemplo

```bash
curl -X POST "https://app.clixx.com.br/api-service/external/SEU_API_ID/url" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "mediaUrl": "https://exemplo.com/catalogo.pdf",
    "number": "5511999999999",
    "body": "Segue o catálogo."
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
| `400` | Campo obrigatório faltando, número inválido, tipo de mensagem que o canal da API não aceita, janela de 24 horas fechada (API Oficial) ou falha no envio. O motivo vem em `error`. |
| `401` | Token ausente ou inválido. |
| `403` | Assinatura da empresa inativa. A integração volta a funcionar sozinha quando a assinatura é reativada. |
| `404` | API não encontrada ou desativada no painel. |
| `409` | A `externalKey` já foi usada nesta API. A mensagem não foi reenviada. |

## Enviar áudio

`POST https://app.clixx.com.br/api-service/external/{apiId}/voice`

Baixa um áudio de uma URL pública e envia como mensagem de voz. Use `.ogg` (Opus) ou `.mp3`. Limite de 64 MB.

### Corpo da requisição

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `audio` | string | Sim | URL pública do áudio (http ou https). |
| `number` | string | Sim | Número do destinatário com DDD. Sem código de país, vale o Brasil (55); para outro país, comece com `+`. |
| `externalKey` | string | Não | Chave sua, única por mensagem. Se a mesma chave chegar de novo, nada é reenviado e a resposta é `409`. Sem chave, toda chamada envia. |
| `isClosed` | boolean | Não | Aba em que o ticket fica em Atendimentos: `false` = Abertos, `"pending"` = Pendentes, `true` = Fechados. Padrão: `false`. |
| `filaId` | integer | Não | ID da fila de atendimento. Fila inexistente ou inativa é ignorada. |
| `userId` | integer | Não | ID do usuário responsável pelo ticket. Usuário inexistente, inativo ou de outra empresa é ignorado. |

### Exemplo

```bash
curl -X POST "https://app.clixx.com.br/api-service/external/SEU_API_ID/voice" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "audio": "https://exemplo.com/recado.ogg",
    "number": "5511999999999"
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
| `400` | Campo obrigatório faltando, número inválido, tipo de mensagem que o canal da API não aceita, janela de 24 horas fechada (API Oficial) ou falha no envio. O motivo vem em `error`. |
| `401` | Token ausente ou inválido. |
| `403` | Assinatura da empresa inativa. A integração volta a funcionar sozinha quando a assinatura é reativada. |
| `404` | API não encontrada ou desativada no painel. |
| `409` | A `externalKey` já foi usada nesta API. A mensagem não foi reenviada. |

## Enviar arquivo em Base64

`POST https://app.clixx.com.br/api-service/external/{apiId}/base64`

Envia um arquivo codificado em Base64. O `mimeType` define se ele vai como imagem, vídeo, áudio ou documento. Limite de 64 MB depois de decodificado.

### Corpo da requisição

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `base64Data` | string | Sim | Conteúdo do arquivo em Base64. Também aceita data URI (`data:image/png;base64,...`). |
| `number` | string | Sim | Número do destinatário com DDD. Sem código de país, vale o Brasil (55); para outro país, comece com `+`. |
| `mimeType` | string | Sim | Tipo do arquivo. |
| `fileName` | string | Não | Nome do arquivo exibido no WhatsApp. |
| `body` | string | Não | Legenda do arquivo. |
| `externalKey` | string | Não | Chave sua, única por mensagem. Se a mesma chave chegar de novo, nada é reenviado e a resposta é `409`. Sem chave, toda chamada envia. |
| `isClosed` | boolean | Não | Aba em que o ticket fica em Atendimentos: `false` = Abertos, `"pending"` = Pendentes, `true` = Fechados. Padrão: `false`. |
| `filaId` | integer | Não | ID da fila de atendimento. Fila inexistente ou inativa é ignorada. |
| `userId` | integer | Não | ID do usuário responsável pelo ticket. Usuário inexistente, inativo ou de outra empresa é ignorado. |

### Exemplo

```bash
curl -X POST "https://app.clixx.com.br/api-service/external/SEU_API_ID/base64" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "base64Data": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
    "number": "5511999999999",
    "mimeType": "image/png",
    "fileName": "etiqueta.png"
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
| `400` | Campo obrigatório faltando, número inválido, tipo de mensagem que o canal da API não aceita, janela de 24 horas fechada (API Oficial) ou falha no envio. O motivo vem em `error`. |
| `401` | Token ausente ou inválido. |
| `403` | Assinatura da empresa inativa. A integração volta a funcionar sozinha quando a assinatura é reativada. |
| `404` | API não encontrada ou desativada no painel. |
| `409` | A `externalKey` já foi usada nesta API. A mensagem não foi reenviada. |

## Enviar localização

`POST https://app.clixx.com.br/api-service/external/{apiId}/location`

Envia um pin no mapa. Funciona em APIs da API Oficial e da UazapiGO; nas da Evolution responde `400`. Na API Oficial vale a janela de 24 horas, como no texto.

### Corpo da requisição

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `number` | string | Sim | Número do destinatário com DDD. Sem código de país, vale o Brasil (55); para outro país, comece com `+`. |
| `latitude` | number | Sim | Latitude em graus decimais. Aceita ponto ou vírgula. De -90 a 90. |
| `longitude` | number | Sim | Longitude em graus decimais. Aceita ponto ou vírgula. De -180 a 180. |
| `name` | string | Não | Nome do local, exibido acima do mapa. |
| `address` | string | Não | Endereço do local, exibido abaixo do nome. |
| `externalKey` | string | Não | Chave sua, única por mensagem. Se a mesma chave chegar de novo, nada é reenviado e a resposta é `409`. Sem chave, toda chamada envia. |
| `isClosed` | boolean | Não | Aba em que o ticket fica em Atendimentos: `false` = Abertos, `"pending"` = Pendentes, `true` = Fechados. Padrão: `false`. |
| `filaId` | integer | Não | ID da fila de atendimento. Fila inexistente ou inativa é ignorada. |
| `userId` | integer | Não | ID do usuário responsável pelo ticket. Usuário inexistente, inativo ou de outra empresa é ignorado. |

### Exemplo

```bash
curl -X POST "https://app.clixx.com.br/api-service/external/SEU_API_ID/location" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "number": "5511999999999",
    "latitude": -23.5613,
    "longitude": -46.6565,
    "name": "Loja Paulista",
    "address": "Av. Paulista, 1000 - São Paulo/SP"
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
| `400` | Campo obrigatório faltando, número inválido, tipo de mensagem que o canal da API não aceita, janela de 24 horas fechada (API Oficial) ou falha no envio. O motivo vem em `error`. |
| `401` | Token ausente ou inválido. |
| `403` | Assinatura da empresa inativa. A integração volta a funcionar sozinha quando a assinatura é reativada. |
| `404` | API não encontrada ou desativada no painel. |
| `409` | A `externalKey` já foi usada nesta API. A mensagem não foi reenviada. |
