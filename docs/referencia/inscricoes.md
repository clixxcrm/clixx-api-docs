# Inscrições

Criação e consulta de inscrições.

## Criar inscrição

`POST https://app.clixx.com.br/api/inscricao`

Cria uma inscrição em um anúncio.

Campos personalizados do anúncio são enviados no formato `{id}_{slug}`, por exemplo `5_nome_completo`.

### Corpo da requisição

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `anuncio_hash` | string | Sim | Hash do anúncio. |
| `nome` | string | Sim | Nome completo. |
| `celular` | string | Sim | Celular com no mínimo 10 dígitos. |
| `origem` | string | Não | Origem da inscrição. Padrão `facebook`. |
| `utm_source` | string | Não | - |
| `utm_medium` | string | Não | - |
| `utm_campaign` | string | Não | - |
| `psid` | string | Não | ID do usuário no Messenger. |

### Exemplo

```bash
curl -X POST "https://app.clixx.com.br/api/inscricao" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "anuncio_hash": "abc123",
    "nome": "João da Silva",
    "celular": "11999999999",
    "origem": "messenger"
  }'
```

**Inscrição com campos personalizados**

```bash
curl -X POST "https://app.clixx.com.br/api/inscricao" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "anuncio_hash": "abc123",
    "nome": "João da Silva",
    "celular": "11999999999",
    "origem": "messenger",
    "psid": "1234567890123456",
    "5_email_comercial": "email@exemplo.com",
    "12_cpf": "12345678900"
  }'
```

### Resposta (201)

```json
{
  "success": true,
  "message": "Inscrição realizada com sucesso!",
  "inscricao": {
    "id": 123,
    "lead_id": 456,
    "anuncio": {
      "id": 1,
      "titulo": "Curso de Marketing",
      "cidade": "São Paulo"
    }
  },
  "whatsapp_enviado": false
}
```

### Erros

| Código | Descrição |
| --- | --- |
| `400` | Requisição inválida. |
| `401` | Token ausente ou inválido. |
| `403` | Assinatura bloqueada. Nos relatórios de metas e negócios, também indica Modo Negócios desativado, com `reason` igual a `modo_negocios_inativo`. |
| `404` | Registro não encontrado. |
| `409` | Lead já inscrito neste anúncio. |
| `422` | Um ou mais campos são inválidos. |

## Listar inscrições

`GET https://app.clixx.com.br/api/inscricoes`

Lista inscrições com filtros e paginação. Use `celular` para verificar se um lead já está inscrito.

### Parâmetros

| Nome | Onde | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- | --- |
| `celular` | Query | string | Não | Busca por celular. |
| `anuncio_hash` | Query | string | Não | Filtra pelo hash do anúncio. |
| `anuncio_id` | Query | integer | Não | Filtra pelo ID do anúncio. |
| `status` | Query | string | Não | Valores: `pendente`, `confirmado`, `cancelado`. |
| `busca` | Query | string | Não | Busca por nome ou telefone. |
| `data_inicial` | Query | date | Não | - |
| `data_final` | Query | date | Não | - |
| `page` | Query | integer | Não | Padrão: `1`. |
| `per_page` | Query | integer | Não | Padrão: `20`. De 1 a 100. |

### Exemplo

```bash
curl -X GET "https://app.clixx.com.br/api/inscricoes" \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Verificar se um lead já está inscrito**

```bash
curl -X GET "https://app.clixx.com.br/api/inscricoes?celular=11999999999" \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Listar as inscrições de um anúncio**

