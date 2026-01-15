# Régua Máxima

## Rotas (refresh sem 404)

Os apps web (`Client`, `Barber`, `Admin`) usam **HashRouter** (`/#/rota`) para evitar erro **404 Not Found** ao dar refresh (F5) em rotas internas quando o build é hospedado como site estático sem regra de rewrite.

Exemplos:

- Home: `/#/`
- Agendar (Client): `/#/agendar`
- Admin Dashboard: `/#/admin/dashboard`