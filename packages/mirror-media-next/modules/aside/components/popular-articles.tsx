import { fetchPopularArticles } from '../aside-data'

import { AsideArticleList } from './aside-article-list'

export function PopularArticles() {
  return (
    <AsideArticleList
      fetchFunc={fetchPopularArticles}
      from="cate_hotnews"
      title="熱門文章"
      withPopInAd
    />
  )
}
