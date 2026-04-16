import errors from '@twreporter/errors'
import client from '../../apollo/apollo-client.js'
import axiosInstance from '../../axios/index.js'
import {
  URL_STATIC_HEADER_HEADERS,
  URL_STATIC_PREMIUM_SECTIONS,
  URL_STATIC_TOPICS,
} from '../../config/index.mjs'
import { DEFAULT_ANNOUNCEMENT_SCOPE } from '../../constants/announcement'
import { fetchAnnoucements } from '../../apollo/query/announcements'

/**
 * @typedef {Object} Category
 * @property {string} id
 * @property {string} slug
 * @property {string} name
 * @property {boolean} isMemberOnly
 */
/**
 * @typedef {import('../../apollo/query/topics').Topic[]} Topics
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
 * @typedef {Object} postsInColumnSection
 * @property {'external' | 'story'} type
 * @property {string} id
 * @property {string} title
 * @property {string} slug
 * @property {string} publishedDate
 * @property {string | null} [heroImage]
 * @property {string | null} [og_image]
 * @property {Array} [apiData]
 * @property {Array<Object>} [apiDataBrief]
 * @property {string} [thumb]
 * @property {string} [content]
 * @property {string} [brief]
 */

/**
 * @typedef {Object} ColumnSectionResponse
 * @property {Object} section
 * @property {postsInColumnSection[]} section.items
 * @property {Object} section.counts
 * @property {number} section.counts.posts
 * @property {number} section.counts.externals
 */

/**
 * @typedef { (HeadersDataSection | HeadersDataCategory)[]} HeadersData
 */
/**
 * Fetches static JSON by URL. Tries local GCS FUSE first (server-side), then falls back to HTTP via axios.
 * Returns `{ data }` where `data` is the parsed JSON body — callers should narrow the type at their own usage site.
 * @param {string} requestUrl - The URL to send the request to.
 * @param {import('axios').AxiosRequestConfig} [requestConfig]
 * @returns {Promise<{ data: any }>}
 */
const fetchStaticJsonByUrl = async (requestUrl, requestConfig) => {
  if (typeof window === 'undefined') {
    try {
      const mod = await import('../server-side-only/fetch-static-json.js')
      const res = await mod.fetchStaticJson(requestUrl)
      // Note: fetchStaticJson internally logs whether it's from GCS mount or HTTP
      // fetchStaticJson returns { data: ... } format
      return res
    } catch (err) {
      console.warn('[static-json] fallback to axios', err)
      // Continue to fall through to unified axios fallback below
    }
  }
  const axiosRes = await axiosInstance(requestUrl, requestConfig)
  return { data: axiosRes?.data }
}

const errorLogger = (errorMessage) => {
  const annotatingAxiosError = errors.helpers.annotateAxiosError(errorMessage)
  //WORKAROUND: print error in here. Should print in place where fetch function used, such as category/[slug]
  console.log(
    JSON.stringify({
      severity: 'WARNING',
      message: errors.helpers.printAll(
        annotatingAxiosError,
        {
          withStack: true,
          withPayload: true,
        },
        0,
        0
      ),
    })
  )

  throw annotatingAxiosError
}

const fetchHeaderDataInDefaultPageLayout = async () => {
  /** @type {HeadersData} */
  let sectionsData = []
  /** @type {Topics} */
  let topicsData = []

  try {
    const responses = await Promise.allSettled([
      fetchStaticJsonByUrl(URL_STATIC_HEADER_HEADERS),
      fetchStaticJsonByUrl(URL_STATIC_TOPICS),
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
    const response = await fetchStaticJsonByUrl(URL_STATIC_PREMIUM_SECTIONS)
    if (response?.data?.sections) {
      sectionsData = response?.data?.sections
    }
    return { sectionsData }
  } catch (err) {
    errorLogger(err)
  }
}

/**
 * fetch announcements filtered by input scope array
 *
 * @typedef {import('../../apollo/query/announcements').Announcement} Announcement
 * @typedef {import('@apollo/client').ApolloQueryResult<{ announcements: Announcement[] }>} AnnouncementQueryResult
 *
 * @param {import('../../constants/announcement').AnnouncementScopeValue[]} [scope]
 * @returns {Promise<AnnouncementQueryResult>}
 */
const fetchAnnoucementsByScope = (scope) => {
  if (
    Array.isArray(scope) &&
    scope.includes(DEFAULT_ANNOUNCEMENT_SCOPE) === false
  ) {
    scope.unshift(DEFAULT_ANNOUNCEMENT_SCOPE)
  }

  return client.query({
    query: fetchAnnoucements,
    variables: {
      scope,
    },
  })
}

export {
  fetchStaticJsonByUrl,
  fetchHeaderDataInDefaultPageLayout,
  fetchHeaderDataInPremiumPageLayout,
  fetchAnnoucementsByScope,
}
