import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { API_TIMEOUT } from '../config'
import {
  PROGRAMABLE_SEARCH_LIMIT_START,
  PROGRAMABLE_SEARCH_NUM,
} from '../utils/programmable-search/const'

export default function useSearchArticles({ items: initialArticles, queries }) {
  const [searchTerms] = useState(queries.request[0].exactTerms)
  const [startIndex, setStartIndex] = useState(1)
  const [hasMore, setHasMore] = useState(!!queries.nextPage)
  const [articles, setArticles] = useState(initialArticles)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function search(searchTerms, startIndex) {
      setIsLoading(true)
      try {
        const { data } = await axios({
          method: 'get',
          url: '/api/search',
          params: {
            exactTerms: searchTerms,
            startFrom: startIndex,
            takeAmount: PROGRAMABLE_SEARCH_NUM,
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

  const loadMore = useCallback(() => {
    if (hasMore) {
      setStartIndex((startIndex) => startIndex + PROGRAMABLE_SEARCH_NUM)
    }
  }, [hasMore])

  return { articles, loadMore, isLoading, hasMore }
}
