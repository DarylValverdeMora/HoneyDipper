import { useCallback, useState } from 'react'
import { useSendStatus } from './useSendStatus'
import type { SendStatusControls } from './useSendStatus'

export type FlowDraft<D> = SendStatusControls & {
  draft: D
  /** Cambia un campo y vuelve al estado "editando" (el aviso de "Abriendo WhatsApp" ya no aplica). */
  setField: <K extends keyof D>(key: K, value: D[K]) => void
}

/** Borrador de una hoja de WhatsApp: los campos tal como los escribe la persona, más el estado de envío. */
export const useFlowDraft = <D extends Record<string, string>>(empty: D): FlowDraft<D> => {
  const [draft, setDraft] = useState<D>(empty)
  const send = useSendStatus()
  const { resetStatus } = send

  const setField = useCallback(
    <K extends keyof D>(key: K, value: D[K]) => {
      setDraft((current) => ({ ...current, [key]: value }))
      resetStatus()
    },
    [resetStatus],
  )

  return { ...send, draft, setField }
}
