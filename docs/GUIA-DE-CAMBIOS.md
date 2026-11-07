# Guía de cambios

Cómo hacer los cambios más comunes sin tocar nada más. Después de cualquier cambio corre:

```bash
npm run typecheck && npm test && npm run build
```

## Cambiar un precio

Archivo: `src/data/menu.ts`. Busca el plato por su nombre y cambia el número de `unico(...)`:

```ts
{ nombre: 'Alitas', descripcion: '...', precio: unico(4200) },
```

Si el plato tiene precio por tamaño, cambia `tamanos({ pequeno: 1800, grande: 2800 })`. Los precios son enteros
en colones, sin puntos. Después corre `npm run check:menu`: debe seguir dando 158 productos.
Para un producto con precio pendiente, usa `PRECIO_PENDIENTE` (la página muestra "Consulta el precio").

## Cambiar un horario

Archivo: `src/data/business.ts`, constante `business.openingHours` (alrededor de la línea 76). Son tres franjas,
cada una con sus días, `opens` y `closes` en formato 24 horas:

```ts
{ days: ['jueves', 'viernes'], opens: '11:00', closes: '21:00' },
```

La franja de hoy, el bloque de "Cómo llegar", el pie de página, los datos estructurados y las horas de reserva
salen de esa constante; no hay que tocar nada más.

## Cambiar un número de WhatsApp

Archivo: `src/data/business.ts`, constante `business.contact` (alrededor de la línea 49). Cada línea tiene
`displayPhone` (como se ve, `8396-8602`) y `whatsapp` (con 506 delante y sin guion). Cuando el dueño confirme que el
número tiene WhatsApp, cambia `whatsappStatus` a `'confirmado'`.

A qué número va cada botón:
- Reservas: `line: 'restaurante'` en `src/data/whatsapp.ts`, plantilla `reserva`.
- Pasteles: `line: 'pasteleria'` en la plantilla `pastel`.
- Eventos: `business.eventosLinea` en `business.ts` (`'restaurante'` o `'pasteleria'`).
- Consultas del menú: plantilla `consulta` en `whatsapp.ts`.

## Ocultar el menú mexicano

Archivo: `src/data/menu.ts`, constante `menuFlags` (alrededor de la línea 15):
`mostrarMenuMexicano: false`. La categoría "Menú mexicano" (dentro de Comidas) desaparece de los chips, de la búsqueda y del botón "Siguiente".

## Ocultar "El lugar"

Archivo: `src/data/business.ts`, `business.mostrarLugar` (línea 101): cámbialo a `false`. La sección desaparece
completa (no tiene enlace en el menú de navegación).

## Quitar el noindex (publicar la versión final)

Son tres cambios, y `src/data/site.test.ts` falla si falta alguno de los dos primeros:
1. `src/data/site.ts`: `indexable: true`. Con eso la build deja de poner `<meta name="robots" content="noindex, nofollow">`.
2. `vercel.json`: borra la línea de la cabecera `X-Robots-Tag`.
3. `src/data/site.ts`: `url: 'https://tu-dominio.com'` (sin barra final), para que la build agregue la URL canónica,
   `og:url` y la imagen para compartir con URL absoluta.

Después haz la build, despliega y confirma con `curl -sI https://tu-dominio.com | grep -i robots` que ya no sale
`X-Robots-Tag`.
