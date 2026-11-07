import { useCallback, useMemo } from 'react'
import { business } from '../data/business'
import { checkCount, describeCountError, describeOpenDateError, eventMessageValues } from '../lib/requests'
import type { EventDraft } from '../lib/requests'
import { businessToday, checkDateFrom } from '../lib/reservation'
import type { IsoDate } from '../lib/reservation'
import type { SendStatus } from './useSendStatus'
import { useFlowDraft } from './useFlowDraft'
import { useFlowMessage } from './useFlowMessage'
import { useMinuteClock } from './useMinuteClock'

const EMPTY_DRAFT: EventDraft = { tipo: '', fecha: '', personas: '' }
const TZ = business.timeZone

export type EventForm = {
  draft: EventDraft
  minDate: IsoDate
  dateError: string
  peopleError: string
  href: string
  message: string
  sendStatus: SendStatus
  setTipo: (value: string) => void
  setFecha: (value: string) => void
  setPersonas: (value: string) => void
  markOpening: () => void
  resetStatus: () => void
}

/** Estado de la hoja "Consultar por un evento". Personas sin tope: no hay datos de capacidad. */
export const useEventForm = (): EventForm => {
  const now = useMinuteClock()
  const { draft, setField, sendStatus, markOpening, resetStatus } = useFlowDraft(EMPTY_DRAFT)
  const minDate = useMemo(() => businessToday(now, TZ), [now])

  const values = useMemo(() => eventMessageValues(draft, { timeZone: TZ, minDate }), [draft, minDate])
  const { href, message } = useFlowMessage('evento', values)

  const setTipo = useCallback((value: string) => setField('tipo', value), [setField])
  const setFecha = useCallback((value: string) => setField('fecha', value), [setField])
  const setPersonas = useCallback((value: string) => setField('personas', value), [setField])

  return {
    draft,
    minDate,
    dateError: describeOpenDateError(checkDateFrom(draft.fecha, minDate)),
    peopleError: describeCountError(checkCount(draft.personas)),
    href,
    message,
    sendStatus,
    setTipo,
    setFecha,
    setPersonas,
    markOpening,
    resetStatus,
  }
}
