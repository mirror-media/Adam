import { useEffect } from 'react'

import { POP_IN_IDS } from '@/constants/ads'

export default function PopInAdInRelatedList({
  className,
}: {
  className?: string
}) {
  useEffect(() => {
    const popInScript = document.getElementById('pop-in-ad-script')
    if (!popInScript) {
      const script = document.createElement('script')
      script.async = true
      script.src =
        window.location.protocol + '//api.popin.cc/searchbox/mirrormedia_tw.js'
      script.id = 'pop-in-ad-script'
      document.head.appendChild(script)
    }

    return () => {
      popInScript?.remove()
    }
  }, [])
  return POP_IN_IDS.RELATED.map((popInId) => (
    <div key={popInId} id={popInId} className={className} />
  ))
}
