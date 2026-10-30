# n8n

Para criar inscrições a partir de um workflow no n8n, use estes nós:

1. **HTTP Request**: busca os anúncios em `GET /anuncios`.
2. **Switch**: verifica se há anúncios disponíveis.
3. **HTTP Request**: cria a inscrição em `POST /inscricao`.

Em cada nó **HTTP Request**, adicione o header:

```
Authorization: Bearer SEU_TOKEN
```
