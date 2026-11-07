import { afterEach, describe, expect, it, vi } from 'vitest'
import { business } from '../data/business'
import { whatsappTemplates } from '../data/whatsapp'
import {
  cakeMessageValues,
  checkCount,
  countCharacters,
  eventMessageValues,
  IDEA_MAX_LENGTH,
  limitCharacters,
} from './requests'
import type { CakeDraft, EventDraft } from './requests'
import { businessToday, checkDateFrom } from './reservation'
import { buildWhatsAppLink, composeFlowMessage } from './whatsapp'

const TZ = business.timeZone
/** Sábado 7 de noviembre, 2:10 p.m. en Costa Rica (UTC−6). */
const SATURDAY_AFTERNOON = new Date('2026-11-07T20:10:00Z')
const context = { timeZone: TZ, minDate: businessToday(SATURDAY_AFTERNOON, TZ) }

const EMPTY_CAKE: CakeDraft = { ocasion: '', fecha: '', porciones: '', idea: '' }
const EMPTY_EVENT: EventDraft = { tipo: '', fecha: '', personas: '' }

const decodeLink = (href: string): string => {
  const text = new URL(href).searchParams.get('text')
  if (text === null) throw new Error('El enlace no trae texto')
  return text
}

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('fecha sin máximo (pastel y evento)', () => {
  it('desde hoy en Costa Rica, sin tope ni días de anticipación', () => {
    expect(checkDateFrom('2026-11-07', context.minDate)).toEqual({ kind: 'valida', date: '2026-11-07' })
    expect(checkDateFrom('2028-03-01', context.minDate).kind).toBe('valida')
    expect(checkDateFrom('2026-11-06', context.minDate).kind).toBe('pasada')
    expect(checkDateFrom('2026-02-30', context.minDate).kind).toBe('invalida')
    expect(checkDateFrom('', context.minDate).kind).toBe('vacia')
  })

  it('con el dispositivo en otra zona, hoy sigue siendo el de Costa Rica', () => {
    vi.stubEnv('TZ', 'Asia/Tokyo')
    // 11:30 p.m. del sábado en Costa Rica ya es domingo en Tokio.
    expect(businessToday(new Date('2026-11-08T05:30:00Z'), TZ)).toBe('2026-11-07')
  })
})

describe('números de porciones y personas', () => {
  it('acepta enteros positivos sin tope', () => {
    expect(checkCount(' 20 ')).toEqual({ kind: 'valida', count: 20 })
    expect(checkCount('350')).toEqual({ kind: 'valida', count: 350 })
    expect(checkCount('007')).toEqual({ kind: 'valida', count: 7 })
  })

  it('rechaza lo que no es un entero positivo', () => {
    for (const value of ['0', '-3', '2.5', '1e3', 'veinte', '12 personas', '99999999999999999999']) {
      expect(checkCount(value).kind).toBe('invalida')
    }
    expect(checkCount('').kind).toBe('vacia')
  })
})

describe('mensaje de pastel', () => {
  it('lleva tildes, saltos de línea y cierra con la foto de referencia', () => {
    const values = cakeMessageValues(
      { ocasion: 'Cumpleaños', fecha: '2026-11-21', porciones: '20', idea: 'Tres leches con decoración de girasoles' },
      context,
    )
    const message = composeFlowMessage({ flow: 'pastel', values })
    expect(message).toBe(
      [
        'Hola, Honey Dipper. Quiero cotizar un pastel.',
        'Ocasión: Cumpleaños',
        'Fecha de entrega: sábado 21 de noviembre',
        'Porciones: 20',
        'Idea de sabor o diseño: Tres leches con decoración de girasoles',
        'Si les sirve, les mando una foto de referencia.',
      ].join('\n'),
    )
  })

  it('deja los campos vacíos para completar en el chat', () => {
    const message = composeFlowMessage({ flow: 'pastel', values: cakeMessageValues(EMPTY_CAKE, context) })
    expect(message.split('\n')).toEqual([
      'Hola, Honey Dipper. Quiero cotizar un pastel.',
      'Ocasión:',
      'Fecha de entrega:',
      'Porciones:',
      'Idea de sabor o diseño:',
      'Si les sirve, les mando una foto de referencia.',
    ])
  })

  it('no manda fechas pasadas, porciones inválidas ni ocasiones fuera de la lista', () => {
    const values = cakeMessageValues({ ocasion: 'Boda', fecha: '2026-11-01', porciones: 'muchas', idea: '' }, context)
    expect(values).toEqual({ ocasion: '', fecha: '', porciones: '', idea: '' })
  })

  it('la idea llega a 300 caracteres sin partir tildes ni emojis', () => {
    const long = 'ñ🎂'.repeat(200)
    const limited = limitCharacters(long, IDEA_MAX_LENGTH)
    expect(countCharacters(limited)).toBe(IDEA_MAX_LENGTH)
    const idea = cakeMessageValues({ ...EMPTY_CAKE, idea: long }, context).idea ?? ''
    expect(countCharacters(idea)).toBe(IDEA_MAX_LENGTH)
    expect(idea.endsWith('🎂')).toBe(true)
    expect(idea).not.toContain('\uFFFD')
  })

  it('quita caracteres de control y saltos de línea de la idea', () => {
    const raw = '  Chocolate\n\ncon\tfresas\u0000\u200B y   crema '
    const values = cakeMessageValues({ ...EMPTY_CAKE, idea: raw }, context)
    expect(values.idea).toBe('Chocolate con fresas y crema')
    const message = composeFlowMessage({ flow: 'pastel', values })
    expect(message.split('\n')).toHaveLength(whatsappTemplates.pastel.fields.length + 2)
  })

  it('va al número de la pastelería, bien codificado', () => {
    const values = cakeMessageValues({ ...EMPTY_CAKE, ocasion: 'Baby shower', idea: 'Diseño en tonos menta & dorado' }, context)
    const href = buildWhatsAppLink({ flow: 'pastel', values })
    expect(href.startsWith(`https://wa.me/${business.contact.pasteleria.whatsapp}?text=`)).toBe(true)
    expect(href).toContain('%0A')
    expect(href).toContain('%26')
    expect(decodeLink(href)).toBe(composeFlowMessage({ flow: 'pastel', values }))
  })
})

describe('mensaje de evento', () => {
  it('lleva tildes, fecha en español y personas sin tope', () => {
    const values = eventMessageValues({ tipo: 'Reunión', fecha: '2027-03-14', personas: '120' }, context)
    expect(composeFlowMessage({ flow: 'evento', values })).toBe(
      [
        'Hola, Honey Dipper. Quiero consultar por un evento en el local.',
        'Tipo de evento: Reunión',
        'Fecha: domingo 14 de marzo',
        'Cantidad de personas: 120',
        '¿Qué opciones tienen?',
      ].join('\n'),
    )
  })

  it('deja los campos vacíos y descarta lo que no es válido', () => {
    expect(eventMessageValues(EMPTY_EVENT, context)).toEqual({ tipo: '', fecha: '', personas: '' })
    expect(eventMessageValues({ tipo: 'Reunión\u0007', fecha: 'ayer', personas: '1,5' }, context)).toEqual({
      tipo: 'Reunión',
      fecha: '',
      personas: '',
    })
  })

  it('va al número de eventos definido en business.ts', () => {
    const href = buildWhatsAppLink({ flow: 'evento', values: {} })
    expect(href.startsWith(`https://wa.me/${business.contact[business.eventosLinea].whatsapp}?text=`)).toBe(true)
  })
})
