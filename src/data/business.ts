import type { ClockTime, DayOfWeek, NonEmpty } from '../lib/types'

/** Número de WhatsApp con código de país 506 + 8 dígitos. Solo se crea con toWhatsAppNumber. */
export type WhatsAppNumber = string & { readonly __brand: 'WhatsAppNumber' }

const COSTA_RICA_NUMBER = /^506\d{8}$/

export const toWhatsAppNumber = (raw: string): WhatsAppNumber => {
  if (!COSTA_RICA_NUMBER.test(raw)) {
    throw new Error(`Número de WhatsApp inválido: ${raw}. Debe ser 506 + 8 dígitos.`)
  }
  return raw as WhatsAppNumber
}

export type ConfirmationStatus = 'confirmado' | 'pendiente'

export type BusinessLine = 'restaurante' | 'pasteleria'

export type ContactLine = {
  label: string
  /** Como se muestra en la página. */
  displayPhone: string
  whatsapp: WhatsAppNumber
  /** Si ya se confirmó que este número tiene WhatsApp. */
  whatsappStatus: ConfirmationStatus
}

export type OpeningHours = {
  days: NonEmpty<DayOfWeek>
  opens: ClockTime
  closes: ClockTime
}

export const business = {
  name: 'Honey Dipper',
  descriptor: 'Cafetería & Pastelería',
  slogan: 'Un lugar para comer rico y celebrar bonito',
  serviceChargeNote: '10% de servicio no incluido',

  location: {
    city: 'Turrialba',
    country: 'Costa Rica',
    address: 'Frente al parquecito de la Dominica',
    mapsUrl: 'https://maps.app.goo.gl/ug1RtwHNZvQqTvwd8',
    coordinates: { lat: 9.909953817368812, lng: -83.68866456584233 },
  },

  // [PLACEHOLDER] Falta confirmar cuál de los dos números tiene WhatsApp.
  contact: {
    restaurante: {
      label: 'Restaurante',
      displayPhone: '8396-8602',
      whatsapp: toWhatsAppNumber('50683968602'),
      whatsappStatus: 'pendiente',
    },
    pasteleria: {
      label: 'Pastelería',
      displayPhone: '6349-0223',
      whatsapp: toWhatsAppNumber('50663490223'),
      whatsappStatus: 'pendiente',
    },
  } satisfies Record<BusinessLine, ContactLine>,

  social: {
    instagram: {
      handle: '@honeydippercr',
      url: 'https://www.instagram.com/honeydippercr/',
    },
    facebook: '[PLACEHOLDER] Facebook, si existe',
    tiktok: '[PLACEHOLDER] TikTok, si existe',
  },

  /** Zona horaria fija del negocio. La franja de hoy calcula con esta, nunca con la del dispositivo. */
  timeZone: 'America/Costa_Rica',

  openingHours: [
    { days: ['lunes', 'martes', 'miercoles'], opens: '11:00', closes: '20:00' },
    { days: ['jueves', 'viernes'], opens: '11:00', closes: '21:00' },
    { days: ['sabado', 'domingo'], opens: '09:00', closes: '21:00' },
  ] satisfies NonEmpty<OpeningHours>,

  /**
   * [PLACEHOLDER] Última hora que se puede reservar, en minutos antes del cierre. El dueño debe confirmarla.
   * Con 60 y cierre a las 9:00 p.m., la última reserva es a las 8:00 p.m.
   */
  reservaUltimaAntesCierreMin: 60,
  /** [PLACEHOLDER] Máximo de personas que se eligen en la hoja; más que eso se conversa por WhatsApp. */
  reservaMaxPersonas: 10,
  /** [PLACEHOLDER] Número al que van las consultas de eventos. Por ahora el del restaurante; confirmar con el dueño. */
  eventosLinea: 'restaurante',

  brunch: {
    days: '[PLACEHOLDER] Días del brunch (¿solo sábado y domingo?)',
    hours: '[PLACEHOLDER] Horario del brunch',
  },

  about: '[PLACEHOLDER] Texto de "sobre nosotros": historia y quién está detrás',
  paymentMethods: ['Tarjeta', 'Efectivo'],

  /** Muestra la sección "El lugar". En false se oculta completa (por ejemplo, si no llega el permiso de la foto). */
  mostrarLugar: true,
} as const
