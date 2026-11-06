import galletas from '../assets/img/galletas.webp'
import hamburguesaPapasWaffle from '../assets/img/hamburguesa-papas-waffle.webp'
import hamburguesaPollo from '../assets/img/hamburguesa-pollo.webp'
import interiorArco from '../assets/img/interior-arco.webp'
import logoHoneyDipper from '../assets/img/logo-honey-dipper.jpg'
import logoHoneyDipperHero from '../assets/img/logo-honey-dipper-hero.webp'
import pancakesHelado from '../assets/img/pancakes-helado.webp'
import pastelChorreado from '../assets/img/pastel-chorreado.webp'
import pastelCumpleanos from '../assets/img/pastel-cumpleanos.webp'
import pizzas from '../assets/img/pizzas.webp'
import rollosCanela from '../assets/img/rollos-canela.webp'
import sandwichPapasWaffle from '../assets/img/sandwich-papas-waffle.webp'
import type { ConfirmationStatus } from './business'
import type { NonEmpty } from '../lib/types'

export type PhotoSection =
  | 'header'
  | 'hero'
  | 'menu-hamburguesas'
  | 'menu-sandwiches'
  | 'menu-brunch'
  | 'menu-tortizzas'
  | 'pasteleria'
  | 'lugar'

export type Photo = {
  src: string
  alt: string
  width: number
  height: number
  sections: NonEmpty<PhotoSection>
  /** Archivo de referencia del que sale la foto. */
  source: string
  permission: ConfirmationStatus
  note?: string
}

export const photos = {
  logo: {
    src: logoHoneyDipper,
    alt: 'Honey Dipper, cafetería y pastelería',
    width: 1080,
    height: 1080,
    sections: ['header'],
    source: '334567232_128492653313998_3196433340749445455_n.jpg',
    permission: 'pendiente',
    note: 'JPG con fondo menta #BFD7CA, igual al token Menta Honey. Falta SVG o PNG transparente.',
  },
  /** Recorte del logo (x 222..862, y 270..950 del original) para el hero. El logo no se toca. */
  logoHero: {
    src: logoHoneyDipperHero,
    alt: 'Honey Dipper, cafetería y pastelería',
    width: 640,
    height: 680,
    sections: ['hero'],
    source: '334567232_128492653313998_3196433340749445455_n.jpg',
    permission: 'pendiente',
    note: 'Mismo logo, con menos margen menta. La gota del logo queda en x 310, y 224 de este recorte.',
  },
  interiorArco: {
    src: interiorArco,
    alt: 'Interior de Honey Dipper: arco amarillo, pared menta con el logo dorado, vitrina de postres y techo de madera',
    width: 1170,
    height: 1560,
    sections: ['hero', 'lugar'],
    source: 'IMG_2354.PNG',
    permission: 'confirmado',
    note: 'Foto de Google Maps del usuario "JuanK Nuñez". Permiso confirmado verbalmente (Daryl, 2026-11-06); hace falta la confirmación por escrito antes de publicar.',
  },
  hamburguesaPollo: {
    src: hamburguesaPollo,
    alt: 'Hamburguesa de pollo empanizado con guacamole y queso derretido, con papas fritas',
    width: 787,
    height: 578,
    sections: ['menu-hamburguesas'],
    source: 'Screenshot 2026-11-06 162926.png',
    permission: 'pendiente',
  },
  hamburguesaPapasWaffle: {
    src: hamburguesaPapasWaffle,
    alt: 'Hamburguesa con papas waffle y aderezo en un plato de cerámica',
    width: 410,
    height: 632,
    sections: ['menu-hamburguesas'],
    source: 'Screenshot 2026-11-06 162937.png',
    permission: 'pendiente',
  },
  sandwichPapasWaffle: {
    src: sandwichPapasWaffle,
    alt: 'Sándwich de carne en pan artesanal con papas waffle y jugo de naranja',
    width: 326,
    height: 542,
    sections: ['menu-sandwiches'],
    source: 'Screenshot 2026-11-06 162856.png',
    permission: 'pendiente',
  },
  pancakesHelado: {
    src: pancakesHelado,
    alt: 'Pancakes con helado de chocolate, cono de barquillo, fresa y moras',
    width: 265,
    height: 334,
    sections: ['menu-brunch'],
    source: 'Screenshot 2026-11-06 162626.png',
    permission: 'pendiente',
  },
  pizzas: {
    src: pizzas,
    alt: 'Dos pizzas delgadas, una de pepperoni y otra con albahaca',
    width: 277,
    height: 327,
    sections: ['menu-tortizzas'],
    source: 'Screenshot 2026-11-06 162644.png',
    permission: 'pendiente',
    note: '[PLACEHOLDER] Confirmar que son tortizzas.',
  },
  pastelChorreado: {
    src: pastelChorreado,
    alt: 'Pastel de dos pisos con chorreado de colores, confites y velas',
    width: 455,
    height: 650,
    sections: ['pasteleria'],
    source: 'Screenshot 2026-11-06 162253.png',
    permission: 'pendiente',
  },
  pastelCumpleanos: {
    src: pastelCumpleanos,
    alt: 'Pastel con el mensaje "Happy Birthday my love" y corazones rosados',
    width: 471,
    height: 645,
    sections: ['pasteleria'],
    source: 'Screenshot 2026-11-06 162222.png',
    permission: 'pendiente',
  },
  rollosCanela: {
    src: rollosCanela,
    alt: 'Torre de rollos de canela con crema, fresas y moras',
    width: 276,
    height: 329,
    sections: ['pasteleria'],
    source: 'Screenshot 2026-11-06 162653.png',
    permission: 'pendiente',
  },
  galletas: {
    src: galletas,
    alt: 'Cuatro galletas de avena apiladas en un plato rosado',
    width: 270,
    height: 337,
    sections: ['pasteleria'],
    source: 'Screenshot 2026-11-06 162820.png',
    permission: 'pendiente',
  },
} satisfies Record<string, Photo>

export type PhotoId = keyof typeof photos

/** Fotos asignadas a una sección o categoría, en el orden de este archivo. */
export const photosForSection = (section: string): Photo[] => {
  return Object.values(photos).filter((photo) => photo.sections.some((photoSection) => photoSection === section))
}

/** Espacios donde no hay foto apta; se muestran como [PLACEHOLDER] con forma de arco. */
export const missingPhotos = [
  { section: 'menu-ensaladas', description: '[PLACEHOLDER] Foto de una ensalada' },
  { section: 'eventos', description: '[PLACEHOLDER] Foto de un evento en el local (con permiso)' },
  { section: 'lugar', description: '[PLACEHOLDER] Foto de la terraza' },
  { section: 'lugar', description: '[PLACEHOLDER] Foto de la fachada o la entrada' },
  { section: 'menu-bebidas', description: '[PLACEHOLDER] Foto de bebidas o café servidos en el local' },
] as const
