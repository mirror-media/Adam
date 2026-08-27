import client, { getStoryClient } from '@/apollo/apollo-client'
import {
  fetchStoryTopics,
  fetchTopic,
  fetchTopics,
  fetchTopicSeoPosts,
} from '@/apollo/query/topics'
import { SITE_URL, STORY_GQL_ENDPOINT } from '@/config/index.mjs'
import { sortArrayWithOtherArrayId, toTaipeiISOString } from '@/utils'
import { parseUrl } from '@/utils/topic'

import type {
  ResolveTopicPageLayoutInput,
  TopicArticle,
  TopicDraft,
  TopicGroupSection,
  TopicIndexItem,
  TopicPageLayoutKind,
  TopicPageTopic,
  TopicPageViewModel,
  TopicPhoto,
  TopicResizedImages,
  TopicSeo,
  TopicSeoPost,
  TopicSlideshowImage,
  TopicTag,
} from './topic-types'
import { TOPIC_RENDER_PAGE_SIZE, WINE_TOPIC_SLUGS } from './topic-types'

type RawTopicPost = {
  brief?: unknown
  heroImage?: TopicPhoto
  id: string
  isFeatured?: boolean | null
  publishedDate?: string | null
  sections?: TopicArticle['sections'] | null
  slug?: string | null
  tags?: TopicArticle['tags'] | null
  title?: string | null
  updatedAt?: string | null
}

type RawTopicIndex = {
  brief?: unknown
  createdAt?: string | null
  heroImage?: TopicPhoto
  id: string
  name?: string | null
  og_image?: TopicPhoto
  slug?: string | null
  style?: string | null
}

type RawTopicPage = RawTopicIndex & {
  dfp?: string | null
  featuredPostsCount?: number | null
  heroUrl?: string | null
  leading?: string | null
  manualOrderOfSlideshowImages?: unknown
  og_description?: string | null
  posts?: RawTopicPost[] | null
  postsCount?: number | null
  slideshow_images?: TopicSlideshowImage[] | null
  tags?: TopicPageTopic['tags'] | null
  type?: string | null
}

function toTopicDraft(value: unknown): TopicDraft {
  if (value == null || typeof value !== 'object') {
    return null
  }

  return value as TopicDraft
}

function toSerializable<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function getOgImageUrl(resized?: TopicResizedImages | null) {
  if (!resized) {
    return undefined
  }

  return resized.w1600 || resized.w2400 || resized.original || undefined
}

function getDraftPlainText(brief: TopicDraft) {
  const blocks = brief?.blocks
  if (!blocks || blocks.length === 0) {
    return undefined
  }

  const text = blocks.map((block) => block.text ?? '').join('')
  if (!text) {
    return undefined
  }

  return text.length > 160 ? `${text.trim().slice(0, 160)}...` : text.trim()
}

const PUBLISHED_FILTER = { state: { equals: 'published' } }

export function hasMoreFeaturedPosts(
  featuredPostsCount: number,
  renderedCount: number
) {
  return featuredPostsCount > renderedCount
}

export function resolveTopicPageLayout({
  featuredPostsCount,
  initialPostsLength,
  type,
}: ResolveTopicPageLayoutInput): TopicPageLayoutKind {
  if (type === 'group') {
    return 'group'
  }

  return hasMoreFeaturedPosts(featuredPostsCount, initialPostsLength)
    ? 'list-featured'
    : 'list'
}

export function isWineTopic(slug: string) {
  return WINE_TOPIC_SLUGS.some((wineSlug) => wineSlug === slug)
}

function parseCmsTagOrders(style: string | null) {
  const orders = new Map<string, number>()
  if (!style) {
    return orders
  }

  const rulePattern = /([^{]+)\{([^}]+)\}/g

  for (const match of style.matchAll(rulePattern)) {
    const selectors = match[1]
    const declarations = match[2]
    if (!selectors || !declarations) {
      continue
    }

    const orderMatch = declarations.match(/\border\s*:\s*(-?\d+)/i)
    if (!orderMatch?.[1]) {
      continue
    }

    const order = Number(orderMatch[1])
    for (const tagMatch of selectors.matchAll(/\.tag-([A-Za-z0-9_-]+)/g)) {
      const token = tagMatch[1]
      if (token) {
        orders.set(token, order)
      }
    }
  }

  return orders
}

