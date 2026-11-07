import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { menu, menuFlags } from '../data/menu'
import type { MenuCategory, MenuCategoryId, MenuGroup, MenuGroupId } from '../data/menu.types'
import { refreshScrollTriggers } from '../lib/load-motion'
import { getVisibleGroups } from '../lib/menu'
import { productAnchorId } from '../lib/menu-ids'
import {
  initialSelection,
  nextStep,
  requireGroups,
  resolveSelection,
  selectCategory as pickCategory,
  selectExact,
  selectGroup as pickGroup,
} from '../lib/menu-selection'
import type { MenuSelection, NextStep } from '../lib/menu-selection'
import type { NonEmpty } from '../lib/types'
import { useReviewMode } from './useReviewMode'
import { useScrollToElement } from './useScrollToElement'

/** Cuánto dura el resaltado del plato al llegar desde la búsqueda. */
const HIGHLIGHT_MS = 1800

export type MenuState = {
  groups: NonEmpty<MenuGroup>
  activeGroup: MenuGroup
  /** La única categoría que se ve. */
  activeCategory: MenuCategory
  /** A dónde lleva el botón "Siguiente" del final. */
  next: NextStep
  isReviewMode: boolean
}

export type ProductTarget = MenuSelection & {
  productName: string
}

export type MenuActions = {
  /** Abre el grupo en su primera categoría. */
  selectGroup: (groupId: MenuGroupId) => void
  selectCategory: (categoryId: MenuCategoryId) => void
  /** Botón "Siguiente": cambia de categoría (o de grupo) y pasa el foco al panel nuevo. */
  goToNext: () => void
  /** Selecciona el grupo y la categoría del plato, baja hasta él, lo resalta y le pasa el foco. */
  goToProduct: (target: ProductTarget) => void
}

export type MenuMeta = {
  /** Inicio del panel: al cambiar de categoría se vuelve aquí si ya quedó atrás. */
  panelRef: RefObject<HTMLDivElement | null>
  /** Barra fija de pestañas y chips (en móvil y tablet). */
  barRef: RefObject<HTMLDivElement | null>
}

/** Qué hacer cuando la categoría nueva ya está en pantalla. */
type AfterChange =
  | { kind: 'nada' }
  | { kind: 'inicio'; focusPanel: boolean }
  | { kind: 'plato'; target: ProductTarget }

type MenuStateValue = { state: MenuState; actions: MenuActions; meta: MenuMeta }

/** true si el inicio del panel quedó tapado por la barra fija (o por el header en escritorio). */
const isPanelStartHidden = (panel: HTMLElement, bar: HTMLElement | null, headerBottom: number): boolean => {
  const barBottom = bar === null ? 0 : bar.getBoundingClientRect().bottom
  const coveredUntil = Math.max(barBottom, headerBottom)
  return panel.getBoundingClientRect().top < coveredUntil
}

const headerBottom = (): number => {
  return document.querySelector('header')?.getBoundingClientRect().bottom ?? 0
}

const highlightTimers = new WeakMap<HTMLElement, number>()

const highlightRow = (row: HTMLElement): void => {
  row.focus({ preventScroll: true })
  row.setAttribute('data-highlighted', '')
  // Dos saltos seguidos a la misma fila: el segundo reinicia el tiempo en vez de heredar el del primero.
  window.clearTimeout(highlightTimers.get(row))
  highlightTimers.set(row, window.setTimeout(() => row.removeAttribute('data-highlighted'), HIGHLIGHT_MS))
}

/**
 * Estado del menú: un grupo (pestaña) y UNA categoría visible a la vez (chips como pestañas).
 * Los grupos salen de menu.ts respetando las banderas, como mostrarMenuMexicano.
 */
export const useMenuState = (): MenuStateValue => {
  const groups = useMemo(() => requireGroups(getVisibleGroups(menu, menuFlags)), [])
  const [selection, setSelection] = useState<MenuSelection>(() => initialSelection(groups))
  const [afterChange, setAfterChange] = useState<AfterChange>({ kind: 'nada' })
  const isReviewMode = useReviewMode()
  const scrollToElement = useScrollToElement()
  const panelRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  const { group: activeGroup, category: activeCategory } = resolveSelection(groups, selection)
  const next = useMemo(() => nextStep(groups, selection), [groups, selection])

  const changeTo = useCallback((nextSelection: MenuSelection, then: AfterChange) => {
    setSelection(nextSelection)
    setAfterChange(then)
  }, [])

  const selectGroup = useCallback(
    (groupId: MenuGroupId) => {
      changeTo(pickGroup(groups, selection, groupId), { kind: 'inicio', focusPanel: false })
    },
    [changeTo, groups, selection],
  )

  const selectCategory = useCallback(
    (categoryId: MenuCategoryId) => {
      changeTo(pickCategory(groups, selection, categoryId), { kind: 'inicio', focusPanel: false })
    },
    [changeTo, groups, selection],
  )

  const goToNext = useCallback(() => {
    changeTo(next.selection, { kind: 'inicio', focusPanel: true })
  }, [changeTo, next])

  const goToProduct = useCallback(
    (target: ProductTarget) => {
      changeTo(selectExact(groups, selection, target), { kind: 'plato', target })
    },
    [changeTo, groups, selection],
  )

  // Ya con la categoría nueva en pantalla: el hilo vuelve a medir y, si hace falta, se sube o se baja.
  useEffect(() => {
    if (afterChange.kind === 'nada') return undefined
    const frameId = requestAnimationFrame(() => {
      setAfterChange({ kind: 'nada' })
      refreshScrollTriggers()
      const panel = panelRef.current
      if (panel === null) return

      if (afterChange.kind === 'plato') {
        const { categoryId, productName } = afterChange.target
        const row = document.getElementById(productAnchorId(categoryId, productName))
        if (row === null) return
        scrollToElement(row)
        highlightRow(row)
        return
      }

      if (afterChange.focusPanel) panel.focus({ preventScroll: true })
      if (isPanelStartHidden(panel, barRef.current, headerBottom())) scrollToElement(panel)
    })
    return () => cancelAnimationFrame(frameId)
  }, [afterChange, scrollToElement])

  const state = useMemo<MenuState>(
    () => ({ groups, activeGroup, activeCategory, next, isReviewMode }),
    [groups, activeGroup, activeCategory, next, isReviewMode],
  )
  const actions = useMemo<MenuActions>(
    () => ({ selectGroup, selectCategory, goToNext, goToProduct }),
    [selectGroup, selectCategory, goToNext, goToProduct],
  )
  const meta = useMemo<MenuMeta>(() => ({ panelRef, barRef }), [])

  return { state, actions, meta }
}
