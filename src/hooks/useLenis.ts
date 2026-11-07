import type Lenis from 'lenis'
import { useEffect, useState } from 'react'
import { loadMotion } from '../lib/load-motion'
import type { MotionRuntime } from '../lib/load-motion'

const SCROLL_DURATION_SECONDS = 1.1
const SECONDS_TO_MS = 1000

/** Crea Lenis, lo conecta con el reloj de GSAP y con ScrollTrigger. Devuelve cómo deshacerlo. */
const startLenis = (runtime: MotionRuntime, setLenis: (lenis: Lenis | null) => void): (() => void) => {
  const { gsap, ScrollTrigger } = runtime
  const instance = new runtime.Lenis({
    duration: SCROLL_DURATION_SECONDS,
    // Lenis lee el scroll-margin-top de cada sección, así los anclajes no quedan bajo el header.
    anchors: true,
  })
  const tick = (timeSeconds: number): void => {
    instance.raf(timeSeconds * SECONDS_TO_MS)
  }

  instance.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  setLenis(instance)

  return () => {
    gsap.ticker.remove(tick)
    // Valores por defecto de GSAP: la página no deja un ajuste global cambiado al desmontar Lenis.
    gsap.ticker.lagSmoothing(500, 33)
    instance.destroy()
    setLenis(null)
  }
}

/**
 * Scroll suave con Lenis, sincronizado con GSAP ScrollTrigger. Si `enabled` es false
 * (por ejemplo con movimiento reducido) no se crea y el scroll queda nativo.
 * Las librerías se descargan aparte, después de la primera pintura.
 */
export const useLenis = (enabled: boolean): Lenis | null => {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (!enabled) return undefined

    let stop: (() => void) | null = null
    let isCancelled = false
    loadMotion().then(
      (runtime) => {
        if (!isCancelled) stop = startLenis(runtime, setLenis)
      },
      // Sin las librerías el scroll queda nativo, igual que con movimiento reducido.
      () => undefined,
    )

    return () => {
      isCancelled = true
      stop?.()
    }
  }, [enabled])

  return lenis
}
