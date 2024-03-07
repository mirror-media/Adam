const defaultDestination = '/section/member'
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
    return defaultDestination
  }
  if (Array.isArray(destination)) {
    const destinationString =
      destination.filter((path) => path)?.[0] ?? defaultDestination
    return destinationString
  }
  return destination
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
