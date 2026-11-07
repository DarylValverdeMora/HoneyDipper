export type MotionRuntime = typeof import('./motion-runtime')

let pending: Promise<MotionRuntime> | null = null

/**
 * Descarga las librerías de movimiento una sola vez, después de que la portada ya se pintó.
 * El hilo de miel y el scroll suave son un extra: si la descarga falla, la página sigue con scroll nativo.
 */
export const loadMotion = (): Promise<MotionRuntime> => {
  pending ??= import('./motion-runtime')
  return pending
}

/** Vuelve a medir los ScrollTrigger (hilo de miel) si GSAP ya se cargó. Si no, no hace falta: medirá al cargar. */
export const refreshScrollTriggers = (): void => {
  void pending?.then(({ ScrollTrigger }) => ScrollTrigger.refresh())
}
