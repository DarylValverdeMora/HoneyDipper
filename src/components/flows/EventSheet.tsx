import { useId } from 'react'
import type { FC } from 'react'
import { EVENT_TYPES, whatsappTemplates } from '../../data/whatsapp'
import { useEventForm } from '../../hooks/useEventForm'
import { useFlowSheet } from '../../hooks/useFlowSheet'
import { Sheet } from '../ui/Sheet'
import { CONTROL_STYLES, FlowField, FlowForm, FlowIntro, useFieldHandler } from './FlowField'
import { FlowSendActions } from './FlowSendActions'

/** Hoja "Consultar por un evento". Sin tope de personas ni datos de capacidad. Todo opcional. */
export const EventSheet: FC = () => {
  const form = useEventForm()
  const sheet = useFlowSheet('evento', form.resetStatus)
  const ids = useId()
  const fieldId = (name: string) => `${ids}-${name}`

  const handleTipo = useFieldHandler(form.setTipo)
  const handleFecha = useFieldHandler(form.setFecha)
  const handlePersonas = useFieldHandler(form.setPersonas)

  return (
    <Sheet isOpen={sheet.isOpen} onClose={sheet.close} title={whatsappTemplates.evento.ctaLabel}>
      <FlowIntro />
      <FlowForm>
        <FlowField label="Tipo de evento" htmlFor={fieldId('tipo')} messageId={fieldId('tipo-aviso')} message="">
          <select id={fieldId('tipo')} value={form.draft.tipo} onChange={handleTipo} className={CONTROL_STYLES}>
            <option value="">Elige el tipo</option>
            {EVENT_TYPES.map((type) => {
              return (
                <option key={type} value={type}>
                  {type}
                </option>
              )
            })}
          </select>
        </FlowField>
        <div className="grid grid-cols-1 gap-3 min-[22rem]:grid-cols-2">
          <FlowField label="Fecha" htmlFor={fieldId('fecha')} messageId={fieldId('fecha-aviso')} message={form.dateError}>
            <input
              id={fieldId('fecha')}
              type="date"
              min={form.minDate}
              value={form.draft.fecha}
              onChange={handleFecha}
              aria-invalid={form.dateError !== ''}
              aria-describedby={fieldId('fecha-aviso')}
              className={CONTROL_STYLES}
            />
          </FlowField>
          <FlowField
            label="Personas"
            htmlFor={fieldId('personas')}
            messageId={fieldId('personas-aviso')}
            message={form.peopleError}
          >
            <input
              id={fieldId('personas')}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="Ej. 25"
              value={form.draft.personas}
              onChange={handlePersonas}
              aria-invalid={form.peopleError !== ''}
              aria-describedby={fieldId('personas-aviso')}
              className={CONTROL_STYLES}
            />
          </FlowField>
        </div>
        <FlowSendActions
          flow="evento"
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
