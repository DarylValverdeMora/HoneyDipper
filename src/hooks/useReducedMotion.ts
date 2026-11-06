import { useSyncExternalStore } from 'react'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

const subscribe = (onChange: () => void): (() => void) => {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY)
  mediaQuery.addEventListener('change', onChange)
  return () => mediaQuery.removeEventListener('change', onChange)
}

const getSnapshot = (): boolean => window.matchMedia(REDUCED_MOTION_QUERY).matches

const getServerSnapshot = (): boolean => true

/** true si la persona pidió menos movimiento en su sistema. Se actualiza si cambia la preferencia. */
export const useReducedMotion = (): boolean => {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
