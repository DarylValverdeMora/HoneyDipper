import { business } from './business'
import type { BusinessLine } from './business'

export type WhatsAppFlow = 'reserva' | 'pastel' | 'evento' | 'consulta'

/** Campos que puede llenar la persona en cada flujo. Todos son opcionales al enviar. */
export type FlowFields = {
  reserva: 'nombre' | 'fecha' | 'hora' | 'personas'
  pastel: 'ocasion' | 'fecha' | 'porciones' | 'idea'
  evento: 'tipo' | 'fecha' | 'personas'
  consulta: 'plato'
}

export type MessageTemplate<F extends WhatsAppFlow> = {
  /** Texto del botón; el mismo en toda la página. */
  ctaLabel: string
  /** A qué número va el mensaje. */
  line: BusinessLine
  intro: string
  fields: ReadonlyArray<{ key: FlowFields[F]; label: string }>
  closing: string
}

export type MessageTemplates = { [F in WhatsAppFlow]: MessageTemplate<F> }

export const whatsappTemplates: MessageTemplates = {
  reserva: {
    ctaLabel: 'Reservar mesa',
    line: 'restaurante',
    intro: 'Hola, Honey Dipper. Quiero reservar una mesa.',
    fields: [
      { key: 'nombre', label: 'Nombre' },
      { key: 'fecha', label: 'Fecha' },
      { key: 'hora', label: 'Hora' },
      { key: 'personas', label: 'Personas' },
    ],
    closing: '¿Tienen espacio?',
  },
  pastel: {
    ctaLabel: 'Cotiza tu pastel',
    line: 'pasteleria',
    intro: 'Hola, Honey Dipper. Quiero cotizar un pastel.',
    fields: [
      { key: 'ocasion', label: 'Ocasión' },
      { key: 'fecha', label: 'Fecha de entrega' },
      { key: 'porciones', label: 'Porciones' },
      { key: 'idea', label: 'Idea de sabor o diseño' },
    ],
    closing: 'Si les sirve, les mando una foto de referencia.',
  },
  evento: {
    ctaLabel: 'Consultar por un evento',
    line: business.eventosLinea,
    intro: 'Hola, Honey Dipper. Quiero consultar por un evento en el local.',
    fields: [
      { key: 'tipo', label: 'Tipo de evento' },
      { key: 'fecha', label: 'Fecha' },
      { key: 'personas', label: 'Cantidad de personas' },
    ],
    closing: '¿Qué opciones tienen?',
  },
  consulta: {
    ctaLabel: 'Pregúntanos por WhatsApp',
    // [PLACEHOLDER] Confirmar a qué número van las consultas del menú.
    line: 'restaurante',
    intro: 'Hola, Honey Dipper. Tengo una consulta sobre el menú.',
    fields: [{ key: 'plato', label: 'Busco' }],
    closing: '¿Lo tienen?',
  },
}

/** Opciones de la hoja de pastel. "Otra" se explica en el chat. */
export const CAKE_OCCASIONS = ['Cumpleaños', 'Baby shower', 'Aniversario', 'Otra'] as const
export type CakeOccasion = (typeof CAKE_OCCASIONS)[number]

/** Opciones de la hoja de evento. */
export const EVENT_TYPES = ['Cumpleaños', 'Baby shower', 'Reunión', 'Otro'] as const
export type EventType = (typeof EVENT_TYPES)[number]
