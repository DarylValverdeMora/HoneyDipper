/** Duraciones y curvas compartidas. Todo el movimiento de la página sale de aquí. */
export const EASE_OUT = 'power3.out'
export const EASE_FALL = 'power2.in'

/** Secuencia de carga: la gota crece, cae y arranca el hilo; el slogan aparece en paralelo. Total < 1,8 s. */
export const LOAD_SEQUENCE = {
  dropGrow: 0.45,
  dropFall: 0.55,
  dropFade: 0.15,
  threadIntro: 0.45,
  sloganDelay: 0.35,
  sloganReveal: 0.6,
  sloganOffsetPx: 12,
} as const

/** Suavizado del hilo al hacer scroll (segundos que tarda en alcanzar la posición). */
export const THREAD_SCRUB_SECONDS = 0.6

export const loadSequenceDuration = (): number => {
  const { dropGrow, dropFall, threadIntro, sloganDelay, sloganReveal } = LOAD_SEQUENCE
  return Math.max(dropGrow + dropFall + threadIntro, sloganDelay + sloganReveal)
}
