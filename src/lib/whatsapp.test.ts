import { describe, expect, it } from 'vitest'
import { toWhatsAppNumber } from '../data/business'
import { buildWaLink, buildWhatsAppLink } from './whatsapp'

const decodeText = (link: string): string => {
  const text = new URL(link).searchParams.get('text')
  if (text === null) throw new Error('El enlace no trae el parámetro text')
  return text
}

describe('buildWhatsAppLink', () => {
  it('arma la reserva hacia el número del restaurante', () => {
    const link = buildWhatsAppLink({
      flow: 'reserva',
      values: { nombre: 'Daryl', fecha: 'sábado 14', hora: '10:30', personas: '4' },
    })
    expect(link.startsWith('https://wa.me/50683968602?text=')).toBe(true)
    expect(decodeText(link)).toBe(
      'Hola, Honey Dipper. Quiero reservar una mesa.\nNombre: Daryl\nFecha: sábado 14\nHora: 10:30\nPersonas: 4\n¿Tienen espacio?',
    )
  })

  it('codifica tildes, ñ, signos y saltos de línea', () => {
    const link = buildWhatsAppLink({ flow: 'pastel', values: { ocasion: 'Cumpleaños de mamá & papá #1' } })
    expect(link).toContain('%0A')
    expect(link).not.toMatch(/[\s¿áéíóúñ&#]/)
    expect(decodeText(link)).toContain('Ocasión: Cumpleaños de mamá & papá #1')
  })

  it('manda la cotización de pastel al número de la pastelería', () => {
    expect(buildWhatsAppLink({ flow: 'pastel' }).startsWith('https://wa.me/50663490223?text=')).toBe(true)
  })

  it('tolera campos vacíos o en blanco', () => {
    const text = decodeText(buildWhatsAppLink({ flow: 'evento', values: { tipo: '   ' } }))
    expect(text).toBe(
      'Hola, Honey Dipper. Quiero consultar por un evento en el local.\nTipo de evento:\nFecha:\nCantidad de personas:\n¿Qué opciones tienen?',
    )
  })
})

describe('toWhatsAppNumber', () => {
  it('rechaza números sin el 506 o con largo incorrecto', () => {
    expect(() => toWhatsAppNumber('83968602')).toThrow()
    expect(() => toWhatsAppNumber('5068396860')).toThrow()
  })

  it('arma el enlace base con el número', () => {
    expect(buildWaLink(toWhatsAppNumber('50683968602'), 'Hola')).toBe('https://wa.me/50683968602?text=Hola')
  })
})
