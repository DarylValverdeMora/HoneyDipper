import { useEffect } from 'react'

/**
 * Si la página se abre con un ancla (#visita), el navegador no la encuentra porque esa sección
 * se monta un instante después de la portada. Cuando ya está, se lleva la vista a ella una vez.
 */
export const useInitialHashScroll = (isContentReady: boolean): void => {
  useEffect(() => {
    if (!isContentReady || window.location.hash.length < 2) return undefined
    const frameId = requestAnimationFrame(() => {
      const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)))
      target?.scrollIntoView()
    })
    return () => cancelAnimationFrame(frameId)
  }, [isContentReady])
}
