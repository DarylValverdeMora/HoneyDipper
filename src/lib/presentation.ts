export const VARIANTS = ['a', 'b'] as const
export type Variant = (typeof VARIANTS)[number]

export const VARIANT_LABELS: Record<Variant, string> = {
  a: 'Menta y miel',
  b: 'Caramelo',
}

export const DEFAULT_VARIANT: Variant = 'a'

/** El modo presentación solo existe con ?present=1. Sin él no hay variante que elegir. */
export type Presentation = { kind: 'apagado' } | { kind: 'activo'; variant: Variant }

const PRESENT_PARAM = 'present'
const VARIANT_PARAM = 'v'

const isVariant = (value: string | null): value is Variant => {
  return VARIANTS.some((variant) => variant === value)
}

/** Lee la URL una vez. ?v=b sin ?present=1 se ignora: fuera del modo presentación siempre es A. */
export const parsePresentation = (search: string): Presentation => {
  const params = new URLSearchParams(search)
  if (params.get(PRESENT_PARAM) !== '1') return { kind: 'apagado' }
  const requested = params.get(VARIANT_PARAM)
  return { kind: 'activo', variant: isVariant(requested) ? requested : DEFAULT_VARIANT }
}

/** La misma URL con la variante elegida, para copiarla o mandarla por WhatsApp. */
export const withVariant = (href: string, variant: Variant): string => {
  const url = new URL(href)
  url.searchParams.set(PRESENT_PARAM, '1')
  url.searchParams.set(VARIANT_PARAM, variant)
  return url.toString()
}

/** Valor del atributo data-variant en <html>. La variante A no lleva atributo. */
export const variantAttribute = (presentation: Presentation): Variant | undefined => {
  if (presentation.kind === 'apagado') return undefined
  return presentation.variant === DEFAULT_VARIANT ? undefined : presentation.variant
}
