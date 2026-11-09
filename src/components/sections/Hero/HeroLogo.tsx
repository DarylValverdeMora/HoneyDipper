import type { FC } from 'react'
import logoHeroMask from '../../../assets/img/logo-honey-dipper-hero-mask.webp'
import { photos } from '../../../data/photos'
import { LogoArt } from '../../ui/LogoArt'

/*
 * Coordenadas dentro del recorte del logo (640×680), medidas sobre la máscara.
 * La gota del logo termina en (310, 224). Entre "HONEY" y "DIPPER" hay una franja
 * vacía de y 225 a 256: el hilo sale de la punta de la gota y corre por esa franja
 * hacia el margen izquierdo, así queda unido a la gota a cualquier ancho.
 * Debajo de y 492 solo hay margen menta: el h1 se queda con los primeros 500 px (aspect-32/25)
 * para que el logo ocupe menos alto.
 */
const LOGO_DROP_TIP = { x: 310, y: 224 }
const THREAD_RUN_Y = 240
const DROP_FALL_DISTANCE = THREAD_RUN_Y - LOGO_DROP_TIP.y

/** id del logo grande: el header muestra su logo solo cuando este salió de la pantalla. */
export const HERO_LOGO_ID = 'logo-principal'

const toPercent = (value: number, total: number): string => {
  return `${(value / total) * 100}%`
}

/** Gota nueva, 30 de ancho y 40 de alto, colgando de la punta de la gota del logo. */
const NEW_DROP_PATH = `M ${LOGO_DROP_TIP.x} ${LOGO_DROP_TIP.y} C ${LOGO_DROP_TIP.x} ${LOGO_DROP_TIP.y + 6} ${LOGO_DROP_TIP.x - 15} ${LOGO_DROP_TIP.y + 16} ${LOGO_DROP_TIP.x - 15} ${LOGO_DROP_TIP.y + 25} A 15 15 0 0 0 ${LOGO_DROP_TIP.x + 15} ${LOGO_DROP_TIP.y + 25} C ${LOGO_DROP_TIP.x + 15} ${LOGO_DROP_TIP.y + 16} ${LOGO_DROP_TIP.x} ${LOGO_DROP_TIP.y + 6} ${LOGO_DROP_TIP.x} ${LOGO_DROP_TIP.y} Z`

type ThreadMarkerProps = {
  y: number
  attribute: 'data-honey-thread-start' | 'data-honey-thread-run'
}

const ThreadMarker: FC<ThreadMarkerProps> = ({ y, attribute }) => {
  const { logoHero } = photos
  return (
    <span
      {...{ [attribute]: '' }}
      aria-hidden="true"
      className="absolute size-0"
      style={{ left: toPercent(LOGO_DROP_TIP.x, logoHero.width), top: toPercent(y, logoHero.height) }}
    />
  )
}

/**
 * El logo queda intacto; la gota que cae es un SVG propio encima.
 * En el celular el ancho sale del alto de la pantalla (w-hero-logo) para que quepan
 * el slogan, los botones y el arco en la primera vista.
 */
export const HeroLogo: FC = () => {
  const { logoHero } = photos

  return (
    <h1
      id={HERO_LOGO_ID}
      className="aspect-32/25 w-hero-logo overflow-hidden lg:w-full lg:max-w-md"
    >
      <span className="relative block">
        <LogoArt
          src={logoHero.src}
          maskSrc={logoHeroMask}
          alt={logoHero.alt}
          width={logoHero.width}
          height={logoHero.height}
          priority
          className="h-auto w-full"
        />
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox={`0 0 ${logoHero.width} ${logoHero.height}`}
          className="pointer-events-none absolute inset-0 size-full overflow-visible"
        >
          <path data-hero-drop data-fall-distance={DROP_FALL_DISTANCE} d={NEW_DROP_PATH} className="fill-honey opacity-0" />
        </svg>
        <ThreadMarker y={LOGO_DROP_TIP.y} attribute="data-honey-thread-start" />
        <ThreadMarker y={THREAD_RUN_Y} attribute="data-honey-thread-run" />
      </span>
    </h1>
  )
}
