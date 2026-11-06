/**
 * Menú completo de Honey Dipper, transcrito de las imágenes del menú (WhatsApp Image 2026-11-06 at
 * 4.24.05 PM (1) a (11) y 4.24.06 PM). Los textos están tal cual el original; las correcciones de
 * ortografía se aplican solo al mostrarlos (src/data/menu-corrections.ts, docs/correcciones-menu.md).
 * Todos los precios en colones. 10% de servicio no incluido.
 */
import {
  PRECIO_PENDIENTE,
  precioPorTamanos as tamanos,
  precioUnico as unico,
} from './menu.types'
import type { Menu, MenuFlag } from './menu.types'

/** Cambiar a false oculta el menú mexicano completo (puede ser temporal). */
export const menuFlags: Record<MenuFlag, boolean> = {
  mostrarMenuMexicano: true,
}

const POR_CONFIRMAR_CHIMICHANGA =
  'Hay dos chimichangas: ₡4.850 en Snacks y ₡4.650 en el Menú mexicano. Confirmar cuál está vigente.'

const WAFFLE_O_PANCAKES = ['Waffle', 'Pancakes'] as const
const WAFFLE_O_CROISSANT = ['Waffle', 'Croissant'] as const

export const menu: Menu = [
  {
    id: 'comidas',
    pestana: 'Comidas',
    etiqueta: { kind: 'confirmada', texto: 'Comidas' },
    categorias: [
      {
        id: 'entradas',
        nombre: 'Entradas',
        productos: [
          { nombre: 'Aros de cebolla', descripcion: 'Crujientes aros de cebolla con tu salsa favorita.', precio: unico(3700) },
          { nombre: 'Dados de queso', descripcion: 'Elige tu salsa: mayo albahaca, mayo chipotle, mostaza miel o BBQ.', precio: unico(4200) },
          {
            nombre: 'Yuca',
            descripcion:
              '5 sticks de Yuca frita con 1 acompañamiento a escoger: frijoles molidos, pico de gallo, guacamole, carne en salsa. Más de un acompañamiento tiene costo adicional.',
            precio: unico(3950),
          },
          {
            nombre: 'Orden de patacones',
            descripcion:
              '6 Patacones con 2 acompañamientos a escoger: Frijoles molidos, pico de gallo, guacamole o carne en salsa. Más de dos acompañamientos tiene acosto adicional de ₡250.',
            precio: unico(4400),
          },
          { nombre: 'Mini sándwich 3 quesos', descripcion: 'En pan artesanal, acompañado con sopa de tomate.', precio: unico(4400) },
          { nombre: 'Empanada de birria', descripcion: 'Con nuestra deliciosa carne de birria', precio: unico(3000) },
          { nombre: 'Trío de empanadas', descripcion: 'De carne, pollo o picadillo de papa con chorizo. Con salsa mayo albahaca.', precio: unico(2500) },
          { nombre: 'Mini surtido', descripcion: 'Papas, Aros de cebolla, Nuggets (Pollo, Pescado) y una salsa a escoger.', precio: unico(5000) },
        ],
      },
      {
        id: 'ensaladas',
        nombre: 'Ensaladas',
        productos: [
          { nombre: 'Vegetariana', descripcion: 'Ensalada base, tomate, fresas, aguacate, almendra, torta vegana y mostaza miel.', precio: unico(4200) },
          { nombre: 'César', descripcion: 'Ensalada base, tomate cherry, queso parmesano,  pollo a la plancha, croutons y aderezo césar.', precio: unico(4700) },
          { nombre: 'Honey', descripcion: 'Ensalada base, tomate, fresa, aguacate, fajitas de carne con chile y cebolla.', precio: unico(4500) },
          { nombre: 'Camarón', descripcion: 'Ensalada base, tomate, fresa, aguacate, camarón salteado y aderezo ranch.', precio: unico(4950) },
        ],
      },
      {
        id: 'casados',
        nombre: 'Casados',
        productos: [
          {
            nombre: 'Casado',
            descripcion:
              'Arroz, frijoles, picadillo, plátano maduro, ensalada y 1 proteína a escoger: Pollo, Carne Mechada, Chuleta o Pescado. *Incluye bebida del día.',
            precio: unico(4200),
          },
          { nombre: 'Arroz con camarones', precio: unico(5500) },
          { nombre: 'Arroz con carne', precio: unico(4950) },
          { nombre: 'Arroz con pollo', precio: unico(4950) },
        ],
      },
      {
        id: 'tortizzas',
        nombre: 'Tortizzas',
        nota: 'Deliciosas pizzas livianas en una base de tortilla de harina.',
        productos: [
          { nombre: 'Honey Dipper', descripcion: 'Carne mechada, cebolla, chile dulce, hongos y queso mozarella.', precio: unico(4900) },
          { nombre: 'Jamón y queso', descripcion: 'Jamón y queso mozarella.', precio: unico(4900) },
          { nombre: 'Hawaina', descripcion: 'Jamón, piña y queso mozarella.', precio: unico(4900) },
          { nombre: 'Margarita', descripcion: 'Tomate cherry, albahaca y queso mozarella.', precio: unico(4600) },
          { nombre: 'Mexicana', descripcion: 'Pollo mechado, chile, cebolla, aguacate, jalapeños y queso mozarella.', precio: unico(4900) },
          { nombre: 'Nutella fresa', descripcion: 'Nutella, fresas y azúcar glass.', precio: unico(4900) },
        ],
      },
      {
        id: 'montaditos',
        nombre: 'Montaditos',
        nota: 'Bocadillos variados sobre una rebanada de pan.',
        productos: [
          { nombre: 'Capresse', descripcion: 'Tomate, queso, pesto y albahaca finamente picada.', precio: unico(4500) },
          { nombre: 'Atún', descripcion: 'Atún arreglado, tomate, aguacate y aderezo de la casa.', precio: unico(4500) },
          { nombre: 'Hongos', descripcion: 'Hongos de la casa, tomate cherry y guacamole.', precio: unico(4500) },
          { nombre: 'Camarón', descripcion: 'Camarón saltado, tomate cherry y guacamole.', precio: unico(4950) },
        ],
      },
      {
        id: 'pastas',
        nombre: 'Pastas',
        nota: 'Incluye 3 tostadas',
        productos: [
          { nombre: 'Al pesto', descripcion: 'Pollo a la plancha y salsa pesto.', precio: unico(4950) },
          { nombre: 'Camarones', descripcion: 'Camarones en salsa blanca.', precio: unico(5300) },
          { nombre: 'Pollo champiñones', descripcion: 'Pollo a la plancha en salsa blanca con hongos.', precio: unico(4950) },
          { nombre: 'Boloñesa', descripcion: 'Carne molida, salsa roja y queso parmesano.', precio: unico(5000) },
          { nombre: 'Vegetariana', descripcion: 'Falafel o Vegetales, hongos y salsa roja o blanca.', precio: unico(5000) },
        ],
      },
      {
        id: 'sandwiches',
        nombre: 'Sandwiches',
        nota: 'Acompañados de papas fritas',
        productos: [
          { nombre: 'De la casa', descripcion: 'Lechuga , tomate, elegir entre: pollo, carne o mano de piedra y aderezo de la casa.', precio: unico(5350) },
          { nombre: 'Jamón y queso', descripcion: 'Lechuga, tomate, jamón, queso mozzarella, aderezo de la casa.', precio: unico(4950) },
          { nombre: 'Tico', descripcion: 'Carne mechada, frijoles molidos, queso mozzarella gratinado, guacamole y natilla.', precio: unico(5350) },
          { nombre: 'Mexicano', descripcion: 'Carne mechada, queso mozzarella, mayo chipotle y guacamole.', precio: unico(5350) },
          { nombre: 'Atún', descripcion: 'Lechuga, tomate atún arreglado y aderezo de la casa.', precio: unico(5350) },
          { nombre: 'Capresse', descripcion: 'Albahaca,  tomates cherry, queso mozarella gratinado y pesto.', precio: unico(4950) },
          { nombre: 'Hongos', descripcion: 'Lechuga, tomate, hongos de la casa, guacamole y aderezo de la casa.', precio: unico(4950) },
          {
            nombre: 'Sándwich Honey',
            descripcion: 'Lomito aguja salteado con chile dulce y cebolla, queso mozarella, salsa de pejibaye o aderezo de la casa.',
            precio: unico(5700),
          },
          { nombre: 'Birria', descripcion: 'Carne mechada, queso mozarella, cebolla morada, culantro, acompañado de salsa de birria.', precio: unico(5700) },
          { nombre: 'Chicken nuggets', descripcion: 'Pollo crispy, bañado en salsa a escoger, ensalada coleslaw y queso mozarella.', precio: unico(5700) },
          { nombre: 'Trío de tostadas', descripcion: 'Guacamole y hongos, cherry y albahaca, mozzarella y bacon.', precio: unico(4850) },
        ],
      },
      {
        id: 'pitas',
        nombre: 'Pitas',
        productos: [
          { nombre: 'César', descripcion: 'Pollo a la plancha, lechuga finamente picada, tomate cherry,  crutones y aderezo césar.', precio: unico(4900) },
          { nombre: 'Pavo y aguacate', descripcion: 'Jamón de pavo, ensalada de la casa, guacamole, mayo-albahaca y mostaza miel.', precio: unico(4500) },
          { nombre: 'Mechudo', descripcion: 'Carne mechada, ensalada de la casa, guacamole y aderezos.', precio: unico(4900) },
          { nombre: 'Capresse', descripcion: 'Ensalada base, tomate, queso mozarella (sin derretir) y pesto.', precio: unico(4600) },
          { nombre: 'Carne', descripcion: 'Ensalada de la casa, fajitas de lomito con chile y cebolla, guacamole y aderezo de la casa.', precio: unico(5200) },
        ],
      },
      {
        id: 'wraps',
        nombre: 'Wraps',
        productos: [
          { nombre: 'Pollo', descripcion: 'Ensalda de la casa, pollo crispy, tomate y aderezo de la casa.', precio: unico(5300) },
          { nombre: 'Carne mechada', descripcion: 'Ensalada de la casa, carne mechada en su salsa, mozzarella, aderezo de la casa.', precio: unico(5300) },
          { nombre: 'Camarón', descripcion: 'Ensalada de la casa, camarón empanizado, pepinillos y mayochipotle.', precio: unico(5950) },
          { nombre: 'Lomito', descripcion: 'Ensalada de la casa, fajitas de lomito con chile y cebolla y aderezo de la casa.', precio: unico(5950) },
        ],
      },
      {
        id: 'snacks',
        nombre: 'Snacks',
        productos: [
          {
            nombre: 'Chimichanga',
            descripcion: 'Tortilla de harina, frijoles molidos, pollo o carne con chipotle, queso mozarella, acompañado de papas.',
            precio: unico(4850),
            porConfirmar: POR_CONFIRMAR_CHIMICHANGA,
          },
          { nombre: 'Alitas', descripcion: '6 alitas de pollo con papas y 2 salsas a escoger.', precio: unico(4200) },
          { nombre: 'Quesadilla', descripcion: 'De pollo o carne, acompañada de papas y salsa.', precio: unico(4700) },
          { nombre: 'Nuggets', descripcion: 'Acompañado de papas y mostaza miel.', precio: unico(4200) },
          { nombre: 'Dedos de pollo', descripcion: 'Acompañados de papas y 1 salsa a escoger.', precio: unico(4700) },
          { nombre: 'Dedos de pescado', descripcion: 'Acompañados de ensalada, papas y 1 salsa a escoger.', precio: unico(4700) },
          { nombre: 'Trío de tacos', descripcion: '3 deliciosos tacos, 1 de pescado, 1 de camarón y 1 de carne.', precio: unico(4700) },
          {
            nombre: 'Papas Honey',
            descripcion: 'Papas de la casa, frijoles molidos hechos en casa, carne mechada, pico de gallo, guacamole, salsas y queso mozarella.',
            precio: unico(3950),
          },
          { nombre: 'Fajitas', descripcion: 'Fajitas de pollo, res o mixtas. Acompañadas de papas y ensalda.', precio: unico(4950) },
          {
            nombre: 'Tacos ticos',
            descripcion: '4 tacos fritos con carne mechada sobre una cama de ensalada verde  y aderezo de la casa.',
            precio: unico(3850),
          },
          {
            nombre: 'Churros',
            descripcion: 'Deliciosos churros bañados en chocolate y leche condensada acompañados con bola de helado.',
            precio: unico(3300),
          },
        ],
      },
      {
        id: 'hamburguesas',
        nombre: 'Hamburguesas',
        nota: 'Incluyen papas fritas y aderezo mostaza miel.',
        productos: [
          {
            nombre: 'Carne',
            descripcion: 'Pan brioche, lechuga, tomate, torta de carne, 2 aros de cebolla y queso mozarella, guacamole y aderezo de la casa.',
            precio: unico(6000),
          },
          {
            nombre: 'Pollo',
            descripcion: 'Pan brioche, lechuga, tomate, pepinillos, pollo crispy,  2 aros de cebolla, guacamole, queso mozarella y adearezo de la casa.',
            precio: unico(5500),
          },
          {
            nombre: 'Vegetariana',
            descripcion: 'Pan brioche, lechuga, tomate, pepinillos, torta vegetariana, 2 aros de cebolla,  queso mozarella y aderezo de la casa.',
            precio: unico(5000),
          },
          {
            nombre: 'Pescado',
            descripcion: 'Pan artesanal, filet de pescado empanizado, lechuga, tomate, cebolla morada y salsa tártara.',
            precio: unico(5500),
          },
          {
            nombre: 'La perfecta',
            descripcion: 'Pan brioche, doble torta de carne, cebolla caramelizada, pepinillos, salsa de queso, tocineta y salsa BBQ.',
            precio: unico(6000),
          },
          {
            nombre: 'La Honey Dipper',
            descripcion: 'Pan brioche, lechuga, tomate, pepinillos, torta de carne, queso Turrialba empanizado, tocineta crujiente  y aderezo de la casa.',
            precio: unico(6000),
          },
          {
            nombre: 'Chicken burger',
            descripcion: 'Pan brioche, pollo empanizado, salsa agridulce, ensalada de repollo coleslaw y queso mozarella.',
            precio: unico(5500),
          },
          {
            nombre: 'Hamburguesa de patacón',
            descripcion: 'Con dos patacones, lechuga, tomate, pollo empanizado o torta de carne y aderezo de la casa.',
            precio: unico(4800),
          },
          {
            nombre: 'Pulled pork',
            descripcion: 'Pan brioche, pepinillos, pulled pork bañada en salsa BBQ hecha en casa, con ensalada de repollo coleslaw y queso mozarella.',
            precio: unico(6000),
          },
          { nombre: 'La del jefe', descripcion: 'Torta de carne, hongos, cebolla caramelizada, lechuga y mayochipotle.', precio: unico(6000) },
          { nombre: 'La pepperoni', descripcion: 'Torta de carne, queso mozarella y peperoni.', precio: unico(6000) },
          { nombre: 'La tropical', descripcion: 'Torta de carne, piña, queso mozarella y salsa jalapeña.', precio: unico(6000) },
          {
            nombre: 'De patacón',
            descripcion: 'Dos patacones con torta de carne, lechuga, tomate y queso.',
            precio: unico(5000),
          },
        ],
      },
      {
        id: 'menu-mexicano',
        nombre: 'Menú mexicano',
        visibleSi: 'mostrarMenuMexicano',
        productos: [
          { nombre: 'Tacos de birria', descripcion: '4 tacos acompañados de cebolla morada, culantro y salsa de birria.', precio: unico(4000) },
          { nombre: 'Quesabirria', descripcion: 'Tortilla de harina, queso mozarella, carne mechada, bañada en salsa de birria', precio: unico(4500) },
          { nombre: 'Sopa azteca', descripcion: 'Sopa de tomate, pollo mechado, queso mozarella, aguacate, natilla y chips.', precio: unico(4000) },
          {
            nombre: 'Chimichanga',
            descripcion: 'Tortilla de harina, frijoles molidos, queso mozarella, pollo o carne con chipotle, papas y ensalada.',
            precio: unico(4650),
            porConfirmar: POR_CONFIRMAR_CHIMICHANGA,
          },
          {
            nombre: 'Nachos',
            descripcion: 'Tortillas, frijoles molidos, carne mechada, queso mozarella, pico de gallo, guacamole y salsas.',
            precio: unico(4500),
          },
          {
            nombre: 'Hamburguesa mexicana',
            descripcion: 'Pan brioche, lechuga , tomate , chill – beans,  carne mechada, queso mozarella, y aros de cebolla, salsa chipotle.',
            precio: unico(4950),
          },
        ],
      },
    ],
  },
  {
    id: 'brunch',
    pestana: 'Brunch',
    etiqueta: {
      kind: 'pendiente',
      texto: 'Brunch (sáb. y dom.)',
      placeholder: '[PLACEHOLDER] Confirmar que el brunch es solo sábado y domingo',
    },
    categorias: [
      {
        id: 'brunch',
        nombre: 'Brunch',
        nota: 'Buenos días',
        productos: [
          { nombre: 'Gallo pinto', descripcion: 'Pinto, huevo, carne en salsa, plátano maduro y una tostada.', precio: unico(4000) },
          { nombre: 'Omelette', descripcion: 'Huevos revueltos con espinaca, chile dulce, cebolla, jamón, queso mozzarella y ensalada.', precio: unico(3800) },
          {
            nombre: 'Wrap de gallo pinto',
            descripcion: 'Tortilla de harina con pinto, huevo picado, tocineta, queso Turrialba, ramiquín de salsa pomodoro y fruta.',
            precio: unico(4200),
          },
          {
            nombre: 'Honey brunch',
            descripcion: 'Dos tortillas de harina con frijoles molidos de la casa, 2 huevos fritos,  queso mozarella y salsa ranchera.',
            precio: unico(3950),
          },
          { nombre: 'Bagel vegetariano', descripcion: 'Espinaca, tomate, queso Turrialba, huevo frito y guacamole.', precio: unico(3850) },
          { nombre: 'Bagel de huevo', descripcion: 'Lechuga, tomate, huevo frito, tocineta, aguacate y queso mozzarella.', precio: unico(4000) },
          {
            nombre: 'Sandwich de pan brioche',
            descripcion: 'Lechuga, tomate, aguacate, jamón, queso mozarella y aderezo de la casa.',
            precio: unico(3850),
          },
          { nombre: 'Tostadas de pan brioche', descripcion: 'Dos tostadas de pan brioche con huevo y aguacate.', precio: unico(3500) },
        ],
      },
      {
        id: 'waffles-pancakes',
        nombre: 'Waffles o pancakes',
        productos: [
          { nombre: 'Tradicional', descripcion: 'Maple, fresas y banano.', precio: unico(3850), formato: WAFFLE_O_PANCAKES },
          { nombre: 'Banoffee', descripcion: 'Con salsa de caramelo y banano.', precio: unico(3850), formato: WAFFLE_O_PANCAKES },
          { nombre: 'Nutella', descripcion: 'Nutella , fresas y banano.', precio: unico(3850), formato: WAFFLE_O_PANCAKES },
          {
            nombre: 'Fresa & limón',
            descripcion: 'Relleno de limón bañado en reducción de fresas.',
            precio: unico(3850),
            formato: WAFFLE_O_PANCAKES,
          },
        ],
      },
      {
        id: 'waffles-croissants',
        nombre: 'Waffles o croissants',
        productos: [
          { nombre: 'Jamón y queso', descripcion: 'Jamón y queso mozarella.', precio: unico(3950), formato: WAFFLE_O_CROISSANT },
          { nombre: 'Queso Turrialba', descripcion: 'Con reducción de frutos rojos.', precio: unico(3950), formato: WAFFLE_O_CROISSANT },
          {
            nombre: 'Capresse',
            descripcion: 'Queso mozarella, jamón y tomate cherry con pesto.',
            precio: unico(3950),
            formato: WAFFLE_O_CROISSANT,
          },
          {
            nombre: 'Italiano',
            descripcion: 'Huevos, tocineta, queso mozarella y salsa poodoro.',
            precio: unico(3950),
            formato: WAFFLE_O_CROISSANT,
          },
          { nombre: 'Carne o pollo', descripcion: 'Con lechuga, queso y tomate.', precio: unico(3950), formato: WAFFLE_O_CROISSANT },
          {
            nombre: 'Miel & huevo',
            descripcion: 'Miel de abeja o maple, tocineta y huevo frito.',
            precio: unico(3950),
            formato: WAFFLE_O_CROISSANT,
          },
        ],
      },
      {
        id: 'tostadas-francesas',
        nombre: 'Tostadas francesas',
        productos: [
          {
            nombre: 'Tostadas francesas',
            descripcion:
              'Las mejores tostadas de la zona, mojadas en nuestra salsa especial, pan blanco elaborado por emprendedores de Turrilaba, cubiertas con reducción de moras, fresas y miel de maple.',
            precio: unico(4500),
          },
        ],
      },
    ],
  },
  {
    id: 'dulces',
    pestana: 'Dulces',
    etiqueta: { kind: 'confirmada', texto: 'Dulces' },
    categorias: [
      {
        id: 'crepas',
        nombre: 'Crepas',
        nota: 'Acompañadas de helado.',
        productos: [
          {
            nombre: 'Honey Dipper',
            descripcion: 'Leche condensada cocinada, almendras, caramelo, nuestra deliciosa torta chilena y helado.',
            precio: unico(4400),
          },
          { nombre: 'Fresa Nutella', descripcion: 'Nutella, fresas, sirope hersheys y helado.', precio: unico(4000) },
          { nombre: 'Mora', descripcion: 'Moras en almíbar, leche condensada y helado.', precio: unico(4000) },
          { nombre: 'Churchill', descripcion: 'Fresas, leche pinito, leche condensada y helado.', precio: unico(4000) },
          { nombre: 'Brownie', descripcion: 'Nutella, brownie, maní, sirope hersheys y helado.', precio: unico(4000) },
          { nombre: 'Choco fresa', descripcion: 'Nutella, fresas, sirope de hersheys y helado.', precio: unico(4000) },
          { nombre: 'Maracuyá', descripcion: 'Crepa invertida con almíbar de maracuyá  y helado adentro.', precio: unico(4000) },
          { nombre: 'Café', descripcion: 'Crepa de café, rellena de dulce de leche y palomitas con caramelo.', precio: unico(4000) },
        ],
      },
    ],
  },
  {
    id: 'bebidas',
    pestana: 'Bebidas',
    etiqueta: { kind: 'confirmada', texto: 'Bebidas' },
    categorias: [
      {
        id: 'bebidas-calientes',
        nombre: 'Bebidas calientes',
        productos: [
          {
            nombre: 'Honey Dipper',
            descripcion: 'Café y Nutella, diluidos en leche con crema chantillí con una galleta Chocodipper encima.',
            precio: unico(3600),
          },
          { nombre: 'Chocolate caliente', descripcion: 'Nuestro delicioso chocolate caliente con marshmellows.', precio: unico(1950) },
          {
            nombre: 'Café con mantequilla de maní',
            descripcion: 'Una deliciosa variación de la bebida clásica que incluye una mezcla de café con una suave y cremosa mantequilla de maní.',
            precio: tamanos({ pequeno: 1800, grande: 2800 }),
          },
          {
            nombre: 'Café paleta',
            descripcion: 'La combinación perfecta entre café caliente y una deliciosa paleta de helado.',
            precio: tamanos({ pequeno: 1800, grande: 2800 }),
          },
          {
            nombre: 'Directo al corazón',
            descripcion: 'Café, leche condensada, nutella, leche espumada y galleta maria en polvo.',
            precio: unico(3600),
          },
          {
            nombre: 'Té caliente ó frío',
            descripcion: 'Consulta por nuestros sabores disponibles. Pueden ser fríos o calientes.',
            precio: tamanos({ pequeno: 1100, grande: 1500 }),
          },
          {
            nombre: 'Té chai',
            descripcion: 'Una aromática infusión que combina té negro con especias como canela, jengibre, clavo de olor y cardamomo.',
            precio: unico(2500),
          },
          { nombre: 'Mocca', descripcion: 'Con leche y jarabe de chocolate.', precio: unico(2300) },
          { nombre: 'Matcha', descripcion: 'Té verde de sabor intenso, con miel de abeja y limón.', precio: unico(1900) },
          { nombre: 'Americano', descripcion: 'El clásico café expresso con agua caliente', precio: tamanos({ pequeno: 1200, grande: 1700 }) },
          { nombre: 'Latte', descripcion: 'Café expresso soble con leche y espuma.', precio: tamanos({ pequeno: 1600, grande: 2200 }) },
          { nombre: 'Expresso', descripcion: 'Preparación de café a presión con sabor y textura más intenso.', precio: unico(1100) },
          { nombre: 'Expresso doble', descripcion: 'Preparación de café a presión con sabor y textura más intenso.', precio: unico(1800) },
          { nombre: 'Capuccino', descripcion: 'Expresso con leche vaporizada y espuma.', precio: tamanos({ pequeno: 1850, grande: 2400 }) },
          { nombre: 'Capuccino con sabor', descripcion: 'Menta, avellana, vainilla, crema irlandesa.', precio: tamanos({ pequeno: 2000, grande: 2600 }) },
          { nombre: 'Agua dulce', descripcion: 'Bebida hecha a base de panela con agua caliente.', precio: tamanos({ pequeno: 1100, grande: 1500 }) },
          {
            nombre: 'Agua dulce con leche',
            descripcion: 'Bebida hecha a base de panela con leche caliente.',
            precio: tamanos({ pequeno: 1500, grande: 1950 }),
          },
        ],
      },
      {
        id: 'frappes',
        nombre: 'Frappés',
        productos: [
          { nombre: 'Frappé paleta', descripcion: 'Bebida en leche con café y paleta de brownie con duce de leche.', precio: unico(3800) },
          { nombre: 'Frappé torta chilena', descripcion: 'Bebida en leche con café y torta chilena', precio: unico(3300) },
          { nombre: 'Frappé snicker', descripcion: 'Bebida en leche con café y snicker.', precio: unico(3300) },
          { nombre: 'Frappé mini sandwich', descripcion: 'Bebida en leche con café y helado mini sándwich', precio: unico(3300) },
          { nombre: 'Frappé brownie', descripcion: 'Bebida en leche con café y brownie', precio: unico(3300) },
          { nombre: 'Frappé higos', descripcion: 'Bebida en leche con café e higos', precio: unico(3300) },
          { nombre: 'Frappé menta', descripcion: 'Bebida en leche con café y menta', precio: unico(3300) },
          { nombre: 'Frappé vainilla', descripcion: 'Bebida en leche con café y vainilla', precio: unico(3300) },
          { nombre: 'Frappé avellana', descripcion: 'Bebida en leche con café y avellana', precio: unico(3300) },
          { nombre: 'Frappé capuccino', descripcion: 'Bebida en leche con café capuccino', precio: unico(3300) },
          { nombre: 'Frappé chocolate', descripcion: 'Bebida en leche con café y chocolate', precio: unico(3300) },
          { nombre: 'Frappé te chai', descripcion: 'Bebida en leche con té chai', precio: unico(3300) },
          {
            nombre: 'Frappé horchata',
            descripcion: 'Bebida en leche con café y horchata',
            precio: PRECIO_PENDIENTE,
            porConfirmar: 'El menú no muestra precio para este frappé.',
          },
          { nombre: 'Frappé crema irlandesa', descripcion: 'Bebida en leche con café y crema irlandesa.', precio: unico(3300) },
        ],
      },
      {
        id: 'lattes-frios',
        nombre: 'Lattes fríos',
        productos: [
          { nombre: 'Latte de menta', descripcion: 'Bebida cremosa de café con leche y sirope de menta.', precio: unico(2800) },
          { nombre: 'Latte de vainilla', descripcion: 'Bebida cremosa de café con leche y vainilla.', precio: unico(2800) },
          { nombre: 'Latte de avellana', descripcion: 'Bebida cremosa de café con leche y avellana.', precio: unico(2800) },
          { nombre: 'Latte de crema irlandesa', descripcion: 'Bebida cremosa de café con leche y crema irlandesa.', precio: unico(2800) },
          { nombre: 'Mocca frío', descripcion: 'Con leche y jarabe de chocolate.', precio: unico(2900) },
        ],
      },
      {
        id: 'sodas-italianas',
        nombre: 'Sodas italianas',
        productos: [
          { nombre: 'Clásica', descripcion: 'Bebida carbonatada con reducción de frutos rojos o maracuyá.', precio: unico(3000) },
          { nombre: 'Con paleta', descripcion: 'Bebida carbonatada con reducción de frutos rojos o maracuyá con paleta de agua.', precio: unico(3400) },
          { nombre: 'Mango strawberry', descripcion: 'Bebida carbonatada con reducción de frutos rojos o maracuyá.', precio: unico(3000) },
        ],
      },
      {
        id: 'otras-bebidas',
        nombre: 'Otros',
        productos: [
          { nombre: 'Milkshakes', descripcion: 'De fresa, banano, chocolate o vainilla.', precio: unico(2800) },
          { nombre: 'Mango dipper', descripcion: 'Bebida refrescante de mango con el toque picante del Tajín', precio: unico(3000) },
          { nombre: 'Soda michelada', precio: unico(2000) },
          { nombre: 'Gaseosas', precio: unico(1000) },
          { nombre: 'Jugo de naranja', precio: unico(1000) },
        ],
      },
    ],
  },
  {
    id: 'ninos',
    pestana: 'Niños',
    etiqueta: { kind: 'confirmada', texto: 'Niños' },
    categorias: [
      {
        id: 'menu-ninos',
        nombre: 'Menú de niños',
        productos: [
          { nombre: 'Nuggets', descripcion: 'Acompañados de papas y aderezo.', precio: unico(3300) },
          { nombre: 'Salchipapas', descripcion: 'Papas fritas y salchichas.', precio: unico(3300) },
          { nombre: 'Quesadilla', descripcion: 'De Pollo o Carne. Acompañada con papas fritas.', precio: unico(3300) },
          { nombre: 'Malteada unicornio', descripcion: 'Nuestra deliciosa malteada en leche con sirope de Kola.', precio: unico(2900) },
          { nombre: 'Malteada comegalletas', descripcion: 'Malteada en leche con sabor a chicle.', precio: unico(2900) },
          { nombre: 'Chocolate frío', descripcion: 'Refrescante chocolate en leche con marshmallows.', precio: unico(2000) },
        ],
      },
    ],
  },
]
