import type { OpeningHours } from '../data/business'
import type { ClockTime, DayOfWeek } from './types'
import { assertNever, DAYS_OF_WEEK } from './types'

const DAY_LABELS: Record<DayOfWeek, string> = {
  lunes: 'lunes',
  martes: 'martes',
  miercoles: 'miércoles',
  jueves: 'jueves',
  viernes: 'viernes',
  sabado: 'sábado',
  domingo: 'domingo',
}

const NOON = 12

const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/** '20:00' → '8:00 p.m.', '09:00' → '9:00 a.m.' */
export const formatClockTime = (time: ClockTime): string => {
  const [hoursText, minutes] = time.split(':')
  const hours = Number(hoursText)
  const period = hours >= NOON ? 'p.m.' : 'a.m.'
  const twelveHour = hours % NOON === 0 ? NOON : hours % NOON
  return `${twelveHour}:${minutes ?? '00'} ${period}`
}

const areConsecutive = (days: readonly DayOfWeek[]): boolean => {
  const positions = days.map((day) => DAYS_OF_WEEK.indexOf(day))
  return positions.every((position, index) => index === 0 || position === (positions[index - 1] ?? -2) + 1)
}

/** ['lunes','martes','miercoles'] → 'Lunes a miércoles'; ['jueves','viernes'] → 'Jueves y viernes' */
export const formatDays = (days: OpeningHours['days']): string => {
  const labels = days.map((day) => DAY_LABELS[day])
  const first = labels[0] ?? ''
  const last = labels[labels.length - 1] ?? ''
  if (labels.length === 1) return capitalize(first)
  if (labels.length > 2 && areConsecutive(days)) return capitalize(`${first} a ${last}`)
  return capitalize(`${labels.slice(0, -1).join(', ')} y ${last}`)
}

export const formatHours = (entry: OpeningHours): string => {
  return `${formatClockTime(entry.opens)} a ${formatClockTime(entry.closes)}`
}

/** Hora en el reloj del negocio: día de la semana y minutos desde la medianoche. */
export type BusinessClock = {
  day: DayOfWeek
  minutes: number
}

const WEEKDAY_BY_ENGLISH_NAME: Record<string, DayOfWeek> = {
  Monday: 'lunes',
  Tuesday: 'martes',
  Wednesday: 'miercoles',
  Thursday: 'jueves',
  Friday: 'viernes',
  Saturday: 'sabado',
  Sunday: 'domingo',
}

const MINUTES_PER_HOUR = 60

const clockFormatters = new Map<string, Intl.DateTimeFormat>()

const formatterFor = (timeZone: string): Intl.DateTimeFormat => {
  const cached = clockFormatters.get(timeZone)
  if (cached) return cached
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  })
  clockFormatters.set(timeZone, formatter)
  return formatter
}

/** Lee día y hora en la zona horaria indicada, sin importar la del dispositivo. */
export const readBusinessClock = (instant: Date, timeZone: string): BusinessClock => {
  const parts = formatterFor(timeZone).formatToParts(instant)
  const partValue = (type: Intl.DateTimeFormatPartTypes): string => {
    return parts.find((part) => part.type === type)?.value ?? ''
  }
  const day = WEEKDAY_BY_ENGLISH_NAME[partValue('weekday')]
  if (!day) {
    throw new Error(`No se pudo leer el día de la semana en ${timeZone}.`)
  }
  const minutes = Number(partValue('hour')) * MINUTES_PER_HOUR + Number(partValue('minute'))
  return { day, minutes }
}

const toMinutes = (time: ClockTime): number => {
  const [hours, minutes] = time.split(':')
  return Number(hours) * MINUTES_PER_HOUR + Number(minutes)
}

export const hoursForDay = (
  schedule: readonly OpeningHours[],
  day: DayOfWeek,
): OpeningHours | undefined => {
  return schedule.find((entry) => entry.days.includes(day))
}

export type TodayStatus =
  | { kind: 'antes-de-abrir'; hours: OpeningHours }
  | { kind: 'abierto'; hours: OpeningHours }
  | { kind: 'cerrado-por-hoy'; hours: OpeningHours }
  | { kind: 'sin-horario' }

type TodayStatusArgs = {
  now: Date
  timeZone: string
  schedule: readonly OpeningHours[]
}

/** Estado del negocio en este instante, calculado con la hora del negocio (no la del dispositivo). */
export const getTodayStatus = ({ now, timeZone, schedule }: TodayStatusArgs): TodayStatus => {
  const clock = readBusinessClock(now, timeZone)
  const hours = hoursForDay(schedule, clock.day)
  if (!hours) return { kind: 'sin-horario' }
  if (clock.minutes < toMinutes(hours.opens)) return { kind: 'antes-de-abrir', hours }
  if (clock.minutes < toMinutes(hours.closes)) return { kind: 'abierto', hours }
  return { kind: 'cerrado-por-hoy', hours }
}

/** 'Hoy abrimos de 11:00 a.m. a 9:00 p.m.' */
export const describeTodayHours = (status: TodayStatus): string => {
  if (status.kind === 'sin-horario') return 'Hoy no abrimos'
  return `Hoy abrimos de ${formatClockTime(status.hours.opens)} a ${formatClockTime(status.hours.closes)}`
}

/** Frase corta del estado actual. La hora de cierre ya va en describeTodayHours. */
export const describeOpenNow = (status: TodayStatus): string => {
  switch (status.kind) {
    case 'abierto':
      return 'Abierto ahora'
    case 'antes-de-abrir':
      return `Cerrado ahora, abrimos a las ${formatClockTime(status.hours.opens)}`
    case 'cerrado-por-hoy':
      return 'Cerrado ahora'
    case 'sin-horario':
      return 'Cerrado hoy'
    default:
      return assertNever(status)
  }
}
