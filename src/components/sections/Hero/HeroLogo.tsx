import type { FC } from 'react'
import { photos } from '../../../data/photos'

/*
 * Coordenadas dentro del recorte del logo (640×680). La gota original del logo
 * termina en (310, 224); la gota nueva nace ahí y cae hasta (310, 610),
 * en el margen menta vacío debajo de "Cafetería & Pastelería", donde empieza el hilo.
 */
const LOGO_DROP_TIP = { x: 310, y: 224 }
const DROP_HEIGHT = 40
const THREAD_START_Y = 610
const FALL_DISTANCE = THREAD_START_Y - (LOGO_DROP_TIP.y + DROP_HEIGHT)

const toPercent = (value: number, total: number): string => {
  return `${(value / total) * 100}%`
}

/** Gota nueva, 30 de ancho y 40 de alto, colgando de la punta de la gota del logo. */
const NEW_DROP_PATH = `M ${LOGO_DROP_TIP.x} ${LOGO_DROP_TIP.y} C ${LOGO_DROP_TIP.x} ${LOGO_DROP_TIP.y + 6} ${LOGO_DROP_TIP.x - 15} ${LOGO_DROP_TIP.y + 16} ${LOGO_DROP_TIP.x - 15} ${LOGO_DROP_TIP.y + 25} A 15 15 0 0 0 ${LOGO_DROP_TIP.x + 15} ${LOGO_DROP_TIP.y + 25} C ${LOGO_DROP_TIP.x + 15} ${LOGO_DROP_TIP.y + 16} ${LOGO_DROP_TIP.x} ${LOGO_DROP_TIP.y + 6} ${LOGO_DROP_TIP.x} ${LOGO_DROP_TIP.y} Z`

/** El logo queda intacto; la gota que cae es un SVG propio encima. */
export const HeroLogo: FC = () => {
  const { logoHero } = photos

  return (
    <h1 className="relative w-full max-w-sm lg:max-w-md">
      <img
        src={logoHero.src}
        alt={logoHero.alt}
        width={logoHero.width}
        height={logoHero.height}
        fetchPriority="high"
        className="block h-auto w-full"
      />
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox={`0 0 ${logoHero.width} ${logoHero.height}`}
        className="pointer-events-none absolute inset-0 size-full overflow-visible"
      >
        <path data-hero-drop data-fall-distance={FALL_DISTANCE} d={NEW_DROP_PATH} className="fill-honey" />
      </svg>
      <span
        data-honey-thread-start
        aria-hidden="true"
        className="absolute size-0"
        style={{ left: toPercent(LOGO_DROP_TIP.x, logoHero.width), top: toPercent(THREAD_START_Y, logoHero.height) }}
      />
    </h1>
  )
}
