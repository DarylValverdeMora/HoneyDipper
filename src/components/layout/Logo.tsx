import type { FC } from 'react'
// Versión de 280 px (2x del tamaño más grande en pantalla); el JPG original queda como fuente.
import logoWordmark from '../../assets/img/logo-honey-dipper-wordmark-280.webp'
import logoWordmarkMask from '../../assets/img/logo-honey-dipper-wordmark-mask.webp'
import { business } from '../../data/business'
import { toAnchor } from '../../data/navigation'
import { cn } from '../../lib/cn'
import { LogoArt } from '../ui/LogoArt'
import type { LogoTone } from '../ui/LogoArt'

const WORDMARK_WIDTH = 680
const WORDMARK_HEIGHT = 500

type LogoProps = {
  /** Alto del logo (h-*); el ancho sale de la proporción. */
  heightClassName: string
  tone?: LogoTone
  isHidden?: boolean
  className?: string
}

/**
 * Recorte del logo con fondo menta (#BFD7CA, igual a surface-brand en la variante A).
 * En el header va con tone="fuerte" (máscara en tono oscuro) para que no se vea lavado.
 * El alto va fijo y el ancho sale de aspect-ratio: con h-full + w-auto, WebKit resolvía el ancho
 * con el tamaño natural de la imagen y empujaba el botón fuera de la pantalla.
 * min-w-0: si el espacio no alcanza (texto del sistema grande en 320 px), el logo cede antes que el botón.
 * Oculto (isHidden) no se ve, no se enfoca y no lo lee el lector de pantalla.
 * [PLACEHOLDER] Pedir el logo en SVG o PNG transparente para reemplazar la máscara derivada del JPG.
 */
export const Logo: FC<LogoProps> = ({ heightClassName, tone = 'original', isHidden = false, className }) => {
  return (
    <a
      href={toAnchor('inicio')}
      aria-hidden={isHidden}
      tabIndex={isHidden ? -1 : undefined}
      className={cn(
        'inline-flex min-w-0 rounded-sm transition-[opacity,visibility] duration-200 ease-out motion-reduce:transition-none',
        isHidden && 'invisible opacity-0',
        className,
      )}
    >
      <LogoArt
        src={logoWordmark}
        maskSrc={logoWordmarkMask}
        alt={`${business.name}, ir al inicio`}
        width={WORDMARK_WIDTH}
        height={WORDMARK_HEIGHT}
        tone={tone}
        className={cn('aspect-68/50 max-w-full', heightClassName)}
      />
    </a>
  )
}
