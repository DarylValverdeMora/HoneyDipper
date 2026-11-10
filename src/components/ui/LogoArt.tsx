import { useMemo } from 'react'
import type { CSSProperties, FC } from 'react'
import { cn } from '../../lib/cn'

export type LogoTone = 'original' | 'fuerte'

type LogoArtProps = {
  src: string
  /** Máscara con fondo transparente sacada del mismo logo (scripts/logo-masks.py). */
  maskSrc: string
  alt: string
  width: number
  height: number
  priority?: boolean
  /** original: el JPG tal cual (variante A). fuerte: siempre la máscara con --logo-ink-strong, para tamaños chicos. */
  tone?: LogoTone
  className?: string
}

/**
 * En la variante A se ve el JPG original (dorado sobre menta, con su degradado).
 * En la variante B el JPG queda invisible y encima se pinta la máscara con el token --logo-ink,
 * porque el fondo menta del JPG no se puede quitar con CSS. Con tone="fuerte" se pinta siempre la máscara.
 */
export const LogoArt: FC<LogoArtProps> = ({
  src,
  maskSrc,
  alt,
  width,
  height,
  priority = false,
  tone = 'original',
  className,
}) => {
  const isStrong = tone === 'fuerte'
  const maskStyle = useMemo<CSSProperties>(() => ({ '--logo-mask': `url("${maskSrc}")` }), [maskSrc])

  return (
    <span className={cn('relative block', className)}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        fetchPriority={priority ? 'high' : 'auto'}
        className={cn('block h-full w-full object-contain object-left', isStrong ? 'invisible' : 'variant-b:invisible')}
      />
      <span
        role="img"
        aria-label={alt}
        style={maskStyle}
        className={cn(
          'logo-mask absolute inset-0',
          isStrong ? 'block bg-logo-ink-strong' : 'hidden bg-logo-ink variant-b:block',
        )}
      />
    </span>
  )
}
