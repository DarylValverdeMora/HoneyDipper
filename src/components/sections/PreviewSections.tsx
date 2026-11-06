import type { FC } from 'react'
import { honeyDrop } from '../../lib/honey-drop'

/*
 * Sección temporal: "Cómo llegar" se construye en la etapa 4D.
 */
export const ComoLlegarPreview: FC = () => {
  return (
    <section id="como-llegar" aria-labelledby="como-llegar-titulo" className="bg-surface text-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 md:px-6">
        <h2 id="como-llegar-titulo" {...honeyDrop} className="text-5xl md:text-6xl">
          Cómo llegar
        </h2>
        <p className="max-w-prose text-sm text-foreground-accent">
          [PLACEHOLDER] Sección temporal. El mapa y las indicaciones llegan en la etapa 4D.
        </p>
      </div>
    </section>
  )
}
