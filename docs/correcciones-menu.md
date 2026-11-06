# Correcciones del menú

Archivo generado con `npm run docs:correcciones`. No editar a mano.

Regla aprobada por Daryl: se corrige solo el texto que se muestra (descripciones y notas). Los
**nombres de los platos se dejan como están** (por ejemplo "Hawaina", "Capresse", "Expresso",
"Capuccino", "Té caliente ó frío"). El texto original queda intacto en `src/data/menu.ts`; las
correcciones viven en `src/data/menu-corrections.ts` y se aplican al mostrar. Para que el dueño
rechace una, se borra su fila en ese archivo y se vuelve a generar este documento.

Total: 43 correcciones en 13 reglas.

| Original | Corregido | Dónde |
| --- | --- | --- |
| Ensalda | Ensalada | Wraps > Pollo |
| ensalda | ensalada | Snacks > Fajitas |
| soble | doble | Bebidas calientes > Latte |
| poodoro | pomodoro | Waffles o croissants > Italiano |
| adearezo | aderezo | Hamburguesas > Pollo |
| Turrilaba | Turrialba | Tostadas francesas > Tostadas francesas |
| acosto | costo | Entradas > Orden de patacones |
| duce de leche | dulce de leche | Frappés > Frappé paleta |
| chill – beans | chili beans | Menú mexicano > Hamburguesa mexicana |
| marshmellows | marshmallows | Bebidas calientes > Chocolate caliente |
| mozarella | mozzarella | Tortizzas > Honey Dipper |
| mozarella | mozzarella | Tortizzas > Jamón y queso |
| mozarella | mozzarella | Tortizzas > Hawaina |
| mozarella | mozzarella | Tortizzas > Margarita |
| mozarella | mozzarella | Tortizzas > Mexicana |
| mozarella | mozzarella | Sandwiches > Capresse |
| mozarella | mozzarella | Sandwiches > Sándwich Honey |
| mozarella | mozzarella | Sandwiches > Birria |
| mozarella | mozzarella | Sandwiches > Chicken nuggets |
| mozarella | mozzarella | Pitas > Capresse |
| mozarella | mozzarella | Snacks > Chimichanga |
| mozarella | mozzarella | Snacks > Papas Honey |
| mozarella | mozzarella | Hamburguesas > Carne |
| mozarella | mozzarella | Hamburguesas > Pollo |
| mozarella | mozzarella | Hamburguesas > Vegetariana |
| mozarella | mozzarella | Hamburguesas > Chicken burger |
| mozarella | mozzarella | Hamburguesas > Pulled pork |
| mozarella | mozzarella | Hamburguesas > La pepperoni |
| mozarella | mozzarella | Hamburguesas > La tropical |
| mozarella | mozzarella | Menú mexicano > Quesabirria |
| mozarella | mozzarella | Menú mexicano > Sopa azteca |
| mozarella | mozzarella | Menú mexicano > Chimichanga |
| mozarella | mozzarella | Menú mexicano > Nachos |
| mozarella | mozzarella | Menú mexicano > Hamburguesa mexicana |
| mozarella | mozzarella | Brunch > Honey brunch |
| mozarella | mozzarella | Brunch > Sandwich de pan brioche |
| mozarella | mozzarella | Waffles o croissants > Jamón y queso |
| mozarella | mozzarella | Waffles o croissants > Capresse |
| mozarella | mozzarella | Waffles o croissants > Italiano |
| peperoni | pepperoni | Hamburguesas > La pepperoni |
| " ," | "," | Sandwiches > De la casa |
| " ," | "," | Menú mexicano > Hamburguesa mexicana |
| " ," | "," | Waffles o pancakes > Nutella |

## Cambios de contenido (no son de ortografía)

El dueño pidió cambiar qué dice el plato. El original queda en `src/data/menu.ts`; el texto nuevo
vive en `src/data/menu-content-changes.ts` y es el que se muestra. Antes de publicar, el dueño
debe aprobar el texto exacto.

| Plato | Original | Nuevo | Estado | Motivo |
| --- | --- | --- | --- | --- |
| Mango strawberry | Bebida carbonatada con reducción de frutos rojos o maracuyá. | Bebida carbonatada con mango y reducción de frutos rojos o maracuyá. | **Pendiente de aprobación del dueño** | El dueño confirmó que sí lleva mango (2026-11-06). La descripción original era igual a la de la Clásica. |

## Pendientes de decidir con el dueño (no se corrigen)

- "Camarón saltado" en Montaditos > Camarón (en Ensaladas dice "salteado").
- "Lechuga, tomate atún arreglado" en Sandwiches > Atún (parece faltar una coma).
