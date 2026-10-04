import { useEffect, useState } from 'react'

/**
 * Unlike `useWindowDimensions`, which re-renders every consumer on every
 * `resize` pixel, this only re-renders when the media query's boolean
 * result actually flips.
 */
export default function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query)
    setMatches(mediaQueryList.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    mediaQueryList.addEventListener('change', handleChange)
    return () => mediaQueryList.removeEventListener('change', handleChange)
  }, [query])

  return matches
}
