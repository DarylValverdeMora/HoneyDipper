import { FlowButton } from '../../flows/FlowButton'
import type { FC } from 'react'
import { photos } from '../../../data/photos'
import { honeyDrop } from '../../../lib/honey-drop'
import { ArchPhoto } from '../../ui/ArchFrame'

const TITLE_ID = 'pasteleria-titulo'

/** Lo que conviene mandar al cotizar. Son los mismos campos del mensaje de WhatsApp "pastel". */
const QUOTE_DETAILS = [
  { term: 'Ocasión', detail: 'Cumpleaños, aniversario, baby shower o lo que vayas a celebrar.' },
  { term: 'Fecha', detail: 'Para qué día lo necesitas.' },
  { term: 'Porciones', detail: 'Cuántas personas van a comer.' },
  { term: 'Idea de sabor o diseño', detail: 'Si tienes una foto de referencia, mándala también.' },
] as const

/**
 * Dos pasteles grandes y dos miniaturas. Anchos máximos (14rem y 8rem) por debajo de la mitad
 * del tamaño real de cada foto, para que se vean nítidas en pantallas 2x.
 */
const PastryGallery: FC = () => {
  return (
    <div className="grid grid-cols-2 items-start gap-4 sm:gap-6 lg:grid-cols-3">
      <ArchPhoto photo={photos.pastelChorreado} bordered className="aspect-3/4 w-full max-w-56 justify-self-end" />
      <ArchPhoto
        photo={photos.pastelCumpleanos}
        bordered
        className="aspect-3/4 w-full max-w-56 justify-self-start lg:mt-16"
      />
      <div className="col-span-2 flex justify-center gap-4 sm:gap-6 lg:col-span-1 lg:mt-32 lg:flex-col lg:justify-start">
        <ArchPhoto photo={photos.rollosCanela} bordered className="aspect-4/5 w-full max-w-32" />
        <ArchPhoto photo={photos.galletas} bordered className="aspect-4/5 w-full max-w-32" />
      </div>
    </div>
  )
}

const QuoteDetails: FC = () => {
  return (
    <dl className="flex flex-col gap-4 border-l-2 border-foreground-accent/40 pl-4">
      {QUOTE_DETAILS.map((item) => {
        return (
          <div key={item.term}>
            <dt className="font-medium">{item.term}</dt>
            <dd className="text-sm">{item.detail}</dd>
          </div>
        )
      })}
    </dl>
  )
}

/** Pastelería: fotos en arcos sobre tablillas de madera. Sin precios: cada pastel se cotiza por WhatsApp. */
export const PasteleriaSection: FC = () => {
  return (
    <section id="pasteleria" aria-labelledby={TITLE_ID} className="wood-slats text-foreground">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="flex flex-col gap-6 lg:col-span-5">
          <h2 id={TITLE_ID} {...honeyDrop} className="text-5xl md:text-6xl">
            Pastelería
          </h2>
          <p className="max-w-prose text-lg">
            Cada pastel se cotiza por WhatsApp, según lo que tengas en mente. Para darte el precio más rápido,
            cuéntanos:
          </p>
          <QuoteDetails />
          <FlowButton flow="pastel" intent="secundario" className="self-start" />
        </div>
        <div className="lg:col-span-7">
          <PastryGallery />
        </div>
      </div>
    </section>
  )
}
