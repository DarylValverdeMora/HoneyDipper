import { business } from '../data/business'
import type { WhatsAppNumber } from '../data/business'
import { whatsappTemplates } from '../data/whatsapp'
import type { FlowFields, MessageTemplate, WhatsAppFlow } from '../data/whatsapp'

export type FlowValues<F extends WhatsAppFlow> = Partial<Record<FlowFields[F], string>>

export type WhatsAppRequest<F extends WhatsAppFlow> = {
  flow: F
  values?: FlowValues<F>
}

const WA_BASE_URL = 'https://wa.me/'

const formatField = (label: string, value: string | undefined): string => {
  const cleanValue = value?.trim() ?? ''
  if (cleanValue === '') return `${label}:`
  return `${label}: ${cleanValue}`
}

/** Arma el texto del mensaje: saludo, un campo por línea y cierre. Los campos vacíos quedan para completar en el chat. */
export const composeMessage = <F extends WhatsAppFlow>(
  template: MessageTemplate<F>,
  values: FlowValues<F>,
): string => {
  const fieldLines = template.fields.map((field) => formatField(field.label, values[field.key]))
  return [template.intro, ...fieldLines, template.closing].join('\n')
}

export const buildWaLink = (phone: WhatsAppNumber, message: string): string => {
  return `${WA_BASE_URL}${phone}?text=${encodeURIComponent(message)}`
}

/** Texto del mensaje de un flujo, tal como llega a WhatsApp (también sirve para copiarlo). */
export const composeFlowMessage = <F extends WhatsAppFlow>({ flow, values = {} }: WhatsAppRequest<F>): string => {
  const template: MessageTemplate<F> = whatsappTemplates[flow]
  return composeMessage(template, values)
}

/** Enlace wa.me con el mensaje prellenado del flujo, enviado al número que le corresponde. */
export const buildWhatsAppLink = <F extends WhatsAppFlow>(request: WhatsAppRequest<F>): string => {
  const phone = business.contact[whatsappTemplates[request.flow].line].whatsapp
  return buildWaLink(phone, composeFlowMessage(request))
}

/** Enlace wa.me sin número: WhatsApp pregunta a quién mandarlo. Sirve para compartir la página. */
export const buildShareLink = (message: string): string => {
  return `${WA_BASE_URL}?text=${encodeURIComponent(message)}`
}
