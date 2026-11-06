import { useCallback } from 'react'
import type { SectionId } from '../data/navigation'
import { useScrollToElement } from './useScrollToElement'

/** Lleva a una sección de la página y deja el ancla en la URL. */
export const useScrollToSection = (): ((sectionId: SectionId) => void) => {
  const scrollToElement = useScrollToElement()

  return useCallback(
    (sectionId: SectionId) => {
      const target = document.getElementById(sectionId)
      if (target === null) return

      window.history.replaceState(null, '', `#${sectionId}`)
      scrollToElement(target)
    },
    [scrollToElement],
  )
}
