import { useMemo } from 'react'
import { business } from '../data/business'
import { getTodayStatus } from '../lib/schedule'
import type { TodayStatus } from '../lib/schedule'
import { useMinuteClock } from './useMinuteClock'

/** Estado de hoy con la hora de Costa Rica; se recalcula cada minuto. */
export const useTodayStatus = (): TodayStatus => {
  const now = useMinuteClock()
  return useMemo(
    () => getTodayStatus({ now, timeZone: business.timeZone, schedule: business.openingHours }),
    [now],
  )
}