function getCmsTagOrder(orders: Map<string, number>, tag: TopicTag) {
  if (tag.slug != null && orders.has(tag.slug)) {
    return orders.get(tag.slug) ?? Number.POSITIVE_INFINITY
  }

  if (orders.has(tag.id)) {
    return orders.get(tag.id) ?? Number.POSITIVE_INFINITY
  }

  return Number.POSITIVE_INFINITY
}

export function sortTopicTagsByCmsStyleOrder(
  tags: TopicTag[],
  style: string | null
) {
  const orders = parseCmsTagOrders(style)
  if (orders.size === 0) {
    return tags
  }

  return tags
    .map((tag, index) => ({
      index,
      order: getCmsTagOrder(orders, tag),
      tag,
    }))
    .sort((left, right) => {
      if (left.order !== right.order) {
        return left.order - right.order
      }

      return left.index - right.index
    })
    .map((item) => item.tag)
}

export function getTopicGroupSections(
  topic: TopicPageTopic
): TopicGroupSection[] {
  return topic.tags.flatMap((tag) => {
    const taggedPosts = topic.posts.filter((post) =>
      post.tags.some((postTag) => postTag.id === tag.id)
    )

    return taggedPosts.length > 0 ? [{ tag, taggedPosts }] : []
  })
}

export function getTopicHeroBackgroundUrl(topic: {
  heroImage?: { resized?: { original?: string | null } | null } | null
  og_image?: { resized?: { original?: string | null } | null } | null
  style?: string | null
}) {
  // CMS `style` already paints `.topic { background-image: url(...) }`.
  // Only fall back to og/hero when the CSS has no url, matching the old topic-group/list pages.
  if (parseUrl(topic.style ?? '')) {
    return null
  }

  return (
    topic.og_image?.resized?.original ||
    topic.heroImage?.resized?.original ||
    null
  )
}

export function toTopicImageSet(
  resized?: TopicResizedImages | null
): Record<string, string> | null {
  if (!resized) {
    return null
  }

  const images: Record<string, string> = {}
  for (const [key, value] of Object.entries(resized)) {
    if (typeof value === 'string' && value.length > 0) {
      images[key] = value
    }
  }

  return Object.keys(images).length > 0 ? images : null
}

export function getTopicIndexCardImages(item: TopicIndexItem) {
  const styleUrl = parseUrl(item.style ?? '')

  if (item.og_image?.resized) {
    return toTopicImageSet(item.og_image.resized)
  }

  if (styleUrl) {
    return toTopicImageSet({ original: styleUrl })
  }

  return toTopicImageSet(item.heroImage?.resized)
}

export function fetchTopicList(take: number, skip: number) {
  const storyClient = getStoryClient(STORY_GQL_ENDPOINT)
  const topicClient = storyClient || client

  return topicClient.query({
    query: storyClient ? fetchStoryTopics : fetchTopics,
    variables: {
      take,
      skip,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      filter: PUBLISHED_FILTER,
    },
  })
}

export function fetchTopicByTopicSlug(
  topicSlug: string,
  postsTake: number,
  postsSkip: number
) {
  return client.query({
    query: fetchTopic,
    variables: {
      topicFilter: {
        slug: { equals: topicSlug },
        state: { equals: 'published' },
      },
      postsFilter: PUBLISHED_FILTER,
      featuredPostsCountFilter: {
        state: { equals: 'published' },
        isFeatured: { equals: true },
      },
      postsOrderBy: [
        { isFeatured: 'desc' },
        { publishedDate: 'desc' },
        { id: 'desc' },
      ],
      postsTake,
      postsSkip,
    },
  })
}

function fetchTopicSeoPostList(topicSlug: string, postsTake: number) {
  return client.query({
    query: fetchTopicSeoPosts,
    variables: {
      topicFilter: {
        slug: { equals: topicSlug },
        state: { equals: 'published' },
      },
      postsFilter: PUBLISHED_FILTER,
      postsTake,
      postsSkip: 0,
    },
  })
}

