import { createContext, useContext } from 'react'
import type { WhatsAppFlow } from '../data/whatsapp'

/** Flujos que se abren en una hoja. 'consulta' (buscador del menú) va directo a WhatsApp. */
export type SheetFlow = Exclude<WhatsAppFlow, 'consulta'>

export type WhatsAppFlowContextValue = {
  state: { activeFlow: SheetFlow | null }
  actions: {
    openFlow: (flow: SheetFlow) => void
    closeFlow: () => void
  }
}

export const WhatsAppFlowContext = createContext<WhatsAppFlowContextValue | null>(null)

export const useWhatsAppFlowContext = (): WhatsAppFlowContextValue => {
  const context = useContext(WhatsAppFlowContext)
  if (context === null) {
    throw new Error('useWhatsAppFlow debe usarse dentro de <WhatsAppFlowProvider>')
  }
  return context
}
