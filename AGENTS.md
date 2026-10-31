# Muninn — Frontend Agentes

## Stack

- React 19 + Radix UI + Tailwind CSS
- React Router + TanStack Query
- Axios + interceptores personalizados
- Vite
- Bun `1.3.14` (`.bun-version`)

## Reglas de Oro

1. **UI**: Radix UI + Tailwind CSS, tema dark con acento mint `#2dd4bf`.
2. **API**: Axios con `withCredentials: true`. `VITE_AUTH_MODE=token` (default) manda `Authorization: Token …` con el token en localStorage (hasta activar cookie). `VITE_AUTH_MODE=cookie` no manda ese header: la sesión es cookie HttpOnly y las mutaciones llevan `X-CSRFToken`. Un 401 limpia la sesión y redirige a `/entrar` (respetando `VITE_BASE_PATH`).
3. **Login**: Endpoint `POST /accounts/users/login_complete/`.
4. **Branch**: Enviar header `x-branch-id` desde `branchStorage`.
5. **Formularios**: React Hook Form + Zod.
6. **Deploy**: Build estático en `dist/`. Staging = GitHub Pages (`main`). Producción = FTP (`production` o tags `v*`).

## Entorno local

```bash
bun install
bun run dev
```

En desarrollo, Vite proxea `/api` a `http://localhost:8000` (override con `VITE_DEV_API_PROXY` en `.env.local`). Copia `.env.example` como referencia.

## Build y verificación

```bash
bun run lint
bun run typecheck
bun run test
bun run build
```

En producción/preview, configurar `VITE_API_URL` (y opcionalmente `VITE_WIDGET_BASE_URL`). Staging en Pages usa `VITE_APP_ENV=staging` (indicador visible) y `VITE_BASE_PATH=/muninn/`.

## Estructura

```
src/
├── api/
├── components/
│   └── ui/              # shadcn/ui
├── hooks/
├── lib/
├── routes/
└── utils/
```

## Ramas, environments y promoción

- `main`: trabajo diario. PR/push corren lint, typecheck, tests y build. El push despliega **staging** a GitHub Pages (environment `staging`).
- `production`: releases. Push (o tag `v*`) despliega los tres FTP (environment `production`).
- Si el CI o un deploy falla en `main`/`production`, `CI status issues` abre (o comenta) un issue `ci-failure` + label de entorno; lo cierra cuando vuelve a verde.

Promover:

```bash
git checkout production
git pull origin production
git merge origin/main
git push origin production
```

### Secretos y variables

- Variable de repo `VITE_API_URL_STAGING` (default `https://api.yggdra.cl/api`).
- Secretos FTP existentes: `FTP_HOST_*`, `FTP_USER_*`, `FTP_PASS_*` (`AGENCIA`, `VOID`, `MUNINN`) y `VITE_API_URL_VOID`.

Detalle en el README (sección Ramas y CI/CD).
