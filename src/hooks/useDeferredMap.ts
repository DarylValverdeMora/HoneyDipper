import { useCallback, useEffect, useState } from 'react'

/**
 * El mapa de Google no se carga al entrar a la página (pesa y trae cookies de terceros).
 * - estatico: se ve la imagen fija con el botón "Ver mapa".
 * - cargando: el iframe ya está en la página, esperando su evento load.
 * - listo: el iframe cargó.
 * - error: sin conexión, o el iframe no respondió a tiempo. La página sigue entera
 *   y el botón "Abrir en Google Maps" funciona igual.
 */
export type MapState =
  | { kind: 'estatico' }
  | { kind: 'cargando' }
  | { kind: 'listo' }
  | { kind: 'error'; reason: 'sin-conexion' | 'sin-respuesta' }

const LOAD_TIMEOUT_MS = 10_000

export type DeferredMap = {
  state: MapState
  load: () => void
  handleLoad: () => void
}

export const useDeferredMap = (): DeferredMap => {
  const [state, setState] = useState<MapState>({ kind: 'estatico' })

  const load = useCallback(() => {
    setState(navigator.onLine ? { kind: 'cargando' } : { kind: 'error', reason: 'sin-conexion' })
  }, [])

  const handleLoad = useCallback(() => {
    setState((current) => (current.kind === 'cargando' ? { kind: 'listo' } : current))
  }, [])

  // Un iframe bloqueado o sin red puede no avisar nunca: se da un tiempo límite y se escucha "offline".
  useEffect(() => {
    if (state.kind !== 'cargando') return undefined

    const fail = (reason: 'sin-conexion' | 'sin-respuesta') => () => {
      setState((current) => (current.kind === 'cargando' ? { kind: 'error', reason } : current))
    }
    const handleOffline = fail('sin-conexion')
    const timeoutId = window.setTimeout(fail('sin-respuesta'), LOAD_TIMEOUT_MS)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.clearTimeout(timeoutId)
      window.removeEventListener('offline', handleOffline)
    }
  }, [state.kind])

  return { state, load, handleLoad }
}
