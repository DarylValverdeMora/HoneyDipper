import { useCallback, useMemo, useState } from 'react'
import type { FC, ReactNode } from 'react'
import { WhatsAppFlowContext } from '../../lib/whatsapp-flow-context'
import type { SheetFlow, WhatsAppFlowContextValue } from '../../lib/whatsapp-flow-context'

type WhatsAppFlowProviderProps = {
  children: ReactNode
}

/** Una sola hoja abierta a la vez: abrir un flujo reemplaza al anterior. */
export const WhatsAppFlowProvider: FC<WhatsAppFlowProviderProps> = ({ children }) => {
  const [activeFlow, setActiveFlow] = useState<SheetFlow | null>(null)
  const openFlow = useCallback((flow: SheetFlow) => setActiveFlow(flow), [])
  const closeFlow = useCallback(() => setActiveFlow(null), [])

  const value = useMemo<WhatsAppFlowContextValue>(
    () => ({ state: { activeFlow }, actions: { openFlow, closeFlow } }),
    [activeFlow, openFlow, closeFlow],
  )

  return <WhatsAppFlowContext value={value}>{children}</WhatsAppFlowContext>
}
