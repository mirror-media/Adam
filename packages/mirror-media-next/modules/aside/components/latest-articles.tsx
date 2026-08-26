import { useEffect, useState } from 'react'

import { fetchLatestArticlesInSection } from '../aside-data'
import type { AsideArticle } from '../aside-types'

import { AsideArticleList } from './aside-article-list'

type LatestArticlesProps = {
  sectionSlug: string
}

export function LatestArticles({ sectionSlug }: LatestArticlesProps) {
  const [articles, setArticles] = useState<AsideArticle[]>([])

  useEffect(() => {
    let isStale = false

    fetchLatestArticlesInSection(sectionSlug).then((latestArticles) => {
      if (!isStale) {
        setArticles(latestArticles)
      }
    })

    return () => {
      isStale = true
    }
  }, [sectionSlug])

  return <AsideArticleList articles={articles} title="最新文章" />
}
