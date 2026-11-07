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
| Enlaces del header y ids de las secciones | `src/data/navigation.ts` |
| Botones, arco, hoja modal, panal y foto pendiente | `src/components/ui/` |
| Header, footer y botón flotante de WhatsApp | `src/components/layout/` |
| Scroll suave (Lenis), movimiento reducido y lógica de las hojas | `src/hooks/` |
| Hero (logo, slogan, CTA, arco del interior) | `src/components/sections/Hero/` |
| Hilo de miel: trazo, gotitas y secuencia de carga | `src/hooks/useHoneyThread.ts`, `src/lib/honey-thread.ts` |
| Duraciones y curvas de movimiento | `src/lib/motion.ts` |
| Gotita del hilo en una sección: `<h2 {...honeyDrop}>` | `src/lib/honey-drop.ts` |
| Sección Menú (compuesto `Menu.*`) | `src/components/sections/Menu/` |
| Estado del menú, scroll-spy y pestañas con teclado | `src/hooks/useMenuState.ts`, `useScrollSpy.ts`, `useRovingTabs.ts` |
| Formato de precios (₡1.200, tamaños, "Consulta el precio") | `src/lib/price.ts` |
| Horario de hoy y "abierto ahora" (hora fija de Costa Rica) | `src/lib/schedule.ts`, `src/hooks/useTodayStatus.ts` |
| Franja de hoy, Pastelería, Eventos y El lugar | `src/components/sections/TodayStrip/`, `Pasteleria/`, `Eventos/`, `Lugar/` |
| Ocultar la sección El lugar | `mostrarLugar` en `src/data/business.ts` |
| Fondo de tablillas de madera (solo CSS) | `@utility wood-slats` en `src/styles/globals.css`, colores `--wood-*` en `tokens.css` |
| Cómo llegar (id `visita`): dirección, mapa diferido, horario completo, teléfonos, pagos | `src/components/sections/Visita/`, `src/hooks/useDeferredMap.ts`, `src/lib/maps.ts` |
| Modo presentación (`?present=1`, `?present=1&v=b`) | `src/components/presentation/PresentPanel.tsx`, `src/hooks/usePresentation.ts`, `src/lib/presentation.ts` |
| Tokens de la variante B "Caramelo" | `[data-variant='b']` en `src/styles/tokens.css` |
| Máscaras del logo para la variante B | `scripts/logo-masks.py` (genera `*-mask.webp`) |
| Marcas de platos por confirmar | Abrir la página con `?review=1` |
| Conversión de fotos a WebP | `scripts/convert-photos.py` (versiones de 480 y 800 px del interior y logo de 280 px hechas con Pillow) |
| Fuentes (sin Google Fonts) | `@fontsource` en `src/styles/globals.css` |
| `<head>`: robots, JSON-LD y precarga del LCP | `scripts/vite-head.ts`, `src/data/site.ts` |
| Correcciones de ortografía del menú | `docs/correcciones-menu.md` |
| Fotos que hay que pedir | `docs/fotos-pendientes.md` |

Los componentes usan solo colores semánticos (`bg-surface-brand`, `text-foreground`); la paleta por
defecto de Tailwind está desactivada. La variante B se activa con `data-variant="b"` en `<html>`.

## Antes de desplegar

- `og:image` y `twitter:image` en `index.html` usan una ruta relativa (`./og-image.jpg`). WhatsApp,
  Facebook y X necesitan una **URL absoluta**: cámbiala por `https://<dominio>/og-image.jpg` al desplegar.
- **Indexación**: mientras es prototipo, `site.indexable` es `false` en `src/data/site.ts` y la build
  agrega `<meta name="robots" content="noindex, nofollow">`. Cuando el cliente apruebe, cambiarlo a `true`.
- Los datos estructurados (JSON-LD) salen de `business.ts` al hacer la build (`scripts/vite-head.ts`,
  `src/lib/structured-data.ts`). Cuando haya dominio, se puede agregar `url`.
- `vercel.json` trae las cabeceras de seguridad (CSP, X-Frame-Options, Referrer-Policy,
  Permissions-Policy, nosniff, HSTS). Si se agrega otro servicio externo (analítica, otro mapa), hay que
  sumarlo a la CSP o el navegador lo bloquea.
- Reemplazar todos los `[PLACEHOLDER]`.
- Tener **por escrito** el permiso de la foto del interior (`interior-arco.webp`, de IMG_2354, autor "JuanK Nuñez" en Google Maps). Hoy está confirmado solo de palabra.

## Datos pendientes: [PLACEHOLDER]

Para listarlos:

```bash
grep -rn "\[PLACEHOLDER\]" src index.html
```

Al cierre de la etapa 2C:

- Cuál número tiene WhatsApp (restaurante 8396-8602 o pastelería 6349-0223) y a cuál van los eventos.
- Días y horario del brunch.
- Texto de "sobre nosotros".
- Días del brunch (la pestaña dice "Brunch (sáb. y dom.)" sin confirmar).
- Productos marcados `porConfirmar` en el menú (`npm run check:menu` los lista): las dos chimichangas y el frappé horchata.
- Texto exacto de la soda italiana "Mango strawberry" (cambio de contenido pendiente de aprobación, ver `docs/correcciones-menu.md`).
- Facebook y TikTok, si existen.
- Confirmar si `pizzas.webp` son tortizzas.
- Fotos faltantes: ensalada, evento, terraza, fachada, bebidas.
