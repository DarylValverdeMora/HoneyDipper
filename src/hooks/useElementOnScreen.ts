import { useEffect, useState } from 'react'

/**
 * true mientras se ve al menos `minVisibleRatio` del elemento con ese id (0 = cualquier píxel).
 * Si el elemento no existe, devuelve false.
 */
export const useElementOnScreen = (elementId: string, minVisibleRatio = 0): boolean => {
  const [isOnScreen, setIsOnScreen] = useState(false)

  useEffect(() => {
    const element = document.getElementById(elementId)
    if (element === null) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisibleEnough = entry !== undefined && entry.isIntersecting && entry.intersectionRatio >= minVisibleRatio
        setIsOnScreen(isVisibleEnough)
      },
      { threshold: minVisibleRatio },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [elementId, minVisibleRatio])

  return isOnScreen
}
