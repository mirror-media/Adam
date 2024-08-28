import axios from 'axios'
import Redis from 'ioredis'
import { number, object, string } from 'yup'
import {
  URL_PROGRAMABLE_SEARCH,
  PROGRAMABLE_SEARCH_API_KEY,
  PROGRAMABLE_SEARCH_ENGINE_ID,
  API_TIMEOUT,
  REDIS_EX,
  REDIS_AUTH,
  READ_REDIS_HOST,
  WRITE_REDIS_HOST,
} from '../../config'
import { PROGRAMABLE_SEARCH_NUM } from '../programmable-search/const'

const readRedis = new Redis({ host: READ_REDIS_HOST, password: REDIS_AUTH })
const writeRedis = new Redis({ host: WRITE_REDIS_HOST, password: REDIS_AUTH })

const searchQuerySchema = object({
  exactTerms: string().required(),
  startFrom: number().optional().integer().positive().max(100).min(1),
  takeAmount: number()
    .optional()
    .integer()
    .default(PROGRAMABLE_SEARCH_NUM)
    .min(1),
})

export async function getSearchResult(query) {
  try {
    const params = await searchQuerySchema.validate(query, {
      stripUnknown: true,
    })

    const takeAmount = params.takeAmount || PROGRAMABLE_SEARCH_NUM
    const exactTerms = params.exactTerms || ''
    let startIndex = params.startFrom || 1

    let adjustedStart =
      Math.floor((startIndex - 1) / PROGRAMABLE_SEARCH_NUM) *
        PROGRAMABLE_SEARCH_NUM +
      1

    const endIndex =
      Math.ceil((startIndex + takeAmount - 1) / PROGRAMABLE_SEARCH_NUM) *
      PROGRAMABLE_SEARCH_NUM

    const fetchAmount = endIndex - adjustedStart + 1

    const originAdjustedStart = adjustedStart

    let combinedResponse

    const allItems = []

    while (allItems.length < fetchAmount && adjustedStart <= 100) {
      const queryParams = {
        key: PROGRAMABLE_SEARCH_API_KEY,
        cx: PROGRAMABLE_SEARCH_ENGINE_ID,
        exactTerms: exactTerms,
        start: adjustedStart,
        num: PROGRAMABLE_SEARCH_NUM,
        sort: ' ,date:s',
      }

      const prefix = 'PROGRAMABLE_SEARCH-3.1'
      const redisKey = `${prefix}_${exactTerms}_${adjustedStart}_${PROGRAMABLE_SEARCH_NUM}}`
      const searchResultCache = await readRedis.get(redisKey)

      if (searchResultCache) {
        console.log(
          JSON.stringify({
            severity: 'DEBUG',
            message: `Get search result from redis cache with key ${redisKey}`,
          })
        )
        const cachedResponse = JSON.parse(searchResultCache)
        if (!combinedResponse) {
          combinedResponse = cachedResponse
        }
        if (cachedResponse?.items) {
          allItems.push(...cachedResponse.items)
        }
      } else {
        let resData = {}
        try {
          const response = await axios({
            method: 'get',
            url: `${URL_PROGRAMABLE_SEARCH}`,
            params: queryParams,
            timeout: API_TIMEOUT,
          })
          resData = response?.data
          writeRedis.set(redisKey, JSON.stringify(resData), 'EX', REDIS_EX)
          if (!combinedResponse) {
            combinedResponse = resData
          }
          if (resData.items) {
            allItems.push(...resData.items)
          }
        } catch (error) {
          console.log(
            JSON.stringify({ severity: 'ERROR', message: error.stack })
          )
        }

        if (resData?.queries?.nextPage === undefined) {
          break
        }
      }

      // 更新開始索引，搜尋下一批結果
      adjustedStart += PROGRAMABLE_SEARCH_NUM
    }

    const sliceStartIndex = startIndex - originAdjustedStart
    const sliceEndIndex = sliceStartIndex + takeAmount
    if (combinedResponse) {
      combinedResponse.items = allItems?.slice(sliceStartIndex, sliceEndIndex)
    }

    return {
      data: combinedResponse,
    }
  } catch (error) {
    console.log(JSON.stringify({ severity: 'ERROR', message: error.stack }))
    return error.message
  }
}
