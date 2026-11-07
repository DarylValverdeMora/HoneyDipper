import { useCallback, useEffect, useState } from 'react'
import { ClipboardUnavailableError, writeToClipboard } from '../lib/clipboard'

type CopyAttempt = { kind: 'ninguno' } | { kind: 'copiado'; text: string } | { kind: 'error'; text: string }

export type CopyMessageStatus = 'listo' | 'copiado' | 'error'

const COPIED_RESET_MS = 4000

/**
 * Copia el mensaje armado. El aviso de "copiado" se va solo; el de error se queda mientras el
 * mensaje no cambie, porque la vista muestra el texto para copiarlo a mano.
 */
export const useCopyMessage = (message: string): { status: CopyMessageStatus; copy: () => void } => {
  const [attempt, setAttempt] = useState<CopyAttempt>({ kind: 'ninguno' })

  useEffect(() => {
    if (attempt.kind !== 'copiado') return undefined
    const timeoutId = window.setTimeout(() => setAttempt({ kind: 'ninguno' }), COPIED_RESET_MS)
    return () => window.clearTimeout(timeoutId)
  }, [attempt])

  const copy = useCallback(() => {
    writeToClipboard(message).then(
      () => setAttempt({ kind: 'copiado', text: message }),
      (error: unknown) => {
        if (!(error instanceof ClipboardUnavailableError)) throw error
        setAttempt({ kind: 'error', text: message })
      },
    )
  }, [message])

  // Un aviso viejo no aplica si el mensaje ya cambió.
  const status: CopyMessageStatus = attempt.kind !== 'ninguno' && attempt.text === message ? attempt.kind : 'listo'
  return { status, copy }
}
