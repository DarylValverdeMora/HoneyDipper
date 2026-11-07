import { afterEach, describe, expect, it, vi } from 'vitest'
import { business } from '../data/business'
import { whatsappTemplates } from '../data/whatsapp'
import {
  availableSlots,
  businessToday,
  checkDate,
  formatReservationDate,
  formatReservationTime,
  isSlotTime,
  reconcileTime,
  reservationDateRange,
  reservationMessageValues,
  sanitizeText,
  weekdayOf,
} from './reservation'
import type { IsoDate, SlotTime } from './reservation'
import { buildWhatsAppLink, composeMessage } from './whatsapp'

const TZ = business.timeZone

/** Costa Rica es UTC−6: las 2:10 p.m. del sábado 7 son las 20:10 UTC. */
const SATURDAY_AFTERNOON = new Date('2026-11-07T20:10:00Z')

const dateOf = (value: string): IsoDate => {
  const check = checkDate(value, reservationDateRange(SATURDAY_AFTERNOON, TZ))
  if (check.kind !== 'valida') throw new Error(`Fecha de prueba inválida: ${value}`)
  return check.date
}

const slot = (value: string): SlotTime => {
  if (!isSlotTime(value)) throw new Error(`Hora de prueba inválida: ${value}`)
  return value
}

const rules = (now: Date) => {
  return { schedule: business.openingHours, timeZone: TZ, lastBeforeCloseMin: business.reservaUltimaAntesCierreMin, now }
}

const context = { timeZone: TZ, range: reservationDateRange(SATURDAY_AFTERNOON, TZ), maxPeople: business.reservaMaxPersonas }

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('fechas de reserva', () => {
  it('va de hoy a 60 días, con la fecha de Costa Rica', () => {
    expect(reservationDateRange(SATURDAY_AFTERNOON, TZ)).toEqual({ min: '2026-11-07', max: '2027-01-06' })
  })

  it('rechaza fechas fuera de rango o que no existen', () => {
    const range = reservationDateRange(SATURDAY_AFTERNOON, TZ)
    expect(checkDate('', range).kind).toBe('vacia')
    expect(checkDate('2026-11-06', range).kind).toBe('fuera-de-rango')
    expect(checkDate('2027-01-07', range).kind).toBe('fuera-de-rango')
    expect(checkDate('2026-02-30', range).kind).toBe('invalida')
    expect(checkDate('2027-01-06', range).kind).toBe('valida')
  })

  it('sabe el día de la semana sin usar la zona del dispositivo', () => {
    vi.stubEnv('TZ', 'Pacific/Kiritimati')
    expect(weekdayOf(dateOf('2026-11-09'))).toBe('lunes')
    expect(weekdayOf(dateOf('2026-11-07'))).toBe('sabado')
  })
})

describe('horas disponibles', () => {
  const nextWeek = new Date('2026-11-08T15:00:00Z')

  it('lunes a miércoles: de 11:00 a 7:00 p.m. (cierra 8:00 p.m., última una hora antes)', () => {
    const slots = availableSlots(dateOf('2026-11-09'), rules(nextWeek))
    expect(slots[0]).toBe('11:00')
    expect(slots.at(-1)).toBe('19:00')
    expect(slots).toHaveLength(17)
    expect(availableSlots(dateOf('2026-11-11'), rules(nextWeek)).at(-1)).toBe('19:00')
  })

  it('jueves y viernes: de 11:00 a 8:00 p.m. (cierra 9:00 p.m.)', () => {
    const slots = availableSlots(dateOf('2026-11-12'), rules(nextWeek))
    expect(slots[0]).toBe('11:00')
    expect(slots.at(-1)).toBe('20:00')
    expect(slots).toHaveLength(19)
  })

  it('sábado y domingo: de 9:00 a.m. a 8:00 p.m., cada 30 minutos', () => {
    const slots = availableSlots(dateOf('2026-11-14'), rules(nextWeek))
    expect(slots.slice(0, 3)).toEqual(['09:00', '09:30', '10:00'])
    expect(slots.at(-1)).toBe('20:00')
    expect(slots).toHaveLength(23)
  })

  it('hoy solo muestra horas que no han pasado', () => {
    expect(availableSlots(dateOf('2026-11-07'), rules(SATURDAY_AFTERNOON))[0]).toBe('14:30')
    // Justo a las 2:30 p.m. esa hora ya no se ofrece
    expect(availableSlots(dateOf('2026-11-07'), rules(new Date('2026-11-07T20:30:00Z')))[0]).toBe('15:00')
    // A las 8:30 p.m. ya no queda ninguna
    expect(availableSlots(dateOf('2026-11-07'), rules(new Date('2026-11-08T02:30:00Z')))).toEqual([])
  })

  it('con el dispositivo en otra zona, "hoy" sigue siendo el de Costa Rica', () => {
    vi.stubEnv('TZ', 'Asia/Tokyo')
    // Sábado 11:30 p.m. en Costa Rica; en Tokio ya es domingo.
    const lateSaturday = new Date('2026-11-08T05:30:00Z')
    expect(lateSaturday.getDay()).toBe(0)
    expect(businessToday(lateSaturday, TZ)).toBe('2026-11-07')
    expect(availableSlots(dateOf('2026-11-07'), rules(lateSaturday))).toEqual([])
    expect(availableSlots(dateOf('2026-11-08'), rules(lateSaturday))).toHaveLength(23)
  })

  it('cambiar de fecha limpia la hora si ya no está disponible', () => {
    const saturday = availableSlots(dateOf('2026-11-14'), rules(nextWeek))
    const monday = availableSlots(dateOf('2026-11-09'), rules(nextWeek))
    expect(reconcileTime(slot('09:00'), saturday)).toEqual({ kind: 'sin-cambio' })
    expect(reconcileTime(slot('09:00'), monday)).toEqual({ kind: 'limpiada', previous: '09:00' })
    expect(reconcileTime(slot('20:00'), monday)).toEqual({ kind: 'limpiada', previous: '20:00' })
    expect(reconcileTime(slot('12:30'), monday)).toEqual({ kind: 'sin-cambio' })
    expect(reconcileTime('', monday)).toEqual({ kind: 'sin-cambio' })
  })
})

