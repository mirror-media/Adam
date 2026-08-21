import { useCallback } from 'react'

/**
 * Horizontal strips in the shell hide their scrollbar so the row keeps its
 * height and touch devices swipe as usual. That leaves a mouse with no way to
 * reach the overflow, since a wheel only scrolls vertically, so translate
 * vertical wheel input into horizontal scrolling.
 *
 * The handler stays out of the way unless the strip actually overflows and the
 * gesture is predominantly vertical, otherwise hovering the row would swallow
 * ordinary page scrolling.
 *
 * Returns a ref callback rather than taking a ref object: strips inside the
 * mobile sheet only exist while it is open, and an effect reading a ref runs
 * before that node is ever attached.
 */
function useHorizontalWheelScroll() {
  return useCallback((node: HTMLElement | null) => {
    if (!node) {
      return
    }

    function handleWheel(event: WheelEvent) {
      const strip = event.currentTarget as HTMLElement

      if (
        strip.scrollWidth <= strip.clientWidth ||
        event.deltaY === 0 ||
        Math.abs(event.deltaY) <= Math.abs(event.deltaX)
      ) {
        return
      }

      event.preventDefault()
      strip.scrollLeft += event.deltaY
    }

    node.addEventListener('wheel', handleWheel, { passive: false })
    return () => node.removeEventListener('wheel', handleWheel)
  }, [])
}

export { useHorizontalWheelScroll }
