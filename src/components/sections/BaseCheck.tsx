import type { FC } from 'react'
import { business } from '../../data/business'
import { photos } from '../../data/photos'
import { whatsappTemplates } from '../../data/whatsapp'
import type { WhatsAppFlow } from '../../data/whatsapp'
import { buildWhatsAppLink } from '../../lib/whatsapp'

const FLOWS: readonly WhatsAppFlow[] = ['reserva', 'pastel', 'evento']

/** Pantalla temporal de la etapa 2B. Se reemplaza por el Hero en la 2C. */
export const BaseCheck: FC = () => {
  const { logo } = photos

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-8 px-4 py-12 text-center">
      <img
        src={logo.src}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        className="w-64"
      />
      <p className="font-display text-2xl italic">{business.slogan}</p>
      <ul className="flex flex-col gap-3">
        {FLOWS.map((flow) => {
          return (
            <li key={flow}>
              <a
                href={buildWhatsAppLink({ flow })}
                className="inline-block rounded-full bg-cta px-6 py-3 font-body text-on-cta"
              >
                {whatsappTemplates[flow].ctaLabel}
              </a>
            </li>
          )
        })}
      </ul>
      <p className="font-body text-sm text-foreground-accent">
        {business.location.city}, {business.location.country}. {Object.keys(photos).length} fotos
        registradas.
      </p>
    </div>
  )
}
