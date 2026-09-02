import { useEffect, useRef, useState } from 'react'

import { useBreakpoint } from '@/hooks/use-breakpoint'
import useWindowDimensions from '@/hooks/use-window-dimensions'

/**
 * 讓側邊欄捲到自己的下緣時釘在畫面底部。
 *
 * 用 `position: sticky` 搭配算出來的 `top`，值是「視窗高度減側邊欄高度再減底部留白」。
 * 側邊欄比視窗高的時候這是負值——負的 `top` 允許元素上緣超出畫面上方那麼多，效果等同
 * 於下緣貼齊視窗底部。
 *
 * `lg` 以下側邊欄不顯示，這裡回傳 `undefined`——沒有 `top` 的 sticky 不會作用，而且
 * 連 `ResizeObserver` 都不會建立。
 */
export function usePinnedAside() {
  const asideRef = useRef<HTMLElement>(null)
  const [asideHeight, setAsideHeight] = useState<number>()
  const { height, width } = useWindowDimensions()
  const lgBreakpoint = useBreakpoint('lg')

  const isPinnable =
    width !== undefined && lgBreakpoint !== undefined && width >= lgBreakpoint

  useEffect(() => {
    const aside = asideRef.current
    if (!aside || !isPinnable) {
      return
    }

    const measure = () => setAsideHeight(aside.offsetHeight)
    measure()

    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(aside)

    return () => resizeObserver.disconnect()
  }, [isPinnable])

  return {
    asideRef,
    top:
      isPinnable && height !== undefined && asideHeight !== undefined
        ? // 減掉的 20 是釘住時下緣與視窗底部之間留的空白。
          height - asideHeight - 20
        : undefined,
  }
}
