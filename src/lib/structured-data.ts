import type { business as businessData, OpeningHours } from '../data/business'
import type { DayOfWeek } from './types'

type Business = typeof businessData

const SCHEMA_DAYS: Record<DayOfWeek, string> = {
  lunes: 'Monday',
  martes: 'Tuesday',
  miercoles: 'Wednesday',
  jueves: 'Thursday',
  viernes: 'Friday',
  sabado: 'Saturday',
  domingo: 'Sunday',
}

/** '50683968602' → '+506 8396-8602' */
const toInternationalPhone = (displayPhone: string): string => {
  return `+506 ${displayPhone}`
}

const openingHoursSpecification = (hours: readonly OpeningHours[]) => {
  return hours.map((block) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: block.days.map((day) => SCHEMA_DAYS[day]),
    opens: block.opens,
    closes: block.closes,
  }))
}

/**
 * Datos estructurados (schema.org) del negocio, SOLO con datos reales de business.ts:
 * nombre, dirección, teléfonos, horario, Instagram, coordenadas y formas de pago.
 * Sin rango de precios, reseñas ni URL (la URL se agrega al publicar).
 */
export const buildLocalBusinessJsonLd = (business: Business) => {
  const { restaurante, pasteleria } = business.contact
  return {
    '@context': 'https://schema.org',
    '@type': ['CafeOrCoffeeShop', 'Bakery'],
    name: business.name,
    description: business.slogan,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.location.address,
      addressLocality: business.location.city,
      addressCountry: 'CR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: business.location.coordinates.lat,
      longitude: business.location.coordinates.lng,
    },
    hasMap: business.location.mapsUrl,
    telephone: toInternationalPhone(restaurante.displayPhone),
    contactPoint: [restaurante, pasteleria].map((line) => ({
      '@type': 'ContactPoint',
      contactType: line.label,
      telephone: toInternationalPhone(line.displayPhone),
      areaServed: 'CR',
      availableLanguage: 'es',
    })),
    openingHoursSpecification: openingHoursSpecification(business.openingHours),
    paymentAccepted: business.paymentMethods.join(', '),
    sameAs: [business.social.instagram.url],
  }
}

/** JSON listo para un <script type="application/ld+json">, sin permitir cerrar la etiqueta. */
export const serializeJsonLd = (data: unknown): string => {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
