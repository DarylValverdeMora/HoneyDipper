import ensalada from '../assets/img/ensalada.webp'
import evento1 from '../assets/img/evento-1.webp'
import evento1w600 from '../assets/img/evento-1-600.webp'
import evento2 from '../assets/img/evento-2.webp'
import evento2w600 from '../assets/img/evento-2-600.webp'
import galletas from '../assets/img/galletas.webp'
import hamburguesaPapasWaffle from '../assets/img/hamburguesa-papas-waffle.webp'
import hamburguesaPollo from '../assets/img/hamburguesa-pollo.webp'
import interiorArco from '../assets/img/interior-arco.webp'
import interiorArco480 from '../assets/img/interior-arco-480.webp'
import interiorArco800 from '../assets/img/interior-arco-800.webp'
import interiorMostrador from '../assets/img/interior-mostrador.webp'
import interiorMostrador480 from '../assets/img/interior-mostrador-480.webp'
import logoHoneyDipperHero from '../assets/img/logo-honey-dipper-hero.webp'
import pancakesHelado from '../assets/img/pancakes-helado.webp'
import pastelChorreado from '../assets/img/pastel-chorreado.webp'
import pastelCumpleanos from '../assets/img/pastel-cumpleanos.webp'
import pizzas from '../assets/img/pizzas.webp'
import rollosCanela from '../assets/img/rollos-canela.webp'
import sandwichPapasWaffle from '../assets/img/sandwich-papas-waffle.webp'
import terrazaNoche from '../assets/img/terraza-noche.webp'
import type { NonEmpty } from '../lib/types'
import type { MenuCategoryId } from './menu.types'

export type PhotoSection =
  | 'hero'
  | `menu-${MenuCategoryId}`
  | 'pasteleria'
  | 'eventos'
  | 'lugar'

/** El negocio envió todas las imágenes de la carpeta HoneyDipper: el permiso de uso queda confirmado para todas. */
const PERMISSION_OWNER = 'confirmado por el negocio (enviada por el dueño)' as const

export type Photo = {
  src: string
  alt: string
  width: number
  height: number
  /** Versiones más livianas para pantallas chicas (srcset con ancho real de cada archivo). */
  srcSet?: string
  sections: NonEmpty<PhotoSection>
  /** Archivo original del que sale la foto (recortado con scripts/crop-photos.py). */
  source: string
  permission: typeof PERMISSION_OWNER
  /** Quién tomó la foto, si hay que mencionarlo. Se muestra como "Foto: <crédito>". */
  credito?: string
  note?: string
}

