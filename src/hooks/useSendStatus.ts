import { useCallback, useState } from 'react'

export type SendStatus = 'editando' | 'abriendo'

export type SendStatusControls = {
  sendStatus: SendStatus
  /** Se tocó "Enviar por WhatsApp": la hoja queda abierta y muestra el aviso. */
  markOpening: () => void
  /** Volver a editar (al cambiar un campo o al cerrar la hoja). */
  resetStatus: () => void
}

export const useSendStatus = (): SendStatusControls => {
  const [sendStatus, setSendStatus] = useState<SendStatus>('editando')
  const markOpening = useCallback(() => setSendStatus('abriendo'), [])
  const resetStatus = useCallback(() => setSendStatus('editando'), [])
  return { sendStatus, markOpening, resetStatus }
}
