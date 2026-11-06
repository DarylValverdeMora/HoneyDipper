import { useCallback } from 'react'
import { useLenisInstance } from '../lib/lenis-context'

type ScrollOptions = {
  /** Se llama cuando termina el desplazamiento (de inmediato con scroll nativo). */
  onComplete?: () => void
}

/** Lleva un elemento a la vista con Lenis si está activo, o con scroll nativo. Ambos respetan scroll-margin. */
export const useScrollToElement = (): ((target: HTMLElement, options?: ScrollOptions) => void) => {
  const lenis = useLenisInstance()

  return useCallback(
    (target: HTMLElement, options: ScrollOptions = {}) => {
      if (lenis !== null) {
        lenis.scrollTo(target, options.onComplete === undefined ? {} : { onComplete: options.onComplete })
        return
      }
      target.scrollIntoView()
      options.onComplete?.()
    },
    [lenis],
  )
}
