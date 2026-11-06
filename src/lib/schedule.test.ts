import { describe, expect, it } from 'vitest'
import { formatClockTime, formatDays } from './schedule'

describe('schedule', () => {
  it('formatea horas en 12 h', () => {
    expect(formatClockTime('09:00')).toBe('9:00 a.m.')
    expect(formatClockTime('20:00')).toBe('8:00 p.m.')
    expect(formatClockTime('12:30')).toBe('12:30 p.m.')
  })

  it('agrupa días como en el post de horario', () => {
    expect(formatDays(['lunes', 'martes', 'miercoles'])).toBe('Lunes a miércoles')
    expect(formatDays(['jueves', 'viernes'])).toBe('Jueves y viernes')
    expect(formatDays(['sabado', 'domingo'])).toBe('Sábado y domingo')
  })
})
