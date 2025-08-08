import { MISO_API_KEY } from '../config/index.mjs'

/**
 * @param {string} endpoint
 * @returns {URL}
 */
const buildMisoUrl = (endpoint) => {
  const url = new URL(endpoint)
  url.searchParams.set('api_key', MISO_API_KEY)
  return url
}

/**
 * @param {string} storyId
 * @param {string} storyType
 * @returns {string}
 */
const formatStoryId = (storyId, storyType) => {
  return storyId.startsWith('mirrormedia')
    ? storyId
    : `mirrormedia_${storyType}_${storyId}`
}

/**
 * @param {URL} url
 * @param {object} body
 * @returns {Promise<Response>}
 */
const misoFetch = async (url, body) => {
  return fetch(url.toString(), {
    method: body ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(body && { body: JSON.stringify(body) }),
    cache: 'no-cache',
  })
}

export { buildMisoUrl, formatStoryId, misoFetch }