describe('mensaje de reserva', () => {
  it('formatea fecha y hora en español de Costa Rica', () => {
    expect(formatReservationDate(dateOf('2026-11-14'), TZ)).toBe('sábado 14 de noviembre')
    expect(formatReservationTime(slot('14:30'), TZ)).toBe('2:30 p.m.')
    expect(formatReservationTime(slot('09:00'), TZ)).toBe('9:00 a.m.')
    expect(formatReservationTime(slot('12:00'), TZ)).toBe('12:00 p.m.')
  })

  it('arma el mensaje con tildes, saltos de línea y los datos limpios', () => {
    const values = reservationMessageValues(
      { nombre: '  María José\tÑúñez\n ', fecha: '2026-11-14', hora: '14:30', personas: '4' },
      context,
    )
    expect(composeMessage(whatsappTemplates.reserva, values)).toBe(
      [
        'Hola, Honey Dipper. Quiero reservar una mesa.',
        'Nombre: María José Ñúñez',
        'Fecha: sábado 14 de noviembre',
        'Hora: 2:30 p.m.',
        'Personas: 4',
        '¿Tienen espacio?',
      ].join('\n'),
    )
  })

  it('deja los campos vacíos para completar en el chat', () => {
    const values = reservationMessageValues({ nombre: '', fecha: '', hora: '', personas: '' }, context)
    expect(composeMessage(whatsappTemplates.reserva, values)).toBe(
      'Hola, Honey Dipper. Quiero reservar una mesa.\nNombre:\nFecha:\nHora:\nPersonas:\n¿Tienen espacio?',
    )
  })

  it('no manda fechas fuera de rango ni personas inventadas', () => {
    const values = reservationMessageValues({ nombre: 'Ana', fecha: '2030-01-01', hora: 'nope', personas: '99' }, context)
    expect(values).toEqual({ nombre: 'Ana', fecha: '', hora: '', personas: '' })
    expect(reservationMessageValues({ nombre: '', fecha: '', hora: '', personas: 'mas' }, context).personas).toBe(
      'Más de 10, lo conversamos por aquí',
    )
  })

  it('recorta el nombre a 60 caracteres sin partir letras con tilde ni emojis', () => {
    const long = `${'á'.repeat(59)}😀😀😀`
    const name = reservationMessageValues({ nombre: long, fecha: '', hora: '', personas: '' }, context).nombre ?? ''
    expect(Array.from(name)).toHaveLength(60)
    expect(name.endsWith('😀')).toBe(true)
    expect(sanitizeText('a\u0000b​c', 60)).toBe('a b c')
  })

  it('el enlace wa.me lleva el texto codificado y se puede leer de vuelta', () => {
    const values = reservationMessageValues(
      { nombre: 'Sofía & Leo #2', fecha: '2026-11-14', hora: '20:00', personas: '2' },
      context,
    )
    const link = buildWhatsAppLink({ flow: 'reserva', values })
    const url = new URL(link)
    expect(url.origin + url.pathname).toBe('https://wa.me/50683968602')
    expect(link).toContain('%0A')
    expect(link).not.toContain(' ')
    expect(url.searchParams.get('text')).toBe(composeMessage(whatsappTemplates.reserva, values))
  })
})
