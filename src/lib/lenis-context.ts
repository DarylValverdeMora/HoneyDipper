import type Lenis from 'lenis'
import { createContext, useContext } from 'react'

export const LenisContext = createContext<Lenis | null>(null)

/** Instancia de Lenis activa, o null si el scroll es nativo (movimiento reducido). */
export const useLenisInstance = (): Lenis | null => {
  return useContext(LenisContext)
}
