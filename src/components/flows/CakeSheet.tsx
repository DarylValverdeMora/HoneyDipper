import { useId } from 'react'
import type { FC } from 'react'
import { CAKE_OCCASIONS, whatsappTemplates } from '../../data/whatsapp'
import { useCakeForm } from '../../hooks/useCakeForm'
import { useFlowSheet } from '../../hooks/useFlowSheet'
import { Sheet } from '../ui/Sheet'
import { CONTROL_STYLES, FlowField, FlowForm, FlowIntro, TEXTAREA_STYLES, useFieldHandler } from './FlowField'
import { FlowSendActions } from './FlowSendActions'

const IDEA_ROWS = 4

/** Hoja "Cotiza tu pastel". Va a la pastelería. Todos los campos son opcionales. */
export const CakeSheet: FC = () => {
  const form = useCakeForm()
  const sheet = useFlowSheet('pastel', form.resetStatus)
  const ids = useId()
  const fieldId = (name: string) => `${ids}-${name}`

  const handleOcasion = useFieldHandler(form.setOcasion)
  const handleFecha = useFieldHandler(form.setFecha)
  const handlePorciones = useFieldHandler(form.setPorciones)
  const handleIdea = useFieldHandler(form.setIdea)

  const ideaAtLimit = form.ideaLength >= form.ideaMaxLength

  return (
    <Sheet isOpen={sheet.isOpen} onClose={sheet.close} title={whatsappTemplates.pastel.ctaLabel}>
      <FlowIntro />
      <FlowForm>
        <FlowField label="Ocasión" htmlFor={fieldId('ocasion')} messageId={fieldId('ocasion-aviso')} message="">
          <select id={fieldId('ocasion')} value={form.draft.ocasion} onChange={handleOcasion} className={CONTROL_STYLES}>
            <option value="">Elige la ocasión</option>
            {CAKE_OCCASIONS.map((occasion) => {
              return (
                <option key={occasion} value={occasion}>
                  {occasion}
                </option>
              )
            })}
          </select>
        </FlowField>
        <div className="grid grid-cols-1 gap-3 min-[22rem]:grid-cols-2">
          <FlowField
            label="Fecha de entrega"
            htmlFor={fieldId('fecha')}
            messageId={fieldId('fecha-aviso')}
            message={form.dateError}
          >
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
            label="Porciones"
            htmlFor={fieldId('porciones')}
            messageId={fieldId('porciones-aviso')}
            message={form.portionsError}
          >
            <input
              id={fieldId('porciones')}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="Ej. 20"
              value={form.draft.porciones}
              onChange={handlePorciones}
              aria-invalid={form.portionsError !== ''}
              aria-describedby={fieldId('porciones-aviso')}
              className={CONTROL_STYLES}
            />
          </FlowField>
        </div>
        <FlowField
          label="Idea de sabor o diseño"
          htmlFor={fieldId('idea')}
          messageId={fieldId('idea-aviso')}
          message={ideaAtLimit ? `Llegaste al máximo de ${form.ideaMaxLength} caracteres.` : ''}
          aside={
            <span id={fieldId('idea-contador')} className="price text-xs text-foreground-accent tabular-nums">
              {form.ideaLength}/{form.ideaMaxLength}
              <span className="sr-only"> caracteres</span>
            </span>
          }
        >
          <textarea
            id={fieldId('idea')}
            rows={IDEA_ROWS}
            value={form.draft.idea}
            onChange={handleIdea}
            aria-describedby={`${fieldId('idea-contador')} ${fieldId('idea-aviso')}`}
            className={TEXTAREA_STYLES}
          />
        </FlowField>
        <FlowSendActions
          flow="pastel"
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
