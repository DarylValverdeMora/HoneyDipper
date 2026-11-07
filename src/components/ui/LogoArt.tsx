import { useMemo } from 'react'
import type { CSSProperties, FC } from 'react'
import { cn } from '../../lib/cn'

type LogoArtProps = {
  src: string
  /** Máscara con fondo transparente sacada del mismo logo (scripts/logo-masks.py). */
  maskSrc: string
  alt: string
  width: number
  height: number
  priority?: boolean
  className?: string
}

/**
 * En la variante A se ve el JPG original (dorado sobre menta, con su degradado).
 * En la variante B el JPG queda invisible y encima se pinta la máscara con el token --logo-ink,
 * porque el fondo menta del JPG no se puede quitar con CSS.
 */
export const LogoArt: FC<LogoArtProps> = ({ src, maskSrc, alt, width, height, priority = false, className }) => {
  const maskStyle = useMemo<CSSProperties>(() => ({ '--logo-mask': `url("${maskSrc}")` }), [maskSrc])

  return (
    <span className={cn('relative block', className)}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        fetchPriority={priority ? 'high' : 'auto'}
        className="block h-full w-full variant-b:invisible"
      />
      <span
        role="img"
        aria-label={alt}
        style={maskStyle}
        className="logo-mask absolute inset-0 hidden bg-logo-ink variant-b:block"
      />
    </span>
  )
}
