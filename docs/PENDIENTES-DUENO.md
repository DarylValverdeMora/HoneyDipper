# Preguntas para el dueño

Redactadas para mandarlas por WhatsApp, una por línea. Van en dos bloques: lo que bloquea la publicación y lo
que mejora la página. El permiso de las fotos de comida, pasteles y evento ya está resuelto (el negocio las
envió), así que no se pregunta.

Cada pregunta dice entre paréntesis dónde vive el dato en el código, para el que haga el cambio.

## Bloquean la publicación

1. ¿Cuál de estos números tiene WhatsApp: 8396-8602 (restaurante) o 6349-0223 (pastelería)? (`business.contact`, `whatsappStatus`)
2. ¿A qué número quieres que lleguen las reservas de mesa? (`whatsapp.ts`, plantilla `reserva`)
3. ¿A qué número quieres que lleguen las cotizaciones de pasteles? (`whatsapp.ts`, plantilla `pastel`)
4. ¿A qué número quieres que lleguen las consultas de eventos? (`business.eventosLinea`)
5. ¿Y las preguntas sobre el menú? (`whatsapp.ts`, plantilla `consulta`)
6. ¿La chimichanga cuesta ₡4.850 (menú de snacks) o ₡4.650 (menú mexicano)? (`menu.ts`, dos productos "Chimichanga")
7. ¿Cuánto cuesta hoy el frappé de horchata? Salió sin precio en el menú. (`menu.ts`, "Frappé horchata")
8. ¿El brunch es solo sábado y domingo? ¿De qué hora a qué hora? (`business.brunch` y `menu.ts`, etiqueta de Brunch)
9. ¿El menú mexicano sigue vigente? (`mostrarMenuMexicano` en `menu.ts`)
10. ¿Aprueban las correcciones de ortografía del menú? Van en `docs/correcciones-menu.md`; los nombres de los platos no se tocaron.
11. ¿Aprueban este texto para la soda italiana Mango strawberry? Hoy dice "reducción de frutos rojos o maracuyá" y lleva mango. (`menu-content-changes.ts`)
12. ¿La dirección queda como "Frente al parquecito de la Dominica, Turrialba"? ¿Quieres agregar algo más, como el distrito? (`business.location.address`)
13. ¿Cuál es la última hora a la que se puede reservar? Puse una hora antes del cierre. (`business.reservaUltimaAntesCierreMin`)
14. ¿Hasta cuántas personas se reservan por la página? Más de eso lo conversan por WhatsApp. Puse 10. (`business.reservaMaxPersonas`)

## Mejoran la página

1. ¿Tienen el logo en SVG o PNG con fondo transparente? (`Logo.tsx`; hoy se saca de un JPG)
2. ¿Pueden mandar las fotos originales, sin recortar y en alta resolución, de la terraza, las ensaladas y los eventos?
3. ¿Tienen una foto de la fachada o de la entrada? (`photos.ts`, hoy es un espacio vacío en "El lugar")
4. ¿Tienen fotos de bebidas y café servidos en el local?
5. ¿Las pizzas de la foto son tortizzas? (`photos.ts`, `pizzas`)
6. ¿Quieres un texto de "Sobre nosotros"? Cuéntanos cómo empezó Honey Dipper y quién está detrás. (`business.about`)
7. ¿Tienen testimonios de clientes que podamos mostrar, con permiso de quien los escribió?
8. ¿Tienen Facebook o TikTok? (`business.social`)
9. ¿La pareja que sale en las fotos del evento está de acuerdo en aparecer en la página? (`photos.ts`, `eventoRevelacion` y `eventoGlobos`)
10. ¿Pueden confirmar con @fotogenicacr que está bien poner "Foto: @fotogenicacr" junto a sus fotos?

## Cruce con los [PLACEHOLDER] del código

Salen de `grep -rn "\[PLACEHOLDER\]" src index.html scripts`. Cada uno está cubierto por una pregunta de arriba
o por un paso de `CHECKLIST-ENTREGA.md`.

| Dónde | Qué falta | Pregunta |
| --- | --- | --- |
| `business.ts` (contact) | Cuál número tiene WhatsApp | Bloquean 1 |
| `business.ts` (`reservaUltimaAntesCierreMin`) | Última hora de reserva | Bloquean 13 |
| `business.ts` (`reservaMaxPersonas`) | Máximo de personas | Bloquean 14 |
| `business.ts` (`eventosLinea`) | Número de eventos | Bloquean 4 |
| `whatsapp.ts` (plantilla `consulta`) | Número de consultas del menú | Bloquean 5 |
| `business.ts` (`brunch`) y `menu.ts` (etiqueta de Brunch) | Días y horario del brunch | Bloquean 8 |
| `business.ts` (`about`) | Texto de "sobre nosotros" | Mejoran 6 |
| `business.ts` (`social`) | Facebook y TikTok | Mejoran 8 |
| `photos.ts` (`pizzas`) | Si son tortizzas | Mejoran 5 |
| `photos.ts` (`missingPhotos`) y `PhotoPlaceholder.tsx` | Fachada y bebidas | Mejoran 3 y 4 |
| `Logo.tsx` | Logo transparente | Mejoran 1 |
| `site.ts` (`indexable`) | Quitar el noindex al publicar | `CHECKLIST-ENTREGA.md` |
| `site.ts` (`url`) | URL pública del sitio | `CHECKLIST-ENTREGA.md` |

Sin marca [PLACEHOLDER] en el código pero también pendientes: precio de la chimichanga, precio del frappé de
horchata, menú mexicano vigente, aprobación de las correcciones, texto de Mango strawberry y dirección final
(Bloquean 6, 7, 9, 10, 11 y 12).
