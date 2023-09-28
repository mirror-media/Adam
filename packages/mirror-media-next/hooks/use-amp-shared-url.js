import { useRouter } from 'next/router'
import { SITE_URL } from '../config/index.mjs'
export default function useAmpSharedUrl(url = '') {
  const { asPath } = useRouter()

  const getSharedUrl = () => {
    let sharedUrl = url
    if (!sharedUrl) {
      const origin = `https://${SITE_URL}`
      const path = asPath
      sharedUrl = `${origin}${path}`
    }
    return `${encodeURIComponent(sharedUrl)}`
  }
  const sharedUrl = getSharedUrl()
  return sharedUrl
}
