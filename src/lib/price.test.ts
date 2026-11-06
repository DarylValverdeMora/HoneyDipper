import { describe, expect, it } from 'vitest'
import { PRECIO_PENDIENTE, colones, precioPorTamanos, precioUnico } from '../data/menu.types'
import { describePrice, formatColones, formatPrice } from './price'

describe('formatPrice', () => {
  it('usa punto de miles', () => {
    expect(formatColones(colones(1200))).toBe('₡1.200')
    expect(formatColones(colones(950))).toBe('₡950')
    expect(formatColones(colones(12500))).toBe('₡12.500')
  })

  it('muestra los tres tipos de precio', () => {
    expect(formatPrice(precioUnico(4200))).toBe('₡4.200')
    expect(formatPrice(precioPorTamanos({ pequeno: 1200, grande: 1700 }))).toBe('Peq. ₡1.200 · Gde. ₡1.700')
    expect(formatPrice(PRECIO_PENDIENTE)).toBe('Consulta el precio')
  })

  it('describe los tamaños sin abreviar', () => {
    expect(describePrice(precioPorTamanos({ pequeno: 1200, grande: 1700 }))).toBe('Pequeño ₡1.200, grande ₡1.700')
  })
})
