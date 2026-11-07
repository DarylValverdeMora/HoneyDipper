import { useCallback } from 'react'
import type { FC } from 'react'
import { whatsappTemplates } from '../../data/whatsapp'
import { useWhatsAppFlow } from '../../hooks/useWhatsAppFlow'
import { Button } from '../ui/Button'
import type { ButtonVariants } from '../ui/Button'

type ReserveButtonProps = ButtonVariants & {
  className?: string
  /** Se llama antes de abrir la hoja; por ejemplo, para cerrar el menú del celular. */
  onBeforeOpen?: () => void
}

/** "Reservar mesa": el mismo texto en toda la página y siempre abre la hoja de reserva. */
export const ReserveButton: FC<ReserveButtonProps> = ({ onBeforeOpen, className, ...variants }) => {
  const { openFlow } = useWhatsAppFlow()

  const handleClick = useCallback(() => {
    onBeforeOpen?.()
    openFlow('reserva')
  }, [onBeforeOpen, openFlow])

  return (
    <Button {...variants} {...(className === undefined ? {} : { className })} onClick={handleClick} aria-haspopup="dialog">
      {whatsappTemplates.reserva.ctaLabel}
    </Button>
  )
}
