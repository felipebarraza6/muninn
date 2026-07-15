# Muninn

Frontend de agentes especializados con estilo dark premium. Inspirado en dashboards modernos, con acento mint y foco en claridad visual.

## Demo

Desplegado como aplicación estática. Compila a `dist/` listo para FTP u otro hosting estático.

## Stack

- **React 19** + **TypeScript**
- **Vite**
- **Tailwind CSS 4**
- **Radix UI** + **shadcn/ui**
- **React Router 6**
- **TanStack Query**
- **Axios**

## Características

- Tema visual dark premium: fondo negro `#000000`, superficies elevadas `#05080f`, acento mint `#2dd4bf`.
- Chat global con selector de agente (estilo cambio de modelo IA).
- Historial de conversaciones internas con archivado/restauración.
- Dashboard de agentes, conversaciones y canales.
- Sidebar responsive y experiencia mobile cuidada.
- Login integrado con backend mediante Token en `localStorage` (`Authorization: Token …`).

## Requisitos

- [Bun](https://bun.sh/) (recomendado) o Node.js 20+

## Cómo empezar

```bash
# Clonar el repo
git clone https://github.com/felipebarraza6/huginn.git
cd huginn

# Instalar dependencias
bun install

# Opcional: copiar variables de ejemplo
cp .env.example .env.local

# Levantar en desarrollo (API local vía proxy /api → localhost:8000)
bun run dev
```

El servidor Vite levanta por defecto en `http://localhost:3001`.

## Scripts

| Comando          | Descripción                           |
|------------------|---------------------------------------|
| `bun run dev`    | Servidor de desarrollo con hot reload |
| `bun run build`  | Build de producción en `dist/`        |
| `bun run lint`   | Revisar código con ESLint             |
| `bun run format` | Formatear con Prettier                |

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
- **Producción / preview:** `VITE_API_URL` (inyectada en build; en CD puede variar por dominio).

Ver `.env.example`.

## Ramas y CI

- `dev`: trabajo diario
- `production`: releases tras CI en verde
- GitHub Actions corre `lint` + `build` en pushes y PRs a esas ramas

## Deploy

```bash
bun run build
```

Sube el contenido de `dist/` a tu hosting estático. El CD por FTP (varios dominios / APIs) se configurará en una fase posterior.

## Licencia

Proyecto privado — Uso interno.
