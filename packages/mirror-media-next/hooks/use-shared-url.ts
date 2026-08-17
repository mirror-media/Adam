import { useEffect, useState } from 'react'

export default function useSharedUrl(url = '') {
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    const sharedUrl = url ? url : window.location.href
    setShareUrl(`${sharedUrl}`)
  }, [url])
  return shareUrl
}
