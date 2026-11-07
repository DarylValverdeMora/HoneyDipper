# QA técnico, etapa 6A (7 de noviembre de 2026)

Las mediciones se hicieron sobre `npm run build` + `vite preview`, con Lighthouse 13.6 en modo móvil
(simulación de 4G lenta y CPU 4x) y axe-core 4.11 en Chromium.

## Antes y después

### Lighthouse móvil

| Categoría | Antes | Después (prototipo, `noindex`) | Después (con `site.indexable = true`) |
| --- | --- | --- | --- |
| Rendimiento | 78 | 92 (90 a 93 en 6 corridas) | 93 |
| Accesibilidad | 100 | 100 | 100 |
| Buenas prácticas | 100 | 100 | 100 |
| SEO | 92 | 66 | 100 |

| Métrica | Antes | Después |
| --- | --- | --- |
| LCP | 4,0 s | 3,2 s |
| TBT | 380 ms | 100 a 140 ms |
| FCP | 1,5 s | 0,8 s |
| Speed Index | 2,0 s | 1,4 a 1,7 s |
| CLS | 0 | 0 |
| Recursos que bloquean el render | 900 ms (Google Fonts) | 150 ms (solo el CSS propio) |

El SEO baja a 66 con `noindex` a propósito: Lighthouse marca "la página no se puede indexar".
Con la bandera en `true` (versión publicada) da 100.

### axe-core (WCAG 2.x A y AA)

| Vista | Antes | Después |
| --- | --- | --- |
| Página, variante A | 0 fallas | 0 fallas |
| Hoja de reserva | 0 | 0 |
| Hoja de pastel | 0 | 0 |
| Hoja de evento | 0 | 0 |
| Página, variante B | 0 | 0 |

### JavaScript

| Archivo | Antes | Después | ¿Bloquea la primera pintura? |
| --- | --- | --- | --- |
| `react` | 218,8 kB (68,3 kB gzip) | 218,8 kB (68,3 kB gzip) | Sí |
| `index` (la app) | 173,4 kB (57,4 kB gzip) | 174,9 kB (57,9 kB gzip) | Sí |
| `motion` (GSAP, ScrollTrigger, Lenis) | 132,8 kB (49,8 kB gzip) | 132,0 kB (49,5 kB gzip) | Antes sí, ahora no: se descarga después |
| `PresentPanel` | 2,5 kB | 2,5 kB | No (solo con `?present=1`) |
| **JS antes de la primera pintura** | **175,5 kB gzip** | **126,2 kB gzip** | |

## Qué se corrigió

1. **Fuentes**: Google Fonts cambiado por `@fontsource` (Cormorant variable normal e itálica,
   Cormorant SC 500, DM Sans variable). `font-display: swap`. Ya no se hacen peticiones a Google.
2. **LCP**: el logo del hero se precarga desde el HTML con `fetchpriority="high"`. Antes se descubría
   recién cuando corría el JS (580 ms de espera).
3. **Carga en dos pasos**: primero se pintan el header y la portada, y el resto de la página se monta
   en el siguiente cuadro (`useAfterFirstPaint`). Si la página se abre con un ancla (`#visita`), se
   lleva la vista a esa sección cuando ya está.
4. **GSAP y Lenis diferidos** (`loadMotion`): ya no frenan la primera pintura. La gota y el slogan
   empiezan invisibles y se animan cuando llegan las librerías. Si no llegan, el slogan se muestra igual
   y el scroll queda nativo. Se quitó `@gsap/react`, que ya no se usa.
5. **Fotos**: la foto del interior tiene `srcset` (480, 800 y 1170 px). El logo del header pasó de un
   JPG de 38 kB a un WebP de 280 px y 5,6 kB.
6. **Reflow al 400 % (320 px)**: "Hoy abrimos de 9:00 a.m. a 9:00 p.m." no se partía en dos líneas y
   empujaba la página 42 px a la derecha. Ahora se parte.
