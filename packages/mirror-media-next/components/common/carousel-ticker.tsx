import type { HTMLAttributes, ReactNode, RefCallback } from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'

const CAROUSEL_TICK_MS = 8000
const CAROUSEL_TRANSITION_MS = 400
const REDUCED_MOTION_SOURCE = 'system:reduced-motion'
const HIDDEN_DOCUMENT_SOURCE = 'system:hidden-document'

type CarouselTickerContextValue = {
  pause: (source: string) => void
  resume: (source: string) => void
  tick: number
}

type CarouselTickerProviderProps = {
  children: ReactNode
}

type CarouselInteractionProps = Pick<
  HTMLAttributes<HTMLElement>,
  | 'onBlurCapture'
  | 'onFocusCapture'
  | 'onPointerDownCapture'
  | 'onPointerEnter'
  | 'onPointerLeave'
>

type UseCarouselTickerOptions = {
  isActive?: boolean
  onTick?: () => void
  skipWhenOffscreen?: boolean
}

const CarouselTickerContext = createContext<CarouselTickerContextValue | null>(
  null
)

function CarouselTickerProvider({ children }: CarouselTickerProviderProps) {
  const pauseSourcesRef = useRef(new Set<string>())
  const timerVersionRef = useRef(0)
  const [isPaused, setIsPaused] = useState(false)
  const [timerVersion, setTimerVersion] = useState(0)
  const [tick, setTick] = useState(0)

  const invalidateTimer = useCallback(() => {
    timerVersionRef.current += 1
    setTimerVersion(timerVersionRef.current)
  }, [])

  const pause = useCallback(
    (source: string) => {
      const pauseSources = pauseSourcesRef.current
      const wasRunning = pauseSources.size === 0

      pauseSources.add(source)
      if (wasRunning) {
        invalidateTimer()
        setIsPaused(true)
      }
    },
    [invalidateTimer]
  )

  const resume = useCallback(
    (source: string) => {
      const pauseSources = pauseSourcesRef.current
      const sourceWasPaused = pauseSources.delete(source)

      if (sourceWasPaused && pauseSources.size === 0) {
        invalidateTimer()
        setIsPaused(false)
      }
    },
    [invalidateTimer]
  )

  useEffect(() => {
    if (isPaused) return

    const scheduledTimerVersion = timerVersionRef.current
    const timeoutId = window.setTimeout(() => {
      if (
        pauseSourcesRef.current.size === 0 &&
        timerVersionRef.current === scheduledTimerVersion
      ) {
        setTick((currentTick) => currentTick + 1)
      }
    }, CAROUSEL_TICK_MS)

    return () => window.clearTimeout(timeoutId)
  }, [isPaused, tick, timerVersion])

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    )

    const syncReducedMotion = () => {
      if (reducedMotionQuery.matches) pause(REDUCED_MOTION_SOURCE)
      else resume(REDUCED_MOTION_SOURCE)
    }
    const syncVisibility = () => {
      if (document.hidden) pause(HIDDEN_DOCUMENT_SOURCE)
      else resume(HIDDEN_DOCUMENT_SOURCE)
    }

    syncReducedMotion()
    syncVisibility()
    reducedMotionQuery.addEventListener('change', syncReducedMotion)
    document.addEventListener('visibilitychange', syncVisibility)

    return () => {
      reducedMotionQuery.removeEventListener('change', syncReducedMotion)
      document.removeEventListener('visibilitychange', syncVisibility)
    }
  }, [pause, resume])

  const value = useMemo(() => ({ pause, resume, tick }), [pause, resume, tick])

  return (
    <CarouselTickerContext.Provider value={value}>
      {children}
    </CarouselTickerContext.Provider>
  )
}

