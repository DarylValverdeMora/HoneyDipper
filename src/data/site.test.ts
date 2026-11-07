import { describe, expect, it } from 'vitest'
import vercelConfigText from '../../vercel.json?raw'
import { site } from './site'

const NOINDEX_HEADER = '"X-Robots-Tag"'
const siteUrl: string = site.url

describe('indexación del sitio', () => {
  it('vercel.json manda X-Robots-Tag solo mientras site.indexable es false', () => {
    // Al publicar la versión final hay que cambiar las dos cosas; esta prueba avisa si se cambia solo una.
    expect(vercelConfigText.includes(NOINDEX_HEADER)).toBe(!site.indexable)
  })

  it('site.url no termina en barra, para armar las URL absolutas sin dobles barras', () => {
    expect(siteUrl.endsWith('/')).toBe(false)
  })

  it('site.url vacío o con https', () => {
    expect(siteUrl === '' || siteUrl.startsWith('https://')).toBe(true)
  })
})
