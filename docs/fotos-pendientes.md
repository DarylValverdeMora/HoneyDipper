# Fotos pendientes

Las fotos del prototipo salen de capturas de Instagram y Google Maps, en baja resolución. El propio negocio
envió **todas** las imágenes de la carpeta HoneyDipper, así que el permiso de uso está confirmado para todas
("confirmado por el negocio (enviada por el dueño)", en `src/data/photos.ts`). La decisión sobre cada imagen
está en `docs/fotos-decisiones.md`.

## Pendientes menores

- [ ] Confirmar que la pareja que aparece en las fotos del evento está de acuerdo en salir en la página.
- [ ] Confirmar el crédito "Foto: @fotogenicacr" con el fotógrafo.

## Fotos que faltan (hoy son [PLACEHOLDER] o no existen)

- [ ] Fachada o entrada del local (hoy es un arco [PLACEHOLDER] en "El lugar").
- [ ] Bebidas y café servidos en el local.
- [ ] Brunch: gallo pinto, waffles, tostadas francesas.
- [ ] Logo en SVG o PNG con fondo transparente. Mientras tanto, la variante B usa máscaras sacadas del JPG (`scripts/logo-masks.py`).
- [ ] Imagen estática del mapa (captura de Google Maps o un mapa con clave de API). Hoy "Cómo llegar" muestra una ilustración con el pin y la dirección hasta que se toca "Ver mapa".
- [ ] Confirmar si la foto `pizzas.webp` son tortizzas.

## Mejoras opcionales (mejor resolución)

- [ ] Terraza de noche: la original mide 232×456; se muestra en un arco chico de 112 px para que no se vea borrosa.
- [ ] Ensalada: la original mide 190×312; se muestra a 128 px.
- [ ] Pasteles, rollos de canela y galletas: miden menos de 500 px de ancho.
- [ ] Interior en alta resolución, horizontal.

## Fotos que no se usan

- Master Class (Screenshot 162204): aparece una pastelera conocida y sugeriría una asociación no confirmada.
- Fotos del post de horario (WhatsApp 4.24.05 PM): son fragmentos de fotos dentro de un diseño; el horario ya está en `business.ts`.
- Screenshot 162832 (interior con rótulo sobreimpreso): el texto queda en el centro de la foto y no se puede quitar con un recorte.
- Copias de WhatsApp de las fotos del evento y del interior: son las mismas imágenes, con menor resolución.
- Capturas de menús, perfil de Instagram (Screenshot 162537) y tarjetas con logo: no son fotos (el menú ya está en `src/data/menu.ts`).
