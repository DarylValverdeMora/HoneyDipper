import type { FC, ReactNode } from 'react'
import type { SectionId } from '../../data/navigation'
import { photos } from '../../data/photos'
import { whatsappTemplates } from '../../data/whatsapp'
import { cn } from '../../lib/cn'
import { buildWhatsAppLink } from '../../lib/whatsapp'
import { ArchPhoto } from '../ui/ArchFrame'
import { ButtonLink } from '../ui/Button'
import { Panal } from '../ui/Panal'
import { PhotoPlaceholder } from '../ui/PhotoPlaceholder'

/*
 * Etapa 3A: secciones temporales, solo para probar el marco (anclajes, header, botón flotante).
 * Se reemplazan por las secciones reales a partir de la etapa 3B.
 */

type PreviewSectionProps = {
  id: SectionId
  title: string
  className: string
  children?: ReactNode
}

const PreviewSection: FC<PreviewSectionProps> = ({ id, title, className, children }) => {
  const titleId = `${id}-titulo`

  return (
    <section id={id} aria-labelledby={titleId} className={cn('relative isolate overflow-hidden', className)}>
      <div className="mx-auto flex min-h-dvh max-w-6xl flex-col gap-8 px-4 py-16 md:px-6">
        <h2 id={titleId} className="text-4xl md:text-5xl">
          {title}
        </h2>
        <p className="max-w-prose text-sm text-foreground-accent">
          [PLACEHOLDER] Sección temporal de la etapa 3A para probar anclajes y el marco de la página.
        </p>
        {children}
      </div>
    </section>
  )
}

export const PreviewSections: FC = () => {
  return (
    <>
      <PreviewSection id="inicio" title="Inicio" className="bg-surface-brand text-on-brand">
        <Panal />
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={buildWhatsAppLink({ flow: 'reserva' })} external>
            {whatsappTemplates.reserva.ctaLabel}
          </ButtonLink>
          <ButtonLink href={buildWhatsAppLink({ flow: 'pastel' })} external intent="secundario">
            {whatsappTemplates.pastel.ctaLabel}
          </ButtonLink>
        </div>
      </PreviewSection>
      <PreviewSection id="menu" title="Menú" className="bg-surface">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <ArchPhoto photo={photos.hamburguesaPollo} className="aspect-3/4" />
          <ArchPhoto photo={photos.pancakesHelado} bordered className="aspect-3/4" />
          <PhotoPlaceholder description="un casado" className="aspect-3/4" />
          <PhotoPlaceholder description="una bebida fría" bordered className="aspect-3/4" />
        </div>
      </PreviewSection>
      <PreviewSection id="pasteleria" title="Pastelería" className="bg-surface-soft">
        <ArchPhoto photo={photos.pastelChorreado} bordered className="aspect-3/4 w-full max-w-xs" />
      </PreviewSection>
      <PreviewSection id="eventos" title="Eventos" className="bg-surface" />
      <PreviewSection id="como-llegar" title="Cómo llegar" className="bg-surface-brand text-on-brand" />
    </>
  )
}
