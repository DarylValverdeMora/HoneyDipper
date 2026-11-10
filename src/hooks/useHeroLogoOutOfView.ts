import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

/**
 * true cuando el logo grande del hero (por id) ya no se ve: quedó entero detrás del header fijo
 * o más arriba. Empieza en false porque la página carga arriba, con el logo a la vista.
 * Si el logo no existe, devuelve true para que el header no se quede sin logo.
 */
export const useHeroLogoOutOfView = (heroLogoId: string, headerRef: RefObject<HTMLElement | null>): boolean => {
  const [isOutOfView, setIsOutOfView] = useState(false)

  useEffect(() => {
    const heroLogo = document.getElementById(heroLogoId)
    if (heroLogo === null) {
      setIsOutOfView(true)
      return undefined
    }
    const headerHeight = headerRef.current?.offsetHeight ?? 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry !== undefined) setIsOutOfView(!entry.isIntersecting)
      },
      { rootMargin: `-${headerHeight}px 0px 0px 0px` },
    )
    observer.observe(heroLogo)
    return () => observer.disconnect()
  }, [heroLogoId, headerRef])

  return isOutOfView
}
