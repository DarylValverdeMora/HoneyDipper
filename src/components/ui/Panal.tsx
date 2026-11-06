import { useId } from 'react'
import type { FC } from 'react'
import { cn } from '../../lib/cn'

type PanalProps = {
  className?: string
}

/**
 * Textura de panal en línea fina y opacidad baja. Va detrás del contenido
 * (el contenedor necesita `relative` y `isolate`). El color sale de `text-*`.
 */
export const Panal: FC<PanalProps> = ({ className }) => {
  const patternId = useId()

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={cn('pointer-events-none absolute inset-0 -z-10 size-full text-honey opacity-20', className)}
    >
      <defs>
        <pattern id={patternId} width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(0.7)">
          <path
            d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100M28 0L28 34L0 50L0 84L28 100L56 84L56 50L28 34"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  )
}
