/**
 * The CMS article styles, which decide the article's path. Declared here rather
 * than imported from `type/raw-data.typedef.js`, the pre-TypeScript JSDoc
 * typedef store.
 */
export type ArticleStyle =
  | 'article'
  | 'wide'
  | 'projects'
  | 'photography'
  | 'script'
  | 'campaign'
  | 'readr'

export type AsideArticleImage = {
  resized?: Record<string, string> | null
  resizedWebp?: Record<string, string> | null
}

export type AsideArticle = {
  id: string
  slug: string
  title: string
  publishedDate: string
  style?: string
  heroImage?: AsideArticleImage | null
}
