import { useEffect } from 'react'

/**
 * This is the base component to set id for Pop In script to insert HTML.
 * Wrap this component by levarge the styled-components function [styling any component](https://styled-components.com/docs/basics#styling-any-component)
 * to maintain Pop In's ad as separate component.
 * Check ~/components/ads/pop-in/pop-in-ad-in-related-list.js for the example.
 * @param {Object} props
 * @param {string} props.popInId - Pop In id to connect to Pop In script
 * @param {string} [props.className] - styled-components property to set style for a React Component
 * @returns {React.ReactElement}
 */
export default function PopInAd({ popInId, className }) {
  useEffect(() => {
    /** @type {HTMLScriptElement | null} */
    let popInScript = document.querySelector('script#pop-in-ad-script')
    if (!popInScript) {
      popInScript = document.createElement('script')
      popInScript.async = true
      popInScript.src =
        window.location.protocol + '//api.popin.cc/searchbox/mirrormedia_tw.js'
      popInScript.id = 'pop-in-ad-script'
      document.head.appendChild(popInScript)
    }

    return () => {
      popInScript?.remove()
    }
  }, [])
  return <div className={className} id={popInId} />
}