export const photos = {
  /** Recorte del logo (x 222..862, y 270..950 del original) para el hero. El logo no se toca. */
  logoHero: {
    src: logoHoneyDipperHero,
    alt: 'Honey Dipper, cafetería y pastelería',
    width: 640,
    height: 680,
    sections: ['hero'],
    source: '334567232_128492653313998_3196433340749445455_n.jpg',
    permission: PERMISSION_OWNER,
    note: 'Mismo logo, con menos margen menta. La gota del logo queda en x 310, y 224 de este recorte.',
  },
  interiorArco: {
    src: interiorArco,
    srcSet: `${interiorArco480} 480w, ${interiorArco800} 800w, ${interiorArco} 1170w`,
    alt: 'Interior de Honey Dipper: arco amarillo, pared menta con el logo dorado, vitrina de postres y techo de madera',
    width: 1170,
    height: 1557,
    sections: ['hero', 'lugar'],
    source: 'IMG_2354.PNG',
    permission: PERMISSION_OWNER,
  },
  /** Otro encuadre de IMG_2354: el mostrador y la vitrina de postres, más de cerca. */
  interiorMostrador: {
    src: interiorMostrador,
    srcSet: `${interiorMostrador480} 480w, ${interiorMostrador} 750w`,
    alt: 'Mostrador menta con vitrina de postres y estantes, visto a través del arco del local',
    width: 750,
    height: 700,
    sections: ['lugar'],
    source: 'IMG_2354.PNG',
    permission: PERMISSION_OWNER,
  },
  terrazaNoche: {
    src: terrazaNoche,
    alt: 'Terraza de Honey Dipper de noche, con luces colgantes entre las ramas y mesas bajo el árbol',
    width: 226,
    height: 450,
    sections: ['lugar'],
    source: 'Screenshot 2026-11-06 161846.png',
    permission: PERMISSION_OWNER,
    note: 'Original de 232×456: se muestra en un arco de 112 px para que se vea nítida en pantallas 2x.',
  },
  eventoRevelacion: {
    src: evento1,
    srcSet: `${evento1w600} 600w, ${evento1} 1170w`,
    alt: 'Pareja celebrando con globos plateados junto a un cartel que dice "Boy or Girl?"',
    width: 1170,
    height: 1548,
    sections: ['eventos'],
    source: 'IMG_2352(1).PNG',
    permission: PERMISSION_OWNER,
    credito: '@fotogenicacr',
    note: 'Pendiente: confirmar que la pareja está de acuerdo en aparecer y el crédito con el fotógrafo.',
  },
  eventoGlobos: {
    src: evento2,
    srcSet: `${evento2w600} 600w, ${evento2} 1170w`,
    alt: 'Arco de globos rosados, celestes y dorados con el letrero "Boy or Girl?" y un pastel al pie',
    width: 1170,
    height: 1440,
    sections: ['eventos'],
    source: 'IMG_2353.PNG',
    permission: PERMISSION_OWNER,
    credito: '@fotogenicacr',
    note: 'Pendiente: confirmar el crédito con el fotógrafo.',
  },
  ensalada: {
    src: ensalada,
    alt: 'Ensalada con pollo a la plancha, fresas, aguacate y tomate, con aderezo en un recipiente',
    width: 184,
    height: 184,
    sections: ['menu-ensaladas'],
    source: 'Screenshot 2026-11-06 162126.png',
    permission: PERMISSION_OWNER,
    note: 'Original de 190×312: se recortó cuadrada y se muestra a 128 px.',
  },
  hamburguesaPollo: {
    src: hamburguesaPollo,
    alt: 'Hamburguesa de pollo empanizado con guacamole y queso derretido, con papas fritas',
    width: 521,
    height: 568,
    sections: ['menu-hamburguesas'],
    source: 'Screenshot 2026-11-06 162926.png',
    permission: PERMISSION_OWNER,
  },
  hamburguesaPapasWaffle: {
    src: hamburguesaPapasWaffle,
    alt: 'Hamburguesa con papas waffle y aderezo en un plato de cerámica',
    width: 406,
    height: 450,
    sections: ['menu-hamburguesas'],
    source: 'Screenshot 2026-11-06 162937.png',
    permission: PERMISSION_OWNER,
  },
  sandwichPapasWaffle: {
    src: sandwichPapasWaffle,
    alt: 'Sándwich de carne en pan artesanal con papas waffle y jugo de naranja',
    width: 320,
    height: 536,
    sections: ['menu-sandwiches'],
    source: 'Screenshot 2026-11-06 162856.png',
    permission: PERMISSION_OWNER,
  },
  pancakesHelado: {
    src: pancakesHelado,
    alt: 'Pancakes con helado de chocolate, cono de barquillo, fresa y moras',
    width: 248,
    height: 329,
    sections: ['menu-brunch'],
    source: 'Screenshot 2026-11-06 162626.png',
    permission: PERMISSION_OWNER,
  },
  pizzas: {
    src: pizzas,
    alt: 'Dos pizzas delgadas, una de pepperoni y otra con albahaca',
    width: 252,
    height: 326,
    sections: ['menu-tortizzas'],
    source: 'Screenshot 2026-11-06 162644.png',
    permission: PERMISSION_OWNER,
    note: '[PLACEHOLDER] Confirmar que son tortizzas.',
  },
  pastelChorreado: {
    src: pastelChorreado,
    alt: 'Pastel de dos pisos con chorreado de colores, confites y velas',
    width: 453,
    height: 646,
    sections: ['pasteleria'],
    source: 'Screenshot 2026-11-06 162253.png',
    permission: PERMISSION_OWNER,
  },
  pastelCumpleanos: {
    src: pastelCumpleanos,
    alt: 'Pastel con el mensaje "Happy Birthday my love" y corazones rosados',
    width: 467,
    height: 644,
    sections: ['pasteleria'],
    source: 'Screenshot 2026-11-06 162222.png',
    permission: PERMISSION_OWNER,
  },
  rollosCanela: {
    src: rollosCanela,
    alt: 'Torre de rollos de canela con crema, fresas y moras',
    width: 244,
    height: 328,
    sections: ['pasteleria'],
    source: 'Screenshot 2026-11-06 162653.png',
    permission: PERMISSION_OWNER,
  },
  galletas: {
    src: galletas,
    alt: 'Cuatro galletas de avena apiladas en un plato rosado',
    width: 264,
    height: 331,
    sections: ['pasteleria'],
    source: 'Screenshot 2026-11-06 162820.png',
    permission: PERMISSION_OWNER,
  },
} satisfies Record<string, Photo>

/** Fotos asignadas a una sección o categoría, en el orden de este archivo. */
export const photosForSection = (section: PhotoSection): Photo[] => {
  return Object.values(photos).filter((photo) => photo.sections.some((photoSection) => photoSection === section))
}
