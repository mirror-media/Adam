import { GPT_MODE } from '../config/index.mjs'
import { SECTION_IDS } from '../constants'
import { GPT_AD_NETWORK, GPT_UNITS } from '../constants/ads'
import { mediaSize } from '../styles/media'

/**
 * Generate the width of the ad's wrapper div.
 * For GPT ads, there will be three types of adSize 'fixed', 'multi', 'fluid'.
 * Since we only use 'multi' type (ex: [[300, 250], [1, 1]]),
 * the adWidth caculation will use 'multi' type caclulatin directly.
 *
 * backup for AdSize type detection: https://github.com/mirror-media/mirror-media-nuxt/blob/0b0a82ed372b1a9e50827dff857eae4a1df3427c/plugins/gpt-ad/util.js#L1-L37
 * backup for AdWidth caculation: https://github.com/mirror-media/mirror-media-nuxt/blob/0b0a82ed372b1a9e50827dff857eae4a1df3427c/plugins/gpt-ad/index.vue#L56-L74
 * @param {googletag.SingleSizeArray[]} adSize
 * @returns {string}
 */
export function getAdWidth(adSize) {
  const widthMax = adSize.reduce((acc, curr) => Math.max(curr[0], acc), 0)
  return `${widthMax}px`
}

/**
 * @param {number} width
 * @returns {'PC' | 'MB'}
 */
function getDevice(width) {
  const isDesktopWidth = width >= mediaSize.xl
  return isDesktopWidth ? 'PC' : 'MB'
}

/**
 * Generate full key like 'PC_HD' if the component support dynamic device adKey like 'HD'
 * @param {'PC' | 'MB'} device
 * @param {string} adKey
 * @returns
 */
function getAdFullKey(device, adKey) {
  return adKey.includes('_') ? adKey : `${device}_${adKey}`
}

/**
 * @typedef {Object} GPTAdData - data hard code in GPT_UNITS
 * @property {string} adUnit - like 'mirror_m_oth_300x250_HD'
 * @property {googletag.SingleSizeArray[]} adSize - nested size array
 *
 * Get GPT_UNITS adData
 * @param {string} pageKey
 * @param {string} adKey
 * @param {number} width
 * @returns {GPTAdData | undefined}
 */
function getAdData(pageKey, adKey, width) {
  const device = getDevice(width)
  const adFullKey = getAdFullKey(device, adKey)
  const adData = GPT_UNITS[pageKey][adFullKey]
  if (!adData && pageKey !== SECTION_IDS.member) {
    console.error(
      `Unable to find the AD data. Got the pageKey "${pageKey}" and adKey "${adFullKey}". Please provide a vaild pageKey or adKey.`
    )
  }
  return adData
}

function getAdUnitPath(adUnit) {
  const processedAdUnit = GPT_MODE === 'dev' ? `test_${adUnit}` : adUnit
  return `/${GPT_AD_NETWORK}/${processedAdUnit}`
}

/**
 * Generate adSlot params for googletag.defineSlot.
 * @typedef {Object} GPTAdSlotParam
 * @property {string} adUnitPath - unit path follows the format /network-code/[parent-ad-unit-code/.../]ad-unit-code
 * @property {googletag.SingleSizeArray[]} adSize - for mirror-media we only use multi size type
 *
 * @param {string} pageKey - key to access GPT_UNITS first layer
 * @param {string} adKey - key to access GPT_UNITS second layer, might need to complete with device
 * @param {number} width - browser width
 * @returns {GPTAdSlotParam}
 */
export function getAdSlotParam(pageKey, adKey, width) {
  const adData = getAdData(pageKey, adKey, width)
  if (!adData) {
    return
  }
  const { adUnit, adSize } = adData
  const adUnitPath = getAdUnitPath(adUnit)
  return { adUnitPath, adSize }
}