```bash
curl -X GET "https://app.clixx.com.br/api/inscricoes?anuncio_hash=abc123" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Resposta (200)

```json
{
  "success": true,
  "total": 1,
  "page": 1,
  "per_page": 20,
  "last_page": 1,
  "inscricoes": [
    {
      "id": 45,
      "lead_id": 123,
      "anuncio_id": 5,
      "origem": "formulario",
      "status": "confirmado",
      "created_at": "2026-02-15 14:30:00",
      "lead": {
        "id": 123,
        "nome": "João da Silva",
        "celular": "11999999999",
        "email": "joao@email.com",
        "cidade": "São Paulo",
        "estado": "SP",
        "status": "ativo",
        "tags": "vip,indicacao",
        "temperatura": "quente"
      },
      "anuncio": {
        "id": 5,
        "titulo": "Curso de Marketing",
        "hash": "abc123",
        "cidade": "São Paulo",
        "estado": "SP"
      }
    }
  ]
}
```

### Erros

| Código | Descrição |
| --- | --- |
| `401` | Token ausente ou inválido. |
| `403` | Assinatura bloqueada. Nos relatórios de metas e negócios, também indica Modo Negócios desativado, com `reason` igual a `modo_negocios_inativo`. |

## Detalhar inscrição

`GET https://app.clixx.com.br/api/inscricoes/{id}`

Retorna a inscrição, o lead, o anúncio e os campos personalizados.

### Parâmetros

| Nome | Onde | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- | --- |
| `id` | URL | integer | Sim | - |

### Exemplo

```bash
curl -X GET "https://app.clixx.com.br/api/inscricoes/123" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Resposta (200)

```json
{
  "success": true,
  "inscricao": {
    "id": 45,
    "lead_id": 123,
    "anuncio_id": 5,
    "origem": "formulario",
    "status": "confirmado",
    "utm_source": null,
    "utm_medium": null,
    "utm_campaign": null,
    "created_at": "2026-02-15 14:30:00",
    "updated_at": "2026-02-15 14:30:00"
  },
  "lead": {
    "id": 123,
    "nome": "João da Silva",
    "celular": "11999999999",
    "email": "joao@email.com",
    "cidade": "São Paulo",
    "estado": "SP",
    "status": "ativo",
    "tags": "vip,indicacao",
    "temperatura": "quente",
    "origem": "formulario",
    "created_at": "2026-02-15 14:30:00"
  },
  "anuncio": {
    "id": 5,
    "titulo": "Curso de Marketing",
    "hash": "abc123",
    "cidade": "São Paulo",
    "estado": "SP"
  },
  "campos_extras": [
    {
      "campo_id": 3,
      "nome": "email_comercial",
      "label": "E-mail Comercial",
      "valor": "joao@empresa.com"
    }
  ]
}
```

### Erros

| Código | Descrição |
| --- | --- |
| `401` | Token ausente ou inválido. |
| `403` | Assinatura bloqueada. Nos relatórios de metas e negócios, também indica Modo Negócios desativado, com `reason` igual a `modo_negocios_inativo`. |
| `404` | Registro não encontrado. |

## Atualizar inscrição

`PUT https://app.clixx.com.br/api/inscricoes/{id}`

Atualiza os dados do lead vinculado e/ou o status da inscrição. `POST` na mesma URL também é aceito.

### Parâmetros

| Nome | Onde | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- | --- |
| `id` | URL | integer | Sim | - |

### Corpo da requisição

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `nome` | string | Não | - |
| `celular` | string | Não | Mínimo de 10 dígitos. |
| `email` | string | Não | - |
| `cidade` | string | Não | - |
| `estado` | string | Não | - |
| `status` | string | Não | Status do lead. Valores: `ativo`, `inativo`. |
| `tags` | string | Não | Tags separadas por vírgula. |
| `temperatura` | string | Não | Valores: `frio`, `morno`, `quente`. |
| `inscricao_status` | string | Não | Status da inscrição. Valores: `pendente`, `confirmado`, `cancelado`. |

### Exemplo

```bash
curl -X PUT "https://app.clixx.com.br/api/inscricoes/123" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{}'
```

### Resposta (200)

```json
{
  "success": true,
  "message": "Inscrição atualizada com sucesso",
  "changes": [
    "nome",
    "inscricao_status"
  ]
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
