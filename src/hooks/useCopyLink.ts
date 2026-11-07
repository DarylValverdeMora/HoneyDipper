import { useCallback, useEffect, useState } from 'react'
import { writeToClipboard } from '../lib/clipboard'

export type CopyStatus = 'listo' | 'copiado' | 'error'

const STATUS_RESET_MS = 2500

/**
 * Copia la URL actual. El portapapeles puede no existir (http, permisos o navegador viejo):
 * en ese caso el estado pasa a 'error' y la vista pide copiar desde la barra de direcciones.
 */
export const useCopyLink = (): { status: CopyStatus; copy: () => void } => {
  const [status, setStatus] = useState<CopyStatus>('listo')

  useEffect(() => {
    if (status === 'listo') return undefined
    const timeoutId = window.setTimeout(() => setStatus('listo'), STATUS_RESET_MS)
    return () => window.clearTimeout(timeoutId)
  }, [status])

  const copy = useCallback(() => {
    writeToClipboard(window.location.href).then(
      () => setStatus('copiado'),
      () => setStatus('error'),
    )
  }, [])

  return { status, copy }
}
