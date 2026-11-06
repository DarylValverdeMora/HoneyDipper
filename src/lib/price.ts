import type { Colones, Price } from '../data/menu.types'
import { assertNever } from './types'

const THOUSANDS = /\B(?=(\d{3})+(?!\d))/g

/** 1200 → '₡1.200'. Punto como separador de miles, como en el menú impreso. */
export const formatColones = (amount: Colones): string => {
  return `₡${String(amount).replace(THOUSANDS, '.')}`
}

export const PENDING_PRICE_TEXT = 'Consulta el precio'

/** Texto del precio tal como se muestra en la fila del plato. */
export const formatPrice = (price: Price): string => {
  switch (price.kind) {
    case 'unico':
      return formatColones(price.monto)
    case 'tamanos':
      return `Peq. ${formatColones(price.pequeno)} · Gde. ${formatColones(price.grande)}`
    case 'pendiente':
      return PENDING_PRICE_TEXT
    default:
      return assertNever(price)
  }
}

/** Versión para lectores de pantalla: sin abreviaturas. */
export const describePrice = (price: Price): string => {
  switch (price.kind) {
    case 'unico':
      return formatColones(price.monto)
    case 'tamanos':
      return `Pequeño ${formatColones(price.pequeno)}, grande ${formatColones(price.grande)}`
    case 'pendiente':
      return PENDING_PRICE_TEXT
    default:
      return assertNever(price)
  }
}
