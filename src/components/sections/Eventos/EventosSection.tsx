import type { FC } from 'react'
import { whatsappTemplates } from '../../../data/whatsapp'
import { honeyDrop } from '../../../lib/honey-drop'
import { buildWhatsAppLink } from '../../../lib/whatsapp'
import { ButtonLink } from '../../ui/Button'
import { PhotoPlaceholder } from '../../ui/PhotoPlaceholder'

const TITLE_ID = 'eventos-titulo'

const OCCASIONS = ['Cumpleaños', 'Baby showers', 'Reuniones'] as const

/**
 * Eventos en el local. Por decisión del dueño no se muestra capacidad, qué incluye ni cifras:
 * la sección solo invita a consultar.
 */
export const EventosSection: FC = () => {
  return (
    <section id="eventos" aria-labelledby={TITLE_ID} className="bg-surface text-foreground">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="flex flex-col gap-6 lg:order-2 lg:col-span-6 lg:col-start-7">
          <h2 id={TITLE_ID} {...honeyDrop} className="text-5xl md:text-6xl">
            Celebrar bonito
          </h2>
          <ul className="flex flex-wrap gap-x-6 gap-y-1 font-display text-2xl italic text-foreground-accent">
            {OCCASIONS.map((occasion) => {
              return <li key={occasion}>{occasion}</li>
            })}
          </ul>
          <p className="max-w-prose text-lg">
            Si estás pensando en celebrar algo con tu gente aquí en el local, escríbenos. Nos cuentas la fecha y la
            idea, y lo conversamos.
          </p>
          <ButtonLink href={buildWhatsAppLink({ flow: 'evento' })} external className="self-start">
            {whatsappTemplates.evento.ctaLabel}
          </ButtonLink>
        </div>
        <PhotoPlaceholder
          description="un evento en el local"
          bordered
          className="aspect-3/4 w-full max-w-sm justify-self-center lg:order-1 lg:col-span-5 lg:justify-self-start"
        />
      </div>
    </section>
  )
}
