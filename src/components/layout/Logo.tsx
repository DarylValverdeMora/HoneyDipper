import type { FC } from 'react'
import logoWordmark from '../../assets/img/logo-honey-dipper-wordmark.jpg'
import { business } from '../../data/business'
import { toAnchor } from '../../data/navigation'
import { cn } from '../../lib/cn'

const WORDMARK_WIDTH = 680
const WORDMARK_HEIGHT = 500

type LogoProps = {
  className?: string
}

/**
 * Recorte del logo con fondo menta (#BFD7CA, igual a surface-brand en la variante A).
 * [PLACEHOLDER] La variante B necesita el logo con fondo transparente.
 */
export const Logo: FC<LogoProps> = ({ className }) => {
  return (
    <a href={toAnchor('inicio')} className={cn('inline-flex shrink-0 rounded-sm', className)}>
      <img
        src={logoWordmark}
        alt={`${business.name}, ir al inicio`}
        width={WORDMARK_WIDTH}
        height={WORDMARK_HEIGHT}
        className="h-full w-auto"
      />
    </a>
  )
}
