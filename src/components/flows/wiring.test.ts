import { describe, expect, it } from 'vitest'
import { whatsappTemplates } from '../../data/whatsapp'

/** Código fuente de la app (sin pruebas), leído como texto. Las rutas quedan relativas a src/. */
const rawSources = import.meta.glob<string>(['/src/**/*.{ts,tsx}', '!/src/**/*.test.{ts,tsx}'], {
  query: '?raw',
  import: 'default',
  eager: true,
})

/** Quita comentarios para no contar textos que solo explican. */
const withoutComments = (code: string): string => {
  return code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
}

const files = Object.entries(rawSources).map(([path, code]) => ({
  path: path.replace(/^\/src\//, ''),
  code: withoutComments(code),
}))

describe('botones de WhatsApp de la página', () => {
  it('lee el código de la app', () => {
    expect(files.length).toBeGreaterThan(30)
  })

  it('ningún componente arma un enlace directo de reserva, pastel o evento', () => {
    const offenders = files.filter(({ path, code }) => {
      return path.startsWith('components') && /buildWhatsAppLink\(\{\s*flow:\s*'(reserva|pastel|evento)'/.test(code)
    })
    expect(offenders.map(({ path }) => path)).toEqual([])
  })

  it('solo la búsqueda sin resultados usa un enlace directo (flujo consulta)', () => {
    const direct = files.filter(({ path, code }) => path.startsWith('components') && code.includes('buildWhatsAppLink('))
    expect(direct.map(({ path }) => path)).toEqual(['components/sections/Menu/MenuSearch.tsx'])
  })

  it('el texto de cada botón sale solo de la plantilla (no hay copias escritas a mano)', () => {
    for (const flow of ['reserva', 'pastel', 'evento'] as const) {
      const label = whatsappTemplates[flow].ctaLabel
      const copies = files.filter(({ path, code }) => path !== 'data/whatsapp.ts' && code.includes(label))
      expect(copies.map(({ path }) => path), label).toEqual([])
    }
  })
})
