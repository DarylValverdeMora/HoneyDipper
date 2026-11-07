import { useCallback, useLayoutEffect, useState } from 'react'
import { parsePresentation, variantAttribute, withVariant } from '../lib/presentation'
import type { Presentation, Variant } from '../lib/presentation'

const VARIANT_ATTRIBUTE = 'data-variant'

export type PresentationControls = {
  presentation: Presentation
  selectVariant: (variant: Variant) => void
}

/**
 * Lee el modo presentación de la URL y pone data-variant en <html> antes de pintar,
 * para que la variante B no parpadee en A al abrir el enlace.
 */
export const usePresentation = (): PresentationControls => {
  const [presentation, setPresentation] = useState(() => parsePresentation(window.location.search))

  useLayoutEffect(() => {
    const root = document.documentElement
    const variant = variantAttribute(presentation)
    if (variant === undefined) {
      root.removeAttribute(VARIANT_ATTRIBUTE)
    } else {
      root.setAttribute(VARIANT_ATTRIBUTE, variant)
    }
  }, [presentation])

  const selectVariant = useCallback((variant: Variant) => {
    window.history.replaceState(window.history.state, '', withVariant(window.location.href, variant))
    setPresentation({ kind: 'activo', variant })
  }, [])

  return { presentation, selectVariant }
}
