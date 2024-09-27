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

const MAX_SEARCH_AMOUNT = 100

const readRedis = new Redis({ host: READ_REDIS_HOST, password: REDIS_AUTH })
const writeRedis = new Redis({ host: WRITE_REDIS_HOST, password: REDIS_AUTH })

const searchQuerySchema = object({
  exactTerms: string().required(),
})

export async function getSearchResultAllAndSorted(query) {
  try {
    const params = await searchQuerySchema.validate(query, {
      stripUnknown: true,
    })

    let { exactTerms = '' } = params

    const prefix = 'PROGRAMABLE_SEARCH_ALL-2'
    const redisKey = `${prefix}_${exactTerms}`
    const searchResultCache = await readRedis.get(redisKey)

    if (searchResultCache) {
      console.log(
        JSON.stringify({
          severity: 'DEBUG',
          message: `Get search result from redis cache with key ${redisKey} 100 posts and sorted`,
        })
      )
      const cachedResponse = JSON.parse(searchResultCache)
      return { data: cachedResponse }
    }

    let combinedResponse
    let hasMoreData = true
    let start = 0

    while (start <= MAX_SEARCH_AMOUNT || hasMoreData) {
      const queryParams = {
        key: PROGRAMABLE_SEARCH_API_KEY,
        cx: PROGRAMABLE_SEARCH_ENGINE_ID,
        exactTerms: exactTerms,
        start,
        num: PROGRAMABLE_SEARCH_NUM,
        sort: ' ,date:s',
      }

      let resData = {}
      try {
        const response = await axios({
          method: 'get',
          url: URL_PROGRAMABLE_SEARCH,
          params: queryParams,
          timeout: API_TIMEOUT,
        })
        resData = response.data

        if (!combinedResponse) {
          combinedResponse = resData
        } else if (
          Array.isArray(combinedResponse.items) &&
          Array.isArray(resData?.items)
        ) {
          combinedResponse.items.push(...resData.items)
        }
      } catch (error) {
        console.log(JSON.stringify({ severity: 'ERROR', message: error.stack }))
      }

      if (resData?.queries?.nextPage === undefined) {
        hasMoreData = false
      }

      // 更新開始索引，搜尋下一批結果
      start += PROGRAMABLE_SEARCH_NUM
    }

    combinedResponse.items?.sort((a, b) => {
      const dateA = new Date(
        a?.pagemap?.metatags?.[0]?.['article:published_time']
      )
      const dateB = new Date(
        b?.pagemap?.metatags?.[0]?.['article:published_time']
      )
      return dateB - dateA
    })

    writeRedis.set(redisKey, JSON.stringify(combinedResponse), 'EX', REDIS_EX)

    return {
      data: combinedResponse,
    }
  } catch (error) {
    console.log(JSON.stringify({ severity: 'ERROR', message: error.stack }))
    return error.message
  }
}
