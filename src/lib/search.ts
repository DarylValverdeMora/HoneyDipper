import type { MenuCategoryId, MenuGroup, MenuGroupId, MenuProduct } from '../data/menu.types'
import { getDisplayDescription } from './menu'

/** Un plato listo para buscar: dónde está y su texto ya normalizado. */
export type SearchEntry = {
  key: string
  groupId: MenuGroupId
  groupLabel: string
  categoryId: MenuCategoryId
  categoryName: string
  product: MenuProduct
  /** Nombre y descripción en minúsculas y sin tildes. */
  haystack: string
}

const COMBINING_MARKS = /\p{M}/gu
const WHITESPACE = /\s+/

/** 'Café' → 'cafe', 'PIÑA' → 'pina'. Para comparar sin importar tildes ni mayúsculas. */
export const normalizeForSearch = (text: string): string => {
  return text.normalize('NFD').replace(COMBINING_MARKS, '').toLowerCase()
}

const toEntry = (group: MenuGroup, category: MenuGroup['categorias'][number], product: MenuProduct): SearchEntry => {
  const description = getDisplayDescription(category.id, product) ?? ''
  return {
    key: `${category.id}/${product.nombre}`,
    groupId: group.id,
    groupLabel: group.pestana,
    categoryId: category.id,
    categoryName: category.nombre,
    product,
    haystack: normalizeForSearch(`${product.nombre} ${description}`),
  }
}

/** Índice de búsqueda de todo el menú visible. Se arma una sola vez. */
export const buildSearchIndex = (groups: readonly MenuGroup[]): SearchEntry[] => {
  return groups.flatMap((group) =>
    group.categorias.flatMap((category) => category.productos.map((product) => toEntry(group, category, product))),
  )
}

const toTerms = (query: string): string[] => {
  return normalizeForSearch(query.trim()).split(WHITESPACE).filter((term) => term !== '')
}

/**
 * Platos cuyo nombre o descripción contienen todas las palabras buscadas (también partes de palabras).
 * Una búsqueda vacía no devuelve nada.
 */
export const searchMenu = (index: readonly SearchEntry[], query: string): SearchEntry[] => {
  const terms = toTerms(query)
  if (terms.length === 0) return []
  return index.filter((entry) => terms.every((term) => entry.haystack.includes(term)))
}
