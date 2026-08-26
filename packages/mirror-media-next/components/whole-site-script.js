import { useEffect, useState } from 'react'

import { useDisplayAd } from '../hooks/useDisplayAd'

import AvividScript from './ads/avivid/avivid-script'
import GPTScript from './ads/gpt/gpt-script'
import ComScoreScript from './comscore-script'
export default function WholeSiteScript() {
  const { shouldShowAd } = useDisplayAd()
  const [canLoadAvivid, setCanLoadAvivid] = useState(false)

  useEffect(() => {
    const { hostname } = window.location
    const isLoopbackHost =
      hostname === 'localhost' ||
      hostname.endsWith('.localhost') ||
      hostname.startsWith('127.') ||
      hostname === '[::1]'

    setCanLoadAvivid(!isLoopbackHost)
  }, [])

  const shouldLoadAvivid = shouldShowAd && canLoadAvivid

  return (
    <>
      {shouldShowAd && <GPTScript />}
      {shouldLoadAvivid && <AvividScript />}
      <ComScoreScript />
    </>
  )
}
