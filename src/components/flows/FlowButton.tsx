import { useCallback } from 'react'
import type { FC } from 'react'
import { whatsappTemplates } from '../../data/whatsapp'
import { useWhatsAppFlow } from '../../hooks/useWhatsAppFlow'
import type { SheetFlow } from '../../lib/whatsapp-flow-context'
import { Button } from '../ui/Button'
import type { ButtonVariants } from '../ui/Button'

type FlowButtonProps = ButtonVariants & {
  flow: SheetFlow
  className?: string
  /** Se llama antes de abrir la hoja; por ejemplo, para cerrar el menú del celular o el selector flotante. */
  onBeforeOpen?: () => void
}

/** Botón de un flujo de WhatsApp: el texto sale de la plantilla (el mismo en toda la página) y abre su hoja. */
export const FlowButton: FC<FlowButtonProps> = ({ flow, onBeforeOpen, className, ...variants }) => {
  const { openFlow } = useWhatsAppFlow()

  const handleClick = useCallback(() => {
    onBeforeOpen?.()
    openFlow(flow)
  }, [flow, onBeforeOpen, openFlow])

  return (
    <Button
      {...variants}
      {...(className === undefined ? {} : { className })}
      onClick={handleClick}
      aria-haspopup="dialog"
      data-flow={flow}
    >
      {whatsappTemplates[flow].ctaLabel}
    </Button>
  )
}
