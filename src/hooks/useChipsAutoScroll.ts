import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { useReducedMotion } from './useReducedMotion'

/** Mantiene a la vista el chip activo dentro de su fila, sin mover la página. */
export const useChipsAutoScroll = (activeChipId: string): RefObject<HTMLUListElement | null> => {
  const rowRef = useRef<HTMLUListElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const row = rowRef.current
    const chip = row?.querySelector<HTMLElement>(`[data-chip="${activeChipId}"]`)
    if (row === null || row === undefined || chip === null || chip === undefined) return

    const chipLeft = chip.offsetLeft - row.offsetLeft
    const target = chipLeft - (row.clientWidth - chip.offsetWidth) / 2
    row.scrollTo({ left: Math.max(0, target), behavior: reducedMotion ? 'auto' : 'smooth' })
  }, [activeChipId, reducedMotion])

  return rowRef
}
