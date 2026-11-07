import { useMemo } from 'react'
import type { WhatsAppFlow } from '../data/whatsapp'
import { buildWhatsAppLink, composeFlowMessage } from '../lib/whatsapp'
import type { FlowValues } from '../lib/whatsapp'

export type FlowMessage = {
  /** Enlace wa.me en vivo. */
  href: string
  /** El mismo texto, para "Copiar mensaje". */
  message: string
}

export const useFlowMessage = <F extends WhatsAppFlow>(flow: F, values: FlowValues<F>): FlowMessage => {
  return useMemo(
    () => ({ href: buildWhatsAppLink({ flow, values }), message: composeFlowMessage({ flow, values }) }),
    [flow, values],
  )
}
