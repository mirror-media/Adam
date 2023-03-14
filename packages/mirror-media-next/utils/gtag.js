// https://github.com/codler/react-ga4#readme
import ga4 from 'react-ga4'
import { GA_TRACKING_ID } from '../config/index.mjs'

const init = () => {
  ga4.initialize([
    {
      trackingId: GA_TRACKING_ID,
    },
  ])
}

/**
 *
 * @param {string} category
 * @param {string} action
 * @param {string} label
 * @param {number} [value]
 */
const sendEvent = (category, action, label, value = undefined) => {
  if (value) {
    ga4.event({
      category,
      action,
      label,
      value,
    })
  } else {
    ga4.event({
      category,
      action,
      label,
    })
  }
}

export { init, sendEvent }
