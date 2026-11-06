import { useCallback } from 'react'
import type { SectionId } from '../data/navigation'
import { useLenisInstance } from '../lib/lenis-context'

/** Lleva a una sección: con Lenis si está activo, si no con el scroll nativo (ambos respetan scroll-margin). */
export const useScrollToSection = (): ((sectionId: SectionId) => void) => {
  const lenis = useLenisInstance()

  return useCallback(
    (sectionId: SectionId) => {
      const target = document.getElementById(sectionId)
      if (target === null) return

      window.history.replaceState(null, '', `#${sectionId}`)
      if (lenis !== null) {
        lenis.scrollTo(target)
        return
      }
      target.scrollIntoView()
    },
    [lenis],
  )
}
