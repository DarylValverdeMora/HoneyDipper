import type { FC } from 'react'
import { business } from '../../../data/business'
import { photos } from '../../../data/photos'
import { honeyDrop } from '../../../lib/honey-drop'
import { ArchPhoto } from '../../ui/ArchFrame'
import { PhotoPlaceholder } from '../../ui/PhotoPlaceholder'

const TITLE_ID = 'lugar-titulo'

/**
 * La misma foto del hero con otro encuadre: horizontal, desde arriba (techo de madera y logo) y sin arco, porque el arco ya está dentro de la foto.
 * Ancho máximo 36rem (576 px): con pantallas 2x la foto (1170 px) no se agranda.
 */
const InteriorPhoto: FC = () => {
  const photo = photos.interiorArco

  return (
    <figure className="w-full max-w-xl">
      <img
        src={photo.src}
        {...(photo.srcSet === undefined ? {} : { srcSet: photo.srcSet })}
        sizes="(min-width: 36rem) 576px, calc(100vw - 2rem)"
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        loading="lazy"
        decoding="async"
        className="aspect-4/3 w-full rounded-3xl object-cover object-top outline -outline-offset-1 outline-image-outline"
      />
    </figure>
  )
}

/**
 * Otro encuadre del interior (mostrador, 750 px: se muestra a 20 rem como máximo) y la terraza de noche. La terraza mide 226 px de
 * ancho, así que va en un arco chico de 7 rem (112 px) y se ve nítida en pantallas 2x. Falta la fachada.
 */
const MoreOfThePlace: FC = () => {
  return (
    <div className="flex max-w-xs flex-col gap-6 lg:col-span-5 lg:col-start-8 lg:row-start-2">
      <ArchPhoto
        photo={photos.interiorMostrador}
        bordered
        sizes="(min-width: 20rem) 288px, calc(100vw - 2rem)"
        className="aspect-4/5 w-full"
      />
      <div className="flex items-end gap-4">
        <ArchPhoto photo={photos.terrazaNoche} bordered className="aspect-1/2 w-28 shrink-0" />
        <PhotoPlaceholder description="la fachada o la entrada" bordered className="aspect-3/4 w-36" />
      </div>
    </div>
  )
}

/** El lugar: el interior, el mostrador, la terraza de noche y un espacio para la fachada. Se apaga con business.mostrarLugar. */
export const LugarSection: FC = () => {
  if (!business.mostrarLugar) return null

  return (
    <section id="lugar" aria-labelledby={TITLE_ID} className="bg-surface-brand text-on-brand">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-10">
        <div className="flex flex-col gap-6 lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:self-end">
          <h2 id={TITLE_ID} {...honeyDrop} className="text-5xl md:text-6xl">
            El lugar
          </h2>
          <p className="max-w-prose text-lg">
            Arcos amarillos, paredes menta y techo de madera. Así se ve Honey Dipper por dentro, en{' '}
            {business.location.city}.
          </p>
        </div>
        <div className="flex justify-center lg:col-span-7 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:items-center lg:justify-start">
          <InteriorPhoto />
        </div>
        <MoreOfThePlace />
      </div>
    </section>
  )
}
