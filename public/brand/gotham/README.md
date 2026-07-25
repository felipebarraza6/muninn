# Gotham — assets estáticos (Aseprite → PNG)

Exportá desde Aseprite (o LibreSprite) y dejá los archivos aquí.
Cuando existan, poné `GOTHAM_USE_STATIC_LAYERS = true` en
`src/lib/gothamAssets.ts`.

## Archivos

| Archivo | Rol | Notas |
|---------|-----|--------|
| `sky.png` | Cielo + luna + estrellas (opcional) | Full-bleed, transparente abajo |
| `far.png` | Skyline lejano | Anclado abajo, parallax lento |
| `mid.png` | Torres medias / cañón | Anclado abajo |
| `near.png` | Primer plano (marcos / calle) | Anclado abajo, parallax rápido |

## Spec de export

- **Canvas sugerido:** `640 × 400` px (o `320 × 200` @2x)
- **Formato:** PNG-8 o PNG-32, fondo transparente
- **Ancla:** composición desde el **borde inferior** (como el SVG actual)
- **Filtro en web:** `image-rendering: pixelated` (ya aplicado en CSS)
- **Tema:** dark navy / charcoal; ventanas warm + mint `#2dd4bf` muy puntual
- **Centro:** dejar “hueco” suave para el hero (no saturar el medio)

## Capas Batcueva (`/entrar`)

Opcional: variantes más oscuras

- `far-batcave.png`
- `mid-batcave.png`
- `near-batcave.png`

Si no existen, se reutilizan las de Gotham con CSS más oscuro.

## Checklist Aseprite

1. Un archivo `.aseprite` con layers: `sky`, `far`, `mid`, `near`
2. File → Export → cada layer como PNG
3. Copiar a esta carpeta
4. Activar `GOTHAM_USE_STATIC_LAYERS`
5. Recargar `/login`
