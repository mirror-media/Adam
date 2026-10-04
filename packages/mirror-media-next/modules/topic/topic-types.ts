export const TOPIC_RENDER_PAGE_SIZE = 12
export const TOPIC_INDEX_RENDER_PAGE_SIZE = 12
export const TOPIC_INDEX_FETCH_PAGE_SIZE = 24

export const WINE_TOPIC_SLUGS = [
  '5c25f9e3315ec51000903a82',
  '5d22bb9fe311f3925c49396c',
  '5a4d8e60160ac91000294611',
  '5ff7d152127ff40f00d7125c',
  '61d6ade96fef6b0f00f8407e',
  '63b7907e7d893f1a00f1ddb1',
  'thebalvenie2023',
  'wine2024',
  'rsroyalsalute2024',
] as const

export type TopicPageLayoutKind = 'list' | 'list-featured' | 'group'

export type TopicDraft = {
  blocks?: Array<{ text?: string }> | null
} | null

export type TopicResizedImages = {
  original?: string | null
  w480?: string | null
  w800?: string | null
  w1200?: string | null
  w1600?: string | null
  w2400?: string | null
}

export type TopicPhoto = {
  resized?: TopicResizedImages | null
  resizedWebp?: TopicResizedImages | null
} | null

export type TopicIndexItem = {
  brief: TopicDraft
  createdAt: string | null
  heroImage: TopicPhoto
  id: string
  name: string
  og_image: TopicPhoto
  slug: string
  style: string | null
}

export type TopicArticle = {
  brief: TopicDraft
  heroImage: TopicPhoto
  id: string
  isFeatured: boolean | null
  publishedDate: string
  sections: Array<{ id: string; name: string | null; slug: string | null }>
  slug: string
  tags: Array<{ id: string; name: string | null; slug: string | null }>
  title: string
  updatedAt: string | null
}

export type TopicSlideshowImage = {
  id: string
  name: string | null
  resized: TopicResizedImages | null
  resizedWebp: TopicResizedImages | null
  topicKeywords: string | null
}

export type TopicTag = {
  id: string
  name: string | null
  slug: string | null
}

export type TopicGroupSection = {
  tag: TopicTag
  taggedPosts: TopicArticle[]
}

export type TopicPageTopic = {
  brief: TopicDraft
  createdAt: string | null
  dfp: string | null
  featuredPostsCount: number
  heroImage: TopicPhoto
  heroUrl: string | null
  id: string
  leading: string | null
  manualOrderOfSlideshowImages: Array<{ id: string }> | null
  name: string
  og_description: string | null
  og_image: TopicPhoto
  posts: TopicArticle[]
  postsCount: number
  slideshow_images: TopicSlideshowImage[] | null
  slug: string
  style: string | null
  tags: TopicTag[]
  type: string | null
}

export type TopicSeoPost = {
  imageUrl: string | null
  publishedDate: string | null
  slug: string
  title: string | null
  updatedAt: string | null
}

export type TopicSeo = {
  description: string | null
  imageUrl: string | null
  jsonLd: {
    '@context': 'https://schema.org'
    '@type': 'ItemList'
    itemListElement: Array<{
      '@type': 'ListItem'
      item: {
        '@type': 'NewsArticle'
        datePublished: string | null
        headline: string
        image: string
        url: string
      }
      position: number
    }>
    numberOfItems: number
  }
  lastmod: string | null
  pubdate: string | null
  title: string
}

export type TopicPageViewModel = {
  layoutKind: TopicPageLayoutKind
  seo: TopicSeo
  slideshowImages: TopicSlideshowImage[]
  topic: TopicPageTopic
}

export type ResolveTopicPageLayoutInput = {
  featuredPostsCount: number
  initialPostsLength: number
  type: string | null | undefined
}
