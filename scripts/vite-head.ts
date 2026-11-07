import type { HtmlTagDescriptor, Plugin } from 'vite'
import { business } from '../src/data/business'
import { site } from '../src/data/site'
import { buildLocalBusinessJsonLd, serializeJsonLd } from '../src/lib/structured-data'

/**
 * Archivos que el navegador debe pedir apenas lee el HTML. La foto del logo del hero es el LCP:
 * sin esto se descubre recién cuando corre el JS. Las fuentes de texto principal van después.
 */
const PRELOADS: ReadonlyArray<{ pattern: RegExp; as: 'image' | 'font'; type: string }> = [
  { pattern: /^assets\/logo-honey-dipper-hero-[\w-]+\.webp$/, as: 'image', type: 'image/webp' },
]

const robotsTag = (): HtmlTagDescriptor[] => {
  if (site.indexable) return []
  return [{ tag: 'meta', attrs: { name: 'robots', content: 'noindex, nofollow' }, injectTo: 'head-prepend' }]
}

const jsonLdTag = (): HtmlTagDescriptor => {
  return {
    tag: 'script',
    attrs: { type: 'application/ld+json' },
    children: serializeJsonLd(buildLocalBusinessJsonLd(business)),
    injectTo: 'head',
  }
}

const preloadTags = (fileNames: readonly string[]): HtmlTagDescriptor[] => {
  return PRELOADS.flatMap(({ pattern, as, type }) => {
    const fileName = fileNames.find((name) => pattern.test(name))
    if (fileName === undefined) return []
    const imageHints = as === 'image' ? { fetchpriority: 'high' } : { crossorigin: '' }
    return [{ tag: 'link', attrs: { rel: 'preload', href: `./${fileName}`, as, type, ...imageHints }, injectTo: 'head' as const }]
  })
}

/** Agrega al <head> el robots (según site.indexable), los datos estructurados y las precargas. */
export const honeyHead = (): Plugin => {
  return {
    name: 'honey-dipper-head',
    transformIndexHtml: {
      order: 'post',
      handler: (_html, context) => {
        const fileNames = context.bundle ? Object.keys(context.bundle) : []
        return [...robotsTag(), jsonLdTag(), ...preloadTags(fileNames)]
      },
    },
  }
}