7. **Landmarks**: las dos navegaciones se llamaban "Principal". La del celular ahora es "Principal (celular)".
8. **SEO**: `meta robots` controlado por `site.indexable` (`src/data/site.ts`), JSON-LD del negocio solo
   con datos de `business.ts` (con pruebas que impiden `priceRange`, reseñas y placeholders), Twitter card
   completa, `og:image:alt` y `robots.txt`.
9. **Seguridad**: `vercel.json` con CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy,
   Permissions-Policy, HSTS y caché larga para `/assets`.

## Revisión manual de accesibilidad

| Punto | Resultado |
| --- | --- |
| Un solo h1 | Sí (el logo del hero, con alt "Honey Dipper, cafetería y pastelería") |
| Orden de encabezados | h1 → h2 por sección → h3 por categoría → h4 por plato, sin saltos |
| Landmarks | header, 2 nav con nombres distintos, main, aside (horario de hoy), footer |
| "Saltar al contenido" | Primer Tab, lleva a `#contenido` |
| Alt en imágenes | Las 13 imágenes tienen alt; el hilo de miel es `aria-hidden` |
| Foco visible | Contorno de 2 px en todos los controles revisados |
| Zoom 200 % (640 px) y 400 % (320 px) | Sin scroll horizontal después del arreglo |
| `prefers-reduced-motion` | 0 animaciones corriendo, Lenis no se crea y el hilo queda completo y quieto |

## Navegadores

| Navegador | Resultado |
| --- | --- |
| Chromium (390, 768 y 1440 px; A y B) | Sin scroll horizontal, sin textos cortados, sin fotos estiradas, consola limpia |
| Firefox | **No probado**: el entorno trae solo Chromium y no permite instalar otros navegadores de Playwright |
| WebKit | **No probado**: mismo motivo |

## Movimiento con CPU 4x y red lenta (400 kbps, 400 ms)

| Medida | Antes de los cambios | Después |
| --- | --- | --- |
| Carga completa | 6,6 s | 4,1 s |
| LCP | 6,8 s | 4,2 s |
| Cuadros de scroll (mediana / p95) | 17 / 17 ms | 17 / 17 ms |
| Cuadros de más de 50 ms | 0 de 315 | 3 a 5 de unos 270 (máximo 117 a 145 ms) |

Con esta red tan lenta, GSAP y Lenis llegan unos segundos después de la portada. Si la persona ya está
haciendo scroll, hay un cuadro de unos 145 ms en el momento en que se activan, y unos pocos de 60 a 70 ms
mientras se pintan fotos que cargan al bajar. Después el hilo y Lenis corren a 60 cuadros por segundo.
Con red normal no pasa: las librerías ya están cuando la persona empieza a bajar.

## Seguridad

- `npm audit`: 0 vulnerabilidades (también con `--omit=dev`).
- No hay secretos en el código ni en el historial de git. Las coincidencias de "token" son tokens de diseño.
- `.env` y `.env.*` están en `.gitignore`.
- CSP simulada con Playwright (cabeceras de `vercel.json` sobre cada respuesta): 0 violaciones. Las tres
  hojas abren, "Copiar mensaje" funciona, el enlace de WhatsApp abre otra pestaña y el iframe del mapa se
  pide sin bloqueo.

## Pendiente

| Qué | Motivo |
| --- | --- |
| Probar en Firefox y WebKit (Safari de iPhone) | No están instalados en el entorno. Hay que correrlo en una máquina con Playwright completo o en un iPhone real. |
| `og:image` y `twitter:image` con URL absoluta | Depende del dominio final. |
| `site.indexable = true` | Cuando el cliente apruebe. |
| Revisar la CSP si se agrega analítica u otro servicio | La CSP actual solo permite el sitio propio y Google Maps. |
| El LCP simulado sigue en 3,2 s | El logo lo pinta React, así que espera a React (68 kB gzip). Bajarlo más pide prerenderizar el HTML (6B o después). |
