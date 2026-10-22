# Muninn

Frontend de agentes especializados con estilo dark premium. Inspirado en dashboards modernos, con acento mint y foco en claridad visual.

## Demo

Desplegado como aplicación estática. Compila a `dist/` listo para FTP u otro hosting estático.

- **Staging:** GitHub Pages en cada push a `main` (`https://<user>.github.io/muninn/`).
- **Producción:** sitios FTP al pushear `production` o un tag `v*`.

## Stack

- **React 19** + **TypeScript**
- **Vite**
- **Tailwind CSS 4**
- **Radix UI** + **shadcn/ui**
- **React Router 6**
- **TanStack Query**
- **Axios**
- **Bun** `1.3.14` (fijado en `.bun-version`)

## Características

- Tema visual dark premium: fondo negro `#000000`, superficies elevadas `#05080f`, acento mint `#2dd4bf`.
- Chat global con selector de agente (estilo cambio de modelo IA).
- Historial de conversaciones internas con archivado/restauración.
- Dashboard de agentes, conversaciones y canales.
- Sidebar responsive y experiencia mobile cuidada.
- Login con `Authorization: Token …` en memoria (`VITE_AUTH_MODE=token`, default) o cookie HttpOnly + CSRF (`VITE_AUTH_MODE=cookie`). El token no se guarda en `localStorage`.

## Requisitos

- [Bun](https://bun.sh/) **1.3.14** (recomendado; ver `.bun-version`) o Node.js 20+

## Cómo empezar

```bash
# Clonar el repo
git clone https://github.com/felipebarraza6/muninn.git
cd muninn

# Instalar dependencias
bun install

# Opcional: copiar variables de ejemplo
cp .env.example .env.local

# Levantar en desarrollo (API local vía proxy /api → localhost:8000)
bun run dev
```

El servidor Vite levanta por defecto en `http://localhost:3001`.

## Scripts

| Comando             | Descripción                           |
| ------------------- | ------------------------------------- |
| `bun run dev`       | Servidor de desarrollo con hot reload |
| `bun run build`     | Build de producción en `dist/`        |
| `bun run lint`      | Revisar código con ESLint             |
| `bun run typecheck` | TypeScript (`tsc --noEmit`)           |
| `bun run test`      | Tests con Vitest                      |
| `bun run format`    | Formatear con Prettier                |

## Estructura

```
src/
├── api/           # Cliente HTTP, endpoints y hooks
├── components/    # Componentes reutilizables y UI
│   └── ui/        # Componentes shadcn/ui
├── hooks/         # Hooks custom
├── lib/           # Utilidades y storage
├── routes/        # Rutas de React Router
└── styles.css     # Variables de tema Muninn
```

## Sistema de diseño

- **Fondo:** `#000000`
- **Superficies:** `rgba(255, 255, 255, 0.03)`
- **Superficies elevadas:** `#05080f`
- **Bordes:** `rgba(255, 255, 255, 0.06)`
- **Acento:** `#2dd4bf`
- **Texto principal:** `#f0f0f0`
- **Tipografía:** Inter

## API

La app consume una API Django/DRF.

- **Desarrollo:** proxy Vite `/api` → `http://localhost:8000` (configurable con `VITE_DEV_API_PROXY`).
- **Staging / producción:** `VITE_API_URL` (inyectada en build; en CD varía por destino).

Ver `.env.example`.

## Ramas y CI/CD

| Rama / evento                         | Qué corre                                         | Destino                          |
| ------------------------------------- | ------------------------------------------------- | -------------------------------- |
| PR o push a `main`                    | lint, typecheck, tests, build                     | —                                |
| Push a `main`                         | deploy **staging**                                | GitHub Pages (`/<repo>/`)        |
| Push a `production` o tag `v*`        | lint, typecheck, tests, build + deploy **prod**   | 3 sitios FTP                     |

`main` es el trabajo diario y el origen de staging. `production` es la rama de releases.

### Promover `main` a `production`

Cuando staging en Pages está bien y el CI de `main` está verde:

```bash
git checkout production
git pull origin production
git merge origin/main
git push origin production
```

O abre un PR `main` → `production` en GitHub. El push a `production` dispara el deploy FTP.

También vale crear un tag `v1.2.3` (anotado o liviano) y hacer push del tag; corre el mismo deploy de producción.

### Environments

| Environment  | Uso                                      |
| ------------ | ---------------------------------------- |
| `staging`    | Deploy de GitHub Pages desde `main`      |
| `production` | Deploys FTP desde `production` o tags `v*` |

GitHub Pages exige Source = **GitHub Actions** (Settings → Pages). El environment `staging` se usa para el job de Pages; `production` para los tres FTP.

Opcional: en `production` activa required reviewers para aprobar cada release.

### Variables y secretos

**Variable de repositorio (Settings → Secrets and variables → Actions → Variables):**

| Variable              | Default                         | Uso                                      |
| --------------------- | ------------------------------- | ---------------------------------------- |
| `VITE_API_URL_STAGING` | `https://api.yggdra.cl/api`    | API del build de GitHub Pages (staging)  |

**Secretos (mismos nombres que ya usa el repo; no hace falta renombrarlos):**

| Secreto             | Destino                         |
| ------------------- | ------------------------------- |
| `FTP_HOST_AGENCIA`  | agents.agenciapatagoniachile.com |
| `FTP_USER_AGENCIA`  | ídem                            |
| `FTP_PASS_AGENCIA`  | ídem                            |
| `FTP_HOST_VOID`     | void.smarthydro.app             |
| `FTP_USER_VOID`     | ídem                            |
| `FTP_PASS_VOID`     | ídem                            |
| `VITE_API_URL_VOID` | API del tenant Void             |
| `FTP_HOST_MUNINN`   | muninn.yggdra.cl                |
| `FTP_USER_MUNINN`   | ídem                            |
| `FTP_PASS_MUNINN`   | ídem                            |

Los secretos pueden vivir a nivel de repo (como ahora) o moverse al environment `production` con los mismos nombres.

APIs fijas en el workflow:

- Agencia Patagonia: `https://api.agenciapatagoniachile.com/api`
- Muninn Yggdra: `https://api.yggdra.cl/api`

El build de staging usa `VITE_BASE_PATH=/muninn/` (nombre del repo), copia `404.html` para el fallback SPA de Pages y `VITE_APP_ENV=staging` (badge visible “Staging”).

Dependabot actualiza `npm` y `github-actions` semanalmente.

### Issues automáticos si falla el CI o un deploy

El workflow `CI status issues` (`.github/workflows/ci-status-issues.yml`) escucha `workflow_run` del workflow `CI` en pushes a `main` y `production` (permiso `issues: write`, `actions/github-script`).

- **Fallo:** abre un issue con labels `ci-failure` y el entorno (`staging` en `main`, `production` en `production`). El cuerpo incluye el link a la ejecución, el commit y los jobs fallidos.
- **Mismo workflow + rama con un issue ya abierto:** comenta en ese issue (no duplica).
- **Vuelve a verde:** comenta y cierra el issue.

Los labels se crean solos si no existen. Este workflow corre desde la rama por defecto (`main`); hay que mergear este cambio para que empiece a actuar.

## Deploy local

```bash
bun run build
```

Sube el contenido de `dist/` a tu hosting estático. El CD de staging y producción está en `.github/workflows/ci.yml`.

## Licencia

Proyecto privado — Uso interno.
