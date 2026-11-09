/*
 * Geometría del hilo de miel. Funciones puras: reciben medidas en píxeles
 * (relativas al contenedor del hilo) y devuelven trazos SVG.
 */

export type Point = { x: number; y: number }

export type ThreadGeometry = {
  /** Punta de la gota del logo: ahí empieza el hilo, sin hueco. */
  start: Point
  /** y de la franja vacía entre "HONEY" y "DIPPER" por la que el hilo corre hacia el margen. */
  runY: number
  /** x del riel vertical, en el margen izquierdo, fuera de las columnas de texto. */
  railX: number
  /** Fondo del contenedor: el hilo termina ahí. */
  bottom: number
}

export type ThreadPath = {
  d: string
  /** y donde el hilo ya bajó por el riel; de ahí para abajo el largo dibujado es lineal con y. */
  railStartY: number
}

/** Radio de la curva que dobla hacia abajo en el margen. */
const RAIL_CORNER_RADIUS = 16

const round = (value: number): number => {
  return Math.round(value * 10) / 10
}

/**
 * Sale de la punta de la gota, dobla enseguida hacia la izquierda por la franja vacía del logo
 * y, en el margen, dobla hacia abajo por el riel hasta el final de la página.
 * El primer radio es la distancia de la gota a la franja: la curva nunca toca las letras.
 */
export const buildThreadPath = ({ start, runY, railX, bottom }: ThreadGeometry): ThreadPath => {
  const dropRadius = Math.max(0, runY - start.y)
  const railStartY = runY + RAIL_CORNER_RADIUS
  const turnX = Math.max(railX + RAIL_CORNER_RADIUS, start.x - dropRadius)
  const d = [
    `M ${round(start.x)} ${round(start.y)}`,
    `Q ${round(start.x)} ${round(runY)} ${round(turnX)} ${round(runY)}`,
    `L ${round(railX + RAIL_CORNER_RADIUS)} ${round(runY)}`,
    `Q ${round(railX)} ${round(runY)} ${round(railX)} ${round(railStartY)}`,
    `L ${round(railX)} ${round(Math.max(bottom, railStartY))}`,
  ].join(' ')
  return { d, railStartY }
}

/** Gotita que cuelga del riel en `y`, centrada en la línea. 8 px de ancho, 13 de alto. */
export const buildDropletPath = ({ x, y }: Point): string => {
  return `M ${round(x)} ${round(y)} C ${round(x)} ${round(y + 2)} ${round(x - 4)} ${round(y + 6)} ${round(x - 4)} ${round(y + 9)} A 4 4 0 0 0 ${round(x + 4)} ${round(y + 9)} C ${round(x + 4)} ${round(y + 6)} ${round(x)} ${round(y + 2)} ${round(x)} ${round(y)} Z`
}

/** x del riel: centrado en el margen que queda a la izquierda del contenedor de columnas. */
export const railXFor = (containerLeft: number, gutter: number): number => {
  const MIN_RAIL_X = 6
  return Math.max(MIN_RAIL_X, containerLeft + gutter / 2)
}

/**
 * Largo de hilo que toca dibujar para que la punta llegue a `tipY`.
 * `introLength` es el tramo de la gota al riel: siempre se dibuja entero al terminar la carga,
 * aunque la punta del scroll esté más arriba, así el hilo nunca queda cortado junto a la gota.
 * Mientras la carga no termina (`introProgress` < 1), todo crece en proporción.
 */
export const drawnLengthAt = ({
  tipY,
  introLength,
  introProgress,
  railStartY,
}: {
  tipY: number
  introLength: number
  introProgress: number
  railStartY: number
}): number => {
  const railLength = Math.max(0, tipY - railStartY)
  return (introLength + railLength) * introProgress
}
