import type { MouseEvent } from 'react'
import { useEffect, useState } from 'react'
import { ChevronUpIcon } from 'lucide-react'

import { cn } from '@/components/cn'

function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let frame = 0

    const read = () => {
      frame = 0
      // One viewport means the same thing on every screen: the reader has left
      // the first one. Pages under two viewports tall never scroll this far.
      const threshold = window.innerHeight
      setVisible(window.scrollY > threshold)
    }

    const onScroll = () => {
      if (frame) {
        return
      }
      frame = window.requestAnimationFrame(read)
    }

    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) {
        window.cancelAnimationFrame(frame)
      }
    }
  }, [])

  function scrollToTop(event: MouseEvent<HTMLButtonElement>) {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })

    // The button hides itself once the page reaches the top, so keyboard and
    // assistive-technology focus has to be moved somewhere real. `blur()` alone
    // leaves the sequential navigation point at the end of the document in some
    // engines, so hand focus to the header the way a skip link would: borrow a
    // tabindex, focus it without fighting the smooth scroll, and give it back.
    const header = document.querySelector<HTMLElement>(
      '[data-slot="site-header"]'
    )

    if (!header) {
      event.currentTarget.blur()
      return
    }

    header.setAttribute('tabindex', '-1')
    header.addEventListener('blur', () => header.removeAttribute('tabindex'), {
      once: true,
    })
    header.focus({ preventScroll: true })
  }

  return (
    <button
      aria-label="回到頁首"
      className={cn(
        // z-2400 sits above the content and the sticky header, and below the
        // shell overlay, popover and ad layers. A corner ad covering this is
        // accepted: the button never hides anything else.
        'fixed right-mm-xl bottom-mm-xl z-2400 flex size-11 items-center justify-center rounded-mm-full border border-mm-neutral-300 bg-mm-neutral-0 text-mm-base-500 shadow-lg transition duration-200 outline-none hover:border-mm-neutral-0 hover:bg-mm-base-700 hover:text-mm-neutral-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mm-second-500',
        // `invisible` also takes it out of the tab order while it is hidden.
        !visible && 'invisible translate-y-mm-m opacity-0'
      )}
      data-slot="back-to-top"
      onClick={scrollToTop}
      type="button"
    >
      {/*
        The glyph is geometrically centred, but an upward chevron carries its
        weight in the two lower arms and reads a shade low, so nudge it up.
      */}
      <ChevronUpIcon aria-hidden="true" className="size-7 -translate-y-px" />
    </button>
  )
}

export { BackToTop }
