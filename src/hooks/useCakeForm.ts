import { useCallback, useMemo } from 'react'
import { business } from '../data/business'
import {
  cakeMessageValues,
  checkCount,
  countCharacters,
  describeCountError,
  describeOpenDateError,
  IDEA_MAX_LENGTH,
  limitCharacters,
} from '../lib/requests'
import type { CakeDraft } from '../lib/requests'
import { businessToday, checkDateFrom } from '../lib/reservation'
import type { IsoDate } from '../lib/reservation'
import type { SendStatus } from './useSendStatus'
import { useFlowDraft } from './useFlowDraft'
import { useFlowMessage } from './useFlowMessage'
import { useMinuteClock } from './useMinuteClock'

const EMPTY_DRAFT: CakeDraft = { ocasion: '', fecha: '', porciones: '', idea: '' }
const TZ = business.timeZone

export type CakeForm = {
  draft: CakeDraft
  /** Hoy en Costa Rica: fecha mínima de entrega. Sin máximo ni días de anticipación inventados. */
  minDate: IsoDate
  dateError: string
  portionsError: string
  ideaLength: number
  ideaMaxLength: number
  href: string
  message: string
  sendStatus: SendStatus
  setOcasion: (value: string) => void
  setFecha: (value: string) => void
  setPorciones: (value: string) => void
  setIdea: (value: string) => void
  markOpening: () => void
  resetStatus: () => void
}

/** Estado de la hoja "Cotiza tu pastel": campos, avisos y el mensaje en vivo. */
export const useCakeForm = (): CakeForm => {
  const now = useMinuteClock()
  const { draft, setField, sendStatus, markOpening, resetStatus } = useFlowDraft(EMPTY_DRAFT)
  const minDate = useMemo(() => businessToday(now, TZ), [now])

  const values = useMemo(() => cakeMessageValues(draft, { timeZone: TZ, minDate }), [draft, minDate])
  const { href, message } = useFlowMessage('pastel', values)

  const setOcasion = useCallback((value: string) => setField('ocasion', value), [setField])
  const setFecha = useCallback((value: string) => setField('fecha', value), [setField])
  const setPorciones = useCallback((value: string) => setField('porciones', value), [setField])
  const setIdea = useCallback((value: string) => setField('idea', limitCharacters(value, IDEA_MAX_LENGTH)), [setField])

  return {
    draft,
    minDate,
    dateError: describeOpenDateError(checkDateFrom(draft.fecha, minDate)),
    portionsError: describeCountError(checkCount(draft.porciones)),
    ideaLength: countCharacters(draft.idea),
    ideaMaxLength: IDEA_MAX_LENGTH,
    href,
    message,
    sendStatus,
    setOcasion,
    setFecha,
    setPorciones,
    setIdea,
    markOpening,
    resetStatus,
  }
}
