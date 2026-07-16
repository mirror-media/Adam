/**
 * These functions should be used on server-side only
 */

import type { AxiosResponse } from 'axios'
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

export type StructData = {
  author?: string[]
  datePublished?: string[]
  dateModified?: string[]
  'page-type'?: string[]
  'page-slug'?: string[]
  'page-image'?: string[]
  'section-slug'?: string[]
  'section-name'?: string[]
  'article-description'?: string[]
}

export type DerivedStructData = {
  title: string
  link: string
  displayLink: string
  htmlTitle: string
}

export type Document = {
  id: string
  structData?: StructData
  derivedStructData?: DerivedStructData
}

type Item = {
  id: string
  document: Document
}

type SearchResult = {
  results: Item[]
  totalSize: number
  nextPageToken?: string
}

type Result = {
  success: boolean
  code: number
  data: Document[] | string
}

type SearchQuery = z.input<typeof searchQuerySchema>

const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String(error.message)
  }
  return String(error)
}

const getErrorStack = (error: unknown): unknown => {
  if (typeof error === 'object' && error !== null && 'stack' in error) {
    return error.stack
  }
  return undefined
}

export async function getSearchResult(opts: SearchQuery): Promise<Result> {
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
    let nextPageToken: string | undefined
    do {
      try {
        /** @see https://cloud.google.com/generative-ai-app-builder/docs/reference/rest/v1/projects.locations.collections.engines.servingConfigs/searchLite */
        const requestBody = {
          query: query,
          pageSize: 50,
          pageToken: nextPageToken,
        }

        const response: AxiosResponse<SearchResult> = await axios.post(
          URL_SEARCH,
          requestBody,
          {
            timeout: API_TIMEOUT,
          }
        )

        const resData = response.data
        nextPageToken = resData.nextPageToken
        const newDocuments = resData.results.map((item) => item.document)
        documents.push(...newDocuments)
        documentCount = documents.length
      } catch (error) {
        console.log(
          JSON.stringify({
            severity: 'ERROR',
            message: getErrorMessage(error),
            debugPayload: {
              stack: getErrorStack(error),
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
      documents.forEach((item) => {
        if (!Object.hasOwnProperty.call(item, 'structData')) {
          console.log(
            JSON.stringify({
              severity: 'DEBUG',
              message: `item (id: ${item.id}) doesn't have \`structData\``,
              debugPayload: {
                item,
              },
            })
          )
        }

        if (!Object.hasOwnProperty.call(item, 'derivedStructData')) {
          console.log(
            JSON.stringify({
              severity: 'DEBUG',
              message: `item (id: ${item.id}) doesn't have \`derivedStructData\``,
              debugPayload: {
                item,
              },
            })
          )
        }
      })

      documents.sort((a, b) => {
        const dateA = new Date(a.structData?.datePublished?.[0] ?? 0)
        const dateB = new Date(b.structData?.datePublished?.[0] ?? 0)
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

  let result: Document[] = []

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
