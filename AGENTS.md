# Huginn — Frontend Agentes IA

## Stack

- React 18 + Radix UI + Tailwind CSS
- React Router + TanStack Query
- Axios + interceptores personalizados
- Vite

## Reglas de Oro

1. **UI**: Radix UI + Tailwind CSS, tema dark con acento mint `#2dd4bf`.
2. **API**: Axios con `withCredentials: true`. Auth vía cookie HttpOnly (`auth_token`).
3. **Login**: Endpoint `POST /accounts/users/login_complete/`.
4. **Branch**: Enviar header `x-branch-id` desde `branchStorage`.
5. **Formularios**: React Hook Form + Zod.
6. **Deploy**: Build estático en `dist/`.

## Entorno local

```bash
bun install
bun run dev
```

## Build

```bash
bun run lint
bun run build
```

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
