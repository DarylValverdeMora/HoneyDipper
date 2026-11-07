import type { NonEmpty } from '../lib/types'

/** Monto en colones: entero y positivo. Solo se crea con `colones()`. */
export type Colones = number & { readonly __brand: 'Colones' }

const isColones = (amount: number): amount is Colones => {
  return Number.isInteger(amount) && amount > 0
}

export const colones = (amount: number): Colones => {
  if (!isColones(amount)) {
    throw new Error(`Monto inválido en colones: ${amount}. Debe ser un entero positivo.`)
  }
  return amount
}

export type Price =
  | { kind: 'unico'; monto: Colones }
  | { kind: 'tamanos'; pequeno: Colones; grande: Colones }
  | { kind: 'pendiente' }

export const precioUnico = (monto: number): Price => {
  return { kind: 'unico', monto: colones(monto) }
}

export const precioPorTamanos = (sizes: { pequeno: number; grande: number }): Price => {
  return { kind: 'tamanos', pequeno: colones(sizes.pequeno), grande: colones(sizes.grande) }
}

export const PRECIO_PENDIENTE: Price = { kind: 'pendiente' }

export type MenuProduct = {
  /** Tal como aparece en el menú impreso. No se corrige. */
  nombre: string
  /** Texto original del menú. Las correcciones de ortografía se aplican al mostrarlo (ver menu-corrections.ts). */
  descripcion?: string
  precio: Price
  /** Opciones de formato a escoger, por ejemplo ['Waffle', 'Pancakes']. */
  formato?: NonEmpty<string>
  /** Motivo por el que este producto necesita confirmación del dueño. */
  porConfirmar?: string
}

export const MENU_FLAGS = ['mostrarMenuMexicano'] as const
export type MenuFlag = (typeof MENU_FLAGS)[number]

export type MenuCategoryId =
  | 'entradas'
  | 'ensaladas'
  | 'casados'
  | 'tortizzas'
  | 'montaditos'
  | 'pastas'
  | 'sandwiches'
  | 'pitas'
  | 'wraps'
  | 'snacks'
  | 'hamburguesas'
  | 'menu-mexicano'
  | 'brunch'
  | 'waffles-pancakes'
  | 'waffles-croissants'
  | 'tostadas-francesas'
  | 'crepas'
  | 'bebidas-calientes'
  | 'frappes'
  | 'lattes-frios'
  | 'sodas-italianas'
  | 'otras-bebidas'
  | 'menu-ninos'

export type MenuCategory = {
  id: MenuCategoryId
  nombre: string
  /** Nota del menú original, por ejemplo "Incluye 3 tostadas". */
  nota?: string
  /** Si existe, la categoría solo se muestra cuando esa bandera está encendida. */
  visibleSi?: MenuFlag
  productos: NonEmpty<MenuProduct>
}

export type MenuGroupId = 'comidas' | 'brunch' | 'dulces' | 'bebidas' | 'ninos'

export type GroupLabel =
  | { kind: 'confirmada'; texto: string }
  | { kind: 'pendiente'; texto: string; placeholder: string }

export type MenuGroup = {
  id: MenuGroupId
  /** Texto corto de la pestaña. */
  pestana: string
  etiqueta: GroupLabel
  categorias: NonEmpty<MenuCategory>
}

export type Menu = NonEmpty<MenuGroup>
