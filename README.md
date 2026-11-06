# Honey Dipper: landing

Prototipo solo frontend de la landing de Honey Dipper, cafetería y pastelería en Turrialba.
Reservas y contacto por WhatsApp con enlaces `wa.me` y mensaje prellenado.

Stack: Vite + React + TypeScript (estricto) + Tailwind v4 + GSAP/ScrollTrigger + Lenis.

## Cómo correrlo

```bash
npm install
npm run dev        # servidor local en http://localhost:5173
npm run typecheck  # chequeo de tipos
npm test           # pruebas (WhatsApp y menú)
npm run check:menu # conteo de productos por grupo (falla si no da 158)
npm run docs:correcciones  # regenera docs/correcciones-menu.md
npm run build      # build de producción en dist/
npm run preview    # sirve la build
```

`vite.config.ts` usa `base: './'`, así la carpeta `dist/` funciona servida desde cualquier ruta.

## Dónde está cada cosa

| Qué | Archivo |
| --- | --- |
| Colores, fuentes y radios (y la variante B del modo presentación) | `src/styles/tokens.css` |
| Conexión de los tokens con Tailwind | `src/styles/globals.css` (`@theme inline`) |
| Nombre, slogan, teléfonos, WhatsApp, horario, mapa | `src/data/business.ts` |
| Menú completo (texto original, precios, banderas) | `src/data/menu.ts` y tipos en `src/data/menu.types.ts` |
| Correcciones de ortografía que se aplican al mostrar | `src/data/menu-corrections.ts` |
| Mensajes prellenados de WhatsApp | `src/data/whatsapp.ts` |
| Armado del enlace `wa.me` | `src/lib/whatsapp.ts` |
| Fotos, texto alternativo y permiso | `src/data/photos.ts` |
| Conversión de fotos a WebP | `scripts/convert-photos.py` |
| Correcciones de ortografía del menú | `docs/correcciones-menu.md` |
| Fotos que hay que pedir | `docs/fotos-pendientes.md` |

Los componentes usan solo colores semánticos (`bg-surface-brand`, `text-foreground`); la paleta por
defecto de Tailwind está desactivada. La variante B se activa con `data-variant="b"` en `<html>`.

## Antes de desplegar

- `og:image` en `index.html` usa una ruta relativa (`./og-image.jpg`). WhatsApp y Facebook necesitan
  una **URL absoluta**: cámbiala por `https://<dominio>/og-image.jpg` al desplegar.
- Reemplazar todos los `[PLACEHOLDER]`.

## Datos pendientes: [PLACEHOLDER]

Para listarlos:

```bash
grep -rn "\[PLACEHOLDER\]" src index.html
```

Al cierre de la etapa 2C:

- Cuál número tiene WhatsApp (restaurante 8396-8602 o pastelería 6349-0223) y a cuál van los eventos.
- Días y horario del brunch.
- Texto de "sobre nosotros".
- Información de eventos: capacidad, qué incluye y cómo se reserva.
- Días del brunch (la pestaña dice "Brunch (sáb. y dom.)" sin confirmar).
- Productos marcados `porConfirmar` en el menú (`npm run check:menu` los lista).
- Facebook y TikTok, si existen.
- Confirmar si `pizzas.webp` son tortizzas.
- Fotos faltantes: ensalada, evento, terraza, fachada, bebidas.
