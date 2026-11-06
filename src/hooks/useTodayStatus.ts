import { useEffect, useState } from 'react'
import { business } from '../data/business'
import { getTodayStatus } from '../lib/schedule'
import type { TodayStatus } from '../lib/schedule'

const MINUTE_MS = 60_000

const readStatus = (): TodayStatus => {
  return getTodayStatus({ now: new Date(), timeZone: business.timeZone, schedule: business.openingHours })
}

const msUntilNextMinute = (): number => {
  return MINUTE_MS - (Date.now() % MINUTE_MS)
}

/**
 * Estado de hoy con la hora de Costa Rica. Se recalcula al cambiar el minuto
 * y al volver a la pestaña (los temporizadores se duermen en segundo plano).
 */
export const useTodayStatus = (): TodayStatus => {
  const [status, setStatus] = useState(readStatus)

  useEffect(() => {
    let timeoutId = 0

    const refresh = () => {
      setStatus(readStatus())
    }

    const scheduleNextTick = () => {
      timeoutId = window.setTimeout(() => {
        refresh()
        scheduleNextTick()
      }, msUntilNextMinute())
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') refresh()
    }

    scheduleNextTick()
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      window.clearTimeout(timeoutId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return status
}
