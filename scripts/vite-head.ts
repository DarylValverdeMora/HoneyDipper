import type { HtmlTagDescriptor, Plugin } from 'vite'
import { business } from '../src/data/business'
import { site } from '../src/data/site'
import { buildLocalBusinessJsonLd, serializeJsonLd } from '../src/lib/structured-data'

/**
 * Archivos que el navegador debe pedir apenas lee el HTML. La foto del logo del hero es el LCP:
 * sin esto se descubre recién cuando corre el JS.
 */
const PRELOADS: ReadonlyArray<{ pattern: RegExp; type: string }> = [
  { pattern: /^assets\/logo-honey-dipper-hero-[\w-]+\.webp$/, type: 'image/webp' },
]

const robotsTag = (): HtmlTagDescriptor[] => {
  if (site.indexable) return []
  return [{ tag: 'meta', attrs: { name: 'robots', content: 'noindex, nofollow' }, injectTo: 'head-prepend' }]
}

const OG_IMAGE_FILE = 'og-image.jpg'

/** Con site.url las etiquetas llevan URL absoluta; sin ella, la ruta relativa del prototipo. */
const sharingTags = (): HtmlTagDescriptor[] => {
  const hasUrl = site.url !== ''
  const imageUrl = hasUrl ? `${site.url}/${OG_IMAGE_FILE}` : `./${OG_IMAGE_FILE}`
  const tags: HtmlTagDescriptor[] = [
    { tag: 'meta', attrs: { property: 'og:image', content: imageUrl }, injectTo: 'head' },
    { tag: 'meta', attrs: { name: 'twitter:image', content: imageUrl }, injectTo: 'head' },
  ]
  if (!hasUrl) return tags
  return [
    ...tags,
    { tag: 'meta', attrs: { property: 'og:url', content: `${site.url}/` }, injectTo: 'head' },
    { tag: 'link', attrs: { rel: 'canonical', href: `${site.url}/` }, injectTo: 'head' },
  ]
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
  return PRELOADS.flatMap(({ pattern, type }) => {
    const fileName = fileNames.find((name) => pattern.test(name))
    if (fileName === undefined) return []
    return [{ tag: 'link', attrs: { rel: 'preload', href: `./${fileName}`, as: 'image', type, fetchpriority: 'high' }, injectTo: 'head' as const }]
  })
}

/** Agrega al <head> el robots (según site.indexable), las etiquetas para compartir, los datos estructurados y las precargas. */
export const honeyHead = (): Plugin => {
  return {
    name: 'honey-dipper-head',
    transformIndexHtml: {
      order: 'post',
      handler: (_html, context) => {
        const fileNames = context.bundle ? Object.keys(context.bundle) : []
        return [...robotsTag(), ...sharingTags(), jsonLdTag(), ...preloadTags(fileNames)]
      },
    },
  }
}
