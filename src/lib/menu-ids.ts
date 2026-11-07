import type { MenuCategoryId, MenuGroupId } from '../data/menu.types'

/** Ids que unen cada pestaña con su panel y cada plato con su fila (aria-controls, aria-labelledby y la búsqueda). */

export const categoryAnchorId = (categoryId: string): string => {
  return `menu-${categoryId}`
}

const NON_ALPHANUMERIC = /[^a-z0-9]+/g

/** 'Café con mantequilla de maní' → 'cafe-con-mantequilla-de-mani' */
const slugify = (text: string): string => {
  return text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(NON_ALPHANUMERIC, '-')
    .replace(/^-|-$/g, '')
}

export const productAnchorId = (categoryId: MenuCategoryId, productName: string): string => {
  return `${categoryAnchorId(categoryId)}--${slugify(productName)}`
}

export const groupTabId = (groupId: MenuGroupId): string => {
  return `menu-tab-${groupId}`
}

export const groupPanelId = (groupId: MenuGroupId): string => {
  return `menu-panel-${groupId}`
}

export const categoryTabId = (categoryId: MenuCategoryId): string => {
  return `menu-categoria-tab-${categoryId}`
}
