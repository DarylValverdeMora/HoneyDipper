import { useCallback, useSyncExternalStore } from 'react'

/** true mientras la media query se cumple. Se actualiza si cambia (rotar, cambiar el ancho de la ventana). */
export const useMediaQuery = (query: string): boolean => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mediaQuery = window.matchMedia(query)
      mediaQuery.addEventListener('change', onChange)
      return () => mediaQuery.removeEventListener('change', onChange)
    },
    [query],
  )
  const getSnapshot = (): boolean => window.matchMedia(query).matches
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
