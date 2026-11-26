import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Script from 'next/script'

import { useReferrer } from '../context/referrer'

/**
 * Component for implement comScore script.
 *
 */
export default function ComScoreScript() {
  const router = useRouter()
  const getReferrer = useReferrer()

  // Sends the first pageview on mount and a virtual pageview on each client-side
  // navigation (comScore SPA guide). Shallow pushes (search keyword changes) are
  // not counted.
  useEffect(() => {
    const sendPageview = () => {
      const pageview = {
        c1: '2',
        c2: '24318560',
        c7: window.location.href,
        c8: document.title,
        c9: getReferrer(),
        // The SDK would read URL, title and referrer when it processes the
        // pageview, which for a queued one is after the user has moved on.
        // Capture them now instead. Must be booleans.
        options: {
          enableFirstPartyCookie: true,
          enableDocumentUrlCollection: false,
          enableDocumentTitleCollection: false,
          enableDocumentReferrerCollection: false,
        },
      }
      if (window.COMSCORE) {
        window.COMSCORE.beacon(pageview)
      } else {
        // beacon.js (lazyOnload) replays this queue once when it loads.
        ;(window._comscore = window._comscore || []).push(pageview)
      }
    }

    sendPageview()

    /** @param {string} _url @param {{ shallow: boolean }} options */
    const handleRouteChangeComplete = (_url, { shallow }) => {
      if (shallow) return
      sendPageview()
    }

    router.events.on('routeChangeComplete', handleRouteChangeComplete)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeComplete)
    }
  }, [router.events, getReferrer])

  return (
    <>
      <Script
        id="comScore"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            var _comscore = _comscore || [];
            (function() {
              var s = document.createElement("script"), el = document.getElementsByTagName("script")[0]; s.async = true;
              s.src = "https://sb.scorecardresearch.com/cs/24318560/beacon.js";
              el.parentNode.insertBefore(s, el);
            })();
          `,
        }}
      />
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<img src="https://sb.scorecardresearch.com/p?c1=2&amp;c2=24318560&amp;cv=3.9.1&amp;cj=1">`,
        }}
      />
    </>
  )
}
