import { useEffect, useState } from 'react'

const ACTIVITY_EVENTS = ['mousemove', 'keypress', 'scroll', 'click'] as const
const ACTIVITY_THROTTLE = 200 // ms between idle-timer resets

/**
 * Tracks whether the user has been inactive for `idleTimeout` ms.
 * mousemove/scroll fire far more often than the idle timer needs to be
 * reset, so activity is throttled before doing the clearTimeout/setTimeout
 * churn. Returns a useState-like tuple so callers can force-clear idle
 * state (e.g. on modal close) without waiting for activity.
 */
export function useIdleTimeout(idleTimeout: number) {
  const [isIdle, setIsIdle] = useState(false)

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    let lastActivityAt = 0

    const resetIdleTimer = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => setIsIdle(true), idleTimeout)
    }

    const handleActivity = () => {
      const now = Date.now()
      if (now - lastActivityAt < ACTIVITY_THROTTLE) return
      lastActivityAt = now
      resetIdleTimer()
    }

    // Set timeout on mount
    resetIdleTimer()

    ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, handleActivity)
    )

    return () => {
      clearTimeout(timeout)
      ACTIVITY_EVENTS.forEach((event) =>
        window.removeEventListener(event, handleActivity)
      )
    }
  }, [idleTimeout])

  return [isIdle, setIsIdle] as const
}
