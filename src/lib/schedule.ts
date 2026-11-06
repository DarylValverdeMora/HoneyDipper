import type { OpeningHours } from '../data/business'
import type { ClockTime, DayOfWeek } from './types'
import { DAYS_OF_WEEK } from './types'

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