export function toTopicArticle(post: unknown): TopicArticle | null {
  if (!post || typeof post !== 'object') {
    return null
  }

  const raw = post as RawTopicPost
  if (!raw.slug || !raw.title || !raw.id) {
    return null
  }

  return {
    brief: toTopicDraft(raw.brief),
    heroImage: raw.heroImage ?? null,
    id: raw.id,
    isFeatured: raw.isFeatured ?? null,
    publishedDate: raw.publishedDate ?? '',
    sections: raw.sections ?? [],
    slug: raw.slug,
    tags: raw.tags ?? [],
    title: raw.title,
    updatedAt: raw.updatedAt ?? null,
  }
}

export function toTopicIndexItem(topic: unknown): TopicIndexItem | null {
  if (!topic || typeof topic !== 'object') {
    return null
  }

  const raw = topic as RawTopicIndex
  if (!raw.slug || !raw.name || !raw.id) {
    return null
  }

  return {
    brief: toTopicDraft(raw.brief),
    createdAt: raw.createdAt ?? null,
    heroImage: raw.heroImage ?? null,
    id: raw.id,
    name: raw.name,
    og_image: raw.og_image ?? null,
    slug: raw.slug,
    style: raw.style ?? null,
  }
}

function toManualOrderOfSlideshowImages(
  value: unknown
): TopicPageTopic['manualOrderOfSlideshowImages'] {
  if (!Array.isArray(value)) {
    return null
  }

  return value.flatMap((item) => {
    if (!item || typeof item !== 'object' || !('id' in item)) {
      return []
    }

    const id = (item as { id?: unknown }).id
    return typeof id === 'string' ? [{ id }] : []
  })
}

function toTopicPageTopic(topic: RawTopicPage): TopicPageTopic | null {
  if (!topic.slug || !topic.name) {
    return null
  }

  return {
    brief: toTopicDraft(topic.brief),
    createdAt: topic.createdAt ?? null,
    dfp: topic.dfp ?? null,
    featuredPostsCount: topic.featuredPostsCount ?? 0,
    heroImage: topic.heroImage ?? null,
    heroUrl: topic.heroUrl ?? null,
    id: topic.id,
    leading: topic.leading ?? null,
    manualOrderOfSlideshowImages: toManualOrderOfSlideshowImages(
      topic.manualOrderOfSlideshowImages
    ),
    name: topic.name,
    og_description: topic.og_description ?? null,
    og_image: topic.og_image ?? null,
    posts: (topic.posts ?? []).flatMap((post) => {
      const article = toTopicArticle(post)
      return article ? [article] : []
    }),
    postsCount: topic.postsCount ?? 0,
    slideshow_images: topic.slideshow_images ?? null,
    slug: topic.slug,
    style: topic.style ?? null,
    // CMS `style` sets flex `order` on `.tag-{slug}`. Sort here so DOM index
    // matches visual order (group dividers use `index > 0`).
    tags: sortTopicTagsByCmsStyleOrder(topic.tags ?? [], topic.style ?? null),
    type: topic.type ?? null,
  }
}

function resolveSlideshowImages(topic: TopicPageTopic): TopicSlideshowImage[] {
  if (topic.leading !== 'slideshow' || !topic.slideshow_images) {
    return []
  }

  const { slideshow_images, manualOrderOfSlideshowImages } = topic

  if (manualOrderOfSlideshowImages == null) {
    return slideshow_images
  }

  return sortArrayWithOtherArrayId(
    slideshow_images,
    manualOrderOfSlideshowImages
  ) as TopicSlideshowImage[]
}

function sortSeoPostsByPublishedDate(posts: TopicSeoPost[]) {
  return [...posts].sort((left, right) => {
    const leftTime = Date.parse(left.publishedDate ?? '') || 0
    const rightTime = Date.parse(right.publishedDate ?? '') || 0
    return rightTime - leftTime
  })
}

function toSeoPostsFromTopic(topic: TopicPageTopic): TopicSeoPost[] {
  return sortSeoPostsByPublishedDate(
    topic.posts.map((post) => ({
      slug: post.slug,
      title: post.title,
      publishedDate: post.publishedDate,
      updatedAt: post.updatedAt ?? null,
      imageUrl: post.heroImage?.resized?.w800 ?? null,
    }))
  )
}

