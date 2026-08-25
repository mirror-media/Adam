import type { MouseEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import NextLink from 'next/link'

import { cn } from '@/components/cn'
import type { ShellFlashNews } from '@/utils/api'

/** PM contract: 32 characters, then a space and an ellipsis. */
function truncate(title: string) {
  return title.length > 32 ? `${title.slice(0, 32)} …` : title
}

const HOLD_MS = 6000
const TURN_MS = 1000

/**
 * The cube's edge. Faces sit half of it from the axis, and the cube is pushed
 * the same distance away again so the face in front lands on the z=0 plane:
 * left where it is, perspective would magnify it and it would spill out of the
 * row's gutter.
 */
const FACE_HEIGHT = 32
const HALF = FACE_HEIGHT / 2

type FlashNewsProps = {
  items: ShellFlashNews[]
}

/**
 * The label stays put; only the headline is a cube that rolls up a quarter
 * turn per item, the one in front tipping back as the one below replaces it.
 */
function FlashNews({ items }: FlashNewsProps) {
  const [index, setIndex] = useState(0)
  const [turning, setTurning] = useState(false)
  // Bumped on every manual advance so the auto interval restarts from the tap
  // rather than firing whatever was left of the previous hold.
  const [cycle, setCycle] = useState(0)
  // Only manual advances are announced. Autoplay stays silent so the strip does
  // not talk over the reader every few seconds.
  const [announcement, setAnnouncement] = useState('')
  const stripRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    setIndex(0)
    setTurning(false)
  }, [items])

  useEffect(() => {
    if (items.length <= 1) {
      return
    }

    const intervalId = window.setInterval(() => {
      // Let the strip answer for itself rather than mirroring pointer and
      // keyboard state into flags that can fall out of step. `:hover` only
      // counts on devices that really hover: touch browsers leave it stuck on
      // the last thing tapped, which would stop the strip for good.
      const hoverCapable = window.matchMedia('(hover: hover)').matches
      const restingOnStrip = hoverCapable
        ? ':hover, :focus-within'
        : ':focus-within'

      if (stripRef.current?.matches(restingOnStrip)) {
        return
      }
      setTurning(true)
    }, HOLD_MS)

    return () => window.clearInterval(intervalId)
  }, [cycle, items.length])

  useEffect(() => {
    if (!turning) {
      return
    }

    // Commit at the end of the turn and drop back to zero in the same render,
    // so the face now in front is the one the rotation just brought up.
    const timeoutId = window.setTimeout(() => {
      setIndex((currentIndex) => (currentIndex + 1) % items.length)
      setTurning(false)
    }, TURN_MS)

    return () => window.clearTimeout(timeoutId)
  }, [turning, items.length])

  function advance(event: MouseEvent<HTMLButtonElement>) {
    // Ignore taps mid-turn: the face the reader is aiming at is still moving.
    if (items.length <= 1 || turning) {
      return
    }

    // A tap parks focus on the button, and a touch browser keeps it there, so
    // `:focus-within` would hold the strip still for the rest of the visit.
    // Keyboard activation reports `detail === 0` and keeps its focus; a pointer
    // hands it back, and on desktop `:hover` still covers the pause.
    if (event.detail > 0) {
      event.currentTarget.blur()
    }

    // The face rolling in is the one the reader asked for, so it can be named
    // now rather than after the turn settles.
    setAnnouncement(truncate(items[(index + 1) % items.length].title))
    setCycle((currentCycle) => currentCycle + 1)
    setTurning(true)
  }

  const current = items[index]
  const incoming = items[(index + 1) % items.length]

  if (!current) {
    return <span aria-hidden="true" />
  }

  const faceClassName =
    'absolute inset-0 truncate rounded-mm-xs leading-8 backface-hidden outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mm-second-400'

  // One link per face: a single link around the cube would still point at the
  // item rotating away once the reader can see the one rotating in.
  return (
    <span
      className="flex min-w-0 flex-1 items-center font-mm-body text-mm-body-m"
      ref={stripRef}
    >
      <strong className="shrink-0 font-mm-sans">
        {/*
          The label doubles as the only manual control. Its visible text names
          the strip, so the accessible name has to spell out what tapping does.
        */}
        <button
          aria-label="看下一則快訊"
          className="rounded-mm-xs py-mm-s outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mm-second-400 enabled:cursor-pointer enabled:hover:underline enabled:hover:underline-offset-4"
          disabled={items.length <= 1}
          onClick={advance}
          type="button"
        >
          快訊
        </button>
        <span aria-hidden="true">｜</span>
      </strong>
      <span
        className="block min-w-0 flex-1 perspective-[400px]"
        style={{ height: FACE_HEIGHT }}
      >
        <span
          className={cn(
            'relative block h-full transform-3d',
            turning &&
              'transition-transform duration-1000 ease-in-out motion-reduce:transition-none'
          )}
          style={{
            transform: `translateZ(-${HALF}px) rotateX(${turning ? 90 : 0}deg)`,
          }}
        >
          <NextLink
            className={faceClassName}
            href={`/story/${current.slug}`}
            style={{ transform: `translateZ(${HALF}px)` }}
          >
            {truncate(current.title)}
          </NextLink>
          <NextLink
            aria-hidden="true"
            className={faceClassName}
            href={`/story/${incoming.slug}`}
            style={{ transform: `rotateX(-90deg) translateZ(${HALF}px)` }}
            tabIndex={-1}
          >
            {truncate(incoming.title)}
          </NextLink>
        </span>
      </span>
      <span aria-live="polite" className="sr-only">
        {announcement}
      </span>
    </span>
  )
}

export { FlashNews }
