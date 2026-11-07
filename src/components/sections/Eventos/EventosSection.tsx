import { FlowButton } from '../../flows/FlowButton'
import type { FC } from 'react'
import { photos } from '../../../data/photos'
import { honeyDrop } from '../../../lib/honey-drop'
import { ArchFigure } from '../../ui/ArchFrame'

const TITLE_ID = 'eventos-titulo'

/** Anchos del arco: 13 rem como máximo, muy por debajo de los 1170 px de cada foto (nítidas en pantallas 2x). */
const EVENT_PHOTO_SIZES = '(min-width: 28rem) 208px, calc(50vw - 1.5rem)'

const EventPhotos: FC = () => {
  return (
    <div className="grid w-full max-w-md grid-cols-2 items-start gap-4 justify-self-center sm:gap-6 lg:order-1 lg:col-span-5 lg:justify-self-start">
      <ArchFigure
        photo={photos.eventoRevelacion}
        bordered
        sizes={EVENT_PHOTO_SIZES}
        frameClassName="aspect-3/4 w-full"
      />
      <ArchFigure
        photo={photos.eventoGlobos}
        bordered
        sizes={EVENT_PHOTO_SIZES}
        figureClassName="mt-10"
        frameClassName="aspect-3/4 w-full"
      />
    </div>
  )
}

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
          <FlowButton flow="evento" className="self-start" />
        </div>
        <EventPhotos />
      </div>
    </section>
  )
}
