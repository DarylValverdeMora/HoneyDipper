# Honey Dipper: landing

Prototipo solo frontend de la landing de Honey Dipper, cafetería y pastelería en Turrialba.
Reservas y contacto por WhatsApp con enlaces `wa.me` y mensaje prellenado.

Stack: Vite + React + TypeScript (estricto) + Tailwind v4 + GSAP/ScrollTrigger + Lenis.

## Cómo correrlo

```bash
npm install
npm run dev        # servidor local en http://localhost:5173
npm run typecheck  # chequeo de tipos
npm test           # pruebas (WhatsApp, menú, horario, fotos, SEO)
npm run check:menu # conteo de productos por grupo (falla si no da 158)
npm run docs:correcciones  # regenera docs/correcciones-menu.md
npm run build      # build de producción en dist/
npm run preview    # sirve la build
```

`vite.config.ts` usa `base: './'`, así la carpeta `dist/` funciona servida desde cualquier ruta.

## Vista previa y modos de revisión

- Vista previa desplegada: **[PENDIENTE: se llena al desplegar en Vercel]**
- Modo presentación, variante A (Menta): `/?present=1`
- Modo presentación, variante B (Caramelo): `/?present=1&v=b`
- Modo revisión (marca los platos por confirmar): `/?review=1`

La vista previa lleva `noindex` (meta y cabecera `X-Robots-Tag`): es un prototipo para revisar, no la entrega final.

## Documentos

| Documento | Para qué |
| --- | --- |
| `docs/PENDIENTES-DUENO.md` | Preguntas para el dueño, listas para mandar por WhatsApp |
| `docs/GUIA-DE-CAMBIOS.md` | Cómo cambiar un precio, un horario, un número, ocultar secciones y quitar el noindex |
| `docs/CHECKLIST-ENTREGA.md` | Lo que falta antes de la entrega final |
| `docs/qa-etapa-6a.md` | Mediciones de rendimiento, accesibilidad y seguridad |
| `docs/correcciones-menu.md` | Correcciones de ortografía del menú |
| `docs/fotos-pendientes.md` y `docs/fotos-decisiones.md` | Fotos que faltan y decisión sobre cada imagen recibida |

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
| Fotos, texto alternativo, permiso y crédito | `src/data/photos.ts` |
| Enlaces del header y ids de las secciones | `src/data/navigation.ts` |
| Botones, arco, hoja modal, panal y foto pendiente | `src/components/ui/` |
| Header, footer y botón flotante de WhatsApp | `src/components/layout/` |
| Scroll suave (Lenis), movimiento reducido y lógica de las hojas | `src/hooks/` |
| Hero (logo, slogan, CTA, arco del interior) | `src/components/sections/Hero/` |
| Hilo de miel: trazo, gotitas y secuencia de carga | `src/hooks/useHoneyThread.ts`, `src/lib/honey-thread.ts` |
| Duraciones y curvas de movimiento | `src/lib/motion.ts` |
| Gotita del hilo en una sección: `<h2 {...honeyDrop}>` | `src/lib/honey-drop.ts` |
| Sección Menú (compuesto `Menu.*`) | `src/components/sections/Menu/` |
| Estado del menú (categoría visible, "Siguiente", búsqueda) y pestañas con teclado | `src/hooks/useMenuState.ts`, `useRovingTabs.ts`, `src/lib/menu-selection.ts` |
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
| Recorte de fotos desde los originales y conversión a WebP | `scripts/crop-photos.py` (quita barra de estado, usuarios, textos e íconos; genera también las versiones del `srcset`) |
| Página 404 (rutas que no existen) | `public/404.html` |
| Fuentes (sin Google Fonts) | `@fontsource` en `src/styles/globals.css` |
| `<head>`: robots, JSON-LD y precarga del LCP | `scripts/vite-head.ts`, `src/data/site.ts` |
| Correcciones de ortografía del menú | `docs/correcciones-menu.md` |
| Fotos que hay que pedir | `docs/fotos-pendientes.md` |
| Decisión sobre cada una de las 36 imágenes recibidas | `docs/fotos-decisiones.md` |

Los componentes usan solo colores semánticos (`bg-surface-brand`, `text-foreground`); la paleta por
defecto de Tailwind está desactivada. La variante B se activa con `data-variant="b"` en `<html>`.

## Antes de desplegar

- `og:image`, `twitter:image`, `og:url` y canonical los agrega la build a partir de `site.url`
  (`src/data/site.ts`). WhatsApp, Facebook y X necesitan una **URL absoluta**: con `url` vacío salen relativas
  (`./og-image.jpg`); pon ahí la URL de la vista previa o del dominio final, sin barra final.
- **Indexación**: mientras es prototipo, `site.indexable` es `false` en `src/data/site.ts`, la build
  agrega `<meta name="robots" content="noindex, nofollow">` y `vercel.json` manda la cabecera `X-Robots-Tag`.
  Cuando el cliente apruebe, cambia las dos cosas (ver `docs/GUIA-DE-CAMBIOS.md`); una prueba avisa si falta una.
- Los datos estructurados (JSON-LD) salen de `business.ts` al hacer la build (`scripts/vite-head.ts`,
  `src/lib/structured-data.ts`). Cuando haya dominio, se puede agregar `url`.
- `vercel.json` trae las cabeceras de seguridad (CSP, X-Frame-Options, Referrer-Policy,
  Permissions-Policy, nosniff, HSTS). Si se agrega otro servicio externo (analítica, otro mapa), hay que
  sumarlo a la CSP o el navegador lo bloquea.
- Reemplazar todos los `[PLACEHOLDER]`.
- Dos pendientes menores con las fotos del evento (`evento-1.webp`, `evento-2.webp`): confirmar que la pareja que aparece está de acuerdo en salir en la página y confirmar el crédito "Foto: @fotogenicacr" con el fotógrafo. El resto de las fotos las envió el dueño y su permiso está confirmado.

## Datos pendientes: [PLACEHOLDER]

La lista completa, con la pregunta para el dueño de cada dato, está en `docs/PENDIENTES-DUENO.md`.
Para ver las marcas en el código:

```bash
grep -rn "\[PLACEHOLDER\]" src index.html scripts
```
