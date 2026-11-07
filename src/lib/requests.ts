import { CAKE_OCCASIONS, EVENT_TYPES } from '../data/whatsapp'
import { checkDateFrom, formatReservationDate, sanitizeText } from './reservation'
import type { IsoDate, OpenDateCheck } from './reservation'
import { assertNever } from './types'
import type { FlowValues } from './whatsapp'

/** Largo máximo de la idea del pastel, contado en caracteres que ve la persona (un emoji cuenta como uno). */
export const IDEA_MAX_LENGTH = 300
/** Las opciones de lista no llevan más que esto; cualquier texto más largo no vino de la lista. */
const OPTION_MAX_LENGTH = 40

// ---------- Campos sueltos ----------

/** Cuántos caracteres ve la persona: no parte tildes ni emojis. */
export const countCharacters = (value: string): number => {
  return Array.from(value).length
}

/** Corta un texto al largo máximo sin partir emojis. */
export const limitCharacters = (value: string, maxLength: number): string => {
  return Array.from(value).slice(0, maxLength).join('')
}

export type CountCheck = { kind: 'vacia' } | { kind: 'valida'; count: number } | { kind: 'invalida' }

const DIGITS = /^\d+$/

/** Porciones o personas: un entero positivo, sin tope (no hay datos de capacidad). */
export const checkCount = (value: string): CountCheck => {
  const trimmed = value.trim()
  if (trimmed === '') return { kind: 'vacia' }
  if (!DIGITS.test(trimmed)) return { kind: 'invalida' }
  const count = Number(trimmed)
  if (!Number.isSafeInteger(count) || count < 1) return { kind: 'invalida' }
  return { kind: 'valida', count }
}

export const describeCountError = (check: CountCheck): string => {
  switch (check.kind) {
    case 'invalida':
      return 'Escribe solo un número entero, como 20.'
    case 'vacia':
    case 'valida':
      return ''
    default:
      return assertNever(check)
  }
}

export const describeOpenDateError = (check: OpenDateCheck): string => {
  switch (check.kind) {
    case 'pasada':
      return 'Elige una fecha de hoy en adelante.'
    case 'invalida':
      return 'Esa fecha no existe. Revísala.'
    case 'vacia':
    case 'valida':
      return ''
    default:
      return assertNever(check)
  }
}

const isOneOf = <T extends string>(options: readonly T[], value: string): value is T => {
  return options.some((option) => option === value)
}

/** Solo se manda una opción de la lista; cualquier otro texto se descarta. */
const pickOption = (options: readonly string[], value: string): string => {
  const clean = sanitizeText(value, OPTION_MAX_LENGTH)
  return isOneOf(options, clean) ? clean : ''
}

const describeOpenDate = (value: string, context: RequestContext): string => {
  const check = checkDateFrom(value, context.minDate)
  return check.kind === 'valida' ? formatReservationDate(check.date, context.timeZone) : ''
}

const describeCount = (value: string): string => {
  const check = checkCount(value)
  return check.kind === 'valida' ? String(check.count) : ''
}

// ---------- Mensajes ----------

export type RequestContext = {
  timeZone: string
  /** Hoy en la zona del negocio. */
  minDate: IsoDate
}

export type CakeDraft = {
  ocasion: string
  fecha: string
  porciones: string
  idea: string
}

export type EventDraft = {
  tipo: string
  fecha: string
  personas: string
}

/** Valores del mensaje del pastel, limpios. Lo que falte o no sea válido queda vacío para completarlo en el chat. */
export const cakeMessageValues = (draft: CakeDraft, context: RequestContext): FlowValues<'pastel'> => {
  return {
    ocasion: pickOption(CAKE_OCCASIONS, draft.ocasion),
    fecha: describeOpenDate(draft.fecha, context),
    porciones: describeCount(draft.porciones),
    idea: sanitizeText(draft.idea, IDEA_MAX_LENGTH),
  }
}

/** Valores del mensaje de evento, limpios. Sin tope de personas: no hay datos de capacidad. */
export const eventMessageValues = (draft: EventDraft, context: RequestContext): FlowValues<'evento'> => {
  return {
    tipo: pickOption(EVENT_TYPES, draft.tipo),
    fecha: describeOpenDate(draft.fecha, context),
    personas: describeCount(draft.personas),
  }
}