function pickLatestTimestamp(posts: TopicSeoPost[]) {
  return posts.reduce<string | undefined>((latest, post) => {
    const candidates = [post.updatedAt, post.publishedDate].filter(
      (value): value is string => Boolean(value)
    )
    const candidate = candidates.reduce<string | undefined>((newest, value) => {
      if (!newest) {
        return value
      }
      return Date.parse(value) > Date.parse(newest) ? value : newest
    }, undefined)

    if (!candidate) {
      return latest
    }
    if (!latest) {
      return candidate
    }
    return Date.parse(candidate) > Date.parse(latest) ? candidate : latest
  }, undefined)
}

function buildTopicSeo(
  topic: TopicPageTopic,
  seoPosts: TopicSeoPost[]
): TopicSeo {
  const description = topic.og_description || getDraftPlainText(topic.brief)
  const imageUrl =
    getOgImageUrl(topic.og_image?.resized) ||
    parseUrl(topic.style ?? '') ||
    undefined
  const lastmod = pickLatestTimestamp(seoPosts)
  const defaultImage = `https://${SITE_URL}/images-next/default-og-img.png`

  return {
    title: `精選專區 / ${topic.name}`,
    description: description ?? null,
    imageUrl: imageUrl ?? null,
    pubdate: topic.createdAt
      ? (toTaipeiISOString(topic.createdAt) ?? null)
      : null,
    lastmod: lastmod ? (toTaipeiISOString(lastmod) ?? null) : null,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      numberOfItems: seoPosts.length,
      itemListElement: seoPosts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'NewsArticle',
          url: `https://${SITE_URL}/story/${post.slug}`,
          headline: post.title || '',
          image: post.imageUrl || defaultImage,
          datePublished: post.publishedDate
            ? (toTaipeiISOString(post.publishedDate) ?? null)
            : null,
        },
      })),
    },
  }
}

export async function loadPublishedTopicList(take: number, skip: number) {
  const response = await fetchTopicList(take, skip)
  const topics = (response.data?.topics ?? []).flatMap((topic: unknown) => {
    const item = toTopicIndexItem(topic)
    return item ? [item] : []
  })
  const topicsCount = response.data?.topicsCount ?? 0

  return toSerializable({ topics, topicsCount })
}

export async function loadTopicPage(
  topicSlug: string
): Promise<TopicPageViewModel | null> {
  const response = await fetchTopicByTopicSlug(
    topicSlug,
    TOPIC_RENDER_PAGE_SIZE,
    0
  )
  const rawTopic = response.data?.topics?.[0]
  if (!rawTopic) {
    return null
  }

  let topic = toTopicPageTopic(rawTopic as RawTopicPage)

  if (!topic) {
    return null
  }

  if (topic.type === 'group' && topic.postsCount > TOPIC_RENDER_PAGE_SIZE) {
    const allPostsResponse = await fetchTopicByTopicSlug(
      topicSlug,
      topic.postsCount,
      0
    )
    const rawAllTopic = allPostsResponse.data?.topics?.[0]
    const mapped = rawAllTopic
      ? toTopicPageTopic(rawAllTopic as RawTopicPage)
      : null
    if (mapped) {
      topic = mapped
    }
  }

  let seoPosts = toSeoPostsFromTopic(topic)

  if (topic.type !== 'group' && topic.postsCount > topic.posts.length) {
    const seoResponse = await fetchTopicSeoPostList(topicSlug, topic.postsCount)
    seoPosts = sortSeoPostsByPublishedDate(
      (seoResponse.data?.topics?.[0]?.posts ?? []).flatMap((post) => {
        if (!post.slug) {
          return []
        }

        return [
          {
            slug: post.slug,
            title: post.title ?? null,
            publishedDate: post.publishedDate ?? null,
            updatedAt: post.updatedAt ?? null,
            imageUrl: post.heroImage?.resized?.w800 ?? null,
          },
        ]
      })
    )
  }

  return toSerializable({
    layoutKind: resolveTopicPageLayout({
      featuredPostsCount: topic.featuredPostsCount,
      initialPostsLength: topic.posts.length,
      type: topic.type,
    }),
    seo: buildTopicSeo(topic, seoPosts),
    slideshowImages: resolveSlideshowImages(topic),
    topic,
  })
}
