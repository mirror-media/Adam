import { useEffect, useState } from 'react'

/**
 * @param {string} [url] - url need to be shared. Optional, value will be current page url if not assigned
 * @returns {string}
 */
export default function useSharedUrl(url = '') {
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    const sharedUrl = url ? url : window.location.href

    setShareUrl(`${encodeURIComponent(sharedUrl)}`)
  }, [url])
  return shareUrl
}
