import useFirstScrollDetector from '../../../hooks/useFirstScrollDetector.js'

import GPTAd from './gpt-ad.js'

/**
 * @typedef {function(googletag.events.SlotRequestedEvent):void} GoogleTagEventHandler
 *
 * @param {Object} props
 * @param {string} [props.pageKey] - key to access GPT_UNITS first layer
 * @param {string} [props.className] - for styled-component method to add styles
 * @returns
 */
export default function GPTMbStAd({ pageKey, className }) {
  const hasScrolled = useFirstScrollDetector()

  return (
    hasScrolled && (
      <GPTAd pageKey={pageKey} adKey="MB_ST" className={className} />
    )
  )
}
