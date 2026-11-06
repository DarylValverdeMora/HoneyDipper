import { useCallback, useEffect, useRef, useState } from 'react'
import { readRemVariablePx } from '../lib/css-length'

/** Distancia extra bajo la barra del menú donde se decide qué categoría está activa. */
const SPY_LINE_EXTRA_PX = 24

/** Si el desplazamiento por código se interrumpe (por ejemplo con la rueda), el pin se suelta solo. */
const PIN_TIMEOUT_MS = 1500

type ScrollSpy = {
  /** Id del elemento que cruza la línea de lectura, o null si todavía no hay ninguno. */
  activeId: string | null
  /** Fija un id mientras dura un desplazamiento hecho por código; `release` vuelve a escuchar el scroll. */
  pin: (id: string) => void
  release: () => void
}

const readSpyLine = (): number => {
  return readRemVariablePx('--header-height') + readRemVariablePx('--menu-nav-height') + SPY_LINE_EXTRA_PX
}

/** Banda de 1 px a la altura de la línea de lectura. */
const toRootMargin = (line: number): string => {
  const below = Math.max(0, window.innerHeight - line - 1)
  return `-${line}px 0px -${below}px 0px`
}

const firstIntersecting = (ids: readonly string[], intersecting: ReadonlySet<string>): string | null => {
  return ids.find((id) => intersecting.has(id)) ?? null
}

/**
 * Scroll-spy: devuelve el id del elemento (de `ids`, en orden de página) que pasa por
 * la línea justo debajo del header y la barra del menú. Funciona igual con Lenis o con scroll nativo.
 */
export const useScrollSpy = (ids: readonly string[]): ScrollSpy => {
  const [activeId, setActiveId] = useState<string | null>(null)
  const pinnedRef = useRef<string | null>(null)
  const observedRef = useRef<string | null>(null)
  const pinTimerRef = useRef<number | undefined>(undefined)
  const idsKey = ids.join('|')

  useEffect(() => {
    // Se trabaja con idsKey para volver a observar solo cuando cambia la lista, no su referencia.
    const spiedIds = idsKey === '' ? [] : idsKey.split('|')
    const elements = spiedIds.map((id) => document.getElementById(id)).filter((element) => element !== null)
    const intersecting = new Set<string>()
    let observer: IntersectionObserver | null = null

    const onChange = (entries: IntersectionObserverEntry[]): void => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) intersecting.add(entry.target.id)
        else intersecting.delete(entry.target.id)
      })
      const current = firstIntersecting(spiedIds, intersecting)
      if (current === null) return
      observedRef.current = current
      if (pinnedRef.current === null) setActiveId(current)
    }

    const observe = (): void => {
      observer?.disconnect()
      intersecting.clear()
      observer = new IntersectionObserver(onChange, { rootMargin: toRootMargin(readSpyLine()) })
      elements.forEach((element) => observer?.observe(element))
    }

    setActiveId(null)
    observe()
    window.addEventListener('resize', observe)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', observe)
    }
  }, [idsKey])

  const release = useCallback(() => {
    window.clearTimeout(pinTimerRef.current)
    pinnedRef.current = null
    if (observedRef.current !== null) setActiveId(observedRef.current)
  }, [])

  const pin = useCallback(
    (id: string) => {
      window.clearTimeout(pinTimerRef.current)
      pinnedRef.current = id
      setActiveId(id)
      pinTimerRef.current = window.setTimeout(release, PIN_TIMEOUT_MS)
    },
    [release],
  )

  useEffect(() => {
    return () => window.clearTimeout(pinTimerRef.current)
  }, [])

  return { activeId, pin, release }
}
