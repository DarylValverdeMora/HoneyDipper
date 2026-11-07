import type { ContactLine } from '../data/business'

/** Enlace tel: con el código de país, por ejemplo tel:+50683968602. */
export const toTelLink = (line: ContactLine): string => {
  return `tel:+${line.whatsapp}`
}

/** Los métodos de pago como frase: ['Tarjeta', 'Efectivo'] → 'tarjeta y efectivo'. */
export const formatPaymentMethods = (methods: readonly string[]): string => {
  const lower = methods.map((method) => method.toLowerCase())
  if (lower.length <= 1) return lower.join('')
  return `${lower.slice(0, -1).join(', ')} y ${lower[lower.length - 1] ?? ''}`
}
