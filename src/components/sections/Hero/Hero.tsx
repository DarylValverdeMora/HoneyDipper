import type { FC } from 'react'
import { business } from '../../../data/business'
import { photos } from '../../../data/photos'
import { FlowButton } from '../../flows/FlowButton'
import { ArchPhoto } from '../../ui/ArchFrame'
import { HeroLogo } from './HeroLogo'

/** Primera vista: logo, slogan, las dos acciones y el arco del local. Fondo Menta Honey. */
export const Hero: FC = () => {
  return (
    <section id="inicio" aria-label="Inicio" className="bg-surface-brand text-on-brand">
      <div
        data-honey-rail
        className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 pt-6 pb-16 md:gap-10 md:px-6 lg:min-h-hero lg:grid-cols-2 lg:gap-16 lg:py-12"
      >
        <div className="flex flex-col items-start gap-6 md:gap-8">
          <HeroLogo />
          <p data-hero-slogan className="max-w-md motion-safe:opacity-0 font-display text-3xl leading-tight italic md:text-4xl">
            {business.slogan}
          </p>
          <div className="flex flex-wrap gap-3">
            <FlowButton flow="reserva" />
            <FlowButton flow="pastel" intent="secundario" />
          </div>
        </div>
        <ArchPhoto
          photo={photos.interiorArco}
          sizes="(min-width: 64rem) 448px, (min-width: 48rem) 384px, calc(100vw - 2rem)"
          bordered
          priority
          className="aspect-3/4 w-full max-w-sm justify-self-center lg:max-w-md lg:justify-self-end"
        />
      </div>
    </section>
  )
}
