# Relatórios

Dados das telas de relatórios do painel, somente para leitura.

## Relatório de origens

`GET https://app.clixx.com.br/api/v1/relatorios/origens`

Mostra de onde os leads vieram no período: totais, por origem, por anúncio Meta e por campanha UTM.

As listas por anúncio e por campanha trazem no máximo 50 itens, os de maior volume.

### Parâmetros

| Nome | Onde | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- | --- |
| `periodo` | Query | string | Não | Valores: `hoje`, `7d`, `30d`, `90d`. Padrão: `30d`. |
| `data_inicial` | Query | date | Não | Envie junto com `data_final`. Substitui o período. |
| `data_final` | Query | date | Não | Envie junto com `data_inicial`. |

### Exemplo

```bash
curl -X GET "https://app.clixx.com.br/api/v1/relatorios/origens" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Resposta (200)

```json
{
  "success": true,
  "periodo": {
    "inicio": "2026-08-01 00:00:00",
    "fim": "2026-10-30 23:59:59"
  },
  "resumo": {
    "total_leads": 120,
    "com_origem_canal": 45,
    "com_referral_meta": 30,
    "com_utm_campaign": 18,
    "anuncios_unicos": 4,
    "ctwa_pendentes": 2
  },
  "por_origem": [
    {
      "origem": "facebook",
      "label": "Facebook",
      "total": 45
    }
  ],
  "por_anuncio": [
    {
      "anuncio_id": "6012345678901",
      "titulo": "Fale com a gente",
      "texto": null,
      "link": null,
      "thumbnail_url": null,
      "total": 12
    }
  ],
  "por_campanha": [
    {
      "utm_campaign": "black-friday",
      "utm_medium": "cpc",
      "total": 18
    }
  ]
}
```

### Erros

| Código | Descrição |
| --- | --- |
| `401` | Token ausente ou inválido. |
| `403` | Assinatura bloqueada. Nos relatórios de metas e negócios, também indica Modo Negócios desativado, com `reason` igual a `modo_negocios_inativo`. |
| `422` | Requisição inválida. |

## Relatório de metas

`GET https://app.clixx.com.br/api/v1/relatorios/metas`

Metas e realizado de cada usuário ativo, mês a mês, com os totais gerais. Exige o Modo Negócios ativo.

O campo `percentual` vem nulo quando não há meta. O realizado soma os negócios ganhos no mês, e vendas de usuários inativos ou sem responsável não entram.

### Parâmetros

| Nome | Onde | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- | --- |
| `ano` | Query | integer | Não | Padrão é o ano atual. De 2000 a 2100. |

### Exemplo

```bash
curl -X GET "https://app.clixx.com.br/api/v1/relatorios/metas" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Resposta (200)

```json
{
  "success": true,
  "ano": 2026,
  "usuarios": [
    {
      "id": 7,
      "nome": "Maria Souza",
      "meses": [
        {
          "mes": 1,
          "meta": 10000,
          "realizado": 8500,
          "percentual": 85
        }
      ],
      "total": {
        "meta": 10000,
        "realizado": 8500,
        "percentual": 85
      }
    }
  ],
  "geral": {
    "meses": [
      {
        "mes": 1,
        "meta": 10000,
        "realizado": 8500,
        "percentual": 85
      }
    ],
    "total": {
      "meta": 10000,
      "realizado": 8500,
      "percentual": 85
    }
  }
}
```

### Erros

| Código | Descrição |
| --- | --- |
| `401` | Token ausente ou inválido. |
| `403` | Assinatura bloqueada. Nos relatórios de metas e negócios, também indica Modo Negócios desativado, com `reason` igual a `modo_negocios_inativo`. |
| `422` | Requisição inválida. |

## Relatório do kanban

`GET https://app.clixx.com.br/api/v1/relatorios/kanban`

Resumo do kanban de um pipeline, com leads e valores por etapa, ganhos, perdidos e taxas de conversão.

### Parâmetros

| Nome | Onde | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- | --- |
| `pipeline_id` | Query | integer | Não | Sem este filtro, usa o pipeline padrão da empresa. |
| `data_inicial` | Query | date | Não | - |
| `data_final` | Query | date | Não | - |
| `responsavel_id` | Query | integer | Não | Filtra por usuário responsável. |

### Exemplo

