import { MICRO_AD_UNITS } from '../constants/ads'

/**
 * Determining whether to insert a `Micro` advertisement after a specific post index.
 *
 * @param {number} index
 * @returns {boolean}
 */
const needInsertMicroAdAfter = (index = 0) => {
  if (typeof index !== 'number') {
    return false
  }

  return index === 1 || index === 3 || index === 5
}

/**
 * @typedef {'HOME' | 'LISTING' | 'STORY' } MicroAdType
 */
/**
 * @typedef {'PC' | 'MB' | 'RWD' } Device
 */

/**
 * Determining which Micro advertisement ID to take based on the `index`.
 *
 * @param {number} index
 * @param {MicroAdType} microAdType
 * @param {Device} device
 * @returns {string | null}
 */
const getMicroAdUnitId = (
  index = 0,
  microAdType = 'LISTING',
  device = 'RWD'
) => {
  let unitId = null

  if (typeof index !== 'number') {
    return null
  }

  if (microAdType === 'LISTING') {
    const unitIndex = Math.floor((index - 1) / 2)
    unitId = MICRO_AD_UNITS.LISTING[device][unitIndex]?.id || null
  } else if (microAdType === 'HOME') {
    const unitIndex = Math.floor((index - 1) / 2)
    unitId = MICRO_AD_UNITS.HOME[device][unitIndex]?.id || null
  }

  return unitId
}

export { needInsertMicroAdAfter, getMicroAdUnitId }
