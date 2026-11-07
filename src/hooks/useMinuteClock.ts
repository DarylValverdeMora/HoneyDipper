import { useEffect, useState } from 'react'

const MINUTE_MS = 60_000

const msUntilNextMinute = (): number => {
  return MINUTE_MS - (Date.now() % MINUTE_MS)
}

/**
 * La hora actual, renovada al cambiar cada minuto y al volver a la pestaña
 * (los temporizadores se duermen en segundo plano).
 */
export const useMinuteClock = (): Date => {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    let timeoutId = 0

    const refresh = () => {
      setNow(new Date())
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

  return now
}
