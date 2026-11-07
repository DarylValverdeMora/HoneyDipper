import { describe, expect, it } from 'vitest'
import { parsePresentation, variantAttribute, withVariant } from './presentation'

describe('modo presentación', () => {
  it('está apagado sin ?present=1', () => {
    expect(parsePresentation('')).toEqual({ kind: 'apagado' })
    expect(parsePresentation('?present=0&v=b')).toEqual({ kind: 'apagado' })
  })

  it('ignora ?v=b sin ?present=1: se muestra la variante A', () => {
    const presentation = parsePresentation('?v=b')
    expect(presentation).toEqual({ kind: 'apagado' })
    expect(variantAttribute(presentation)).toBeUndefined()
  })

  it('usa A por defecto y B con v=b', () => {
    expect(parsePresentation('?present=1')).toEqual({ kind: 'activo', variant: 'a' })
    expect(parsePresentation('?present=1&v=b')).toEqual({ kind: 'activo', variant: 'b' })
    expect(parsePresentation('?present=1&v=z')).toEqual({ kind: 'activo', variant: 'a' })
  })

  it('solo B pone data-variant', () => {
    expect(variantAttribute({ kind: 'activo', variant: 'a' })).toBeUndefined()
    expect(variantAttribute({ kind: 'activo', variant: 'b' })).toBe('b')
  })

  it('guarda la variante en el enlace sin perder otros parámetros', () => {
    expect(withVariant('https://honeydipper.cr/?review=1#menu', 'b')).toBe(
      'https://honeydipper.cr/?review=1&present=1&v=b#menu',
    )
  })
})
