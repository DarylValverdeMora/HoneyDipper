import { useWhatsAppFlowContext } from '../lib/whatsapp-flow-context'
import type { SheetFlow } from '../lib/whatsapp-flow-context'

export type WhatsAppFlowControls = {
  activeFlow: SheetFlow | null
  openFlow: (flow: SheetFlow) => void
  closeFlow: () => void
}

/** Abre y cierra las hojas de WhatsApp (reserva, pastel, evento) desde cualquier parte de la página. */
export const useWhatsAppFlow = (): WhatsAppFlowControls => {
  const { state, actions } = useWhatsAppFlowContext()
  return { activeFlow: state.activeFlow, openFlow: actions.openFlow, closeFlow: actions.closeFlow }
}
