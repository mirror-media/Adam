import { useEffect, useState } from 'react'
import { SHARE_URL_FACEBOOK } from '../constants'

/**
 * @param {string} [url]
 * @returns {string}
 */
export function useShareFbUrl(url) {
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    setShareUrl(
      `${SHARE_URL_FACEBOOK}${encodeURIComponent(url || window.location.href)}`
    )
  }, [url])

  return shareUrl
}
