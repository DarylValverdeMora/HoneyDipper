import type { OpeningHours } from '../data/business'
import { DAYS_OF_WEEK } from './types'
import type { DayOfWeek } from './types'
import { hoursForDay, readBusinessClock } from './schedule'
import type { FlowValues } from './whatsapp'

/** Fecha sin hora, como la da <input type="date">: 'AAAA-MM-DD'. Solo se crea con toIsoDate. */
export type IsoDate = string & { readonly __brand: 'IsoDate' }

/** Hora reservable en 24 h: '14:30'. Solo se crea con toSlot o isSlotTime. */
export type SlotTime = string & { readonly __brand: 'SlotTime' }

export const SLOT_STEP_MIN = 30
export const BOOKING_WINDOW_DAYS = 60

const MINUTES_PER_HOUR = 60
const MS_PER_DAY = 86_400_000
/** Mediodía en Costa Rica (UTC−6) expresado en UTC: un instante que cae en el mismo día en cualquier zona cercana. */
const CR_NOON_UTC_HOUR = 18
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/
const SLOT = /^(\d{2}):(\d{2})$/

// ---------- Fechas ----------

type DateParts = { year: number; month: number; day: number }

const pad = (value: number): string => {
  return String(value).padStart(2, '0')
}

const isIsoDate = (value: string): value is IsoDate => {
  return ISO_DATE.test(value)
}

/** Constructor de IsoDate: arma el texto con ceros a la izquierda. */
const toIsoDate = ({ year, month, day }: DateParts): IsoDate => {
  const text = `${year}-${pad(month)}-${pad(day)}`
  if (!isIsoDate(text)) throw new Error(`Fecha inválida: ${text}`)
  return text
}

/** Lee 'AAAA-MM-DD'. Devuelve undefined si el texto no es una fecha real (por ejemplo 2026-02-30). */
export const parseIsoDate = (value: string): DateParts | undefined => {
  const match = ISO_DATE.exec(value)
  if (!match) return undefined
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])]
  const probe = new Date(Date.UTC(year, month - 1, day))
  const isRealDate = probe.getUTCFullYear() === year && probe.getUTCMonth() === month - 1 && probe.getUTCDate() === day
  return isRealDate ? { year, month, day } : undefined
}

const businessDateFormatters = new Map<string, Intl.DateTimeFormat>()

const businessDateFormatter = (timeZone: string): Intl.DateTimeFormat => {
  const cached = businessDateFormatters.get(timeZone)
  if (cached) return cached
  const formatter = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' })
  businessDateFormatters.set(timeZone, formatter)
  return formatter
}

/** Fecha de hoy en la zona del negocio, no en la del dispositivo. */
export const businessToday = (now: Date, timeZone: string): IsoDate => {
  const parts = businessDateFormatter(timeZone).formatToParts(now)
  const read = (type: Intl.DateTimeFormatPartTypes): number => Number(parts.find((part) => part.type === type)?.value)
  return toIsoDate({ year: read('year'), month: read('month'), day: read('day') })
}

const addDays = (date: IsoDate, days: number): IsoDate => {
  const parts = parseIsoDate(date)
  if (!parts) throw new Error(`Fecha inválida: ${date}`)
  const shifted = new Date(Date.UTC(parts.year, parts.month - 1, parts.day) + days * MS_PER_DAY)
  return toIsoDate({ year: shifted.getUTCFullYear(), month: shifted.getUTCMonth() + 1, day: shifted.getUTCDate() })
}

export type DateRange = { min: IsoDate; max: IsoDate }

/** Desde hoy (hora de Costa Rica) hasta 60 días después. */
export const reservationDateRange = (now: Date, timeZone: string): DateRange => {
  const min = businessToday(now, timeZone)
  return { min, max: addDays(min, BOOKING_WINDOW_DAYS) }
}

export type DateCheck = { kind: 'vacia' } | { kind: 'valida'; date: IsoDate } | { kind: 'fuera-de-rango'; range: DateRange } | { kind: 'invalida' }

