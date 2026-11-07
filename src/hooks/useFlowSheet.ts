import { useCallback } from 'react'
import type { SheetFlow } from '../lib/whatsapp-flow-context'
import { useWhatsAppFlow } from './useWhatsAppFlow'

/** Si la hoja de este flujo está abierta y cómo cerrarla (limpiando el aviso de "Abriendo WhatsApp"). */
export const useFlowSheet = (flow: SheetFlow, resetStatus: () => void): { isOpen: boolean; close: () => void } => {
  const { activeFlow, closeFlow } = useWhatsAppFlow()
  const close = useCallback(() => {
    resetStatus()
    closeFlow()
  }, [closeFlow, resetStatus])
  return { isOpen: activeFlow === flow, close }
}
