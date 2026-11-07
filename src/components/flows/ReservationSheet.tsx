import { useCallback, useId } from 'react'
import type { ChangeEvent, FC, FormEvent, ReactNode } from 'react'
import { business } from '../../data/business'
import { whatsappTemplates } from '../../data/whatsapp'
import { useReservationForm } from '../../hooks/useReservationForm'
import { useWhatsAppFlow } from '../../hooks/useWhatsAppFlow'
import { MORE_PEOPLE, NAME_MAX_LENGTH } from '../../lib/reservation'
import { Button, ButtonLink } from '../ui/Button'
import { Sheet } from '../ui/Sheet'

/** 16 px o más en los campos: así iOS no hace zoom al tocarlos. */
const CONTROL_STYLES =
  'min-h-12 w-full rounded-2xl border border-foreground/25 bg-surface px-4 text-base text-foreground transition-[border-color] duration-150 ease-out hover:border-foreground/50 aria-invalid:border-foreground'

const PEOPLE_OPTIONS = Array.from({ length: business.reservaMaxPersonas }, (_, index) => String(index + 1))

type FieldProps = {
  label: string
  htmlFor: string
  messageId: string
  message: string
  children: ReactNode
}

/** Etiqueta real, el campo y un aviso que se anuncia al cambiar (aria-live). */
const Field: FC<FieldProps> = ({ label, htmlFor, messageId, message, children }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
      <p id={messageId} aria-live="polite" className="text-sm text-pretty text-foreground">
        {message}
      </p>
    </div>
  )
}

const preventSubmit = (event: FormEvent<HTMLFormElement>): void => {
  event.preventDefault()
}

const useFieldHandler = (setter: (value: string) => void) => {
  return useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setter(event.target.value),
    [setter],
  )
}

/** Hoja de reserva. Todos los campos son opcionales: lo que falte se completa en el chat. */
export const ReservationSheet: FC = () => {
  const { activeFlow, closeFlow } = useWhatsAppFlow()
  const form = useReservationForm()
  const ids = useId()
  const fieldId = (name: string) => `${ids}-${name}`

  const handleNombre = useFieldHandler(form.setNombre)
  const handleFecha = useFieldHandler(form.setFecha)
  const handleHora = useFieldHandler(form.setHora)
  const handlePersonas = useFieldHandler(form.setPersonas)

  const { resetStatus } = form
  const handleClose = useCallback(() => {
    resetStatus()
    closeFlow()
  }, [closeFlow, resetStatus])

  const hasDate = form.draft.fecha !== '' && form.dateError === ''

  return (
    <Sheet isOpen={activeFlow === 'reserva'} onClose={handleClose} title={whatsappTemplates.reserva.ctaLabel}>
      <p className="pb-6 text-sm text-pretty">
        Llena lo que sepas. Lo que falte lo completas en el chat de WhatsApp.
      </p>
      <form noValidate onSubmit={preventSubmit} className="flex flex-col gap-5">
        <Field label="Nombre" htmlFor={fieldId('nombre')} messageId={fieldId('nombre-aviso')} message="">
          <input
            id={fieldId('nombre')}
            type="text"
            autoComplete="name"
            maxLength={NAME_MAX_LENGTH}
            value={form.draft.nombre}
            onChange={handleNombre}
            className={CONTROL_STYLES}
          />
        </Field>
        <div className="grid grid-cols-1 gap-3 min-[22rem]:grid-cols-2">
          <Field label="Fecha" htmlFor={fieldId('fecha')} messageId={fieldId('fecha-aviso')} message={form.dateError}>
            <input
              id={fieldId('fecha')}
              type="date"
              min={form.range.min}
              max={form.range.max}
              value={form.draft.fecha}
              onChange={handleFecha}
              aria-invalid={form.dateError !== ''}
              aria-describedby={fieldId('fecha-aviso')}
              className={CONTROL_STYLES}
            />
          </Field>
          <Field label="Hora" htmlFor={fieldId('hora')} messageId={fieldId('hora-aviso')} message={form.timeNotice}>
            <select
              id={fieldId('hora')}
              value={form.draft.hora}
              onChange={handleHora}
              aria-describedby={fieldId('hora-aviso')}
              className={CONTROL_STYLES}
            >
              <option value="">{hasDate ? 'Elige hora' : 'Elige fecha'}</option>
              {form.slots.map((slot) => {
                return (
                  <option key={slot} value={slot}>
                    {form.labelForSlot(slot)}
                  </option>
                )
              })}
            </select>
          </Field>
        </div>
        <Field label="Personas" htmlFor={fieldId('personas')} messageId={fieldId('personas-aviso')} message="">
          <select
            id={fieldId('personas')}
            value={form.draft.personas}
            onChange={handlePersonas}
            className={CONTROL_STYLES}
          >
            <option value="">Elige cuántas personas</option>
            {PEOPLE_OPTIONS.map((count) => {
              return (
                <option key={count} value={count}>
                  {count === '1' ? '1 persona' : `${count} personas`}
                </option>
              )
            })}
            <option value={MORE_PEOPLE}>Más personas (lo conversamos por WhatsApp)</option>
          </select>
        </Field>
        <div className="flex flex-col gap-3 pt-2">
          <ButtonLink href={form.href} external full onClick={form.markOpening}>
            Enviar por WhatsApp
          </ButtonLink>
          <p role="status" className="text-center text-sm text-pretty">
            {form.sendStatus === 'abriendo' ? 'Abriendo WhatsApp. Si no se abrió, toca el botón otra vez.' : ''}
          </p>
          {form.sendStatus === 'abriendo' && (
            <Button intent="discreto" full onClick={handleClose}>
              Cerrar
            </Button>
          )}
        </div>
      </form>
    </Sheet>
  )
}
