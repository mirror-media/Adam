import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

type StickyOffsets = { compact: number; desktop: number }

type StickyHeaderContextValue = {
  showStickyControls: boolean
  // Scroll position at which the header collapses on the current breakpoint.
  stickyOffset: number
}

const StickyHeaderContext = createContext<StickyHeaderContextValue>({
  showStickyControls: false,
  stickyOffset: 0,
})

const StickyHeaderDispatchContext = createContext<
  Dispatch<SetStateAction<StickyOffsets>>
>(() => {})

function StickyHeaderProvider({ children }: { children: ReactNode }) {
  const [showStickyControls, setShowStickyControls] = useState(false)
  const [stickyOffset, setStickyOffset] = useState(0)
  const [stickyOffsets, setStickyOffsets] = useState<StickyOffsets>({
    compact: 0,
    desktop: 0,
  })

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)')

    function updateStickyState() {
      const offset = desktop.matches
        ? stickyOffsets.desktop
        : stickyOffsets.compact
      setStickyOffset(offset)
      setShowStickyControls(window.scrollY >= offset)
    }

    updateStickyState()
    window.addEventListener('scroll', updateStickyState, { passive: true })
    desktop.addEventListener('change', updateStickyState)
    return () => {
      window.removeEventListener('scroll', updateStickyState)
      desktop.removeEventListener('change', updateStickyState)
    }
  }, [stickyOffsets])

  return (
    <StickyHeaderDispatchContext.Provider value={setStickyOffsets}>
      <StickyHeaderContext.Provider
        value={{ showStickyControls, stickyOffset }}
      >
        {children}
      </StickyHeaderContext.Provider>
    </StickyHeaderDispatchContext.Provider>
  )
}

function useStickyHeader() {
  return useContext(StickyHeaderContext)
}

function useSetStickyOffsets() {
  return useContext(StickyHeaderDispatchContext)
}

export { StickyHeaderProvider, useSetStickyOffsets, useStickyHeader }
