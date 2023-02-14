import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { API_TIMEOUT } from '../config'
import {
  PROGRAMABLE_SEARCH_LIMIT_START,
  PROGRAMABLE_SEARCH_NUM,
} from '../utils/programmable-search/const'
import { logGAEvent } from '../utils/programmable-search/analytics'

export default function useSearchArticles({ items: initialArticles, queries }) {
  const [searchTerms] = useState(queries.request[0].exactTerms)
  const [startIndex, setStartIndex] = useState(1)
  const [hasMore, setHasMore] = useState(!!queries.nextPage)
  const [articles, setArticles] = useState(initialArticles)
  const [isLoading, setIsLoading] = useState(false)
  const [loadMoreTimes, setLoadMoreTimes] = useState(0)

  useEffect(() => {
    async function search(searchTerms, startIndex) {
      setIsLoading(true)
      try {
        const { data } = await axios({
          method: 'get',
          url: '/api/search',
          params: {
            exactTerms: searchTerms,
            start: startIndex,
          },
          timeout: API_TIMEOUT,
        })
        if (data) {
          const { queries, items } = data
          const hasMore =
            !!queries.nextPage &&
            startIndex !== PROGRAMABLE_SEARCH_LIMIT_START &&
            data.queries.request[0].count
          setHasMore(hasMore)

          setArticles((oldArticles) => {
            // since programmable search may return duplicate result in different page, filter it out.
            const newArticles = items.filter(
              (article) =>
                !oldArticles.find(
                  (oldArticle) => oldArticle.title === article.title
                )
            )
            return [...oldArticles, ...newArticles]
          })
        }
      } catch (error) {
        if (startIndex === PROGRAMABLE_SEARCH_LIMIT_START) {
          setHasMore(false)
        }
        console.error(error)
      }
      setIsLoading(false)
    }
    if (hasMore && startIndex !== 1) {
      search(searchTerms, startIndex)
    }
  }, [hasMore, searchTerms, startIndex])

  useEffect(() => {
    if (loadMoreTimes) {
      logGAEvent('scroll', `${searchTerms}-loadmore-${loadMoreTimes}`)
    }
  }, [loadMoreTimes, searchTerms])

  const loadMore = useCallback(() => {
    if (hasMore) {
      setStartIndex((startIndex) => startIndex + PROGRAMABLE_SEARCH_NUM)
      setLoadMoreTimes((prev) => {
        return prev + 1
      })
    }
  }, [hasMore])

  return { articles, loadMore, isLoading, hasMore }
}
