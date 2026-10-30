# Formulários

Formulários de captação ativos e links de WhatsApp. As rotas antigas `/anuncios` e `/anuncios/{hash}` continuam funcionando com a mesma resposta. Os campos mantêm o nome `anuncios`, `anuncio_id` e `anuncio_hash`.

## Listar formulários

`GET https://app.clixx.com.br/api/form`

Retorna os formulários ativos da empresa.

### Exemplo

```bash
curl -X GET "https://app.clixx.com.br/api/form" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Resposta (200)

```json
{
  "success": true,
  "total": 1,
  "anuncios": [
    {
      "id": 5,
      "titulo": "Curso de Marketing",
      "hash": "abc123",
      "cidade": "São Paulo",
      "estado": "SP",
      "subtitulo": null,
      "local": null,
      "endereco": null,
      "data_inicial": "2026-02-01",
      "data_final": "2026-02-03",
      "periodo": "01/02/2026 a 03/02/2026",
      "imagem": null,
      "link_inscricao": "https://app.clixx.com.br/inscricao/abc123",
      "webhook_url": null,
      "pipeline_id": null,
      "etapa_inicial_id": null,
      "campos_personalizados": [
        {}
      ]
    }
  ]
}
```

### Erros

| Código | Descrição |
| --- | --- |
| `401` | Token ausente ou inválido. |
| `403` | Assinatura bloqueada. Nos relatórios de metas e negócios, também indica Modo Negócios desativado, com `reason` igual a `modo_negocios_inativo`. |

## Detalhar formulário

`GET https://app.clixx.com.br/api/form/{hash}`

Retorna os detalhes de um formulário, com seus campos extras.

### Parâmetros

| Nome | Onde | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- | --- |
| `hash` | URL | string | Sim | Hash do formulário. |

### Exemplo

```bash
curl -X GET "https://app.clixx.com.br/api/form/abc123" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Resposta (200)

```json
{
  "success": true,
  "anuncio": {
    "id": 5,
    "titulo": "Curso de Marketing",
    "hash": "abc123",
    "cidade": "São Paulo",
    "estado": "SP",
    "subtitulo": null,
    "descricao": null,
    "mais_informacoes": null,
    "local": null,
    "endereco": null,
    "data_inicial": "2026-02-01",
    "data_final": "2026-02-03",
    "periodo": "01/02/2026 a 03/02/2026",
    "imagem": null,
    "link_inscricao": "https://app.clixx.com.br/inscricao/abc123",
    "campos_extras": [
      {}
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

## Gerar link de WhatsApp

`GET https://app.clixx.com.br/api/whatsapp/link/{hash}`

Retorna o link de inscrição e o link de WhatsApp de um formulário. O campo `whatsapp` vem nulo quando não há número configurado.

### Parâmetros

| Nome | Onde | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- | --- |
| `hash` | URL | string | Sim | Hash do formulário. |

### Exemplo

```bash
curl -X GET "https://app.clixx.com.br/api/whatsapp/link/abc123" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Resposta (200)

```json
{
  "success": true,
  "anuncio": {
    "titulo": "Curso de Marketing",
    "cidade": "São Paulo",
    "estado": "SP"
  },
  "links": {
    "formulario": "https://app.clixx.com.br/inscricao/abc123",
    "whatsapp": "https://wa.me/5511999999999?text=...",
    "whatsapp_message": "Olá! Quero me inscrever."
  }
}
```

### Erros

| Código | Descrição |
| --- | --- |
| `401` | Token ausente ou inválido. |
| `403` | Assinatura bloqueada. Nos relatórios de metas e negócios, também indica Modo Negócios desativado, com `reason` igual a `modo_negocios_inativo`. |
| `404` | Registro não encontrado. |
