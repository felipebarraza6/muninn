# Muninn

## Qué es

Muninn es el cliente de agentes de IA de Ginnung: catálogo, estudio, chat, canales, flujos y la operación comercial de la sucursal. Se compila a un sitio estático y consume la API Yggdra (agentes, workflows, cuentas y sucursales).

## A quién sirve

Equipos que diseñan y operan agentes (estudio y canales) y las organizaciones que los publican en sus dominios. Staging en GitHub Pages (`https://<owner>.github.io/muninn/`). Producción por FTP, según el workflow: agents.agenciapatagoniachile.com, void.smarthydro.app y muninn.yggdra.cl.

## Stack

React 19, TypeScript, Vite 7, Tailwind CSS 4, Radix, TanStack Query, React Router, Axios. El gestor del repo es Bun 1.3.14 (`.bun-version` y `bun.lockb`). El CI usa la acción `.github/actions/setup-bun`.

## Cómo correr en local

```bash
bun install
cp .env.example .env.local
bun run dev
```

El servidor queda en http://localhost:3001. En desarrollo el proxy de Vite manda `/api` a `http://localhost:8000` (se cambia con `VITE_DEV_API_PROXY`). Hace falta la API Ginnung para datos reales.


## Variables de entorno

Solo nombres. Copia el ejemplo a un archivo local y completa los valores ahí. No los commitees ni los pegues en un issue.

Nombres que declara `.env.example` y el código. Los comentarios del ejemplo explican el modo. Acá no van valores.

| Nombre | Uso |
|--------|-----|
| `VITE_API_URL` | API del build de preview o producción. Obligatoria en el build de producción |
| `VITE_APP_ENV` | `staging` muestra el indicador. El CD de Pages lo inyecta |
| `VITE_WIDGET_BASE_URL` | Base del widget embebido |
| `VITE_REALTIME_URL` | WebSocket del estudio. Vacío deja solo polling |
| `VITE_DEV_API_PROXY` | Target del proxy de Vite en local |
| `VITE_AUTH_MODE` | `token` (default, token en localStorage) o `cookie` (HttpOnly + CSRF) |
| `VITE_COMMERCIAL_API` | Vacío usa la API real. `mock` muestra cifras de ejemplo y no abre Flow |
| `VITE_AGENT_CATALOG_MOCK` | Plantillas locales si la API aún no responde. Solo desarrollo |
| `VITE_MUNINN_HOSTS` | Hosts extra que deben verse como Muninn |
| `VITE_PWA_NAME` | Nombre PWA del build |
| `VITE_PWA_THEME_COLOR` | Color de tema PWA |
| `VITE_BASE_PATH` | Prefijo del build. Pages usa `/muninn/` |

En Actions, la variable de repositorio `VITE_API_URL_STAGING` alimenta el build de Pages. Los secretos de FTP y la URL del tenant Void están nombrados en el workflow: `FTP_HOST_AGENCIA`, `FTP_USER_AGENCIA`, `FTP_PASS_AGENCIA`, `FTP_HOST_VOID`, `FTP_USER_VOID`, `FTP_PASS_VOID`, `VITE_API_URL_VOID`, `FTP_HOST_MUNINN`, `FTP_USER_MUNINN`, `FTP_PASS_MUNINN`.

El propio workflow documenta dos bases fijas de API para los builds de Agencia Patagonia y de muninn.yggdra.cl. El inventario de consumidores advierte que `api.agenciapatagoniachile.com` no está verificado como la misma instancia que `yggdra_infra`.


## Scripts

| Comando | Qué hace |
|---------|----------|
| `bun run dev` | Vite |
| `bun run build` | Build de producción y copia `dist/404.html` |
| `bun run build:dev` | Build en mode development |
| `bun run preview` | Previsualiza `dist/` |
| `bun run lint` | ESLint |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run test` | Vitest |
| `bun run test:watch` | Vitest en watch |
| `bun run format` | Prettier |
| `bun run generate:api-types` | Baja OpenAPI de la API local y regenera `src/api/generated/schema.ts` |


## Deploy (como está hoy)

Todo el deploy está en `.github/workflows/ci.yml`.

| Evento | Qué corre | Destino |
|--------|-----------|---------|
| PR o push a `main` y `production`, y tags `v*` | Job `validate`: lint, typecheck, tests, build | — |
| Push a `main` | `deploy-staging` | GitHub Pages, environment `staging` |
| Push a `production` o tag `v*` | tres jobs FTP | Agencia, Void y muninn.yggdra.cl, environment `production` |

Pages tiene que estar en Source = GitHub Actions. Un fallo del workflow `CI` en `main` o `production` abre o actualiza un issue (`ci-status-issues.yml`) y lo cierra cuando vuelve a verde.

`docs/CONSUMERS.yaml` registra deploy `github-pages` desde `main`. Los FTP de producción están en el workflow y no en ese YAML.


Este PR de documentación no cambia workflows, secretos ni el destino del deploy.

## Relación con la API Ginnung

Auth por token o por cookie, según `VITE_AUTH_MODE`. Sucursal con `X-Branch-ID` en el cliente (`useActiveBranchId`).

Módulos del inventario: accounts, branches, ai-agents, workflows, scheduling, analytics, unified-config.

`bun run generate:api-types` hace `curl` a `$VITE_DEV_API_PROXY/api/schema/` (default `http://localhost:8000`) y corre `openapi-typescript`. No usa el freeze del VPS ni el sha de `/api/schema/contract/`. No hay `contract.yml` que llame al chequeo reutilizable. El estilo en el inventario es `openapi-typescript`.

Id de consumidor y etiqueta de issues de backend: `front:muninn`.


El chequeo reutilizable está en [docs/CONTRACT_CHECK.md](https://github.com/felipebarraza6/yggdra_infra/blob/main/docs/CONTRACT_CHECK.md) y en `.github/workflows/contract-check.yml` de `yggdra_infra`. Corre en el runner del VPS, compara el `schema_sha256` de `https://api.yggdra.cl/api/schema/contract/` con el sha commiteado en el front, regenera tipos desde el freeze de `api/schema/openapi.yaml` y exige `tsc --noEmit`.

En la rama por defecto de este repo **no hay** un workflow `contract.yml` que llame ese chequeo. El inventario `docs/CONSUMERS.yaml` del backend describe el estilo de consumo de cada app.

## Enlaces

- Arquitectura: [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md)
- Ejemplo de entorno: [.env.example](.env.example)
- API Ginnung: https://github.com/felipebarraza6/yggdra_infra
- Chequeo de contrato: https://github.com/felipebarraza6/yggdra_infra/blob/main/docs/CONTRACT_CHECK.md
- Auditoría del motor de agentes (en el backend): https://github.com/felipebarraza6/yggdra_infra/blob/main/docs/muninn-agent-engine-audit.md
