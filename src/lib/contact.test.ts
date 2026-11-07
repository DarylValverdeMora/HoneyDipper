import { describe, expect, it } from 'vitest'
import { business } from '../data/business'
import { formatPaymentMethods, toTelLink } from './contact'

describe('contacto', () => {
  it('arma enlaces tel: con +506', () => {
    expect(toTelLink(business.contact.restaurante)).toBe('tel:+50683968602')
    expect(toTelLink(business.contact.pasteleria)).toBe('tel:+50663490223')
  })

  it('escribe los métodos de pago como frase', () => {
    expect(formatPaymentMethods(business.paymentMethods)).toBe('tarjeta y efectivo')
    expect(formatPaymentMethods(['Tarjeta', 'Efectivo', 'SINPE'])).toBe('tarjeta, efectivo y sinpe')
  })
})
