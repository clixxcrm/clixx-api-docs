# Inscrição pelo Messenger

Os endpoints de Messenger guardam o estado do lead durante uma inscrição pelo Facebook Messenger. Com eles, o n8n consegue montar um mini-formulário dentro do chat.

## Fluxo

1. O usuário clica em "Fazer inscrição": salve o estado com `step` igual a `nome`.
2. O usuário envia o nome: salve com `step` igual a `celular`.
3. O usuário envia o celular: salve com `step` igual a `confirmacao`.
4. O usuário confirma: chame `POST /inscricao` e remova o estado com `DELETE /messenger/state/{psid}`.

Para retomar a conversa, consulte o estado em `GET /messenger/state/{psid}`. Se não houver estado salvo, a resposta é `404` com `"message": "state_not_found"`.
