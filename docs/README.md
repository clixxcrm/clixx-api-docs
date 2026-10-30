# API do Clixx CRM

A API do Clixx permite integrar o CRM a chatbots, automações e sistemas próprios, usando ferramentas como WhatsApp, n8n e Zapier.

## URL base

```
https://app.clixx.com.br/api
```

Todas as respostas são em JSON.

## O que você pode fazer

| Recurso | Para quê |
| --- | --- |
| [Anúncios](referencia/anuncios.md) | Listar anúncios ativos e gerar links de WhatsApp |
| [Inscrições](referencia/inscricoes.md) | Criar, consultar e atualizar inscrições |
| [Leads](referencia/leads.md) | Consultar leads e movê-los no pipeline |
| [Negócios](referencia/negocios.md) e [propostas](referencia/propostas.md) | Gerenciar oportunidades de cada lead |
| [Messenger](referencia/messenger.md) | Guardar o estado da conversa de um chatbot |
| [Relatórios](referencia/relatorios.md) | Ler origens, metas, kanban e negócios |

## Primeiros passos

1. No Clixx, abra **Configurações > API** e gere seu token.
2. Faça sua primeira chamada:

```bash
curl https://app.clixx.com.br/api/anuncios \
  -H "Authorization: Bearer SEU_TOKEN"
```

Veja também [Autenticação](guias/autenticacao.md) e [Erros e limites](guias/erros-e-limites.md).