/** Las fechas 'AAAA-MM-DD' se comparan bien como texto. */
export const checkDate = (value: string, range: DateRange): DateCheck => {
  if (value.trim() === '') return { kind: 'vacia' }
  const parts = parseIsoDate(value)
  if (!parts) return { kind: 'invalida' }
  const date = toIsoDate(parts)
  if (date < range.min || date > range.max) return { kind: 'fuera-de-rango', range }
  return { kind: 'valida', date }
}

export type OpenDateCheck = { kind: 'vacia' } | { kind: 'valida'; date: IsoDate } | { kind: 'pasada'; min: IsoDate } | { kind: 'invalida' }

/** Igual que checkDate pero sin fecha máxima: para pedidos donde no hay datos de anticipación ni de tope. */
export const checkDateFrom = (value: string, min: IsoDate): OpenDateCheck => {
  if (value.trim() === '') return { kind: 'vacia' }
  const parts = parseIsoDate(value)
  if (!parts) return { kind: 'invalida' }
  const date = toIsoDate(parts)
  if (date < min) return { kind: 'pasada', min }
  return { kind: 'valida', date }
}

/** Día de la semana de una fecha, sin depender de la zona del dispositivo. */
export const weekdayOf = (date: IsoDate): DayOfWeek => {
  const parts = parseIsoDate(date)
  if (!parts) throw new Error(`Fecha inválida: ${date}`)
  const sundayFirst = new Date(Date.UTC(parts.year, parts.month - 1, parts.day)).getUTCDay()
  const mondayFirst = (sundayFirst + 6) % 7
  const day = DAYS_OF_WEEK[mondayFirst]
  if (day === undefined) throw new Error(`Día fuera de rango: ${mondayFirst}`)
  return day
}

// ---------- Horas ----------

const toMinutes = (time: string): number => {
  const match = SLOT.exec(time)
  if (!match) throw new Error(`Hora inválida: ${time}`)
  return Number(match[1]) * MINUTES_PER_HOUR + Number(match[2])
}

const toSlot = (minutes: number): SlotTime => {
  const text = `${pad(Math.floor(minutes / MINUTES_PER_HOUR))}:${pad(minutes % MINUTES_PER_HOUR)}`
  if (!isSlotTime(text)) throw new Error(`Hora inválida: ${text}`)
  return text
}

export type SlotRules = {
  schedule: readonly OpeningHours[]
  timeZone: string
  /** Minutos antes del cierre en que ya no se reserva. */
  lastBeforeCloseMin: number
  now: Date
}

/**
 * Horas reservables del día, cada 30 minutos: desde la apertura hasta el cierre menos
 * lastBeforeCloseMin. Si la fecha es hoy en Costa Rica, solo las que todavía no pasaron.
 */
export const availableSlots = (date: IsoDate, rules: SlotRules): SlotTime[] => {
  const hours = hoursForDay(rules.schedule, weekdayOf(date))
  if (!hours) return []
  const first = toMinutes(hours.opens)
  const last = toMinutes(hours.closes) - rules.lastBeforeCloseMin
  const isToday = date === businessToday(rules.now, rules.timeZone)
  const nowMinutes = isToday ? readBusinessClock(rules.now, rules.timeZone).minutes : -1

  const slots: SlotTime[] = []
  for (let minutes = first; minutes <= last; minutes += SLOT_STEP_MIN) {
    if (minutes > nowMinutes) slots.push(toSlot(minutes))
  }
  return slots
}

export type TimeReconciliation = { kind: 'sin-cambio' } | { kind: 'limpiada'; previous: SlotTime }

/** Al cambiar la fecha: si la hora elegida ya no está en la lista nueva, hay que limpiarla. */
export const reconcileTime = (time: SlotTime | '', slots: readonly SlotTime[]): TimeReconciliation => {
  if (time === '' || slots.includes(time)) return { kind: 'sin-cambio' }
  return { kind: 'limpiada', previous: time }
}

export const isSlotTime = (value: string): value is SlotTime => {
  const match = SLOT.exec(value)
  if (!match) return false
  return Number(match[1]) < 24 && Number(match[2]) < MINUTES_PER_HOUR
}

// ---------- Texto del mensaje ----------

const spanishDateFormatter = (timeZone: string): Intl.DateTimeFormat => {
  return new Intl.DateTimeFormat('es-CR', { timeZone, weekday: 'long', day: 'numeric', month: 'long' })
}

