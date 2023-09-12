import errors from '@twreporter/errors'
import {
  URL_STATIC_PREMIUM_SECTIONS,
  URL_STATIC_TOPICS,
  URL_STATIC_HEADER_HEADERS,
} from '../../config/index.mjs'
import axiosInstance from '../../axios/index.js'

/**
 * @typedef {Object} Category
 * @property {string} id
 * @property {string} slug
 * @property {string} name
 * @property {boolean} isMemberOnly
 */
/**
 * @typedef {import('../../apollo/fragments/topic.js').Topic[]} Topics
 */

/**
 * @typedef {Object} CategoryInHeadersDataSection
 * @property {string} id
 * @property {string} slug
 * @property {string} name
 * @property {boolean} isMemberOnly
 */

/**
 * @typedef {Object} HeadersDataSection
 * @property {number} order
 * @property {'section'} type
 * @property {string} slug
 * @property {string} name
 * @property {CategoryInHeadersDataSection[]} categories
 */

/**
 * @typedef {Object} HeadersDataCategory
 * @property {number} order
 * @property {'category'} type
 * @property {string} slug
 * @property {string} name
 * @property {boolean} isMemberOnly
 * @property {string[]} sections
 *
 */

/**
 * @typedef { (HeadersDataSection | HeadersDataCategory)[]} HeadersData
 */
/**
 * Creates an Axios request function that sends a GET request to the specified URL with a timeout.
 * @param {string} requestUrl - The URL to send the request to.
 */
const createAxiosRequest = (requestUrl) => {
  return () => axiosInstance(requestUrl)
}

const errorLogger = (errorMessage) => {
  const annotatingAxiosError = errors.helpers.annotateAxiosError(errorMessage)
  throw annotatingAxiosError
}

/** @type {() => Promise<import('axios').AxiosResponse<{headers: HeadersData}>>} */
const fetchNormalSections = createAxiosRequest(URL_STATIC_HEADER_HEADERS)

/** @type {() => Promise<import('axios').AxiosResponse<{topics: Topics}>>} */
const fetchTopics = createAxiosRequest(URL_STATIC_TOPICS)

const fetchPremiumSections = createAxiosRequest(URL_STATIC_PREMIUM_SECTIONS)

const fetchHeaderDataInDefaultPageLayout = async () => {
  /** @type {HeadersData} */
  let sectionsData = []
  /** @type {Topics} */
  let topicsData = []
  try {
    const responses = await Promise.allSettled([
      fetchNormalSections(),
      fetchTopics(),
    ])

    const sectionsResponse = responses[0].status === 'fulfilled' && responses[0]
    sectionsData = Array.isArray(sectionsResponse?.value?.data?.headers)
      ? sectionsResponse?.value?.data?.headers
      : []

    const topicsResponse = responses[1].status === 'fulfilled' && responses[1]
    topicsData = Array.isArray(topicsResponse?.value?.data?.topics)
      ? topicsResponse?.value?.data?.topics
      : []

    return { sectionsData, topicsData }
  } catch (err) {
    errorLogger(err)
  }
}

const fetchHeaderDataInPremiumPageLayout = async () => {
  let sectionsData = []
  try {
    const response = await fetchPremiumSections()
    if (response?.data?.sections) {
      sectionsData = response?.data?.sections
    }
    return { sectionsData }
  } catch (err) {
    errorLogger(err)
  }
}
export {
  fetchHeaderDataInDefaultPageLayout,
  fetchHeaderDataInPremiumPageLayout,
}
