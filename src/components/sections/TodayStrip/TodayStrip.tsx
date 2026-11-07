import type { FC } from 'react'
import { toAnchor } from '../../../data/navigation'
import { useTodayStatus } from '../../../hooks/useTodayStatus'
import { describeOpenNow, describeTodayHours } from '../../../lib/schedule'

const linkStyles =
  'inline-flex min-h-11 items-center underline decoration-foreground/30 underline-offset-4 transition-[text-decoration-color] duration-150 ease-out hover:decoration-foreground'

/** Franja bajo el hero: horario de hoy y si está abierto ahora, con la hora de Costa Rica. */
export const TodayStrip: FC = () => {
  const status = useTodayStatus()
  const isOpen = status.kind === 'abierto'

  return (
    <aside aria-label="Horario de hoy" className="bg-surface-soft text-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 md:flex-row md:items-center md:justify-between md:gap-8 md:px-6">
        <div className="flex flex-col gap-1">
          <p className="font-display text-2xl leading-tight md:text-3xl">
            <span className="price lining-nums">{describeTodayHours(status)}</span>
          </p>
          <p className="flex items-center gap-2 text-sm font-medium">
            <span
              aria-hidden="true"
              className="size-2.5 shrink-0 rounded-full border-2 border-foreground-accent data-[open=true]:border-foreground data-[open=true]:bg-foreground"
              data-open={isOpen}
            />
            {describeOpenNow(status)}
          </p>
        </div>
        <nav aria-label="Más sobre el horario" className="flex gap-6 text-sm">
          <a href={toAnchor('horario')} className={linkStyles}>
            Ver horario completo
          </a>
          <a href={toAnchor('visita')} className={linkStyles}>
            Cómo llegar
          </a>
        </nav>
      </div>
    </aside>
  )
}
