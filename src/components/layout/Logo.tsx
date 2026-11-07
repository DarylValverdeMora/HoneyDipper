import type { FC } from 'react'
import logoWordmark from '../../assets/img/logo-honey-dipper-wordmark.jpg'
import logoWordmarkMask from '../../assets/img/logo-honey-dipper-wordmark-mask.webp'
import { business } from '../../data/business'
import { toAnchor } from '../../data/navigation'
import { cn } from '../../lib/cn'
import { LogoArt } from '../ui/LogoArt'

const WORDMARK_WIDTH = 680
const WORDMARK_HEIGHT = 500

type LogoProps = {
  className?: string
}

/**
 * Recorte del logo con fondo menta (#BFD7CA, igual a surface-brand en la variante A).
 * En la variante B se pinta con su máscara (ver LogoArt).
 * [PLACEHOLDER] Pedir el logo en SVG o PNG transparente para reemplazar la máscara derivada del JPG.
 */
export const Logo: FC<LogoProps> = ({ className }) => {
  return (
    <a href={toAnchor('inicio')} className={cn('inline-flex shrink-0 rounded-sm', className)}>
      <LogoArt
        src={logoWordmark}
        maskSrc={logoWordmarkMask}
        alt={`${business.name}, ir al inicio`}
        width={WORDMARK_WIDTH}
        height={WORDMARK_HEIGHT}
        className="h-full w-auto"
      />
    </a>
  )
}