```bash
curl -X GET "https://app.clixx.com.br/api/v1/relatorios/kanban" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Resposta (200)

```json
{
  "success": true,
  "pipeline": {
    "id": 3,
    "nome": "Pipeline Principal"
  },
  "filtros": {
    "data_inicial": "2026-01-01",
    "data_final": "2026-10-30",
    "responsavel_id": null
  },
  "resumo": {
    "total_leads": 35,
    "total_valor": 51154.67,
    "leads_entrados": 35,
    "leads_ganho": 8,
    "leads_perdido": 4,
    "valor_ganho": 45787.81,
    "valor_perdido": 1138.21,
    "taxa_conversao": 66.7,
    "taxa_conversao_entrada": 22.9,
    "eficiencia_liquida": 11.4
  },
  "etapas": [
    {
      "id": 12,
      "nome": "Negociação",
      "ordem": 3,
      "cor": "#fd7e14",
      "tipo": "normal",
      "is_final": false,
      "total_leads": 9,
      "soma_valor": 4098.52,
      "media_valor": 455.39
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
| `422` | Requisição inválida. |

## Relatório de negócios

`GET https://app.clixx.com.br/api/v1/relatorios/negocios`

Resumo dos negócios de um pipeline por status, etapa, mês, responsável, produto e previsão de fechamento. Exige o Modo Negócios ativo.

### Parâmetros

| Nome | Onde | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- | --- |
| `pipeline_id` | Query | integer | Não | Sem este filtro, usa o pipeline padrão da empresa. |
| `data_inicial` | Query | date | Não | - |
| `data_final` | Query | date | Não | - |
| `responsavel_id` | Query | integer | Não | Filtra por usuário responsável. |

### Exemplo

```bash
curl -X GET "https://app.clixx.com.br/api/v1/relatorios/negocios" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Resposta (200)

```json
{
  "success": true,
  "pipeline": {
    "id": 3,
    "nome": "Pipeline Principal"
  },
  "filtros": {
    "data_inicial": "2026-01-01",
    "data_final": "2026-10-30",
    "responsavel_id": null
  },
  "resumo": {
    "total": 28,
    "qtd_aberto": 15,
    "qtd_ganho": 8,
    "qtd_perdido": 5,
    "valor_aberto": 4098.52,
    "valor_ganho": 45902.24,
    "valor_perdido": 1138.21,
    "ticket_medio_ganho": 6557.46,
    "taxa_conversao": 61.5
  },
  "etapas": [
    {
      "id": 12,
      "nome": "Negociação",
      "ordem": 3,
      "cor": "#fd7e14",
      "tipo": "normal",
      "qtd": 9,
      "valor": 4098.52,
      "qtd_aberto": 9,
      "qtd_ganho": 0,
      "qtd_perdido": 0
    }
  ],
  "por_mes": [
    {
      "mes": "2026-10",
      "ganhos": 3,
      "perdidos": 1,
      "valor_ganho": 9800,
      "valor_perdido": 300
    }
  ],
  "por_responsavel": [
    {
      "id": 7,
      "nome": "Maria Souza",
      "total": 12,
      "ganhos": 5,
      "perdidos": 1,
      "valor_fechado": 30000,
      "taxa_conversao": 83.3
    }
  ],
  "produtos_mais_vendidos": [
    {
      "id": 4,
      "nome": "Plano Premium",
      "vezes": 6,
      "valor_total": 18000
    }
  ],
  "produtos_menos_vendidos": [
    {
      "id": 4,
      "nome": "Plano Premium",
      "vezes": 6,
      "valor_total": 18000
    }
  ],
  "previsao_fechamento": {
    "atrasados": {
      "qtd": 5,
      "valor": 2500
    },
    "meses": [
      {
        "mes": "2026-11",
        "qtd": 5,
        "valor": 2500
      }
    ],
    "sem_previsao": {
      "qtd": 5,
      "valor": 2500
    }
  }
}
```

### Erros

| Código | Descrição |
| --- | --- |
| `401` | Token ausente ou inválido. |
| `403` | Assinatura bloqueada. Nos relatórios de metas e negócios, também indica Modo Negócios desativado, com `reason` igual a `modo_negocios_inativo`. |
| `404` | Registro não encontrado. |
| `422` | Requisição inválida. |
