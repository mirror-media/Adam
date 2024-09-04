const defaultDestination = '/premiumsection/member'
import { useRouter } from 'next/router'
import { useCallback } from 'react'

/**
 *
 * @param {import('next/router').NextRouter} router
 * @returns {string}
 */
const getDestination = (router) => {
  const destination = router?.query?.destination

  if (!destination) {
    const url = new URL(window.location.origin)
    url.pathname = defaultDestination

    /** @type {[string, string][]} */
    const entries = []
    for (const [key, value] of Object.entries(router.query)) {
      if (Array.isArray(value)) {
        for (const v of value) {
          entries.push([key, v])
        }
      } else {
        entries.push([key, value])
      }
    }

    url.search = new URLSearchParams(entries).toString()

    return url.href
  }

  const queryParam = Object.assign({}, router.query)
  delete queryParam['destination']

  /** @type {string} */
  let destinationString

  if (Array.isArray(destination)) {
    destinationString =
      destination.filter((path) => path)?.[0] ?? defaultDestination
  } else {
    destinationString = destination === '/' ? defaultDestination : destination
  }

  return destinationString
}

export default function useRedirect() {
  const router = useRouter()

  const redirect = useCallback(() => {
    if (!router.isReady) {
      return
    }
    const destination = getDestination(router)

    // TODO: there are some prviledged pages under construction,
    // so we can't use router.replace
    window.location.replace(destination)
  }, [router])

  return { redirect }
}
