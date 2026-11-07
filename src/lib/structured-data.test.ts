import { describe, expect, it } from 'vitest'
import { business } from '../data/business'
import { buildLocalBusinessJsonLd, serializeJsonLd } from './structured-data'

describe('datos estructurados del negocio', () => {
  const data = buildLocalBusinessJsonLd(business)

  it('usa solo datos reales de business.ts', () => {
    expect(data.name).toBe('Honey Dipper')
    expect(data.address.streetAddress).toBe('Frente al parquecito de la Dominica')
    expect(data.geo).toEqual({ '@type': 'GeoCoordinates', latitude: 9.909953817368812, longitude: -83.68866456584233 })
    expect(data.contactPoint.map((point) => point.telephone)).toEqual(['+506 8396-8602', '+506 6349-0223'])
    expect(data.sameAs).toEqual(['https://www.instagram.com/honeydippercr/'])
    expect(data.paymentAccepted).toBe('Tarjeta, Efectivo')
  })

  it('traduce el horario a días de schema.org', () => {
    expect(data.openingHoursSpecification).toEqual([
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday'], opens: '11:00', closes: '20:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Thursday', 'Friday'], opens: '11:00', closes: '21:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday', 'Sunday'], opens: '09:00', closes: '21:00' },
    ])
  })

  it('no inventa rango de precios, reseñas ni placeholders', () => {
    const json = serializeJsonLd(data)
    for (const forbidden of ['priceRange', 'aggregateRating', 'review', 'PLACEHOLDER']) {
      expect(json).not.toContain(forbidden)
    }
  })

  it('no deja cerrar la etiqueta <script>', () => {
    expect(serializeJsonLd({ text: '</script><script>alert(1)</script>' })).not.toContain('</script>')
  })
})
