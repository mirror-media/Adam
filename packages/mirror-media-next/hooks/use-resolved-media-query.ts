import { useEffect, useState } from 'react'

export type ResolvedMediaMatch = boolean | null

/**
 * Keeps the unresolved state distinct from a real non-match so ad code does
 * not request a fallback unit before the browser has resolved the viewport.
 * Callers use stable media-query constants.
 */
export function useResolvedMediaQuery(query: string): ResolvedMediaMatch {
  const [matches, setMatches] = useState<ResolvedMediaMatch>(null)

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query)
    const updateMatches = () => {
      setMatches(mediaQueryList.matches)
    }

    updateMatches()
    mediaQueryList.addEventListener('change', updateMatches)

    return () => mediaQueryList.removeEventListener('change', updateMatches)
  }, [query])

  return matches
}
