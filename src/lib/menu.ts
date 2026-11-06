import { menuContentChanges } from '../data/menu-content-changes'
import type { ContentChange } from '../data/menu-content-changes'
import { menuCorrections } from '../data/menu-corrections'
import type { SpellingCorrection } from '../data/menu-corrections'
import { menuFlags } from '../data/menu'
import type { Menu, MenuCategory, MenuCategoryId, MenuFlag, MenuGroup, MenuGroupId, MenuProduct } from '../data/menu.types'

const WHOLE_WORD_BOUNDARY = '(?<![\\p{L}\\p{N}])'
const WHOLE_WORD_END = '(?![\\p{L}\\p{N}])'

const escapeRegExp = (text: string): string => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const toWholeWordPattern = (original: string): RegExp => {
  return new RegExp(`${WHOLE_WORD_BOUNDARY}${escapeRegExp(original)}${WHOLE_WORD_END}`, 'gu')
}

const toPattern = (correction: SpellingCorrection): RegExp => {
  if (correction.kind === 'patron') return new RegExp(correction.patron.source, correction.patron.flags)
  return toWholeWordPattern(correction.original)
}

const toReplacement = (correction: SpellingCorrection): string => {
  if (correction.kind === 'patron') return correction.reemplazo
  return correction.corregido
}

const applyCorrection = (text: string, correction: SpellingCorrection): string => {
  return text.replace(toPattern(correction), toReplacement(correction))
}

/** Texto listo para mostrar: aplica las correcciones de ortografía aprobadas. Solo para descripciones y notas. */
export const toDisplayText = (text: string, corrections: readonly SpellingCorrection[] = menuCorrections): string => {
  return corrections.reduce(applyCorrection, text)
}

/** Cuántas veces aparece una corrección en un texto. */
export const countCorrectionMatches = (text: string, correction: SpellingCorrection): number => {
  return text.match(toPattern(correction))?.length ?? 0
}

const isCategoryVisible = (category: MenuCategory, flags: Record<MenuFlag, boolean>): boolean => {
  if (category.visibleSi === undefined) return true
  return flags[category.visibleSi]
}

/** Menú con solo las categorías visibles según las banderas. Un grupo sin categorías visibles desaparece. */
export const getVisibleGroups = (sourceMenu: Menu, flags: Record<MenuFlag, boolean> = menuFlags): MenuGroup[] => {
  return sourceMenu.flatMap((group) => {
    const [firstVisible, ...restVisible] = group.categorias.filter((category) => isCategoryVisible(category, flags))
    if (firstVisible === undefined) return []
    return [{ ...group, categorias: [firstVisible, ...restVisible] }]
  })
}

export const countProducts = (group: MenuGroup): number => {
  return group.categorias.reduce((total, category) => total + category.productos.length, 0)
}

export const countProductsByGroup = (groups: readonly MenuGroup[]): Record<MenuGroupId, number> => {
  const counts: Record<MenuGroupId, number> = { comidas: 0, brunch: 0, dulces: 0, bebidas: 0, ninos: 0 }
  groups.forEach((group) => {
    counts[group.id] += countProducts(group)
  })
  return counts
}

export type ProductLocation = {
  group: MenuGroup
  category: MenuCategory
  product: MenuProduct
}

export const listProducts = (groups: readonly MenuGroup[]): ProductLocation[] => {
  return groups.flatMap((group) =>
    group.categorias.flatMap((category) => category.productos.map((product) => ({ group, category, product }))),
  )
}

export const listProductsToConfirm = (groups: readonly MenuGroup[]): ProductLocation[] => {
  return listProducts(groups).filter(({ product }) => product.porConfirmar !== undefined)
}

/** El cambio de contenido que corresponde a este plato, solo si su `original` sigue igual al de menu.ts. */
export const findContentChange = (
  categoryId: MenuCategoryId,
  product: MenuProduct,
  changes: readonly ContentChange[] = menuContentChanges,
): ContentChange | undefined => {
  return changes.find(
    (change) =>
      change.categoryId === categoryId && change.producto === product.nombre && change.original === product.descripcion,
  )
}

/** Descripción lista para mostrar: aplica el cambio de contenido (si hay) y luego las correcciones de ortografía. */
export const getDisplayDescription = (categoryId: MenuCategoryId, product: MenuProduct): string | undefined => {
  const description = findContentChange(categoryId, product)?.nuevo ?? product.descripcion
  if (description === undefined) return undefined
  return toDisplayText(description)
}
