import type { FC, ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import type { Photo } from '../../data/photos'

/**
 * Arco como el del local. Con borde, el marco mantequilla usa p-2 y el arco interior
 * también es rounded-t-full: su radio es la mitad de su ancho, así que queda
 * exactamente 8 px menor que el de afuera (radios concéntricos).
 */
const archStyles = tv({
  slots: {
    outer: 'rounded-t-full',
    inner: 'relative size-full overflow-hidden rounded-t-full outline -outline-offset-1 outline-image-outline',
  },
  variants: {
    bordered: {
      true: { outer: 'bg-arch p-2 shadow-raised' },
      false: { outer: 'overflow-hidden' },
    },
  },
  defaultVariants: { bordered: false },
})

type ArchFrameProps = {
  children: ReactNode
  /** Marco Amarillo mantequilla alrededor del arco. */
  bordered?: boolean
  /** Tamaño y proporción vienen de afuera, por ejemplo "aspect-3/4 w-72". */
  className?: string
}

export const ArchFrame: FC<ArchFrameProps> = ({ children, bordered = false, className }) => {
  const { outer, inner } = archStyles({ bordered })
  return (
    <div className={outer({ class: className })}>
      <div className={inner()}>{children}</div>
    </div>
  )
}

type ArchPhotoProps = {
  photo: Photo
  bordered?: boolean
  className?: string
  /** Solo la foto principal de la vista inicial debe cargar sin espera. */
  priority?: boolean
}

export const ArchPhoto: FC<ArchPhotoProps> = ({ photo, bordered = false, className, priority = false }) => {
  return (
    <ArchFrame bordered={bordered} {...(className === undefined ? {} : { className })}>
      <img
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className="size-full object-cover"
      />
    </ArchFrame>
  )
}
