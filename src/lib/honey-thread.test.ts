import { describe, expect, it } from 'vitest'
import { buildThreadPath, drawnLengthAt, railXFor } from './honey-thread'

describe('buildThreadPath', () => {
  it('empieza en la gota, baja por el riel y termina al fondo', () => {
    const { d, railStartY } = buildThreadPath({ start: { x: 180, y: 300 }, railX: 8, bottom: 4000 })
    expect(d.startsWith('M 180 300')).toBe(true)
    expect(d.endsWith('L 8 4000')).toBe(true)
    expect(railStartY).toBe(348)
  })

  it('no sube si el fondo queda antes del riel', () => {
    const { d } = buildThreadPath({ start: { x: 180, y: 300 }, railX: 8, bottom: 10 })
    expect(d.endsWith('L 8 348')).toBe(true)
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
