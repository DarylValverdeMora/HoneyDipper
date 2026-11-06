import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { menu, menuFlags } from '../data/menu'
import type { MenuCategoryId, MenuGroup, MenuGroupId } from '../data/menu.types'
import { getVisibleGroups } from '../lib/menu'
import { useReviewMode } from './useReviewMode'
import { useScrollSpy } from './useScrollSpy'
import { useScrollToElement } from './useScrollToElement'
import { readRemVariablePx } from '../lib/css-length'

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

/** Cuánto dura el resaltado del plato al llegar desde la búsqueda. */
const HIGHLIGHT_MS = 1800

export const groupTabId = (groupId: MenuGroupId): string => {
  return `menu-tab-${groupId}`
}

export const groupPanelId = (groupId: MenuGroupId): string => {
  return `menu-panel-${groupId}`
}

export type MenuState = {
  groups: readonly MenuGroup[]
  activeGroup: MenuGroup
  activeCategoryId: string
  isReviewMode: boolean
}

export type ProductTarget = {
  groupId: MenuGroupId
  categoryId: MenuCategoryId
  productName: string
}

export type MenuActions = {
  selectGroup: (groupId: MenuGroupId) => void
  selectCategory: (categoryId: string) => void
  /** Cambia al grupo del plato, baja hasta él, lo resalta y le pasa el foco. */
  goToProduct: (target: ProductTarget) => void
}

export type MenuMeta = {
  /** Inicio del panel del grupo: al cambiar de grupo se vuelve aquí si ya se bajó. */
  panelRef: RefObject<HTMLDivElement | null>
}

type MenuStateValue = { state: MenuState; actions: MenuActions; meta: MenuMeta }

const findGroup = (groups: readonly MenuGroup[], groupId: MenuGroupId): MenuGroup | undefined => {
  return groups.find((group) => group.id === groupId)
}

/** true si el inicio del panel ya quedó tapado por la barra fija del menú. */
const isPanelScrolledPast = (panel: HTMLElement): boolean => {
  const stickyBottom = readRemVariablePx('--header-height') + readRemVariablePx('--menu-nav-height')
  return panel.getBoundingClientRect().top < stickyBottom
}

/**
 * Estado del menú: grupo activo (pestaña) y categoría activa (chip, por scroll-spy).
 * Los grupos salen de menu.ts respetando las banderas, como mostrarMenuMexicano.
 */
export const useMenuState = (): MenuStateValue => {
  const groups = useMemo(() => getVisibleGroups(menu, menuFlags), [])
  const [firstGroup] = groups
  if (firstGroup === undefined) throw new Error('El menú no tiene grupos visibles.')

  const [activeGroupId, setActiveGroupId] = useState<MenuGroupId>(firstGroup.id)
  const activeGroup = findGroup(groups, activeGroupId) ?? firstGroup
  const categoryIds = useMemo(
    () => activeGroup.categorias.map((category) => categoryAnchorId(category.id)),
    [activeGroup],
  )
  const spy = useScrollSpy(categoryIds)
  const isReviewMode = useReviewMode()
  const scrollToElement = useScrollToElement()
  const panelRef = useRef<HTMLDivElement>(null)

  const selectGroup = useCallback(
    (groupId: MenuGroupId) => {
      setActiveGroupId(groupId)
      requestAnimationFrame(() => {
        const panel = panelRef.current
        if (panel !== null && isPanelScrolledPast(panel)) scrollToElement(panel)
      })
    },
    [scrollToElement],
  )

  const { pin, release } = spy
  const selectCategory = useCallback(
    (categoryId: string) => {
      const anchorId = categoryAnchorId(categoryId)
      const target = document.getElementById(anchorId)
      if (target === null) return
      pin(anchorId)
      scrollToElement(target, { onComplete: release })
    },
    [pin, release, scrollToElement],
  )

  const [pendingTarget, setPendingTarget] = useState<ProductTarget | null>(null)

  const goToProduct = useCallback((target: ProductTarget) => {
    setActiveGroupId(target.groupId)
    setPendingTarget(target)
  }, [])

  // Cuando el grupo del plato ya está en pantalla, se baja hasta la fila.
  useEffect(() => {
    if (pendingTarget === null || pendingTarget.groupId !== activeGroup.id) return
    const row = document.getElementById(productAnchorId(pendingTarget.categoryId, pendingTarget.productName))
    setPendingTarget(null)
    if (row === null) return

    pin(categoryAnchorId(pendingTarget.categoryId))
    scrollToElement(row, { onComplete: release })
    row.focus({ preventScroll: true })
    row.setAttribute('data-highlighted', '')
    window.setTimeout(() => row.removeAttribute('data-highlighted'), HIGHLIGHT_MS)
  }, [pendingTarget, activeGroup.id, pin, release, scrollToElement])

  const firstCategoryId = categoryIds[0] ?? ''
  const activeCategoryId = spy.activeId ?? firstCategoryId

  const state = useMemo<MenuState>(
    () => ({ groups, activeGroup, activeCategoryId, isReviewMode }),
    [groups, activeGroup, activeCategoryId, isReviewMode],
  )
  const actions = useMemo<MenuActions>(
    () => ({ selectGroup, selectCategory, goToProduct }),
    [selectGroup, selectCategory, goToProduct],
  )
  const meta = useMemo<MenuMeta>(() => ({ panelRef }), [])

  return { state, actions, meta }
}