const spanishTimeFormatter = (timeZone: string): Intl.DateTimeFormat => {
  return new Intl.DateTimeFormat('es-CR', { timeZone, hour: 'numeric', minute: '2-digit', hour12: true })
}

/**
 * Un instante cuya hora en Costa Rica es la hora pedida. Costa Rica no tiene horario de verano (UTC−6),
 * así que cualquier día sirve; la fecha fija solo da el punto de partida.
 */
const COSTA_RICA_OFFSET_HOURS = 6
const REFERENCE_DAY_UTC = Date.UTC(2026, 0, 1)

const instantAtBusinessTime = (minutes: number): Date => {
  return new Date(REFERENCE_DAY_UTC + (COSTA_RICA_OFFSET_HOURS * MINUTES_PER_HOUR + minutes) * 60_000)
}

const partOf = (parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): string => {
  return parts.find((part) => part.type === type)?.value ?? ''
}

/** '2026-11-08' → 'domingo 8 de noviembre' */
export const formatReservationDate = (date: IsoDate, timeZone: string): string => {
  const parts = parseIsoDate(date)
  if (!parts) throw new Error(`Fecha inválida: ${date}`)
  const noon = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, CR_NOON_UTC_HOUR))
  const formatted = spanishDateFormatter(timeZone).formatToParts(noon)
  return `${partOf(formatted, 'weekday')} ${partOf(formatted, 'day')} de ${partOf(formatted, 'month')}`
}

/** '14:30' → '2:30 p.m.' (Intl da 'p. m.' con espacios; se juntan como en el resto de la página). */
export const formatReservationTime = (time: SlotTime, timeZone: string): string => {
  const formatted = spanishTimeFormatter(timeZone).formatToParts(instantAtBusinessTime(toMinutes(time)))
  const period = partOf(formatted, 'dayPeriod').replace(/\s/g, '')
  return `${partOf(formatted, 'hour')}:${partOf(formatted, 'minute')} ${period}`
}

export const NAME_MAX_LENGTH = 60

// Caracteres de control (incluye saltos de línea y tabulaciones) y de formato invisibles.
const CONTROL_CHARACTERS = /[\p{Cc}\p{Cf}]+/gu
const REPEATED_SPACES = /\s{2,}/g

/** Quita caracteres de control, junta espacios, recorta y limita el largo sin partir tildes ni emojis. */
export const sanitizeText = (value: string, maxLength: number): string => {
  const clean = value.replace(CONTROL_CHARACTERS, ' ').replace(REPEATED_SPACES, ' ').trim()
  return Array.from(clean).slice(0, maxLength).join('').trim()
}

// ---------- Mensaje ----------

export const MORE_PEOPLE = 'mas'

export type ReservationDraft = {
  nombre: string
  fecha: string
  hora: string
  /** '' (sin elegir), '1'…'10' o 'mas'. */
  personas: string
}

export type ReservationContext = {
  timeZone: string
  range: DateRange
  maxPeople: number
}

const describePeople = (personas: string, maxPeople: number): string => {
  if (personas === MORE_PEOPLE) return `Más de ${maxPeople}, lo conversamos por aquí`
  const count = Number(personas)
  if (!Number.isInteger(count) || count < 1 || count > maxPeople) return ''
  return String(count)
}

/**
 * Valores del mensaje de reserva, ya limpios y en español. Lo que falta o no es válido queda vacío
 * y la persona lo completa en el chat (la plantilla deja "Fecha:" sin nada).
 */
export const reservationMessageValues = (
  draft: ReservationDraft,
  context: ReservationContext,
): FlowValues<'reserva'> => {
  const dateCheck = checkDate(draft.fecha, context.range)
  const fecha = dateCheck.kind === 'valida' ? formatReservationDate(dateCheck.date, context.timeZone) : ''
  const hora = isSlotTime(draft.hora) ? formatReservationTime(draft.hora, context.timeZone) : ''
  return {
    nombre: sanitizeText(draft.nombre, NAME_MAX_LENGTH),
    fecha,
    hora,
    personas: describePeople(draft.personas, context.maxPeople),
  }
}
