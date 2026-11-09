import { describe, expect, it } from 'vitest'
import { buildThreadPath, drawnLengthAt, railXFor } from './honey-thread'

describe('buildThreadPath', () => {
  it('empieza en la punta de la gota, sin hueco, baja por el riel y termina al fondo', () => {
    const { d, railStartY } = buildThreadPath({ start: { x: 180, y: 300 }, runY: 308, railX: 8, bottom: 4000 })
    expect(d.startsWith('M 180 300 Q 180 308 172 308')).toBe(true)
    expect(d.endsWith('L 8 4000')).toBe(true)
    expect(railStartY).toBe(324)
  })

  it('el tramo horizontal queda en la franja de runY: nunca baja sobre las letras', () => {
    const { d } = buildThreadPath({ start: { x: 150, y: 210 }, runY: 218, railX: 8, bottom: 4000 })
    const horizontalYs = [...d.matchAll(/L (\S+) (\S+)/g)].slice(0, 1).map((match) => Number(match[2]))
    expect(horizontalYs).toEqual([218])
  })

  it('en pantallas angostas la primera curva no pasa del riel', () => {
    const { d } = buildThreadPath({ start: { x: 20, y: 200 }, runY: 210, railX: 8, bottom: 4000 })
    expect(d.startsWith('M 20 200 Q 20 210 24 210')).toBe(true)
  })

  it('no sube si el fondo queda antes del riel', () => {
    const { d } = buildThreadPath({ start: { x: 180, y: 300 }, runY: 308, railX: 8, bottom: 10 })
    expect(d.endsWith('L 8 324')).toBe(true)
  })
})

describe('railXFor', () => {
  it('queda en medio del margen y nunca pegado al borde', () => {
    expect(railXFor(0, 16)).toBe(8)
    expect(railXFor(144, 24)).toBe(156)
    expect(railXFor(0, 4)).toBe(6)
  })
})

describe('drawnLengthAt', () => {
  it('antes del riel solo cuenta la curva de entrada', () => {
    expect(drawnLengthAt({ tipY: 100, introLength: 200, introProgress: 1, railStartY: 400 })).toBe(200)
    expect(drawnLengthAt({ tipY: 700, introLength: 200, introProgress: 1, railStartY: 400 })).toBe(500)
  })

  it('no dibuja nada antes de que caiga la gota', () => {
    expect(drawnLengthAt({ tipY: 700, introLength: 200, introProgress: 0, railStartY: 400 })).toBe(0)
  })
})
