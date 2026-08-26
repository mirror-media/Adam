import { useEffect, useState } from 'react'

import { fetchPopularArticles } from '../aside-data'
import type { AsideArticle } from '../aside-types'

import { AsideArticleList } from './aside-article-list'

export function PopularArticles() {
  const [articles, setArticles] = useState<AsideArticle[]>([])

  useEffect(() => {
    let isStale = false

    fetchPopularArticles().then((popularArticles) => {
      if (!isStale) {
        setArticles(popularArticles)
      }
    })

    return () => {
      isStale = true
    }
  }, [])

  return <AsideArticleList articles={articles} title="熱門文章" withPopInAd />
}
