# API-Service (WhatsApp)

A API-Service envia mensagens de WhatsApp por um número conectado ao Clixx. Use para avisos que nascem em outro sistema: pedido saiu para entrega, boleto, lembrete de agendamento, código de acesso.

Ela é separada da [API do CRM](../README.md). Tem URL e token próprios, e cada API fica ligada a um número.

## Antes de começar

1. No Clixx, abra **Configurações > API-Service** e clique em **Nova API**.
2. Dê um nome e escolha o canal, ou seja, o número que vai enviar. O canal não muda depois de criado; para outro número, crie outra API.
3. Copie o token. Ele aparece uma vez só. Se perder, use **Gerar novo token** no card da API. O token anterior para de funcionar na hora.
4. Copie a **URL de integração** do card. Ela termina com o ID da API:

```
https://app.clixx.com.br/api-service/external/SEU_API_ID
```

## Primeira mensagem

```bash
curl -X POST "https://app.clixx.com.br/api-service/external/SEU_API_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "number": "5511999999999",
    "body": "Olá! Esta é a primeira mensagem pela API."
  }'
```

A resposta traz o ID da mensagem no WhatsApp e o ID do ticket:

```json
{
  "success": true,
  "messageId": "wamid.HBgNNTUxMTk5OTk5OTk5ORUCABEYEjQ1Q0E4",
  "conversaId": 1520
}
```

As rotas estão em [Mensagens](mensagens.md), [Templates](templates.md) e [Status da mensagem](status.md).

## Autenticação

Envie o token no header `Authorization`. Ele começa com `clx_`:

```
Authorization: Bearer SEU_TOKEN
```

Só em [Enviar texto pela URL](mensagens.md#enviar-texto-pela-url) o token também pode ir na URL, no parâmetro `token`.

{% hint style="warning" %}
Quem tem o token envia mensagens pelo número da sua empresa. Guarde-o no servidor e não o coloque em código de navegador, aplicativo ou repositório público.
{% endhint %}

Para pausar uma integração sem apagar nada, desligue **API ativa** no card. Enquanto estiver desligada, as chamadas respondem `404`.

## O que cada canal envia

| Envio | API Oficial | UazapiGO | Evolution |
| --- | --- | --- | --- |
| Texto, arquivo e áudio | Sim | Sim | Sim |
| Localização | Sim | Sim | Não |
| Template | Sim | Não | Não |

Na API Oficial, texto, arquivo, áudio e localização só saem com a **janela de 24 horas** aberta, ou seja, se o contato mandou mensagem nas últimas 24 horas. Fora dela, a resposta é `400` com `Janela de 24h expirada`. Para falar com quem não escreveu, envie um [template](templates.md).

## Número do destinatário

- Só os dígitos contam: `(11) 99999-9999` e `11999999999` dão no mesmo.
- Número sem código de país (10 ou 11 dígitos) recebe o 55 do Brasil.
- Para outro país, comece com `+`, como em `+351912345678`.

## Ticket em Atendimentos

Cada envio abre o ticket do contato no canal da API, ou usa o que já existe, e a mensagem aparece no chat como enviada. Quando o contato responder, a conversa continua ali.

Por padrão o ticket vai para a aba **Abertos**. Para mudar, use estes campos, que valem em todas as rotas de envio:

| Campo | Efeito |
| --- | --- |
| `isClosed` | `false` = Abertos (padrão), `"pending"` = Pendentes, `true` = Fechados |
| `filaId` | Coloca o ticket na fila de atendimento informada |
| `userId` | Define o usuário responsável pelo ticket |

Fila ou usuário que não existe, está inativo ou é de outra empresa é ignorado, sem erro.

{% hint style="info" %}
Se o número da API Oficial estiver **desativado** no Clixx, porque a empresa usa esse número só para a API, texto, localização e template saem direto pela Meta, sem abrir ticket. A resposta vem com `"ticketCriado": false` e sem `conversaId`.
{% endhint %}

## Evitar envio duplicado

Se a sua integração repete chamadas quando dá erro de rede, mande uma `externalKey` única por mensagem, como o ID do pedido junto com o tipo do aviso. Se a mesma chave chegar de novo na mesma API, nada é reenviado e a resposta é `409`, com os dados do primeiro envio:

```json
{
  "success": false,
  "duplicated": true,
  "code": "EXTERNAL_KEY_DUPLICADA",
  "error": "externalKey \"pedido-1234-saiu\" ja' foi utilizada em 2026-11-09 10:15:00; mensagem NAO reenviada. Use uma externalKey unica por mensagem.",
  "messageId": "wamid.HBgNNTUxMTk5OTk5OTk5ORUCABEYEjQ1Q0E4",
  "conversaId": 1520,
  "sentAt": "2026-11-09 10:15:00"
}
```

Sem `externalKey`, toda chamada envia.

## Confirmar a entrega

`success: true` quer dizer que o WhatsApp aceitou a mensagem, não que ela chegou. A Meta ainda pode recusar a entrega depois, por exemplo para número sem WhatsApp. Guarde o `messageId` e consulte [Status da mensagem](status.md) alguns segundos depois: o `status` passa por `sent`, `delivered` e `read`, ou fica `failed`, com o motivo em `error`.

No Clixx, o botão **Logs de envio** do card mostra os envios dos últimos 30 dias: o que foi pedido, o que a API respondeu e o status de entrega.

## Erros

O motivo vem sempre em `error`. Trate pelo código HTTP, porque o texto é para leitura e pode mudar.

| Código | Quando acontece | Exemplo de `error` |
| --- | --- | --- |
| `400` | Campo obrigatório faltando, número inválido, envio que o canal não aceita, janela de 24 horas fechada ou recusa no envio | `Campos obrigatorios: body, number` |
| `401` | Token ausente, errado ou substituído por um novo | `Token invalido.` |
| `403` | Assinatura da empresa inativa. Volta sozinha quando a assinatura é reativada; o motivo vem em `reason` | `Assinatura inativa. Integracao suspensa.` |
| `404` | ID da API errado, API apagada ou desligada | `API nao encontrada ou inativa.` |
| `409` | `externalKey` repetida | Veja [Evitar envio duplicado](#evitar-envio-duplicado) |
| `502` | A Meta não respondeu à [listagem de templates](templates.md#listar-templates) | `Falha ao listar templates.` |
