import { useEffect, useState } from 'react'
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

  useEffect(() => {
    setIndex(0)
    setTurning(false)
  }, [items])

  useEffect(() => {
    if (items.length <= 1) {
      return
    }

    const intervalId = window.setInterval(() => setTurning(true), HOLD_MS)
    return () => window.clearInterval(intervalId)
  }, [items.length])

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
    <span className="flex min-w-0 flex-1 items-center font-mm-body text-mm-body-m">
      <strong className="shrink-0 font-mm-sans">快訊｜</strong>
      <span
        className="block min-w-0 flex-1 [perspective:400px]"
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
    </span>
  )
}

export { FlashNews }
