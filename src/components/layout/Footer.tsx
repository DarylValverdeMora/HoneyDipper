import type { FC, ReactNode } from 'react'
import { business } from '../../data/business'
import type { ContactLine } from '../../data/business'
import type { SectionId } from '../../data/navigation'
import { formatDays, formatHours } from '../../lib/schedule'
import { Panal } from '../ui/Panal'
import { Logo } from './Logo'

const toTelLink = (line: ContactLine): string => {
  return `tel:+${line.whatsapp}`
}

const linkStyles =
  'underline decoration-foreground/30 underline-offset-4 transition-[text-decoration-color] duration-150 ease-out hover:decoration-foreground'

type FooterBlockProps = {
  title: string
  children: ReactNode
  id?: SectionId
}

const FooterBlock: FC<FooterBlockProps> = ({ title, children, id }) => {
  return (
    <div id={id} className="flex flex-col gap-3">
      <h2 className="text-2xl">{title}</h2>
      {children}
    </div>
  )
}

const HoursBlock: FC = () => {
  return (
    <FooterBlock title="Horario" id="horario">
      <dl className="grid grid-cols-1 gap-2 text-sm">
        {business.openingHours.map((entry) => {
          return (
            <div key={entry.days.join('-')}>
              <dt className="font-medium">{formatDays(entry.days)}</dt>
              <dd className="price text-foreground-accent">{formatHours(entry)}</dd>
            </div>
          )
        })}
      </dl>
    </FooterBlock>
  )
}

const ContactBlock: FC = () => {
  const { restaurante, pasteleria } = business.contact

  return (
    <FooterBlock title="Contacto">
      <ul className="flex flex-col gap-2 text-sm">
        {[restaurante, pasteleria].map((line) => {
          return (
            <li key={line.label}>
              {line.label}:{' '}
              <a href={toTelLink(line)} className={`price ${linkStyles}`}>
                {line.displayPhone}
              </a>
            </li>
          )
        })}
        <li>
          Instagram:{' '}
          <a href={business.social.instagram.url} target="_blank" rel="noopener noreferrer" className={linkStyles}>
            {business.social.instagram.handle}
          </a>
        </li>
      </ul>
    </FooterBlock>
  )
}

const VisitBlock: FC = () => {
  return (
    <FooterBlock title="Visítanos">
      <address className="flex flex-col gap-2 text-sm not-italic">
        <span>
          {business.location.address}, {business.location.city}.
        </span>
        <a href={business.location.mapsUrl} target="_blank" rel="noopener noreferrer" className={linkStyles}>
          Abrir en Google Maps
        </a>
      </address>
      <p className="text-sm">Pagos con {business.paymentMethods.join(' y ').toLowerCase()}.</p>
    </FooterBlock>
  )
}

export const Footer: FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative isolate overflow-hidden bg-surface-soft text-foreground">
      <Panal />
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pt-14 pb-28 md:px-6 md:pb-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Logo className="h-24 self-start overflow-hidden rounded-2xl" />
            <p className="font-display text-xl italic">{business.slogan}</p>
          </div>
          <HoursBlock />
          <ContactBlock />
          <VisitBlock />
        </div>
        <div className="flex flex-col gap-1 border-t border-foreground/15 pt-6 text-sm text-foreground-accent sm:flex-row sm:justify-between">
          <p>Precios en colones. {business.serviceChargeNote}.</p>
          <p>
            © {currentYear} {business.name}, {business.location.city}
          </p>
        </div>
      </div>
    </footer>
  )
}
