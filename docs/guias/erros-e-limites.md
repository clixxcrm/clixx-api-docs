# Erros e limites

## Códigos de resposta

| Código | Significado |
| --- | --- |
| `200` | Sucesso |
| `201` | Inscrição criada |
| `400` | JSON inválido ou sem dados para atualizar |
| `401` | Token ausente ou inválido |
| `403` | Assinatura bloqueada ou Modo Negócios desativado |
| `404` | Registro não encontrado |
| `409` | Lead já inscrito no formulário |
| `422` | Dados ou filtros inválidos |
| `500` | Erro interno |

## Formato dos erros

A maioria dos erros traz uma mensagem em `error`:

```json
{
  "success": false,
  "error": "Pipeline não encontrado."
}
```

Nos erros de validação de inscrições e negócios, `errors` traz um item para cada campo:

```json
{
  "success": false,
  "errors": {
    "titulo": "Título é obrigatório."
  }
}
```

## Limite de requisições

Os endpoints `/v1/`, `/form` e `/inscricoes` aceitam até 60 requisições por minuto por IP. Acima disso, a resposta pode ser um bloqueio em vez de JSON, então espere um pouco antes de tentar de novo.

## CORS

A API aceita requisições de qualquer origem (`Access-Control-Allow-Origin: *`). Mesmo assim, não use o token em código de navegador.

## PUT bloqueado

Se o seu cliente HTTP não permitir `PUT`, use `POST` na mesma URL. Isso vale para `/webhook/leads/{id}`, `/inscricoes/{id}` e `/v1/negocios/{id}`.

## Valores em texto

Em negócios e propostas, os valores monetários vêm como texto, por exemplo `"1500.00"`. Converta para número antes de fazer contas. Nos relatórios, eles vêm como número.
