import { startTransition, useEffect, useState } from 'react'

/**
 * false en el primer render y true justo después de que el navegador pinta. Sirve para pintar
 * primero lo que se ve al abrir (header y portada) y montar el resto un instante después,
 * sin bloquear la imagen principal (LCP) con el trabajo de toda la página.
 */
export const useAfterFirstPaint = (): boolean => {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Un requestAnimationFrame corre antes del pintado; el setTimeout dentro de él, después.
    let timeoutId = 0
    const frameId = requestAnimationFrame(() => {
      timeoutId = window.setTimeout(() => startTransition(() => setIsReady(true)), 0)
    })
    return () => {
      cancelAnimationFrame(frameId)
      window.clearTimeout(timeoutId)
    }
  }, [])

  return isReady
}
