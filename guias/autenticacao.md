# Autenticação

Todas as chamadas exigem o token de API da sua empresa. Ele é gerado no Clixx, em **Configurações > API**.

## Como enviar o token

Use o header `Authorization`. Esta é a forma recomendada:

```
Authorization: Bearer SEU_TOKEN
```

Se a sua ferramenta não permitir headers, envie o token na URL:

```
?api_token=SEU_TOKEN
```

{% hint style="warning" %}
Mantenha o token em segredo e não o exponha em código público ou em páginas abertas no navegador. Ao gerar um novo token, o anterior deixa de funcionar.
{% endhint %}

## Alcance do token

O token pertence à empresa, não a um usuário. Por isso, as respostas trazem os dados de toda a empresa, sem as restrições que um colaborador tem no painel.

## Assinatura

A API exige assinatura ativa ou período de teste válido. Sem isso, todos os endpoints respondem `403`:

```json
{
  "success": false,
  "error": "Assinatura expirada. Renove para continuar usando a API.",
  "reason": "subscription_expired"
}
```

Valores possíveis de `reason`: `trial_expired`, `subscription_expired`, `expirada`, `cancelada`, `suspensa` e `empresa_inactive`.

Sua integração deve tratar esse retorno e alertar o cliente.
