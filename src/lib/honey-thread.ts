/*
 * Geometría del hilo de miel. Funciones puras: reciben medidas en píxeles
 * (relativas al contenedor del hilo) y devuelven trazos SVG.
 */

export type Point = { x: number; y: number }

export type ThreadGeometry = {
  /** Donde cae la gota del logo: ahí empieza el hilo. */
  start: Point
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

/** Radio de las dos curvas: la que sale de la gota y la que dobla hacia abajo en el borde. */
const CORNER_RADIUS = 24

const round = (value: number): number => {
  return Math.round(value * 10) / 10
}

/**
 * Baja un poco desde la gota, corre hacia la izquierda por el margen vacío del logo
 * y dobla hacia abajo por el riel hasta el final de la página.
 */
export const buildThreadPath = ({ start, railX, bottom }: ThreadGeometry): ThreadPath => {
  const runY = start.y + CORNER_RADIUS
  const railStartY = runY + CORNER_RADIUS
  const turnX = Math.max(railX, start.x - CORNER_RADIUS)
  const d = [
    `M ${round(start.x)} ${round(start.y)}`,
    `Q ${round(start.x)} ${round(runY)} ${round(turnX)} ${round(runY)}`,
    `L ${round(railX + CORNER_RADIUS)} ${round(runY)}`,
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
 * `introLength` es la parte curva (de la gota al riel). Mientras la carga no termina
 * (`introProgress` < 1), el tramo del riel crece en proporción, así nada aparece antes que la gota caiga.
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
