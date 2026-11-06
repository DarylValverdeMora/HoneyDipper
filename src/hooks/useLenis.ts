import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useEffect, useState } from 'react'

gsap.registerPlugin(ScrollTrigger)

const SCROLL_DURATION_SECONDS = 1.1
const SECONDS_TO_MS = 1000

/**
 * Scroll suave con Lenis, sincronizado con GSAP ScrollTrigger. Si `enabled` es false
 * (por ejemplo con movimiento reducido) no se crea y el scroll queda nativo.
 */
export const useLenis = (enabled: boolean): Lenis | null => {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (!enabled) return

    const instance = new Lenis({
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
      instance.destroy()
      setLenis(null)
    }
  }, [enabled])

  return lenis
}
