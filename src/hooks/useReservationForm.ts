import { useCallback, useMemo, useState } from 'react'
import { business } from '../data/business'
import {
  availableSlots,
  checkDate,
  formatReservationDate,
  formatReservationTime,
  isSlotTime,
  NAME_MAX_LENGTH,
  reconcileTime,
  reservationDateRange,
  reservationMessageValues,
} from '../lib/reservation'
import type { DateCheck, DateRange, IsoDate, ReservationDraft, SlotTime } from '../lib/reservation'
import { assertNever } from '../lib/types'
import { buildWhatsAppLink, composeFlowMessage } from '../lib/whatsapp'
import { useMinuteClock } from './useMinuteClock'
import { useSendStatus } from './useSendStatus'
import type { SendStatus } from './useSendStatus'

const EMPTY_DRAFT: ReservationDraft = { nombre: '', fecha: '', hora: '', personas: '' }

export type ReservationForm = {
  draft: ReservationDraft
  range: DateRange
  slots: SlotTime[]
  /** Aviso del campo fecha (fuera de rango o inexistente), o '' si no hay. */
  dateError: string
  /** Aviso del campo hora (se limpió, o ya no quedan horas), o ''. */
  timeNotice: string
  href: string
  /** El mismo texto del enlace, para copiarlo. */
  message: string
  sendStatus: SendStatus
  labelForSlot: (slot: SlotTime) => string
  setNombre: (value: string) => void
  setFecha: (value: string) => void
  setHora: (value: string) => void
  setPersonas: (value: string) => void
  markOpening: () => void
  resetStatus: () => void
}

const TZ = business.timeZone

const slotsFor = (check: DateCheck, now: Date): SlotTime[] => {
  if (check.kind !== 'valida') return []
  return availableSlots(check.date, {
    schedule: business.openingHours,
    timeZone: TZ,
    lastBeforeCloseMin: business.reservaUltimaAntesCierreMin,
    now,
  })
}

const describeDateError = (check: DateCheck): string => {
  switch (check.kind) {
    case 'fuera-de-rango':
      return `Elige una fecha entre hoy y el ${formatReservationDate(check.range.max, TZ)}.`
    case 'invalida':
      return 'Esa fecha no existe. Revísala.'
    case 'vacia':
    case 'valida':
      return ''
    default:
      return assertNever(check)
  }
}

const clearedTimeNotice = (previous: SlotTime, date: IsoDate): string => {
  return `Las ${formatReservationTime(previous, TZ)} no están disponibles el ${formatReservationDate(date, TZ)}. Elige otra hora.`
}

/** Estado de la hoja de reserva: campos, horas posibles, avisos y el enlace de WhatsApp en vivo. */
export const useReservationForm = (): ReservationForm => {
  const now = useMinuteClock()
  const [draft, setDraft] = useState<ReservationDraft>(EMPTY_DRAFT)
  const [clearedNotice, setClearedNotice] = useState('')
  const { sendStatus, markOpening, resetStatus } = useSendStatus()

  const range = useMemo(() => reservationDateRange(now, TZ), [now])
  const dateCheck = useMemo(() => checkDate(draft.fecha, range), [draft.fecha, range])
  const slots = useMemo(() => slotsFor(dateCheck, now), [dateCheck, now])

  // Si la hora elegida para hoy ya pasó mientras la hoja estaba abierta, no se manda.
  const validHora = isSlotTime(draft.hora) && slots.includes(draft.hora) ? draft.hora : ''

  const values = useMemo(() => {
    return reservationMessageValues(
      { ...draft, hora: validHora },
      { timeZone: TZ, range, maxPeople: business.reservaMaxPersonas },
    )
  }, [draft, validHora, range])
  const href = useMemo(() => buildWhatsAppLink({ flow: 'reserva', values }), [values])
  const message = useMemo(() => composeFlowMessage({ flow: 'reserva', values }), [values])

  const noSlotsLeft = dateCheck.kind === 'valida' && slots.length === 0
  const timeNotice = noSlotsLeft ? 'Ese día ya no quedan horas para reservar. Elige otro día.' : clearedNotice

  const update = useCallback((patch: Partial<ReservationDraft>) => {
    setDraft((current) => ({ ...current, ...patch }))
    resetStatus()
  }, [resetStatus])

  const setNombre = useCallback(
    (value: string) => update({ nombre: Array.from(value).slice(0, NAME_MAX_LENGTH).join('') }),
    [update],
  )

  // Sin fecha válida no hay lista de horas, así que la hora se suelta sin aviso (el aviso va en la fecha).
  const setFecha = useCallback(
    (value: string) => {
      const check = checkDate(value, range)
      if (check.kind !== 'valida') {
        setClearedNotice('')
        update({ fecha: value, hora: '' })
        return
      }
      const reconciliation = reconcileTime(isSlotTime(draft.hora) ? draft.hora : '', slotsFor(check, now))
      if (reconciliation.kind === 'limpiada') {
        setClearedNotice(clearedTimeNotice(reconciliation.previous, check.date))
        update({ fecha: value, hora: '' })
        return
      }
      setClearedNotice('')
      update({ fecha: value })
    },
    [draft.hora, now, range, update],
  )

  const setHora = useCallback(
    (value: string) => {
      setClearedNotice('')
      update({ hora: value })
    },
    [update],
  )

  const setPersonas = useCallback((value: string) => update({ personas: value }), [update])
  const labelForSlot = useCallback((slot: SlotTime) => formatReservationTime(slot, TZ), [])

  return {
    draft,
    range,
    slots,
    dateError: describeDateError(dateCheck),
    timeNotice,
    href,
    message,
    sendStatus,
    labelForSlot,
    setNombre,
    setFecha,
    setHora,
    setPersonas,
    markOpening,
    resetStatus,
  }
}
