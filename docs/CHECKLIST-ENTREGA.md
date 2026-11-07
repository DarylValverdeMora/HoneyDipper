# Checklist de entrega

Lo que falta antes de entregarle la página final al cliente. La vista previa es solo para revisar: no es la entrega.

## Vista previa

- URL de la vista previa: **[PENDIENTE: se llena al desplegar en Vercel]**
- [ ] Desplegada en Vercel con el framework Vite (comando `npm run build`, salida `dist`), desde la rama `claude/project-thread-1ew8bn`.
- [ ] URL anotada aquí y en el README.
- [ ] `site.url` en `src/data/site.ts` con esa URL (sin barra final) y vuelto a desplegar.
- [ ] `og:image`, `og:url` y canonical salen con URL absoluta en el HTML servido.
- [ ] Prueba de compartir el enlace por WhatsApp: se ve la imagen y el título.

## Resolver los pendientes del dueño

- [ ] Respuestas a `docs/PENDIENTES-DUENO.md`, bloque "Bloquean la publicación".
- [ ] Datos cambiados en el código según `docs/GUIA-DE-CAMBIOS.md`.
- [ ] `grep -rn "\[PLACEHOLDER\]" src index.html scripts` sin resultados que lleguen a la página.
- [ ] Marcas de platos por confirmar resueltas (`?review=1` ya no muestra puntos rojos; `npm run check:menu` sin pendientes).
- [ ] Correcciones de ortografía aprobadas (`docs/correcciones-menu.md`).

## Pruebas con datos reales

- [ ] Número de reservas probado: el enlace abre WhatsApp con el mensaje correcto.
- [ ] Número de pasteles probado.
- [ ] Número de eventos probado.
- [ ] Número de consultas del menú probado.
- [ ] Probado en un iPhone real (Safari): menú por categoría, hojas de WhatsApp, mapa, botón flotante.
- [ ] Probado en un Android real (Chrome): lo mismo.
- [ ] Probado en Firefox de escritorio (no se pudo en el entorno de desarrollo).
- [ ] Horario de hoy y "abierto ahora" coinciden con el horario real.

## Publicación

- [ ] Dominio propio comprado y apuntado a Vercel.
- [ ] HTTPS activo y cabeceras de seguridad llegando (`curl -sI https://dominio`).
- [ ] `site.indexable: true` y `X-Robots-Tag` borrado de `vercel.json` (ver la guía, "Quitar el noindex").
- [ ] `site.url` con el dominio final y nueva build desplegada.
- [ ] Lighthouse móvil sobre el dominio final (Rendimiento, Accesibilidad, Buenas prácticas y SEO en 90 o más).
- [ ] Google Maps: perfil del negocio con el enlace a la página.
- [ ] Enlace de la página en la biografía de Instagram.
- [ ] Si se agrega analítica o otro servicio externo, sumarlo a la CSP de `vercel.json`.
