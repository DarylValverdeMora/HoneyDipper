import { useCallback, useRef } from 'react'
import type { KeyboardEvent } from 'react'

type RovingTabsOptions<T extends string> = {
  ids: readonly T[]
  activeId: T
  onSelect: (id: T) => void
}

type RovingTabs<T extends string> = {
  registerTab: (id: T) => (node: HTMLButtonElement | null) => void
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void
}

const KEY_STEPS: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }

const nextIndex = (key: string, current: number, total: number): number | null => {
  if (key === 'Home') return 0
  if (key === 'End') return total - 1
  const step = KEY_STEPS[key]
  if (step === undefined) return null
  return (current + step + total) % total
}

/** Pestañas con foco itinerante: flechas, Inicio y Fin mueven el foco y seleccionan (patrón WAI-ARIA). */
export const useRovingTabs = <T extends string>({ ids, activeId, onSelect }: RovingTabsOptions<T>): RovingTabs<T> => {
  const tabsRef = useRef(new Map<T, HTMLButtonElement>())

  const registerTab = useCallback(
    (id: T) => (node: HTMLButtonElement | null) => {
      if (node === null) tabsRef.current.delete(id)
      else tabsRef.current.set(id, node)
    },
    [],
  )

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      const index = nextIndex(event.key, ids.indexOf(activeId), ids.length)
      if (index === null) return
      const nextId = ids[index]
      if (nextId === undefined) return

      event.preventDefault()
      onSelect(nextId)
      tabsRef.current.get(nextId)?.focus()
    },
    [activeId, ids, onSelect],
  )

  return { registerTab, onKeyDown }
}
