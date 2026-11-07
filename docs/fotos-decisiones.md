# Decisión sobre las 36 imágenes recibidas (etapa 5C-2)

El negocio envió todas las imágenes de la carpeta HoneyDipper, así que el permiso está confirmado para todas.
Cada foto que se usa sale del archivo original, recortada con `scripts/crop-photos.py`: se quitan la barra de
estado del celular, los usuarios, los "me gusta", los comentarios, el texto de la publicación, los avisos de
copyright y los íconos de reel. Las que no se pueden dejar limpias no se usan.

| # | Archivo original | Decisión | Dónde y por qué |
| --- | --- | --- | --- |
| 01 | 334567232_128492653313998_3196433340749445455_n.jpg | Se usa | Logo: header y hero (recortes en WebP). Falta versión transparente. |
| 02 | IMG_2352(1).PNG | Se usa | Eventos, primera foto (1170×1548). Recorte: solo la foto, sin barra de estado, usuario, "me gusta" ni texto de la publicación. Crédito "Foto: @fotogenicacr". |
| 03 | IMG_2353.PNG | Se usa | Eventos, segunda foto (1170×1440). Mismo recorte y crédito. |
| 04 | IMG_2354.PNG | Se usa | Hero y El lugar (arco completo, 1170×1557) y El lugar con otro encuadre (mostrador, 750×700). Recorte sin nombre de usuario, aviso de copyright ni botones. |
| 05 | Screenshot 2026-11-06 161803.png | No se usa | Es la misma vista del interior de IMG_2354, con menor resolución (378×462). |
| 06 | Screenshot 2026-11-06 161846.png | Se usa | El lugar: terraza de noche, en arco chico de 112 px (original 232×456). |
| 07 | Screenshot 2026-11-06 162126.png | Se usa | Menú, Ensaladas: miniatura de 128 px (recorte cuadrado de 184×184). |
| 08 | Screenshot 2026-11-06 162204.png | No se usa | Master Class: aparece una pastelera conocida; sugeriría una asociación no confirmada. |
| 09 | Screenshot 2026-11-06 162222.png | Se usa | Pastelería: pastel "Happy Birthday my love". Recorte sin los puntos del carrusel. |
| 10 | Screenshot 2026-11-06 162253.png | Se usa | Pastelería: pastel de dos pisos. Recorte sin la flecha del carrusel ni los puntos. |
| 11 | Screenshot 2026-11-06 162327.png | No se usa | Tarjeta con el logo, no es una foto. |
| 12 | Screenshot 2026-11-06 162537.png | No se usa | Perfil de Instagram: usuarios, seguidores e interfaz; no hay foto limpia. |
| 13 | Screenshot 2026-11-06 162626.png | Se usa | Menú, Brunch: pancakes con helado. Recorte sin el ícono de reel. |
| 14 | Screenshot 2026-11-06 162644.png | Se usa | Menú, Tortizzas: pizzas. Recorte sin el ícono de reel. |
| 15 | Screenshot 2026-11-06 162653.png | Se usa | Pastelería: rollos de canela. Recorte sin el ícono de reel. |
| 16 | Screenshot 2026-11-06 162820.png | Se usa | Pastelería: galletas de avena. |
| 17 | Screenshot 2026-11-06 162832.png | No se usa | Interior con "HONEY DIPPER" sobreimpreso en el centro. Recortar arriba deja techo y un rótulo lavado por el flash ("HON… DIPPER"); recortar abajo deja mesa y piso con un cliente. No queda bien. |
| 18 | Screenshot 2026-11-06 162856.png | Se usa | Menú, Sándwiches: sándwich con papas waffle. |
| 19 | Screenshot 2026-11-06 162926.png | Se usa | Menú, Hamburguesas: hamburguesa de pollo. Recorte sin el botón "Compartir" ni la camiseta de una persona. |
| 20 | Screenshot 2026-11-06 162937.png | Se usa | Menú, Hamburguesas: hamburguesa con papas waffle. Recorte a la bandeja, sin el brazo ni las piernas de la persona. |
| 21 | WhatsApp Image 2026-11-06 at 4.15.21 PM.jpeg | No se usa | Copia de IMG_2352 con menor resolución (739×1600). |
| 22 | WhatsApp Image 2026-11-06 at 4.15.22 PM (1).jpeg | No se usa | Copia de IMG_2353 con menor resolución. |
| 23 | WhatsApp Image 2026-11-06 at 4.15.22 PM.jpeg | No se usa | Copia de IMG_2354 con menor resolución. |
| 24 | WhatsApp Image 2026-11-06 at 4.24.05 PM (1).jpeg | No se usa | Página del menú Mexicano: es texto, ya está en `menu.ts`. |
| 25 | WhatsApp Image 2026-11-06 at 4.24.05 PM (10).jpeg | No se usa | Página de Bebidas calientes: texto. |
| 26 | WhatsApp Image 2026-11-06 at 4.24.05 PM (11).jpeg | No se usa | Página de Bebidas frías: texto. |
| 27 | WhatsApp Image 2026-11-06 at 4.24.05 PM (2).jpeg | No se usa | Portada del menú con el logo: no es foto. |
| 28 | WhatsApp Image 2026-11-06 at 4.24.05 PM (3).jpeg | No se usa | Página de Entradas y Ensaladas: texto. |
| 29 | WhatsApp Image 2026-11-06 at 4.24.05 PM (4).jpeg | No se usa | Página de Casados, Tortizzas y Montaditos: texto. |
| 30 | WhatsApp Image 2026-11-06 at 4.24.05 PM (5).jpeg | No se usa | Página de Pastas y Sándwiches: texto. |
| 31 | WhatsApp Image 2026-11-06 at 4.24.05 PM (6).jpeg | No se usa | Página de Pitas y Wraps: texto. |
| 32 | WhatsApp Image 2026-11-06 at 4.24.05 PM (7).jpeg | No se usa | Página de Snacks: texto. |
| 33 | WhatsApp Image 2026-11-06 at 4.24.05 PM (8).jpeg | No se usa | Página de Hamburguesas: texto. |
| 34 | WhatsApp Image 2026-11-06 at 4.24.05 PM (9).jpeg | No se usa | Página de Crepas y Niños: texto. |
| 35 | WhatsApp Image 2026-11-06 at 4.24.05 PM.jpeg | No se usa | Post de horario: fragmentos de fotos en un diseño (decisión del dueño). El horario ya está en `business.ts`. |
| 36 | WhatsApp Image 2026-11-06 at 4.24.06 PM.jpeg | No se usa | Página de Brunch: texto. |

Se usan 15 de 36; las otras 21 son duplicados, capturas de texto o interfaz, o no se pueden dejar limpias.
