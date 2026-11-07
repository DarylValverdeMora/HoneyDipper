import { describe, expect, it } from 'vitest'
import { photos, photosForSection, type Photo } from './photos'

const allPhotos: Photo[] = Object.values(photos)

describe('fotos del negocio', () => {
  it('todas están en WebP, con ancho y alto definidos y texto alternativo', () => {
    for (const photo of allPhotos) {
      expect(photo.src).toMatch(/\.webp$/)
      expect(photo.width).toBeGreaterThan(0)
      expect(photo.height).toBeGreaterThan(0)
      expect(photo.alt.trim()).not.toBe('')
    }
  })

  it('las dos fotos del evento llevan el crédito del fotógrafo y no nombran a nadie', () => {
    const eventPhotos = photosForSection('eventos')
    expect(eventPhotos).toHaveLength(2)
    for (const photo of eventPhotos) {
      expect(photo.credito).toBe('@fotogenicacr')
      expect(photo.alt).not.toMatch(/@|mari|martmora|felipe|martina/i)
    }
  })

  it('solo las fotos del evento traen crédito', () => {
    const credited = allPhotos.filter((photo) => photo.credito !== undefined)
    expect(credited.map((photo) => photo.source).sort()).toEqual(['IMG_2352(1).PNG', 'IMG_2353.PNG'])
  })

  it('no usa las fotos descartadas (Master Class, post de horario ni copias de WhatsApp)', () => {
    for (const photo of allPhotos) {
      expect(photo.source).not.toMatch(/162204|WhatsApp|162832/)
    }
  })

  it('la pastelería usa las cuatro fotos del plan y Ensaladas tiene su miniatura', () => {
    expect(photosForSection('pasteleria').map((photo) => photo.source)).toEqual([
      'Screenshot 2026-11-06 162253.png',
      'Screenshot 2026-11-06 162222.png',
      'Screenshot 2026-11-06 162653.png',
      'Screenshot 2026-11-06 162820.png',
    ])
    expect(photosForSection('menu-ensaladas')).toHaveLength(1)
  })
})