function useCarouselTicker<T extends HTMLElement = HTMLElement>({
  isActive = true,
  onTick,
  skipWhenOffscreen = false,
}: UseCarouselTickerOptions = {}) {
  const context = useContext(CarouselTickerContext)
  const carouselId = useId()
  const carouselElementRef = useRef<T | null>(null)
  const focusCameFromPointerRef = useRef(false)
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null)
  const isVisibleRef = useRef(true)
  const onTickRef = useRef(onTick)
  const tick = context?.tick ?? 0
  const previousTickRef = useRef(tick)
  const sources = useMemo(
    () => ({
      focus: `${carouselId}:focus`,
      hover: `${carouselId}:hover`,
      pointer: `${carouselId}:pointer`,
    }),
    [carouselId]
  )

  const pause = context?.pause
  const resume = context?.resume

  useEffect(() => {
    onTickRef.current = onTick
  }, [onTick])

  const carouselRef = useCallback<RefCallback<T>>(
    (element) => {
      carouselElementRef.current = element
      intersectionObserverRef.current?.disconnect()
      intersectionObserverRef.current = null
      isVisibleRef.current = true

      if (
        !skipWhenOffscreen ||
        !element ||
        !('IntersectionObserver' in window)
      ) {
        return
      }

      const observer = new window.IntersectionObserver(([entry]) => {
        isVisibleRef.current = entry?.isIntersecting ?? true
      })

      observer.observe(element)
      intersectionObserverRef.current = observer
    },
    [skipWhenOffscreen]
  )

  useEffect(
    () => () => {
      intersectionObserverRef.current?.disconnect()
    },
    []
  )

  useEffect(() => {
    const finishPointerInteraction = () => {
      resume?.(sources.pointer)
    }
    const switchToKeyboardInput = () => {
      focusCameFromPointerRef.current = false
      const carouselElement = carouselElementRef.current

      if (
        isActive &&
        carouselElement &&
        carouselElement.contains(document.activeElement)
      ) {
        pause?.(sources.focus)
      }
    }

    window.addEventListener('blur', finishPointerInteraction)
    window.addEventListener('keydown', switchToKeyboardInput)
    window.addEventListener('pointercancel', finishPointerInteraction)
    window.addEventListener('pointerup', finishPointerInteraction)

    if (!isActive) {
      resume?.(sources.focus)
      resume?.(sources.hover)
      resume?.(sources.pointer)
    }

    return () => {
      window.removeEventListener('blur', finishPointerInteraction)
      window.removeEventListener('keydown', switchToKeyboardInput)
      window.removeEventListener('pointercancel', finishPointerInteraction)
      window.removeEventListener('pointerup', finishPointerInteraction)
      resume?.(sources.focus)
      resume?.(sources.hover)
      resume?.(sources.pointer)
    }
  }, [isActive, pause, resume, sources])

  useEffect(() => {
    if (previousTickRef.current === tick) return

    previousTickRef.current = tick
    if (isActive && isVisibleRef.current) onTickRef.current?.()
  }, [isActive, tick])

  const interactionProps = useMemo<CarouselInteractionProps>(
    () => ({
      onBlurCapture: (event) => {
        if (!isActive) return
        if (!event.currentTarget.contains(event.relatedTarget)) {
          focusCameFromPointerRef.current = false
          resume?.(sources.focus)
        }
      },
      onFocusCapture: () => {
        if (isActive && !focusCameFromPointerRef.current) {
          pause?.(sources.focus)
        }
      },
      onPointerDownCapture: () => {
        if (isActive) {
          focusCameFromPointerRef.current = true
          pause?.(sources.pointer)
        }
      },
      onPointerEnter: (event) => {
        if (isActive && event.pointerType !== 'touch') pause?.(sources.hover)
      },
      onPointerLeave: (event) => {
        if (isActive && event.pointerType !== 'touch') resume?.(sources.hover)
      },
    }),
    [isActive, pause, resume, sources]
  )

  return {
    carouselRef,
    interactionProps,
  }
}

function useCarouselTickerPause(isPaused: boolean) {
  const context = useContext(CarouselTickerContext)
  const pauseId = useId()
  const pause = context?.pause
  const resume = context?.resume

  useEffect(() => {
    if (isPaused) pause?.(pauseId)
    else resume?.(pauseId)

    return () => resume?.(pauseId)
  }, [isPaused, pause, pauseId, resume])
}

export {
  CAROUSEL_TICK_MS,
  CAROUSEL_TRANSITION_MS,
  CarouselTickerProvider,
  useCarouselTicker,
  useCarouselTickerPause,
}
