import { afterEach, describe, expect, it, vi } from 'vitest'
import { business } from '../data/business'
import {
  describeOpenNow,
  describeTodayHours,
  formatClockTime,
  formatDays,
  getTodayStatus,
  readBusinessClock,
} from './schedule'

/** Costa Rica es UTC−6 todo el año (sin horario de verano). Las fechas se fijan en UTC. */
const statusAt = (isoUtc: string) => {
  return getTodayStatus({
    now: new Date(isoUtc),
    timeZone: business.timeZone,
    schedule: business.openingHours,
  })
}

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

describe('estado de hoy (America/Costa_Rica)', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('lunes 8:00 p.m.: cerrado (el lunes cierra a las 8:00 p.m.)', () => {
    const status = statusAt('2026-11-10T02:00:00Z')
    expect(status.kind).toBe('cerrado-por-hoy')
    expect(describeTodayHours(status)).toBe('Hoy abrimos de 11:00 a.m. a 8:00 p.m.')
    expect(describeOpenNow(status)).toBe('Cerrado ahora')
  })

  it('sábado 9:00 a.m.: abierto (el fin de semana abre a las 9:00 a.m.)', () => {
    const status = statusAt('2026-11-07T15:00:00Z')
    expect(status.kind).toBe('abierto')
    expect(describeTodayHours(status)).toBe('Hoy abrimos de 9:00 a.m. a 9:00 p.m.')
  })

  it('sábado 8:59 a.m.: todavía no abre', () => {
    const status = statusAt('2026-11-07T14:59:00Z')
    expect(status.kind).toBe('antes-de-abrir')
    expect(describeOpenNow(status)).toBe('Cerrado ahora, abrimos a las 9:00 a.m.')
  })

  it('jueves 8:59 p.m.: abierto; a las 9:00 p.m. ya cerró', () => {
    const open = statusAt('2026-11-13T02:59:00Z')
    expect(open.kind).toBe('abierto')
    expect(describeTodayHours(open)).toBe('Hoy abrimos de 11:00 a.m. a 9:00 p.m.')
    expect(describeOpenNow(open)).toBe('Abierto ahora')
    expect(statusAt('2026-11-13T03:00:00Z').kind).toBe('cerrado-por-hoy')
  })

  it('usa la hora de Costa Rica aunque el dispositivo esté en otra zona', () => {
    vi.stubEnv('TZ', 'Asia/Tokyo')
    const instant = new Date('2026-11-13T02:59:00Z')
    // En Tokio ese instante ya es viernes 11:59 a.m.
    expect(instant.getDay()).toBe(5)
    expect(instant.getHours()).toBe(11)

    expect(readBusinessClock(instant, business.timeZone)).toEqual({ day: 'jueves', minutes: 20 * 60 + 59 })
    expect(statusAt('2026-11-13T02:59:00Z').kind).toBe('abierto')
  })

  it('un dispositivo en UTC no adelanta el día: lunes 11:30 p.m. en CR sigue siendo lunes', () => {
    vi.stubEnv('TZ', 'UTC')
    const status = statusAt('2026-11-10T05:30:00Z')
    expect(new Date('2026-11-10T05:30:00Z').getDay()).toBe(2)
    expect(status.kind).toBe('cerrado-por-hoy')
    expect(describeTodayHours(status)).toBe('Hoy abrimos de 11:00 a.m. a 8:00 p.m.')
  })
})
