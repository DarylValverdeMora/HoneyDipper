import type { FC } from 'react'
import { ArchFrame } from './ArchFrame'

type PhotoPlaceholderProps = {
  /** Qué foto falta, por ejemplo "la vitrina de postres". */
  description: string
  bordered?: boolean
  className?: string
}

/** Arco menta que marca una foto que todavía no tenemos (ver docs/fotos-pendientes.md). */
export const PhotoPlaceholder: FC<PhotoPlaceholderProps> = ({ description, bordered = false, className }) => {
  return (
    <ArchFrame bordered={bordered} {...(className === undefined ? {} : { className })}>
      <div
        role="img"
        aria-label={`Foto pendiente: ${description}`}
        className="flex size-full items-center justify-center bg-surface-brand px-4 pt-12 pb-6 text-center"
      >
        <p className="font-body text-sm text-on-brand">[PLACEHOLDER] Foto de {description}</p>
      </div>
    </ArchFrame>
  )
}
