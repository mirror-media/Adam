const defaultDestination = '/section/member'
import { useRouter } from 'next/router'
import { useCallback } from 'react'

/**
 *
 * @param {import('next/router').NextRouter} router
 * @returns {import('next/link').LinkProps['href']}
 */
const getDestination = (router) => {
  const destination = router?.query?.destination
  if (!destination) {
    return {
      pathname: defaultDestination,
      query: router.query,
    }
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

  return {
    pathname: destinationString,
    query: queryParam,
  }
}

export default function useRedirect() {
  const router = useRouter()

  const redirect = useCallback(() => {
    if (!router.isReady) {
      return
    }
    const destination = getDestination(router)

    router.replace(destination)
  }, [router])

  return { redirect }
}
