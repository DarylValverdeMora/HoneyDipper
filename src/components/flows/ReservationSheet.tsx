import { useId } from 'react'
import type { FC } from 'react'
import { business } from '../../data/business'
import { whatsappTemplates } from '../../data/whatsapp'
import { useReservationForm } from '../../hooks/useReservationForm'
import { useFlowSheet } from '../../hooks/useFlowSheet'
import { MORE_PEOPLE, NAME_MAX_LENGTH } from '../../lib/reservation'
import { Sheet } from '../ui/Sheet'
import { CONTROL_STYLES, FlowField as Field, FlowForm, FlowIntro, useFieldHandler } from './FlowField'
import { FlowSendActions } from './FlowSendActions'

const PEOPLE_OPTIONS = Array.from({ length: business.reservaMaxPersonas }, (_, index) => String(index + 1))

/** Hoja de reserva. Todos los campos son opcionales: lo que falte se completa en el chat. */
export const ReservationSheet: FC = () => {
  const form = useReservationForm()
  const sheet = useFlowSheet('reserva', form.resetStatus)
  const ids = useId()
  const fieldId = (name: string) => `${ids}-${name}`

  const handleNombre = useFieldHandler(form.setNombre)
  const handleFecha = useFieldHandler(form.setFecha)
  const handleHora = useFieldHandler(form.setHora)
  const handlePersonas = useFieldHandler(form.setPersonas)

  const hasDate = form.draft.fecha !== '' && form.dateError === ''

  return (
    <Sheet isOpen={sheet.isOpen} onClose={sheet.close} title={whatsappTemplates.reserva.ctaLabel}>
      <FlowIntro />
      <FlowForm>
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
        <FlowSendActions
          flow="reserva"
          href={form.href}
          message={form.message}
          sendStatus={form.sendStatus}
          onOpen={form.markOpening}
          onClose={sheet.close}
        />
      </FlowForm>
    </Sheet>
  )
}
