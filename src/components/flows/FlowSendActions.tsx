import { useId } from 'react'
import type { FC, FocusEvent } from 'react'
import { business } from '../../data/business'
import { whatsappTemplates } from '../../data/whatsapp'
import { useCopyMessage } from '../../hooks/useCopyMessage'
import type { CopyMessageStatus } from '../../hooks/useCopyMessage'
import type { SendStatus } from '../../hooks/useSendStatus'
import type { SheetFlow } from '../../lib/whatsapp-flow-context'
import { Button, ButtonLink } from '../ui/Button'
import { TEXTAREA_STYLES } from './FlowField'

export const PRIVACY_NOTE = 'No guardamos estos datos; solo sirven para armar tu mensaje'

type FlowSendActionsProps = {
  flow: SheetFlow
  href: string
  message: string
  sendStatus: SendStatus
  onOpen: () => void
  onClose: () => void
}

const copyStatusText = (status: CopyMessageStatus, phone: string): string => {
  if (status === 'copiado') return `Mensaje copiado. Pégalo en un chat de WhatsApp con el ${phone}.`
  if (status === 'error') return 'No se pudo copiar. Mantén presionado el texto de abajo y cópialo.'
  return ''
}

const selectAll = (event: FocusEvent<HTMLTextAreaElement>): void => {
  event.currentTarget.select()
}

/**
 * Cierre de cada hoja: el enlace real a WhatsApp, la nota de privacidad, "Copiar mensaje" por si
 * WhatsApp no abre y, después de tocar enviar, el aviso con un botón para cerrar.
 */
export const FlowSendActions: FC<FlowSendActionsProps> = ({ flow, href, message, sendStatus, onOpen, onClose }) => {
  const copy = useCopyMessage(message)
  const fallbackId = useId()
  const phone = business.contact[whatsappTemplates[flow].line].displayPhone

  return (
    <div className="flex flex-col gap-3 pt-2">
      <ButtonLink href={href} external full onClick={onOpen} data-send-link>
        Enviar por WhatsApp
      </ButtonLink>
      <p className="text-center text-xs text-pretty text-foreground-accent">{PRIVACY_NOTE}</p>
      <p role="status" className="text-center text-sm text-pretty">
        {sendStatus === 'abriendo' ? 'Abriendo WhatsApp. Si no se abrió, toca el botón otra vez o copia el mensaje.' : ''}
      </p>
      <Button intent="secundario" full onClick={copy.copy}>
        Copiar mensaje
      </Button>
      <p role="status" className="text-center text-sm text-pretty">
        {copyStatusText(copy.status, phone)}
      </p>
      {copy.status === 'error' && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor={fallbackId} className="text-sm font-medium">
            Tu mensaje
          </label>
          <textarea id={fallbackId} readOnly rows={6} value={message} onFocus={selectAll} className={TEXTAREA_STYLES} />
        </div>
      )}
      {sendStatus === 'abriendo' && (
        <Button intent="discreto" full onClick={onClose}>
          Cerrar
        </Button>
      )}
    </div>
  )
}
