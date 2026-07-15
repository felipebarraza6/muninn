# Muninn — Frontend Agentes

## Stack

- React 19 + Radix UI + Tailwind CSS
- React Router + TanStack Query
- Axios + interceptores personalizados
- Vite

## Reglas de Oro

1. **UI**: Radix UI + Tailwind CSS, tema dark con acento mint `#2dd4bf`.
2. **API**: Axios con `withCredentials: true`. Auth vía `Authorization: Token …` (token en `localStorage`).
3. **Login**: Endpoint `POST /accounts/users/login_complete/`.
4. **Branch**: Enviar header `x-branch-id` desde `branchStorage`.
5. **Formularios**: React Hook Form + Zod.
6. **Deploy**: Build estático en `dist/` (CD FTP en fase posterior).

## Entorno local

```bash
bun install
bun run dev
```

En desarrollo, Vite proxea `/api` a `http://localhost:8000` (override con `VITE_DEV_API_PROXY` en `.env.local`). Copia `.env.example` como referencia.

## Build

```bash
bun run lint
bun run build
```

En producción/preview, configurar `VITE_API_URL` (y opcionalmente `VITE_WIDGET_BASE_URL`).

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

## Ramas

- `dev`: trabajo diario
- `production`: releases (merge desde `dev` con CI en verde)
