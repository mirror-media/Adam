import { useEffect, useState } from 'react'
import { SHARE_URL_LINE } from '../constants'

/**
 * @param {string} [url]
 * @returns {string}
 */
export function useShareLineUrl(url) {
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    setShareUrl(
      `${SHARE_URL_LINE}${encodeURIComponent(url || window.location.href)}`
    )
  }, [url])

  return shareUrl
}
