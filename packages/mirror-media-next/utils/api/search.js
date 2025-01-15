/**
 * These functions should be used on server-side only
 */

import axios from 'axios'
import Redis from 'ioredis'
import { z } from 'zod'
import { API_TIMEOUT } from '../../config/index.mjs'
import { SEARCH_NUM } from '../../constants/search'

const {
  URL_SEARCH = '',
  REDIS_EX,
  REDIS_AUTH,
  REDIS_HOST = '',
  REDIS_DB = '0',
  REDIS_CONNECTION_TIMEOUT,
} = process.env

const MAX_SEARCH_AMOUNT = 100

const redisInstance = new Redis({
  host: REDIS_HOST,
  password: REDIS_AUTH,
  db: Number(REDIS_DB),
  lazyConnect: true,
  connectTimeout: Number(REDIS_CONNECTION_TIMEOUT) || 10000,
})

const searchQuerySchema = z.object({
  query: z.string().min(1),
  skip: z.number().int().min(1).max(MAX_SEARCH_AMOUNT).optional().default(1),
  take: z.number().int().min(1).optional().default(SEARCH_NUM),
})

/**
 * @typedef {Object} StructData
 * @property {string[]} [author]
 * @property {string[]} [datePublished]
 * @property {string[]} [dateModified]
 * @property {string[]} [page-type]
 * @property {string[]} [page-slug]
 * @property {string[]} [page-image]
 * @property {string[]} [section-slug]
 * @property {string[]} [section-name]
 * @property {string[]} [article-description]
 */

/**
 * @typedef {Object} DerivedStructData
 * @property {string} title
 * @property {string} link
 * @property {string} displayLink
 * @property {string} htmlTitle
 */

/**
 * @typedef {Object} Document
 * @property {string} id
 * @property {StructData} structData
 * @property {DerivedStructData} derivedStructData
 */

/**
 * @typedef {Object} Item
 * @property {string} id
 * @property {Document} document
 */

/**
 * @typedef {Object} SearchResult
 * @property {Item[]} results
 * @property {number} totalSize
 * @property {string} [nextPageToken]
 */

/**
 * @typedef {Object} Result
 * @property {boolean} success
 * @property {number} code
 * @property {Document[] | string} data
 */

/**
 * @param {z.infer<typeof searchQuerySchema>} opts
 * @returns {Promise<Result>}
 */
export async function getSearchResult(opts) {
  const { success, data, error } = searchQuerySchema.safeParse(opts)

  if (!success) {
    console.log(
      JSON.stringify({
        severity: 'NOTICE',
        message: 'Call `getSearchResult` with invalid arguments',
        debugPayload: {
          error: error.issues,
        },
      })
    )

    return {
      success: false,
      code: 400,
      data: 'call with invalid arguments',
    }
  }

  const { query } = data

  const prefix = 'VERTEX_AI_SEARCH'
  const redisKey = `${prefix}_${query}`

  /** @type {Document[]} */
  let documents = []
  let documentCount = documents.length

  const searchResultFromCache = await redisInstance.get(redisKey)

  if (searchResultFromCache) {
    console.log(
      JSON.stringify({
        severity: 'DEBUG',
        message: `Get search result from redis cache with key ${redisKey}`,
      })
    )
    documents = JSON.parse(searchResultFromCache)
    documentCount = documents.length
  } else {
    /** @type {string | undefined} */
    let nextPageToken
    do {
      try {
        /** @see https://cloud.google.com/generative-ai-app-builder/docs/reference/rest/v1/projects.locations.collections.engines.servingConfigs/searchLite */
        const requestBody = {
          query: query,
          pageSize: 50,
          pageToken: nextPageToken,
        }

        /**
         * @type {import('axios').AxiosResponse<SearchResult>}
         */
        const response = await axios.post(URL_SEARCH, requestBody, {
          timeout: API_TIMEOUT,
        })

        const resData = response.data
        nextPageToken = resData.nextPageToken
        const newDocuments = resData.results.map((item) => item.document)
        documents.push(...newDocuments)
        documentCount = documents.length
      } catch (error) {
        console.log(
          JSON.stringify({
            severity: 'ERROR',
            message: error.message,
            debugPayload: {
              stack: error.stack,
            },
          })
        )

        return {
          success: false,
          code: 500,
          data: 'encountered API error',
        }
      }
    } while (documentCount <= MAX_SEARCH_AMOUNT && nextPageToken)

    if (documentCount) {
      documents.sort((a, b) => {
        const dateA = new Date(a.structData.datePublished?.[0] ?? null)
        const dateB = new Date(b.structData.datePublished?.[0] ?? null)
        return dateB.valueOf() - dateA.valueOf()
      })
    }

    redisInstance.set(
      redisKey,
      JSON.stringify(documents),
      'EX',
      Number(REDIS_EX) || 3600
    )
  }

  /** @type {Document[]} */
  let result = []

  if (documents.length > 0) {
    const { skip, take } = data
    const start = skip - 1
    const end = start + take
    result = documents.slice(start, end)
  }

  return {
    success: true,
    code: 200,
    data: result,
  }
}
