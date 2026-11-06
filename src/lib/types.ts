export type NonEmpty<T> = readonly [T, ...T[]]

type Hour =
  | '00' | '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11'
  | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20' | '21' | '22' | '23'
type Minute = '00' | '15' | '30' | '45'

/** Hora en formato 24 h, por ejemplo '09:00' o '21:00'. */
export type ClockTime = `${Hour}:${Minute}`

export const DAYS_OF_WEEK = [
  'lunes',
  'martes',
  'miercoles',
  'jueves',
  'viernes',
  'sabado',
  'domingo',
] as const

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number]

export const assertNever = (value: never): never => {
  throw new Error(`Caso no contemplado: ${String(value)}`)
}
