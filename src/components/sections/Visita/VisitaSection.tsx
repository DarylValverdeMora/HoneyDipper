import type { FC, ReactNode } from 'react'
import { business } from '../../../data/business'
import { useTodayStatus } from '../../../hooks/useTodayStatus'
import { formatPaymentMethods, toTelLink } from '../../../lib/contact'
import { honeyDrop } from '../../../lib/honey-drop'
import { formatDays, formatHours } from '../../../lib/schedule'
import { ReserveButton } from '../../flows/ReserveButton'
import { ButtonLink } from '../../ui/Button'
import { MapCard } from './MapCard'

const TITLE_ID = 'visita-titulo'

const linkStyles =
  'underline decoration-foreground/30 underline-offset-4 transition-[text-decoration-color] duration-150 ease-out hover:decoration-foreground'

type InfoBlockProps = {
  title: string
  id?: 'horario'
  children: ReactNode
}

const InfoBlock: FC<InfoBlockProps> = ({ title, id, children }) => {
  return (
    <div id={id} className="flex flex-col gap-2">
      <h3 className="font-body text-sm font-medium text-foreground-accent">{title}</h3>
      {children}
    </div>
  )
}

/** Horario completo; el grupo de días de hoy queda marcado. */
const HoursList: FC = () => {
  const status = useTodayStatus()
  const todayHours = status.kind === 'sin-horario' ? undefined : status.hours

  return (
    <dl className="flex flex-col gap-1">
      {business.openingHours.map((entry) => {
        const isToday = entry === todayHours
        return (
          <div key={entry.days.join('-')} className="flex flex-wrap justify-between gap-x-4" data-today={isToday}>
            <dt className="data-[today=true]:font-medium">
              {formatDays(entry.days)}
              {isToday && <span className="text-foreground-accent"> (hoy)</span>}
            </dt>
            <dd className="price">{formatHours(entry)}</dd>
          </div>
        )
      })}
    </dl>
  )
}

const ContactList: FC = () => {
  const { restaurante, pasteleria } = business.contact

  return (
    <ul className="flex flex-col gap-1">
      {[restaurante, pasteleria].map((line) => {
        return (
          <li key={line.label} className="flex justify-between gap-4">
            <span>{line.label}</span>
            <a href={toTelLink(line)} className={`price ${linkStyles}`}>
              {line.displayPhone}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

/** Cómo llegar: dirección, mapa diferido, horario completo, teléfonos, Instagram y pagos. */
export const VisitaSection: FC = () => {
  return (
    <section id="visita" aria-labelledby={TITLE_ID} className="bg-surface text-foreground">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-12 lg:gap-x-16">
        <div className="flex flex-col gap-6 lg:col-span-5">
          <h2 id={TITLE_ID} {...honeyDrop} className="text-5xl md:text-6xl">
            Cómo llegar
          </h2>
          <address className="font-display text-3xl leading-tight not-italic">
            {business.location.address}, {business.location.city}.
          </address>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={business.location.mapsUrl} external intent="secundario">
              Abrir en Google Maps
            </ButtonLink>
            <ReserveButton />
          </div>
        </div>
        <div className="lg:col-span-7 lg:row-span-2">
          <MapCard />
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
          <InfoBlock title="Horario" id="horario">
            <HoursList />
          </InfoBlock>
          <InfoBlock title="Teléfonos">
            <ContactList />
          </InfoBlock>
          <InfoBlock title="Instagram">
            <a
              href={business.social.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`self-start ${linkStyles}`}
            >
              {business.social.instagram.handle}
            </a>
          </InfoBlock>
          <InfoBlock title="Pagos">
            <p>Aceptamos {formatPaymentMethods(business.paymentMethods)}.</p>
          </InfoBlock>
        </div>
      </div>
    </section>
  )
}
